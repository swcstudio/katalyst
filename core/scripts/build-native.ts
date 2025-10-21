#!/usr/bin/env deno run --allow-all

/**
 * Build script for native multithreading binaries
 * Supports local development and testing
 */

import { exec } from "https://deno.land/x/exec@0.0.5/mod.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";

const PACKAGE_DIR = "./packages/multithreading";
const SUPPORTED_TARGETS = [
  "x86_64-unknown-linux-gnu",
  "aarch64-unknown-linux-gnu", 
  "x86_64-apple-darwin",
  "aarch64-apple-darwin",
  "x86_64-pc-windows-msvc"
];

async function checkPrerequisites() {
  console.log("🔍 Checking prerequisites...");
  
  // Check if Rust is installed
  try {
    await exec("rustc --version");
    console.log("✅ Rust compiler found");
  } catch {
    console.error("❌ Rust not found. Please install Rust from https://rustup.rs/");
    Deno.exit(1);
  }

  // Check if napi-rs CLI is available
  if (!existsSync(`${PACKAGE_DIR}/node_modules/@napi-rs/cli`)) {
    console.log("📦 Installing napi-rs CLI...");
    await exec("npm install", { cwd: PACKAGE_DIR });
  }

  // Check if Cargo.toml exists
  if (!existsSync(`${PACKAGE_DIR}/Cargo.toml`)) {
    console.error(`❌ Cargo.toml not found in ${PACKAGE_DIR}`);
    Deno.exit(1);
  }
}

async function detectTarget(): Promise<string> {
  const arch = await exec("uname -m");
  const os = await exec("uname -s");
  
  const archStr = arch.output.trim();
  const osStr = os.output.trim().toLowerCase();
  
  if (osStr.includes("darwin")) {
    return archStr === "arm64" ? "aarch64-apple-darwin" : "x86_64-apple-darwin";
  } else if (osStr.includes("linux")) {
    return archStr === "aarch64" ? "aarch64-unknown-linux-gnu" : "x86_64-unknown-linux-gnu";
  } else {
    return "x86_64-pc-windows-msvc"; // Assume Windows
  }
}

async function buildTarget(target: string, debug: boolean = false) {
  console.log(`🔨 Building for target: ${target}${debug ? " (debug)" : " (release)"}`);
  
  const buildCmd = debug 
    ? `npm run build:debug --target ${target}`
    : `npm run build --target ${target}`;
    
  try {
    const result = await exec(buildCmd, { 
      cwd: PACKAGE_DIR,
      stdout: "piped",
      stderr: "piped"
    });
    
    if (result.status.success) {
      console.log(`✅ Successfully built ${target}`);
      return true;
    } else {
      console.error(`❌ Failed to build ${target}:`);
      console.error(result.stderr);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error building ${target}:`, error);
    return false;
  }
}

async function testBinary(target: string) {
  console.log(`🧪 Testing binary for ${target}...`);
  
  try {
    const result = await exec("npm test", { 
      cwd: PACKAGE_DIR,
      stdout: "piped",
      stderr: "piped"
    });
    
    if (result.status.success) {
      console.log(`✅ Tests passed for ${target}`);
      return true;
    } else {
      console.error(`❌ Tests failed for ${target}:`);
      console.error(result.stderr);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error testing ${target}:`, error);
    return false;
  }
}

async function main() {
  const args = Deno.args;
  const debug = args.includes("--debug");
  const test = args.includes("--test");
  const targetFlag = args.find(arg => arg.startsWith("--target="));
  const allTargets = args.includes("--all");
  
  console.log("🚀 Katalyst Native Binary Builder");
  console.log("==================================");
  
  await checkPrerequisites();
  
  let targets: string[];
  
  if (allTargets) {
    targets = SUPPORTED_TARGETS;
    console.log("🎯 Building for all supported targets");
  } else if (targetFlag) {
    const target = targetFlag.split("=")[1];
    if (!SUPPORTED_TARGETS.includes(target)) {
      console.error(`❌ Unsupported target: ${target}`);
      console.error(`Supported targets: ${SUPPORTED_TARGETS.join(", ")}`);
      Deno.exit(1);
    }
    targets = [target];
  } else {
    const detected = await detectTarget();
    console.log(`🔍 Detected target: ${detected}`);
    targets = [detected];
  }
  
  let successCount = 0;
  
  for (const target of targets) {
    // Add target if not already installed
    try {
      await exec(`rustup target add ${target}`);
    } catch (error) {
      console.warn(`⚠️  Could not add target ${target}:`, error);
    }
    
    const built = await buildTarget(target, debug);
    if (built && test) {
      const tested = await testBinary(target);
      if (tested) successCount++;
    } else if (built) {
      successCount++;
    }
  }
  
  console.log("\n📊 Build Summary:");
  console.log(`✅ Successfully built: ${successCount}/${targets.length} targets`);
  
  if (successCount === targets.length) {
    console.log("🎉 All builds completed successfully!");
  } else {
    console.log("⚠️  Some builds failed. Check the output above.");
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
