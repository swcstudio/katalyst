use std::env;
use std::process::Command;

fn main() {
    // Get Python configuration
    let output = Command::new("python3-config")
        .args(&["--ldflags", "--embed"])
        .output()
        .expect("Failed to execute python3-config");
    
    let ldflags = String::from_utf8_lossy(&output.stdout);
    
    // Parse and apply the flags
    for flag in ldflags.split_whitespace() {
        if flag.starts_with("-L") {
            println!("cargo:rustc-link-search={}", &flag[2..]);
        } else if flag.starts_with("-l") {
            println!("cargo:rustc-link-lib={}", &flag[2..]);
        } else if flag.starts_with("-Wl,-rpath,") {
            let path = &flag[11..];
            println!("cargo:rustc-link-arg=-Wl,-rpath,{}", path);
        }
    }
    
    // Also set the Python path for runtime
    if let Ok(python_path) = env::var("PYTHON_PATH") {
        println!("cargo:rustc-env=PYTHON_PATH={}", python_path);
    } else {
        // Try to find Python path
        let python_path = Command::new("python3")
            .args(&["-c", "import sys; print(sys.prefix)"])
            .output()
            .expect("Failed to get Python path");
        
        let path = String::from_utf8_lossy(&python_path.stdout).trim().to_string();
        println!("cargo:rustc-env=PYTHON_PATH={}", path);
    }
    
    // Tell cargo to rerun if build.rs changes
    println!("cargo:rerun-if-changed=build.rs");
}