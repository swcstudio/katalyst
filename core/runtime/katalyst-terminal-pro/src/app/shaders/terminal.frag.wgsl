// Fragment shader for terminal rendering

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) tex_coords: vec2<f32>,
    @location(1) color: vec4<f32>,
}

struct Uniforms {
    cursor_pos: vec2<f32>,
    cursor_blink: f32,
    blur_amount: f32,
    background_color: vec4<f32>,
    selection_color: vec4<f32>,
}

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

@group(0) @binding(1)
var glyph_texture: texture_2d<f32>;

@group(0) @binding(2)
var glyph_sampler: sampler;

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    // Sample glyph texture
    let glyph_alpha = textureSample(glyph_texture, glyph_sampler, input.tex_coords).a;
    
    // Apply text color with glyph alpha
    var final_color = vec4<f32>(input.color.rgb, input.color.a * glyph_alpha);
    
    // Add cursor blink effect if at cursor position
    let cursor_distance = distance(input.clip_position.xy, uniforms.cursor_pos);
    if (cursor_distance < 10.0) {
        let blink_factor = (sin(uniforms.cursor_blink * 6.28318) + 1.0) * 0.5;
        final_color = mix(final_color, vec4<f32>(1.0, 1.0, 1.0, 1.0), blink_factor * 0.5);
    }
    
    // Apply background blur for floating elements
    if (uniforms.blur_amount > 0.0) {
        // Simplified blur effect
        final_color.rgb = mix(final_color.rgb, uniforms.background_color.rgb, uniforms.blur_amount);
    }
    
    // Gamma correction for better visual quality
    final_color.rgb = pow(final_color.rgb, vec3<f32>(2.2));
    
    return final_color;
}

// Additional effects shader for post-processing
@fragment
fn fs_post_process(input: VertexOutput) -> @location(0) vec4<f32> {
    let color = textureSample(glyph_texture, glyph_sampler, input.tex_coords);
    
    // CRT screen effect (optional)
    let scanline = sin(input.clip_position.y * 3.14159 * 2.0) * 0.04;
    let vignette = 1.0 - distance(input.tex_coords - 0.5, vec2<f32>(0.0)) * 0.5;
    
    var final_color = color;
    final_color.rgb = final_color.rgb * (1.0 + scanline) * vignette;
    
    // Subtle chromatic aberration
    let aberration = 0.002;
    let r = textureSample(glyph_texture, glyph_sampler, input.tex_coords + vec2<f32>(aberration, 0.0)).r;
    let b = textureSample(glyph_texture, glyph_sampler, input.tex_coords - vec2<f32>(aberration, 0.0)).b;
    final_color.r = r;
    final_color.b = b;
    
    return final_color;
}