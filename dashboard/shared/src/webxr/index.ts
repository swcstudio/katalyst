/**
 * Katalyst WebXR - Metaverse Development System
 *
 * Comprehensive WebXR integration for immersive experiences
 * across VR headsets, AR devices, and web browsers
 */

// Core XR System
export * from './core/XRCanvas';
export * from './core/XRSession';
export * from './core/XRProvider';

// Spatial UI Components
export * from './components/SpatialCard';
export * from './components/SpatialButton';
export * from './components/SpatialText';
export * from './components/SpatialLayout';
export * from './components/InteractionZone';

// Hand Tracking & Gestures
export * from './tracking/HandTracking';
export * from './tracking/GestureRecognition';
export * from './tracking/EyeTracking';

// 3D Extensions of Aceternity UI
export * from './aceternity-xr/AceternityXR';
export * from './aceternity-xr/SpatialEffects';

// Platform Integrations
export * from './platforms/MetaQuest';
export * from './platforms/VisionPro';
export * from './platforms/WebXR';

// Performance & Optimization
export * from './optimization/LODSystem';
export * from './optimization/SpatialRenderer';
export * from './optimization/PerformanceMonitor';

// Development Tools
export * from './devtools/XRInspector';
export * from './devtools/SpatialDebugger';

// Hooks & Utilities
export * from './hooks/useXRSession';
export * from './hooks/useHandTracking';
export * from './hooks/useSpatialInteraction';
export * from './hooks/useXRPerformance';
export * from './hooks/useGestureRecognition';

// State Management
export * from './stores/xr-store';
export * from './stores/spatial-state';

// Bridge to Existing Systems
export * from './bridge/ComponentBridge';
export * from './bridge/MobileBridge';
export * from './bridge/DesignSystemBridge';

// Types
export * from './types/xr-types';
export * from './types/spatial-types';
export * from './types/gesture-types';

// Examples & Templates
export * from './examples/XRStore';
export * from './examples/XRClassroom';
export * from './examples/XRAnalytics';
export * from './examples/MetaverseApp';
