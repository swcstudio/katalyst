use rstest::*;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::process::Command;
use std::time::{Duration, Instant};
use tokio::test;

#[derive(Debug, Clone)]
pub struct ComponentTestCase {
    name: &'static str,
    component_path: &'static str,
    expected_elements: Vec<&'static str>,
    performance_budget_ms: u64,
    accessibility_required: bool,
}

#[fixture]
fn test_environment() -> HashMap<String, String> {
    let mut env = HashMap::new();
    env.insert("DENO_ENV".to_string(), "test".to_string());
    env.insert("NODE_ENV".to_string(), "test".to_string());
    env
}

#[fixture]
fn demo_components() -> Vec<ComponentTestCase> {
    vec![
        ComponentTestCase {
            name: "AnimatedShinyTextDemo",
            component_path: "libs/ui/src/components/solidstack/demos/AnimatedShinyTextDemo.tsx",
            expected_elements: vec!["✨ Introducing SolidStack UI", "svg", "span"],
            performance_budget_ms: 50,
            accessibility_required: true,
        },
        ComponentTestCase {
            name: "DotPatternDemo", 
            component_path: "libs/ui/src/components/solidstack/demos/DotPatternDemo.tsx",
            expected_elements: vec!["svg", "pattern", "circle", "aria-hidden"],
            performance_budget_ms: 30,
            accessibility_required: true,
        },
        ComponentTestCase {
            name: "GridPatternDemo",
            component_path: "libs/ui/src/components/solidstack/demos/GridPatternDemo.tsx", 
            expected_elements: vec!["svg", "pattern", "path", "mask-image"],
            performance_budget_ms: 30,
            accessibility_required: true,
        },
        ComponentTestCase {
            name: "OrbitingCirclesDemo",
            component_path: "libs/ui/src/components/solidstack/demos/OrbitingCirclesDemo.tsx",
            expected_elements: vec!["svg", "circle", "animation", "transform"],
            performance_budget_ms: 75,
            accessibility_required: true,
        },
    ]
}

