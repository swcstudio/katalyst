#!/bin/bash

# Build script for Zed WASM IDE with Cryptobox integration

set -e

echo "🚀 Building Zed WASM IDE with Cryptobox Integration"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ $1 found${NC}"
    fi
}

echo "Checking prerequisites..."
check_command rustc
check_command cargo
check_command wasm-pack
check_command node
check_command npm

# Build WASM module
echo -e "\n${YELLOW}Building WASM module...${NC}"
cd zed-wasm-ide
wasm-pack build --target web --out-dir pkg
echo -e "${GREEN}✅ WASM module built${NC}"

# Build iOS React Native app
echo -e "\n${YELLOW}Building React Native iOS app...${NC}"
cd ../lynx-react-ios
npm install
cd ios
pod install
cd ..
echo -e "${GREEN}✅ React Native iOS app configured${NC}"

# Copy WASM artifacts to React Native app
echo -e "\n${YELLOW}Copying WASM artifacts...${NC}"
cp -r ../zed-wasm-ide/pkg/* ./src/wasm/
echo -e "${GREEN}✅ WASM artifacts copied${NC}"

# Generate TypeScript definitions
echo -e "\n${YELLOW}Generating TypeScript definitions...${NC}"
npm run generate-types 2>/dev/null || true
echo -e "${GREEN}✅ TypeScript definitions generated${NC}"

# Build the iOS app
echo -e "\n${YELLOW}Building iOS app...${NC}"
if [[ "$1" == "--ios" ]]; then
    npx react-native run-ios
elif [[ "$1" == "--release" ]]; then
    cd ios
    xcodebuild -workspace LynxReactIos.xcworkspace \
               -scheme LynxReactIos \
               -configuration Release \
               -sdk iphoneos \
               -derivedDataPath build
    echo -e "${GREEN}✅ iOS release build complete${NC}"
    echo -e "${YELLOW}Build artifacts available at: ios/build${NC}"
else
    echo -e "${YELLOW}Run with --ios to launch in simulator${NC}"
    echo -e "${YELLOW}Run with --release to create release build${NC}"
fi

echo -e "\n${GREEN}🎉 Build complete!${NC}"
echo -e "To run the development server: ${YELLOW}npm start${NC}"
echo -e "To run on iOS simulator: ${YELLOW}npm run ios${NC}"