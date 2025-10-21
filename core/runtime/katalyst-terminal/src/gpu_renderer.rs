use anyhow::Result;
use wgpu::{
    Adapter, Backend, Backends, CommandEncoderDescriptor, Device, DeviceDescriptor, Features,
    Instance, InstanceDescriptor, Limits, LoadOp, Operations, PowerPreference, Queue,
    RenderPassColorAttachment, RenderPassDescriptor, RenderPipeline, RequestAdapterOptions,
    Surface, SurfaceConfiguration, SurfaceError, TextureUsages, TextureViewDescriptor,
};
use std::sync::Arc;
use parking_lot::RwLock;

use crate::{config::TerminalConfig, font_renderer::FontRenderer};

/// GPU-accelerated renderer using wgpu (like Alacritty)
pub struct GpuRenderer {
    device: Device,
    queue: Queue,
    surface: Surface,
    config: SurfaceConfiguration,
    pipeline: RenderPipeline,
    
    // Caching
    glyph_cache: Arc<RwLock<GlyphCache>>,
    atlas_texture: wgpu::Texture,
    
    // Performance
    target_fps: u32,
    frame_time_budget_ns: u64,
    
    // Damage tracking
    damage_tracker: DamageTracker,
}

impl GpuRenderer {
    pub async fn new(terminal_config: &TerminalConfig) -> Result<Self> {
        // Create wgpu instance with best backend (Vulkan/Metal/DX12)
        let instance = Instance::new(InstanceDescriptor {
            backends: Backends::PRIMARY,
            ..Default::default()
        });
        
        // Create surface (window)
        let surface = create_surface(&instance)?;
        
        // Request high-performance adapter
        let adapter = instance
            .request_adapter(&RequestAdapterOptions {
                power_preference: PowerPreference::HighPerformance,
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .ok_or_else(|| anyhow::anyhow!("Failed to find suitable GPU adapter"))?;
        
        // Create device with all features for maximum performance
        let (device, queue) = adapter
            .request_device(
                &DeviceDescriptor {
                    label: Some("Katalyst GPU Device"),
                    features: Features::empty()
                        | Features::TEXTURE_ADAPTER_SPECIFIC_FORMAT_FEATURES
                        | Features::PUSH_CONSTANTS,
                    limits: Limits::default(),
                },
                None,
            )
            .await?;
        
        // Configure surface for optimal performance
        let size = winit::dpi::PhysicalSize::new(
            terminal_config.window_width,
            terminal_config.window_height,
        );
        
        let config = surface
            .get_default_config(&adapter, size.width, size.height)
            .ok_or_else(|| anyhow::anyhow!("Surface incompatible with adapter"))?;
        
        surface.configure(&device, &config);
        
        // Create render pipeline
        let pipeline = create_render_pipeline(&device, &config)?;
        
        // Create glyph atlas texture for caching
        let atlas_texture = create_atlas_texture(&device, 4096, 4096)?;
        
        // Initialize glyph cache
        let glyph_cache = Arc::new(RwLock::new(GlyphCache::new()));
        
        Ok(Self {
            device,
            queue,
            surface,
            config,
            pipeline,
            glyph_cache,
            atlas_texture,
            target_fps: 144, // Start with high FPS
            frame_time_budget_ns: 1_000_000_000 / 144,
            damage_tracker: DamageTracker::new(),
        })
    }
    
    pub fn render_damaged(&mut self, content: &DamagedContent, font_renderer: &FontRenderer) -> Result<()> {
        let start_time = std::time::Instant::now();
        
        // Get next frame
        let output = match self.surface.get_current_texture() {
            Ok(frame) => frame,
            Err(SurfaceError::Lost) => {
                self.reconfigure_surface()?;
                self.surface.get_current_texture()?
            }
            Err(e) => return Err(e.into()),
        };
        
        let view = output.texture.create_view(&TextureViewDescriptor::default());
        
        // Create command encoder
        let mut encoder = self.device.create_command_encoder(&CommandEncoderDescriptor {
            label: Some("Render Encoder"),
        });
        
        {
            // Begin render pass with damage tracking
            let mut render_pass = encoder.begin_render_pass(&RenderPassDescriptor {
                label: Some("Terminal Render Pass"),
                color_attachments: &[Some(RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: Operations {
                        load: if content.full_redraw {
                            LoadOp::Clear(wgpu::Color {
                                r: 0.0,
                                g: 0.0,
                                b: 0.0,
                                a: 1.0,
                            })
                        } else {
                            LoadOp::Load // Only redraw damaged regions
                        },
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
            });
            
            render_pass.set_pipeline(&self.pipeline);
            
            // Render only damaged cells
            for damaged_cell in &content.damaged_cells {
                self.render_cell(&mut render_pass, damaged_cell, font_renderer)?;
            }
        }
        
        // Submit commands
        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();
        
        // Track frame time for adaptive rendering
        let frame_time = start_time.elapsed();
        if frame_time.as_nanos() > self.frame_time_budget_ns as u128 {
            // Frame took too long, might need to optimize
            tracing::warn!("Frame time exceeded budget: {:?}", frame_time);
        }
        
        Ok(())
    }
    
    fn render_cell(
        &mut self,
        render_pass: &mut wgpu::RenderPass,
        cell: &DamagedCell,
        font_renderer: &FontRenderer,
    ) -> Result<()> {
        // Check glyph cache first
        let glyph_key = GlyphKey {
            character: cell.character,
            font_size: cell.font_size,
            bold: cell.bold,
            italic: cell.italic,
        };
        
        let glyph_data = {
            let cache = self.glyph_cache.read();
            cache.get(&glyph_key).cloned()
        };
        
        let glyph_data = match glyph_data {
            Some(data) => data,
            None => {
                // Rasterize glyph and add to cache
                let data = font_renderer.rasterize_glyph(&glyph_key)?;
                self.upload_glyph_to_atlas(&glyph_key, &data)?;
                
                let mut cache = self.glyph_cache.write();
                cache.insert(glyph_key.clone(), data.clone());
                data
            }
        };
        
        // Draw glyph quad with instancing for performance
        self.draw_glyph_instance(render_pass, cell, &glyph_data);
        
        Ok(())
    }
    
    fn upload_glyph_to_atlas(&mut self, key: &GlyphKey, data: &GlyphData) -> Result<()> {
        // Upload glyph bitmap to GPU texture atlas
        self.queue.write_texture(
            wgpu::ImageCopyTexture {
                texture: &self.atlas_texture,
                mip_level: 0,
                origin: wgpu::Origin3d {
                    x: data.atlas_x,
                    y: data.atlas_y,
                    z: 0,
                },
                aspect: wgpu::TextureAspect::All,
            },
            &data.bitmap,
            wgpu::ImageDataLayout {
                offset: 0,
                bytes_per_row: Some(data.width * 4),
                rows_per_image: Some(data.height),
            },
            wgpu::Extent3d {
                width: data.width,
                height: data.height,
                depth_or_array_layers: 1,
            },
        );
        
        Ok(())
    }
    
    fn draw_glyph_instance(&self, render_pass: &mut wgpu::RenderPass, cell: &DamagedCell, glyph: &GlyphData) {
        // Use instanced rendering for maximum performance
        // This is where the actual GPU draw call happens
        // Similar to how Alacritty batches glyphs
    }
    
    pub fn set_target_fps(&mut self, fps: u32) {
        self.target_fps = fps;
        self.frame_time_budget_ns = 1_000_000_000 / fps as u64;
    }
    
    pub fn resize(&mut self, width: u32, height: u32) -> Result<()> {
        self.config.width = width;
        self.config.height = height;
        self.surface.configure(&self.device, &self.config);
        self.damage_tracker.mark_full_redraw();
        Ok(())
    }
    
    fn reconfigure_surface(&mut self) -> Result<()> {
        self.surface.configure(&self.device, &self.config);
        Ok(())
    }
}

#[derive(Clone, Debug)]
pub struct DamagedContent {
    pub damaged_lines: Vec<usize>,
    pub damaged_cells: Vec<DamagedCell>,
    pub full_redraw: bool,
}

#[derive(Clone, Debug)]
pub struct DamagedCell {
    pub row: usize,
    pub col: usize,
    pub character: char,
    pub foreground: Color,
    pub background: Color,
    pub bold: bool,
    pub italic: bool,
    pub underline: bool,
    pub font_size: f32,
}

#[derive(Clone, Debug, Hash, Eq, PartialEq)]
struct GlyphKey {
    character: char,
    font_size: f32,
    bold: bool,
    italic: bool,
}

#[derive(Clone, Debug)]
struct GlyphData {
    bitmap: Vec<u8>,
    width: u32,
    height: u32,
    atlas_x: u32,
    atlas_y: u32,
    advance: f32,
}

struct GlyphCache {
    glyphs: dashmap::DashMap<GlyphKey, GlyphData>,
    atlas_allocator: AtlasAllocator,
}

impl GlyphCache {
    fn new() -> Self {
        Self {
            glyphs: dashmap::DashMap::new(),
            atlas_allocator: AtlasAllocator::new(4096, 4096),
        }
    }
    
    fn get(&self, key: &GlyphKey) -> Option<GlyphData> {
        self.glyphs.get(key).map(|entry| entry.clone())
    }
    
    fn insert(&mut self, key: GlyphKey, data: GlyphData) {
        self.glyphs.insert(key, data);
    }
}

struct DamageTracker {
    damaged_regions: Vec<Rect>,
    needs_full_redraw: bool,
}

impl DamageTracker {
    fn new() -> Self {
        Self {
            damaged_regions: Vec::new(),
            needs_full_redraw: true,
        }
    }
    
    fn mark_damaged(&mut self, rect: Rect) {
        self.damaged_regions.push(rect);
    }
    
    fn mark_full_redraw(&mut self) {
        self.needs_full_redraw = true;
        self.damaged_regions.clear();
    }
    
    fn get_damaged_regions(&mut self) -> Vec<Rect> {
        if self.needs_full_redraw {
            self.needs_full_redraw = false;
            vec![Rect::full()]
        } else {
            std::mem::take(&mut self.damaged_regions)
        }
    }
}

#[derive(Clone, Debug)]
struct Rect {
    x: u32,
    y: u32,
    width: u32,
    height: u32,
}

impl Rect {
    fn full() -> Self {
        Self {
            x: 0,
            y: 0,
            width: u32::MAX,
            height: u32::MAX,
        }
    }
}

#[derive(Clone, Debug)]
pub struct Color {
    pub r: f32,
    pub g: f32,
    pub b: f32,
    pub a: f32,
}

struct AtlasAllocator {
    width: u32,
    height: u32,
    current_x: u32,
    current_y: u32,
    row_height: u32,
}

impl AtlasAllocator {
    fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            current_x: 0,
            current_y: 0,
            row_height: 0,
        }
    }
    
    fn allocate(&mut self, width: u32, height: u32) -> Option<(u32, u32)> {
        if self.current_x + width > self.width {
            // Move to next row
            self.current_x = 0;
            self.current_y += self.row_height;
            self.row_height = 0;
        }
        
        if self.current_y + height > self.height {
            // Atlas full
            return None;
        }
        
        let position = (self.current_x, self.current_y);
        self.current_x += width;
        self.row_height = self.row_height.max(height);
        
        Some(position)
    }
}

fn create_surface(instance: &Instance) -> Result<Surface> {
    // This would integrate with winit or your windowing system
    // For now, placeholder
    unimplemented!("Surface creation depends on windowing system")
}

fn create_render_pipeline(device: &Device, config: &SurfaceConfiguration) -> Result<RenderPipeline> {
    // Create shaders and pipeline for terminal rendering
    // This includes vertex and fragment shaders optimized for glyph rendering
    unimplemented!("Pipeline creation with optimized shaders")
}

fn create_atlas_texture(device: &Device, width: u32, height: u32) -> Result<wgpu::Texture> {
    // Create texture atlas for glyph caching
    let texture = device.create_texture(&wgpu::TextureDescriptor {
        label: Some("Glyph Atlas"),
        size: wgpu::Extent3d {
            width,
            height,
            depth_or_array_layers: 1,
        },
        mip_level_count: 1,
        sample_count: 1,
        dimension: wgpu::TextureDimension::D2,
        format: wgpu::TextureFormat::Rgba8UnormSrgb,
        usage: TextureUsages::TEXTURE_BINDING | TextureUsages::COPY_DST,
        view_formats: &[],
    });
    
    Ok(texture)
}