#[rstest]
#[tokio::test]
async fn test_component_renders_successfully(
    #[from(demo_components)] component: ComponentTestCase,
    #[from(test_environment)] _env: HashMap<String, String>,
) {
    let start_time = Instant::now();
    
    let output = Command::new("deno")
        .args(&[
            "run",
            "--allow-all",
            "--no-check",
            "tests/solidstack/render-component.ts",
            &component.name,
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute deno command");

    let render_time = start_time.elapsed();
    
    assert!(output.status.success(), 
        "Component {} failed to render: {}", 
        component.name, 
        String::from_utf8_lossy(&output.stderr)
    );
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    assert!(!stdout.is_empty(), "Component {} produced no output", component.name);
    
    // Performance validation
    assert!(
        render_time.as_millis() <= component.performance_budget_ms as u128,
        "Component {} render time {}ms exceeds budget {}ms",
        component.name,
        render_time.as_millis(),
        component.performance_budget_ms
    );
}

#[rstest]
#[tokio::test]
async fn test_component_contains_expected_elements(
    #[from(demo_components)] component: ComponentTestCase,
) {
    let output = Command::new("deno")
        .args(&[
            "run", 
            "--allow-all",
            "--no-check",
            "tests/solidstack/render-component.ts",
            &component.name,
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute deno command");

    assert!(output.status.success());
    
    let html_output = String::from_utf8_lossy(&output.stdout);
    
    for expected_element in &component.expected_elements {
        assert!(
            html_output.contains(expected_element),
            "Component {} missing expected element: {}",
            component.name,
            expected_element
        );
    }
}

#[rstest]
#[tokio::test] 
async fn test_component_accessibility_compliance(
    #[from(demo_components)] component: ComponentTestCase,
) {
    if !component.accessibility_required {
        return;
    }

    let output = Command::new("deno")
        .args(&[
            "run",
            "--allow-all", 
            "--no-check",
            "tests/solidstack/accessibility-check.ts",
            &component.name,
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute accessibility check");

    assert!(output.status.success(),
        "Accessibility check failed for {}: {}",
        component.name,
        String::from_utf8_lossy(&output.stderr)
    );

    let result: Value = serde_json::from_str(&String::from_utf8_lossy(&output.stdout))
        .expect("Failed to parse accessibility check result");

    assert_eq!(result["violations"].as_array().unwrap().len(), 0,
        "Component {} has accessibility violations: {:?}",
        component.name,
        result["violations"]
    );
}

#[rstest]
#[case("AnimatedShinyTextDemo", "DotPatternDemo")]
#[case("GridPatternDemo", "OrbitingCirclesDemo")]
#[case("AnimatedShinyTextDemo", "OrbitingCirclesDemo")]
#[tokio::test]
async fn test_components_work_together(
    #[case] component1: &str,
    #[case] component2: &str,
) {
    let output = Command::new("deno")
        .args(&[
            "run",
            "--allow-all",
            "--no-check", 
            "tests/solidstack/integration-test.ts",
            component1,
            component2,
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute integration test");

    assert!(output.status.success(),
        "Integration test failed for {} + {}: {}",
        component1,
        component2,
        String::from_utf8_lossy(&output.stderr)
    );

    let result: Value = serde_json::from_str(&String::from_utf8_lossy(&output.stdout))
        .expect("Failed to parse integration test result");

    assert!(result["success"].as_bool().unwrap(),
        "Components {} and {} failed integration test",
        component1,
        component2
    );
}

#[rstest]
#[values(1, 5, 10, 25)]
#[tokio::test]
async fn test_component_performance_under_load(instances: u32) {
    let start_time = Instant::now();
    
    let output = Command::new("deno")
        .args(&[
            "run",
            "--allow-all",
            "--no-check",
            "tests/solidstack/load-test.ts",
            &instances.to_string(),
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute load test");

    let total_time = start_time.elapsed();
    
    assert!(output.status.success(),
        "Load test with {} instances failed: {}",
        instances,
        String::from_utf8_lossy(&output.stderr)
    );

    let result: Value = serde_json::from_str(&String::from_utf8_lossy(&output.stdout))
        .expect("Failed to parse load test result");

    let render_time_ms = result["total_render_time_ms"].as_u64().unwrap();
    let memory_usage_mb = result["memory_usage_mb"].as_f64().unwrap();

    // Performance assertions scale with instance count
    let expected_max_time = (instances as u64) * 20; // 20ms per instance
    assert!(render_time_ms <= expected_max_time,
        "Load test with {} instances took {}ms, expected <= {}ms",
        instances,
        render_time_ms,
        expected_max_time
    );

    // Memory usage should be reasonable
    let expected_max_memory = (instances as f64) * 5.0; // 5MB per instance
    assert!(memory_usage_mb <= expected_max_memory,
        "Load test with {} instances used {}MB memory, expected <= {}MB",
        instances,
        memory_usage_mb,
        expected_max_memory
    );
}

#[rstest]
#[case("light")]
#[case("dark")]
#[case("high-contrast")]
#[tokio::test]
async fn test_component_theme_compatibility(#[case] theme: &str) {
    let demo_components = demo_components();
    
    for component in demo_components {
        let output = Command::new("deno")
            .args(&[
                "run",
                "--allow-all",
                "--no-check",
                "tests/solidstack/theme-test.ts", 
                &component.name,
                theme,
            ])
            .current_dir(".")
            .output()
            .expect("Failed to execute theme test");

        assert!(output.status.success(),
            "Theme test failed for {} with theme {}: {}",
            component.name,
            theme,
            String::from_utf8_lossy(&output.stderr)
        );

        let result: Value = serde_json::from_str(&String::from_utf8_lossy(&output.stdout))
            .expect("Failed to parse theme test result");

        assert!(result["theme_applied"].as_bool().unwrap(),
            "Component {} failed to apply theme {}",
            component.name,
            theme
        );

        if theme == "high-contrast" {
            assert!(result["contrast_ratio"].as_f64().unwrap() >= 4.5,
                "Component {} does not meet contrast requirements for high-contrast theme",
                component.name
            );
        }
    }
}

#[rstest]
#[tokio::test]
async fn test_component_bundle_size() {
    let output = Command::new("deno")
        .args(&[
            "run",
            "--allow-all",
            "--no-check",
            "tests/solidstack/bundle-analysis.ts",
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute bundle analysis");

    assert!(output.status.success(),
        "Bundle analysis failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    let result: Value = serde_json::from_str(&String::from_utf8_lossy(&output.stdout))
        .expect("Failed to parse bundle analysis result");

    let total_size_kb = result["total_size_kb"].as_f64().unwrap();
    let gzipped_size_kb = result["gzipped_size_kb"].as_f64().unwrap();

    // Bundle size assertions
    assert!(total_size_kb <= 150.0,
        "Total bundle size {}KB exceeds 150KB limit",
        total_size_kb
    );

    assert!(gzipped_size_kb <= 45.0,
        "Gzipped bundle size {}KB exceeds 45KB limit", 
        gzipped_size_kb
    );

    assert!(result["tree_shakable"].as_bool().unwrap(),
        "Bundle is not properly tree-shakable"
    );
}

#[rstest]
#[tokio::test]
async fn test_component_type_safety() {
    let output = Command::new("deno")
        .args(&[
            "check",
            "--all",
            "libs/ui/src/components/solidstack/demos/index.ts",
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute type check");

    assert!(output.status.success(),
        "TypeScript type check failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // Ensure no type errors in output
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(!stderr.contains("error TS"),
        "TypeScript errors found: {}",
        stderr
    );
}

#[rstest]
#[tokio::test]
async fn test_component_security() {
    let output = Command::new("deno")
        .args(&[
            "run",
            "--allow-all",
            "--no-check",
            "tests/solidstack/security-audit.ts",
        ])
        .current_dir(".")
        .output()
        .expect("Failed to execute security audit");

    assert!(output.status.success(),
        "Security audit failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    let result: Value = serde_json::from_str(&String::from_utf8_lossy(&output.stdout))
        .expect("Failed to parse security audit result");

    assert!(result["vulnerabilities"].as_array().unwrap().is_empty(),
        "Security vulnerabilities found: {:?}",
        result["vulnerabilities"]
    );

    assert!(result["csp_compatible"].as_bool().unwrap(),
        "Components are not CSP compatible"
    );

    assert!(result["xss_safe"].as_bool().unwrap(),
        "Components may be vulnerable to XSS"
    );
}