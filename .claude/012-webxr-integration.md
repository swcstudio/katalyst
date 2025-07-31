# WebXR Integration - Metaverse Development with Katalyst

## Overview

Katalyst WebXR provides a comprehensive development platform for building immersive virtual and augmented reality applications directly in the metaverse. This system extends Katalyst's multi-platform architecture (Core, Next.js, Remix, Mobile) to include WebXR experiences that run across VR headsets, AR devices, and web browsers.

## Key Features

- **Universal WebXR Support** - Deploy to Meta Quest, Apple Vision Pro, HoloLens, and web browsers
- **Spatial UI Components** - 3D extensions of Aceternity UI with hand tracking and gesture controls
- **Cross-Platform Reality** - Shared components between 2D, mobile, and XR experiences
- **Immersive Development** - Code and debug directly in VR using spatial development tools
- **Performance Optimized** - Rust-powered rendering pipeline with 90+ FPS target
- **Social Metaverse** - Multi-user collaboration and shared virtual spaces

## Architecture

### WebXR Framework Stack

```
┌─────────────────────────────────────────────────────────┐
│                  Katalyst WebXR                        │
├─────────────────────────────────────────────────────────┤
│  Spatial UI      │  3D Components  │  Hand Tracking    │
│  (XR Extensions) │  (Three.js/R3F) │  (WebXR Gestures) │
├─────────────────────────────────────────────────────────┤
│  Reality Bridge  │  Scene Manager  │  Performance      │
│  (2D↔3D↔XR)     │  (Spatial Data) │  (Rust Rendering) │
├─────────────────────────────────────────────────────────┤
│           Shared Design System & Components             │
│        (Aceternity UI + Mobile + WebXR Extensions)      │
├─────────────────────────────────────────────────────────┤
│  Core Framework  │  Next.js        │  Remix           │
│  (XR Experiences)│  (XR Marketing) │  (XR Dashboard)  │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Initialize WebXR Development

```bash
# Install WebXR dependencies
npm install @katalyst/webxr @katalyst/spatial-ui three @react-three/fiber

# Initialize XR project
npx katalyst xr init --platform "quest,vision-pro,web" --name "My Metaverse App"

# Setup spatial development environment
npx katalyst xr dev --mode immersive-vr
```

### 2. Basic WebXR App

```tsx
// src/App.xr.tsx
import React from 'react';
import { 
  XRCanvas, 
  SpatialUI, 
  HandTracking,
  useXRSession,
  AceternityXR 
} from '@katalyst/webxr';

export default function MetaverseApp() {
  const { isXRSupported, enterXR, session } = useXRSession();
  
  return (
    <XRCanvas>
      <SpatialUI>
        {/* 3D Extensions of Aceternity Components */}
        <AceternityXR.SpatialCard 
          variant="holographic"
          position={[0, 1.6, -2]}
          scale={[1, 1, 0.1]}
        >
          <h1>Welcome to the Metaverse</h1>
          <p>Built with Katalyst WebXR</p>
        </AceternityXR.SpatialCard>

        {/* Interactive 3D Button */}
        <AceternityXR.SpatialButton
          variant="aurora"
          position={[0, 1.2, -2]}
          onGrabStart={() => console.log('Grabbed!')}
          onPointerSelect={() => console.log('Selected!')}
          hapticFeedback="heavy"
        >
          Immersive Action
        </AceternityXR.SpatialButton>

        {/* Hand Tracking Visualization */}
        <HandTracking
          onHandPose={(hand) => {
            // Handle hand gestures and poses
            console.log('Hand pose:', hand.joints);
          }}
          showDebugHands={true}
        />
      </SpatialUI>
    </XRCanvas>
  );
}
```

## Core WebXR Components

### 1. XR Canvas System

```tsx
// /shared/src/webxr/core/XRCanvas.tsx
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';

const xrStore = createXRStore({
  handTracking: true,
  passthrough: true,
  foveation: 1,
  frameRate: 90,
});

export const XRCanvas: React.FC<XRCanvasProps> = ({ 
  children, 
  enablePassthrough = false,
  frameRate = 90,
  ...props 
}) => {
  return (
    <Canvas {...props}>
      <XR store={xrStore}>
        <ambientLight intensity={0.2} />
        <pointLight position={[2, 2, 2]} />
        
        {/* Spatial Audio */}
        <PositionalAudio />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {children}
      </XR>
    </Canvas>
  );
};
```

### 2. Spatial UI Components

```tsx
// /shared/src/webxr/components/SpatialCard.tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Text, RoundedBox } from '@react-three/drei';

