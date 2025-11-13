// Vertex shader for terminal rendering

struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) tex_coords: vec2<f32>,
    @location(2) color: vec4<f32>,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) tex_coords: vec2<f32>,
    @location(1) color: vec4<f32>,
}

struct Uniforms {
    projection: mat4x4<f32>,
    view: mat4x4<f32>,
    screen_size: vec2<f32>,
    time: f32,
    _padding: f32,
}

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    
    // Convert pixel coordinates to normalized device coordinates
    let normalized_pos = vec2<f32>(
        (input.position.x / uniforms.screen_size.x) * 2.0 - 1.0,
        1.0 - (input.position.y / uniforms.screen_size.y) * 2.0
    );
    
    output.clip_position = vec4<f32>(normalized_pos, 0.0, 1.0);
    output.tex_coords = input.tex_coords;
    output.color = input.color;
    
    return output;
}