interface SpatialCardProps {
  variant: 'glass' | 'holographic' | 'aurora' | 'meteors';
  position: [number, number, number];
  children: React.ReactNode;
  interactive?: boolean;
  followGaze?: boolean;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  variant,
  position,
  children,
  interactive = true,
  followGaze = false,
}) => {
  const { player } = useXR();
  const cardRef = useRef<THREE.Group>();
  
  // Gaze following behavior
  useFrame(() => {
    if (followGaze && cardRef.current && player.head) {
      cardRef.current.lookAt(player.head.position);
    }
  });

  const cardMaterial = useMemo(() => {
    switch (variant) {
      case 'glass':
        return (
          <meshPhysicalMaterial
            transmission={0.9}
            thickness={0.1}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        );
      case 'holographic':
        return (
          <holographicMaterial
            fresnelAmount={0.3}
            fresnelOpacity={0.15}
            holotint="#19f7ff"
          />
        );
      default:
        return <meshStandardMaterial />;
    }
  }, [variant]);

  return (
    <group ref={cardRef} position={position}>
      <RoundedBox args={[2, 1.2, 0.1]} radius={0.1}>
        {cardMaterial}
      </RoundedBox>
      
      {/* Spatial Text Rendering */}
      <SpatialText position={[0, 0, 0.06]}>
        {children}
      </SpatialText>
      
      {/* Interactive Zones */}
      {interactive && (
        <InteractiveZone
          onHover={(e) => e.object.scale.setScalar(1.1)}
          onUnhover={(e) => e.object.scale.setScalar(1)}
          onSelect={() => console.log('Card selected')}
        />
      )}
    </group>
  );
};
```

### 3. Hand Tracking System

```tsx
// /shared/src/webxr/components/HandTracking.tsx
import { useXR } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';

interface HandTrackingProps {
  onHandPose?: (hand: XRHand) => void;
  onGesture?: (gesture: GestureType) => void;
  showDebugHands?: boolean;
  hapticFeedback?: boolean;
}

export const HandTracking: React.FC<HandTrackingProps> = ({
  onHandPose,
  onGesture,
  showDebugHands = false,
  hapticFeedback = true,
}) => {
  const { hands } = useXR();
  const gestureRecognizer = useGestureRecognition();
  
  useFrame(() => {
    hands.forEach((hand, index) => {
      if (hand.visible) {
        // Call pose callback
        onHandPose?.(hand);
        
        // Recognize gestures
        const gesture = gestureRecognizer.recognize(hand.joints);
        if (gesture) {
          onGesture?.(gesture);
          
          // Trigger haptic feedback
          if (hapticFeedback && hand.inputSource?.gamepad) {
            hand.inputSource.gamepad.hapticActuators?.[0]?.pulse(0.5, 100);
          }
        }
      }
    });
  });

  return (
    <>
      {showDebugHands && (
        <group>
          {hands.map((hand, index) => (
            <HandMesh key={index} hand={hand} />
          ))}
        </group>
      )}
    </>
  );
};
```

## Advanced Features

### 1. Immersive Development Environment

```tsx
// /shared/src/webxr/dev/ImmersiveIDE.tsx
export const ImmersiveIDE: React.FC = () => {
  const [currentFile, setCurrentFile] = useState('App.tsx');
  const [code, setCode] = useState('');
  
  return (
    <SpatialUI>
      {/* Floating Code Editor */}
      <SpatialCard 
        variant="glass" 
        position={[-2, 1.6, -1]}
        followGaze={false}
      >
        <SpatialCodeEditor
          value={code}
          onChange={setCode}
          language="typescript"
          onSave={() => compileInXR(code)}
        />
      </SpatialCard>

      {/* 3D File Explorer */}
      <SpatialFileTree
        position={[-3, 1.6, -1]}
        onFileSelect={setCurrentFile}
        currentFile={currentFile}
      />

      {/* Live Preview in 3D Space */}
      <SpatialPreview
        position={[2, 1.6, -1]}
        code={code}
        autoRefresh={true}
      />

      {/* Hand-Controlled Terminal */}
      <SpatialTerminal
        position={[0, 0.8, -1]}
        gestureControls={true}
      />
    </SpatialUI>
  );
};
```

### 2. Multi-User Collaboration

```tsx
// /shared/src/webxr/collaboration/SharedSpace.tsx
import { useMultiplayerSession } from '@katalyst/webxr';

export const SharedMetaverseSpace: React.FC = () => {
  const { users, localUser, sendMessage, shareScreen } = useMultiplayerSession();
  
  return (
    <XRCanvas>
      <SpatialUI>
        {/* User Avatars */}
        {users.map(user => (
          <Avatar
            key={user.id}
            position={user.position}
            headRotation={user.headRotation}
            handPositions={user.hands}
            username={user.name}
          />
        ))}

        {/* Shared 3D Whiteboard */}
        <CollaborativeWhiteboard
          position={[0, 2, -3]}
          onDraw={(stroke) => sendMessage('draw', stroke)}
          strokes={sharedStrokes}
        />

        {/* Voice Chat Visualization */}
        <SpatialAudioVisualizer users={users} />

        {/* Shared Code Editor */}
        <SharedCodeEditor
          position={[2, 1.6, -2]}
          onCodeChange={(code) => sendMessage('code', code)}
          collaborators={users}
        />
      </SpatialUI>
    </XRCanvas>
  );
};
```

### 3. Spatial Analytics Dashboard

```tsx
// /shared/src/webxr/analytics/SpatialDashboard.tsx
export const SpatialAnalytics: React.FC = () => {
  const { metrics, realTimeData } = useAnalytics();
  
  return (
    <SpatialUI>
      {/* 3D Data Visualizations */}
      <DataCube
        position={[0, 1.6, -2]}
        data={metrics.userEngagement}
        type="bar3d"
        interactive={true}
      />

      {/* Floating Metric Cards */}
      {metrics.kpis.map((kpi, index) => (
        <SpatialCard
          key={kpi.name}
          variant="aurora"
          position={[index * 1.5 - 3, 2.5, -1]}
        >
          <MetricDisplay
            value={kpi.value}
            trend={kpi.trend}
            label={kpi.name}
          />
        </SpatialCard>
      ))}

      {/* Interactive Network Graph */}
      <NetworkGraph3D
        position={[-2, 1, -3]}
        nodes={realTimeData.connections}
        onNodeSelect={(node) => showDetails(node)}
      />
    </SpatialUI>
  );
};
```

## Performance Optimization

### 1. Rust-Powered Rendering Pipeline

```rust
// /shared/src/webxr/native/spatial_renderer.rs
use wasm_bindgen::prelude::*;
use web_sys::{WebGl2RenderingContext, XRSession};

#[wasm_bindgen]
pub struct SpatialRenderer {
    context: WebGl2RenderingContext,
    scene_graph: SceneGraph,
    frustum_culler: FrustumCuller,
}

#[wasm_bindgen]
impl SpatialRenderer {
    #[wasm_bindgen(constructor)]
    pub fn new(context: WebGl2RenderingContext) -> SpatialRenderer {
        SpatialRenderer {
            context,
            scene_graph: SceneGraph::new(),
            frustum_culler: FrustumCuller::new(),
        }
    }

    // Optimized batch rendering for XR
    #[wasm_bindgen]
    pub fn render_frame(&mut self, xr_frame: &XRFrame) -> Result<(), JsValue> {
        // Frustum culling
        let visible_objects = self.frustum_culler.cull(&self.scene_graph);
        
        // Instanced rendering for repeated objects
        self.batch_render_instances(&visible_objects)?;
        
        // Late-stage reprojection for smooth motion
        self.apply_reprojection(xr_frame)?;
        
        Ok(())
    }

    // Hand tracking optimization
    #[wasm_bindgen]
    pub fn process_hand_tracking(&mut self, joints: &[f32]) -> Vec<f32> {
        // Real-time gesture recognition using ML
        self.gesture_classifier.predict(joints)
    }
}
```

### 2. Level-of-Detail (LOD) System

```tsx
// /shared/src/webxr/optimization/LODSystem.tsx
import { useLOD } from '@react-three/drei';

export const AdaptiveLODMesh: React.FC<LODMeshProps> = ({ 
  geometry, 
  position,
  lodLevels = [1, 0.5, 0.25] 
}) => {
  const meshRef = useRef();
  const { camera } = useThree();
  const { player } = useXR();
  
  const distance = useMemo(() => {
    if (!player.head) return 100;
    return player.head.position.distanceTo(new THREE.Vector3(...position));
  }, [player.head, position]);

  const lodLevel = useMemo(() => {
    if (distance < 2) return 0;      // High detail
    if (distance < 5) return 1;      // Medium detail
    return 2;                        // Low detail
  }, [distance]);

  return (
    <mesh ref={meshRef} position={position}>
      <geometry 
        {...geometry} 
        detail={lodLevels[lodLevel]}
      />
      <SpatialMaterial 
        quality={lodLevel === 0 ? 'high' : 'medium'}
      />
    </mesh>
  );
};
```

## Platform Support

### 1. Meta Quest Integration

```tsx
// /shared/src/webxr/platforms/MetaQuest.tsx
export const MetaQuestApp: React.FC = () => {
  const questFeatures = useQuestFeatures();
  
  return (
    <XRCanvas 
      frameRate={90}
      foveatedRendering={true}
      handTracking={questFeatures.handTracking}
    >
      <SpatialUI>
        {/* Quest-specific UI optimizations */}
        <QuestControllerRays />
        <QuestHapticFeedback />
        <QuestAudioSpatializer />
        
        {/* Platform-specific components */}
        {questFeatures.colorPassthrough && <PassthroughLayer />}
        {questFeatures.anchorTracking && <SpatialAnchors />}
      </SpatialUI>
    </XRCanvas>
  );
};
```

### 2. Apple Vision Pro Integration

```tsx
// /shared/src/webxr/platforms/VisionPro.tsx
export const VisionProApp: React.FC = () => {
  const visionFeatures = useVisionProFeatures();
  
  return (
    <XRCanvas 
      passthrough={true}
      spatialComputing={true}
      eyeTracking={visionFeatures.eyeTracking}
    >
      <SpatialUI>
        {/* Vision Pro UI paradigms */}
        <GazeInteraction />
        <SpatialPersonas />
        <DigitalCrown />
        
        {/* iOS integration */}
        <iOSAppWindow 
          bundleId="com.katalyst.xr"
          position={[2, 1.6, -1]}
        />
      </SpatialUI>
    </XRCanvas>
  );
};
```

## Development Tools

### 1. XR Inspector

```tsx
// /shared/src/webxr/devtools/XRInspector.tsx
export const XRInspector: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [showPerformance, setShowPerformance] = useState(true);
  
  return (
    <SpatialUI>
      {/* Performance Monitor */}
      {showPerformance && (
        <SpatialCard variant="glass" position={[3, 2, -1]}>
          <PerformanceMetrics
            fps={useFrameRate()}
            drawCalls={useDrawCalls()}
            memory={useMemoryUsage()}
          />
        </SpatialCard>
      )}

      {/* Scene Graph Inspector */}
      <SpatialCard variant="holographic" position={[3, 1, -1]}>
        <SceneGraphTree
          onNodeSelect={setSelectedObject}
          selectedNode={selectedObject}
        />
      </SpatialCard>

      {/* Object Inspector */}
      {selectedObject && (
        <SpatialCard variant="aurora" position={[3, 0, -1]}>
          <ObjectProperties object={selectedObject} />
        </SpatialCard>
      )}
    </SpatialUI>
  );
};
```

### 2. Immersive Testing Suite

```tsx
// /shared/src/webxr/testing/XRTesting.tsx
export const XRTestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState([]);
  
  const runSpatialTests = async () => {
    const tests = [
      testHandTracking,
      testSpatialInteractions,
      testPerformance90FPS,
      testMultiUserSync,
    ];
    
    const results = await Promise.all(
      tests.map(test => test.run())
    );
    
    setTestResults(results);
  };

  return (
    <SpatialUI>
      <SpatialCard variant="meteors" position={[0, 1.6, -2]}>
        <TestSuite
          tests={testResults}
          onRunTests={runSpatialTests}
          realTime3DVisualization={true}
        />
      </SpatialCard>
    </SpatialUI>
  );
};
```

## Build & Deployment

### 1. XR Build Configuration

```javascript
// katalyst.xr.config.js
export default {
  platforms: {
    quest: {
      frameRate: 90,
      foveatedRendering: true,
      optimizeForBattery: true,
      controllerProfiles: ['oculus-touch'],
    },
    visionpro: {
      passthrough: true,
      spatialComputing: true,
      eyeTracking: true,
      handTracking: true,
    },
    web: {
      fallbackMode: '2d',
      polyfillMissing: true,
      adaptiveQuality: true,
    }
  },
  
  optimization: {
    LOD: true,
    frustumCulling: true,
    occlusionCulling: true,
    batchRendering: true,
    
    // Spatial audio optimization
    spatialAudio: {
      maxSources: 32,
      hrtf: true,
      roomScale: true,
    }
  },
  
  build: {
    target: ['webxr', 'native'],
    bundleSize: 'aggressive',
    treeshaking: true,
    compression: 'brotli',
  }
};
```

### 2. Deployment Commands

```bash
# Build for multiple XR platforms
npx katalyst xr build --platforms quest,visionpro,web

# Deploy to XR app stores
npx katalyst xr deploy --platform quest --store meta
npx katalyst xr deploy --platform visionpro --store apple

# Development with hot reload in VR
npx katalyst xr dev --immersive --platform quest

# Performance profiling
npx katalyst xr profile --target 90fps --platform all

# Multi-user testing
npx katalyst xr test --collaborative --users 4
```

## Integration with Existing Katalyst Systems

### 1. Shared Component Bridge

```tsx
// /shared/src/webxr/bridge/ComponentBridge.tsx
export const WebXRBridge = {
  // Convert 2D components to spatial equivalents
  spatialize: <T extends ComponentType>(
    Component: T,
    spatialProps: SpatialProps
  ): ComponentType<ComponentProps<T> & SpatialProps> => {
    return (props) => (
      <SpatialWrapper {...spatialProps}>
        <Component {...props} />
      </SpatialWrapper>
    );
  },

  // Render Aceternity components in 3D space
  aceternityToXR: (variant: AceternityVariant) => ({
    position,
    children,
    ...props
  }) => {
    return (
      <AceternityXR.SpatialCard
        variant={variant}
        position={position}
        {...props}
      >
        {children}
      </AceternityXR.SpatialCard>
    );
  },

  // Mobile-to-XR gesture mapping
  mobileGesturesToXR: (mobileGestures: MobileGesture[]) => {
    return mobileGestures.map(gesture => ({
      ...gesture,
      spatial: true,
      handTracking: gesture.touch ? 'pinch' : 'point',
    }));
  },
};
```

### 2. Cross-Platform State Management

```tsx
// /shared/src/webxr/stores/xr-store.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface XRStore {
  // Current XR session state
  isXRActive: boolean;
  currentPlatform: 'quest' | 'visionpro' | 'web' | null;
  
  // Spatial UI state
  spatialMode: '2d' | '3d' | 'mixed';
  handsVisible: boolean;
  eyeTrackingActive: boolean;
  
  // Shared state between 2D and XR views
  sharedData: any;
  
  // Actions
  enterXR: (platform: string) => void;
  exitXR: () => void;
  updateSpatialMode: (mode: string) => void;
  syncWith2D: (data: any) => void;
}

export const useXRStore = create<XRStore>()(
  subscribeWithSelector((set, get) => ({
    isXRActive: false,
    currentPlatform: null,
    spatialMode: '2d',
    handsVisible: false,
    eyeTrackingActive: false,
    sharedData: {},
    
    enterXR: (platform) => set({ 
      isXRActive: true, 
      currentPlatform: platform as any,
      spatialMode: '3d' 
    }),
    
    exitXR: () => set({ 
      isXRActive: false, 
      currentPlatform: null,
      spatialMode: '2d' 
    }),
    
    updateSpatialMode: (mode) => set({ spatialMode: mode as any }),
    
    syncWith2D: (data) => set({ sharedData: data }),
  }))
);
```

## Best Practices

### 1. Spatial UX Principles

```tsx
// Example of good spatial UX design
export const SpatialUXBestPractices: React.FC = () => {
  return (
    <SpatialUI>
      {/* Comfortable viewing distances */}
      <SpatialCard position={[0, 1.6, -2]}>
        Keep primary content 1.5-3m from user
      </SpatialCard>

      {/* Hand interaction zones */}
      <InteractionZone
        position={[0, 1.2, -1]}
        size={[0.8, 0.6, 0.4]}
        description="Comfortable reach zone"
      />

      {/* Avoid motion sickness */}
      <SmoothLocomotion
        snapTurning={true}
        vignetteDuringMovement={true}
        comfortMode={true}
      />

      {/* Spatial audio cues */}
      <PositionalAudio
        url="/sounds/ui-feedback.mp3"
        distance={5}
        rolloffFactor={1}
      />
    </SpatialUI>
  );
};
```

### 2. Performance Guidelines

- **Target 90 FPS minimum** for VR comfort
- **Use LOD systems** for complex scenes
- **Batch draw calls** for repeated objects
- **Implement frustum culling** for large environments
- **Use spatial audio** sparingly to avoid CPU overhead
- **Profile regularly** with XR-specific metrics

### 3. Accessibility in XR

```tsx
// /shared/src/webxr/accessibility/XRAccessibility.tsx
export const AccessibleSpatialUI: React.FC = () => {
  const { colorBlindMode, reducedMotion, largeText } = useAccessibility();
  
  return (
    <SpatialUI>
      {/* High contrast mode for visibility */}
      <SpatialCard 
        variant={colorBlindMode ? "high-contrast" : "glass"}
        position={[0, 1.6, -2]}
      >
        {/* Screen reader compatible spatial text */}
        <SpatialText
          size={largeText ? 0.15 : 0.1}
          ariaLabel="Main interface card"
        >
          Accessible Spatial Interface
        </SpatialText>
      </SpatialCard>

      {/* Alternative input methods */}
      <AlternativeInputs
        voiceCommands={true}
        gazeInput={true}
        switchControl={true}
      />

      {/* Motion preferences */}
      <AnimatedObjects
        disabled={reducedMotion}
        alternatives="static-highlights"
      />
    </SpatialUI>
  );
};
```

## Use Cases & Templates

### 1. XR E-commerce Store

```tsx
// Virtual shopping experience
export const XRStore: React.FC = () => {
  return (
    <XRCanvas>
      <SpatialUI>
        <ProductGallery3D />
        <VirtualShoppingCart />
        <SpatialCheckout />
        <ProductVisualization3D />
      </SpatialUI>
    </XRCanvas>
  );
};
```

### 2. Educational XR Platform

```tsx
// Immersive learning environment
export const XRClassroom: React.FC = () => {
  return (
    <XRCanvas>
      <SpatialUI>
        <Virtual3DModels />
        <CollaborativeWhiteboard />
        <SpatialPresentation />
        <InteractiveSimulations />
      </SpatialUI>
    </XRCanvas>
  );
};
```

### 3. XR Data Visualization

```tsx
// 3D analytics and data exploration
export const XRAnalytics: React.FC = () => {
  return (
    <XRCanvas>
      <SpatialUI>
        <DataVisualization3D />
        <InteractiveCharts />
        <SpatialFilters />
        <RealTimeMetrics />
      </SpatialUI>
    </XRCanvas>
  );
};
```

## API Reference

### Core XR Hooks

```tsx
// Primary XR session management
const { 
  isXRSupported, 
  enterXR, 
  exitXR, 
  session 
} = useXRSession();

// Hand tracking data
const { 
  hands, 
  gestures, 
  pinchStates 
} = useHandTracking();

// Spatial interaction
const { 
  onHover, 
  onSelect, 
  onGrab 
} = useSpatialInteraction();

// Performance monitoring
const { 
  frameRate, 
  renderTime, 
  memoryUsage 
} = useXRPerformance();
```

## Troubleshooting

### Common Issues

1. **Low Frame Rate**
   ```bash
   npx katalyst xr profile --identify-bottlenecks
   npx katalyst xr optimize --target-fps 90
   ```

2. **Hand Tracking Not Working**
   ```javascript
   // Check browser support
   if ('XRHand' in window) {
     console.log('Hand tracking supported');
   }
   
   // Request hand tracking permission
   await navigator.xr.requestSession('immersive-vr', {
     requiredFeatures: ['hand-tracking']
   });
   ```

3. **Platform Compatibility**
   ```tsx
   // Feature detection and fallbacks
   const features = await detectXRFeatures();
   if (!features.handTracking) {
     // Fall back to controller input
   }
   ```

## Future Roadmap

- **AI-Powered Spatial Interactions** - Natural language commands in 3D space
- **Neural Hand Tracking** - ML-enhanced gesture recognition
- **Shared Persistent Worlds** - Cross-session virtual environments
- **WebGPU Integration** - Next-generation rendering performance
- **Spatial Web Standards** - Integration with emerging XR web standards

---

## Support & Resources

- **XR Documentation**: `/shared/src/webxr/README.md`
- **3D Component Library**: `/shared/src/webxr/components/`
- **Example Projects**: `/shared/src/webxr/examples/`
- **Performance Tools**: `/shared/src/webxr/devtools/`
- **Community**: [XR Discord Channel](https://discord.gg/katalyst-xr)

**Note**: WebXR capabilities extend across all Katalyst frameworks (Core, Next.js, Remix) with platform-specific optimizations for each use case. This enables seamless transitions between 2D web experiences and immersive 3D environments.

---

*Built for the future of spatial computing and metaverse development*