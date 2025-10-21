# Metaverse Platform Guide

This section covers the metaverse platform implementation, providing WebXR and 3D experiences for immersive applications.

## Overview

The metaverse platform enables the creation of immersive 3D experiences, WebXR applications, and metaverse environments using React 19, Three.js, and modern web technologies. It supports VR headsets, AR devices, and traditional web browsers.

**Key Features**:
- WebXR API integration for VR/AR experiences
- Three.js and React Three Fiber for 3D graphics
- Cross-platform compatibility (desktop, mobile, VR headsets)
- Spatial computing and hand tracking
- Multi-user networking and real-time collaboration
- Performance optimization for 60fps experiences

## Architecture

```
platforms/metaverse/
├── mod.ts                    # Metaverse module exports
├── package.json              # Metaverse-specific dependencies
└── src/
    ├── KatalystMetaverse.ts  # Core metaverse engine
    ├── index.ts              # Entry point and initialization
    ├── session.ts            # WebXR session management
    ├── components/           # React 3D components
    ├── systems/              # 3D systems and logic
    ├── utils/                # 3D utilities and helpers
    └── assets/               # 3D models, textures, audio
```

## Configuration

### Metaverse Configuration

The metaverse platform is configured through the main build system with WebXR-specific settings.

**Purpose**: Core metaverse and WebXR configuration
**Features**: Renderer selection, physics engine, networking

### Core Interfaces

#### MetaverseConfig

```typescript
export interface MetaverseConfig {
  renderer: 'three' | 'babylon' | 'aframe';
  physics: 'cannon' | 'ammo' | 'rapier';
  networking: 'webrtc' | 'websocket' | 'webtransport';
  xr: boolean;
  performance: {
    targetFPS: number;
    pixelRatio: number;
    shadows: boolean;
    antialiasing: boolean;
  };
  input: {
    handTracking: boolean;
    controllers: boolean;
    gaze: boolean;
    voice: boolean;
  };
}
```

#### MetaverseEngine

The core engine class that orchestrates all metaverse functionality:

```typescript
export class MetaverseEngine {
  private config: MetaverseConfig;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private physics: PhysicsEngine;
  private networking: NetworkManager;
  
  constructor(config: MetaverseConfig) {
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    // Initialize renderer, physics, and networking
    console.log('Initializing metaverse with:', this.config);
  }
  
  async loadWorld(worldUrl: string): Promise<void> {
    // Load 3D world from URL
    console.log('Loading world from:', worldUrl);
  }
  
  async enableXR(): Promise<void> {
    if (!this.config.xr) {
      throw new Error('XR not enabled in configuration');
    }
    // Enable WebXR
    console.log('Enabling WebXR...');
  }
}
```

## WebXR Integration

### Session Management

The metaverse platform provides comprehensive WebXR session management.

#### Session Initialization

```typescript
// session.ts
export class XRSessionManager {
  private session: XRSession | null = null;
  private renderer: THREE.WebGLRenderer;
  private referenceSpace: XRReferenceSpace | null = null;
  
  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
  }
  
  async requestSession(mode: XRSessionMode = 'immersive-vr'): Promise<XRSession> {
    if (!navigator.xr) {
      throw new Error('WebXR not supported');
    }
    
    try {
      this.session = await navigator.xr.requestSession(mode, {
        optionalFeatures: [
          'local-floor',
          'bounded-floor',
          'hand-tracking',
          'anchors',
          'plane-detection'
        ]
      });
      
      await this.setupSession();
      return this.session;
    } catch (error) {
      throw new Error(`Failed to request XR session: ${error.message}`);
    }
  }
  
  private async setupSession(): Promise<void> {
    if (!this.session) return;
    
    // Setup render loop
    this.session.requestAnimationFrame(this.onXRFrame.bind(this));
    
    // Setup input sources
    this.session.addEventListener('inputsourceschange', this.onInputSourcesChange.bind(this));
    
    // Setup reference space
    this.referenceSpace = await this.session.requestReferenceSpace('local-floor');
  }
  
  private onXRFrame(time: number, frame: XRFrame): void {
    if (!this.session || !this.referenceSpace) return;
    
    // Update camera pose
    const pose = frame.getViewerPose(this.referenceSpace);
    if (pose) {
      // Update Three.js camera
      this.updateCameraFromPose(pose);
    }
    
    // Render frame
    this.renderer.render(this.scene, this.camera);
    
    // Continue render loop
    this.session.requestAnimationFrame(this.onXRFrame.bind(this));
  }
}
```

#### Device Detection and Compatibility

```typescript
export class XRCompatibility {
  static async checkSupport(): Promise<{
    vr: boolean;
    ar: boolean;
    handTracking: boolean;
    controllers: boolean;
  }> {
    const support = {
      vr: false,
      ar: false,
      handTracking: false,
      controllers: false
    };
    
    if (!navigator.xr) return support;
    
    // Check VR support
    support.vr = await navigator.xr.isSessionSupported('immersive-vr');
    
    // Check AR support
    support.ar = await navigator.xr.isSessionSupported('immersive-ar');
    
    // Check for controller support
    if (support.vr) {
      try {
        const session = await navigator.xr.requestSession('immersive-vr');
        support.controllers = true;
        session.end();
      } catch {
        // Controller check failed
      }
    }
    
    // Check hand tracking support
    if (support.vr) {
      support.handTracking = 'HandTracking' in window;
    }
    
    return support;
  }
}
```

## 3D Rendering System

### Three.js Integration

The metaverse platform uses Three.js with React Three Fiber for declarative 3D scenes.

#### Core Rendering Setup

```typescript
// KatalystMetaverse.ts
export class KatalystMetaverse {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animations: Map<string, THREE.AnimationClip> = new Map();
  
  constructor(container: HTMLElement, config: MetaverseConfig) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: config.performance.antialiasing,
      alpha: true 
    });
    
    this.setupRenderer(config);
    this.setupLighting();
    this.setupEventListeners(container);
  }
  
  private setupRenderer(config: MetaverseConfig): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.performance.pixelRatio));
    this.renderer.shadowMap.enabled = config.performance.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  }
  
  private setupLighting(): void {
    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Directional lighting with shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    this.scene.add(directionalLight);
    
    // Environment map for reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const envTexture = pmremGenerator.fromScene(new THREE.Scene()).texture;
    this.scene.environment = envTexture;
  }
}
```

### React Three Fiber Components

#### Declarative 3D Scene Components

```typescript
// components/Scene.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stats } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

export function MetaverseScene({ config }: { config: MetaverseConfig }) {
  return (
    <Canvas
      shadows={config.performance.shadows}
      camera={{ position: [0, 2, 5], fov: 75 }}
      gl={{ 
        antialias: config.performance.antialiasing,
        alpha: true,
        outputEncoding: THREE.sRGBEncoding
      }}
    >
      {config.performance.shadows && (
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
      )}
      
      <ambientLight intensity={0.4} />
      
      <Environment preset="city" />
      
      {config.physics && (
        <Physics gravity={[0, -9.81, 0]}>
          <WorldContent />
        </Physics>
      )}
      
      <OrbitControls />
      
      {process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  );
}

function WorldContent() {
  return (
    <>
      {/* Ground plane */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      
      {/* Sample objects */}
      <InteractiveCube position={[0, 1, 0]} />
      <FloatingSphere position={[3, 2, 0]} />
    </>
  );
}
```

#### Interactive Components

```typescript
// components/InteractiveObjects.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

function InteractiveCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current && clicked) {
      meshRef.current.rotation.y += delta * 2;
    }
  });
  
  return (
    <RigidBody type="dynamic" position={position}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        scale={clicked ? 1.2 : 1}
        onClick={() => setClicked(!clicked)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={hovered ? '#ff6b6b' : '#4dabf7'} 
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </RigidBody>
  );
}

function FloatingSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color="#51cf66"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
}
```

## Physics Integration

### Rapier Physics Engine

The metaverse platform integrates Rapier for realistic physics simulation.

#### Physics Setup

```typescript
// systems/PhysicsSystem.ts
export class PhysicsSystem {
  private world: RAPIER.World;
  private bodies: Map<string, RAPIER.RigidBody> = new Map();
  private colliders: Map<string, RAPIER.Collider> = new Map();
  
  constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  }
  
  createRigidBody(id: string, desc: RAPIER.RigidBodyDesc): RAPIER.RigidBody {
    const body = this.world.createRigidBody(desc);
    this.bodies.set(id, body);
    return body;
  }
  
  createCollider(id: string, bodyId: string, desc: RAPIER.ColliderDesc): RAPIER.Collider {
    const body = this.bodies.get(bodyId);
    if (!body) throw new Error(`RigidBody not found: ${bodyId}`);
    
    const collider = this.world.createCollider(desc, body);
    this.colliders.set(id, collider);
    return collider;
  }
  
  update(deltaTime: number): void {
    this.world.step(deltaTime);
    
    // Update Three.js objects based on physics
    this.bodies.forEach((body, id) => {
      const position = body.translation();
      const rotation = body.rotation();
      
      // Update corresponding Three.js mesh
      const mesh = this.getMeshForBody(id);
      if (mesh) {
        mesh.position.set(position.x, position.y, position.z);
        mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      }
    });
  }
  
  private getMeshForBody(id: string): THREE.Object3D | null {
    // Implementation to get Three.js mesh for physics body
    return null;
  }
}
```

#### React Three Fiber Physics Integration

```typescript
// components/PhysicsWorld.tsx
import React from 'react';
import { Physics } from '@react-three/rapier';

export function PhysicsWorld({ children }: { children: React.ReactNode }) {
  return (
    <Physics 
      gravity={[0, -9.81, 0]}
      defaultContactMaterial={{
        friction: 0.7,
        restitution: 0.3,
      }}
    >
      {children}
    </Physics>
  );
}
```

## Networking and Multi-User

### WebRTC Integration

Real-time networking for multi-user experiences using WebRTC.

#### Network Manager

```typescript
// systems/NetworkManager.ts
export class NetworkManager {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private localId: string;
  private remotePeers: Map<string, RTCPeerConnection> = new Map();
  
  constructor() {
    this.localId = this.generateId();
  }
  
  async initialize(signalingUrl: string): Promise<void> {
    // Setup signaling connection
    const signalingConnection = new WebSocket(signalingUrl);
    
    signalingConnection.onmessage = (event) => {
      this.handleSignalingMessage(JSON.parse(event.data));
    };
    
    // Setup peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    
    this.setupPeerConnectionHandlers();
  }
  
  private setupPeerConnectionHandlers(): void {
    if (!this.peerConnection) return;
    
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };
    
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
    };
    
    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannelHandlers();
    };
  }
  
  private setupDataChannelHandlers(): void {
    if (!this.dataChannel) return;
    
    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };
    
    this.dataChannel.onmessage = (event) => {
      this.handleNetworkMessage(JSON.parse(event.data));
    };
    
    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };
  }
  
  sendMessage(type: string, data: any): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Data channel not ready');
      return;
    }
    
    this.dataChannel.send(JSON.stringify({
      type,
      data,
      timestamp: Date.now(),
      sender: this.localId
    }));
  }
  
  broadcastTransform(position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    this.sendMessage('transform-update', {
      position: { x: position.x, y: position.y, z: position.z },
      quaternion: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w }
    });
  }
  
  private handleNetworkMessage(message: any): void {
    switch (message.type) {
      case 'transform-update':
        this.updateRemoteUserTransform(message.sender, message.data);
        break;
      case 'user-joined':
        this.handleUserJoined(message.sender);
        break;
      case 'user-left':
        this.handleUserLeft(message.sender);
        break;
    }
  }
}
```

### Synchronization System

```typescript
// systems/SynchronizationSystem.ts
export class SynchronizationSystem {
  private networkManager: NetworkManager;
  private remoteUsers: Map<string, RemoteUser> = new Map();
  private lastUpdateTime: number = 0;
  
  constructor(networkManager: NetworkManager) {
    this.networkManager = networkManager;
  }
  
  updateLocalTransform(position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    const now = Date.now();
    if (now - this.lastUpdateTime > 50) { // 20Hz update rate
      this.networkManager.broadcastTransform(position, quaternion);
      this.lastUpdateTime = now;
    }
  }
  
  updateRemoteUserTransform(userId: string, transform: Transform): void {
    const user = this.remoteUsers.get(userId);
    if (user && user.mesh) {
      // Smooth interpolation
      user.mesh.position.lerp(
        new THREE.Vector3(transform.position.x, transform.position.y, transform.position.z),
        0.1
      );
      user.mesh.quaternion.slerp(
        new THREE.Quaternion(
          transform.quaternion.x, 
          transform.quaternion.y, 
          transform.quaternion.z, 
          transform.quaternion.w
        ),
        0.1
      );
    }
  }
  
  createRemoteUser(userId: string): THREE.Group {
    const userGroup = new THREE.Group();
    
    // Add avatar representation
    const avatar = this.createAvatarMesh();
    userGroup.add(avatar);
    
    const remoteUser: RemoteUser = {
      id: userId,
      mesh: userGroup,
      avatar: avatar
    };
    
    this.remoteUsers.set(userId, remoteUser);
    return userGroup;
  }
  
  private createAvatarMesh(): THREE.Mesh {
    const geometry = new THREE.CapsuleGeometry(0.3, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
      metalness: 0.3,
      roughness: 0.7
    });
    
    return new THREE.Mesh(geometry, material);
  }
}

interface Transform {
  position: { x: number; y: number; z: number };
  quaternion: { x: number; y: number; z: number; w: number };
}

interface RemoteUser {
  id: string;
  mesh: THREE.Group;
  avatar: THREE.Mesh;
}
```

## Performance Optimization

### Level of Detail (LOD)

```typescript
// systems/LODSystem.ts
export class LODSystem {
  private lods: Map<string, THREE.LOD> = new Map();
  private camera: THREE.PerspectiveCamera;
  
  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }
  
  createLOD(id: string, objects: THREE.Object3D[], distances: number[]): THREE.LOD {
    const lod = new THREE.LOD();
    
    objects.forEach((object, index) => {
      lod.addLevel(object, distances[index]);
    });
    
    this.lods.set(id, lod);
    return lod;
  }
  
  update(): void {
    this.lods.forEach((lod) => {
      lod.update(this.camera);
    });
  }
}
```

### Occlusion Culling

```typescript
// systems/OcclusionCulling.ts
export class OcclusionCulling {
  private objects: Set<THREE.Object3D> = new Set();
  private camera: THREE.PerspectiveCamera;
  private frustrum: THREE.Frustum;
  
  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.frustrum = new THREE.Frustum();
    this.updateFrustum();
  }
  
  addObject(object: THREE.Object3D): void {
    this.objects.add(object);
  }
  
  cull(): void {
    this.updateFrustum();
    
    this.objects.forEach((object) => {
      const boundingBox = new THREE.Box3().setFromObject(object);
      const isVisible = this.frustrum.intersectsBox(boundingBox);
      object.visible = isVisible;
    });
  }
  
  private updateFrustum(): void {
    const matrix = new THREE.Matrix4().multiplyMatrices(
      this.camera.projectionMatrix, 
      this.camera.matrixWorldInverse
    );
    this.frustrum.setFromProjectionMatrix(matrix);
  }
}
```

## Input Systems

### Hand Tracking

```typescript
// systems/HandTracking.ts
export class HandTracking {
  private leftHand: XRHand | null = null;
  private rightHand: XRHand | null = null;
  private handModels: Map<string, THREE.Group> = new Map();
  
  constructor(session: XRSession) {
    this.initializeHandTracking(session);
  }
  
  private async initializeHandTracking(session: XRSession): Promise<void> {
    if ('HandTracking' in window) {
      try {
        // Request hand tracking
        await session.requestReferenceSpace('viewer');
        
        // Setup hand input sources
        session.addEventListener('inputsourceschange', (event) => {
          event.added.forEach((inputSource) => {
            if (inputSource.hand) {
              this.setupHand(inputSource);
            }
          });
        });
      } catch (error) {
        console.warn('Hand tracking not available:', error);
      }
    }
  }
  
  private setupHand(inputSource: XRInputSource): void {
    const hand = inputSource.hand!;
    
    if (inputSource.handedness === 'left') {
      this.leftHand = hand;
    } else if (inputSource.handedness === 'right') {
      this.rightHand = hand;
    }
    
    // Load hand model
    this.loadHandModel(inputSource.handedness);
  }
  
  private async loadHandModel(handedness: string): Promise<void> {
    // Load 3D hand model
    const handModel = await this.loadGLTF(`/models/hands/${handedness}.glb`);
    handModel.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    this.handModels.set(handedness, handModel.scene);
  }
  
  updateHands(frame: XRFrame, referenceSpace: XRReferenceSpace): void {
    if (this.leftHand) {
      this.updateHand(this.leftHand, 'left', frame, referenceSpace);
    }
    
    if (this.rightHand) {
      this.updateHand(this.rightHand, 'right', frame, referenceSpace);
    }
  }
  
  private updateHand(hand: XRHand, handedness: string, frame: XRFrame, referenceSpace: XRReferenceSpace): void {
    const handModel = this.handModels.get(handedness);
    if (!handModel) return;
    
    // Update each joint
    for (const joint of Object.values(hand)) {
      if (joint && joint.pose) {
        const pose = frame.getPose(joint.space, referenceSpace);
        if (pose) {
          const jointMesh = handModel.getObjectByName(joint.jointName!);
          if (jointMesh) {
            jointMesh.position.fromArray(pose.transform.position);
            jointMesh.quaternion.fromArray(pose.transform.orientation);
          }
        }
      }
    }
  }
}
```

## Usage Examples

### Basic Metaverse Scene

```typescript
// index.ts
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MetaverseEngine, MetaverseConfig } from './KatalystMetaverse';

const config: MetaverseConfig = {
  renderer: 'three',
  physics: 'rapier',
  networking: 'webrtc',
  xr: true,
  performance: {
    targetFPS: 60,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    shadows: true,
    antialiasing: true
  },
  input: {
    handTracking: true,
    controllers: true,
    gaze: false,
    voice: false
  }
};

const container = document.getElementById('metaverse-container');
if (container) {
  const root = createRoot(container);
  root.render(
    <MetaverseScene config={config} />
  );
}
```

### WebXR Experience

```typescript
// components/XRExperience.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, ARButton, XR } from '@react-three/xr';
import { Sky, Environment } from '@react-three/drei';

export function XRExperience({ config }: { config: MetaverseConfig }) {
  const [isXRActive, setIsXRActive] = useState(false);
  
  return (
    <>
      {config.xr && (
        <>
          <VRButton />
          <ARButton />
        </>
      )}
      
      <Canvas>
        <XR>
          <XREnvironment config={config} />
          <XRExperienceContent isXRActive={isXRActive} />
        </XR>
      </Canvas>
    </>
  );
}

function XREnvironment({ config }: { config: MetaverseConfig }) {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="city" />
      
      {config.performance.shadows && (
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
      )}
      
      <ambientLight intensity={0.4} />
    </>
  );
}

function XRExperienceContent({ isXRActive }: { isXRActive: boolean }) {
  return (
    <>
      {/* Interactive XR objects */}
      <XRInteractiveCube position={[0, 1.5, -2]} />
      <XRHandTracking />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
    </>
  );
}
```

### Multi-User Experience

```typescript
// components/MultiUserExperience.tsx
import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { NetworkManager } from '../systems/NetworkManager';

export function MultiUserExperience() {
  const [networkManager, setNetworkManager] = useState<NetworkManager | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);
  
  useEffect(() => {
    const manager = new NetworkManager();
    manager.initialize('wss://your-signaling-server.com');
    setNetworkManager(manager);
    
    return () => {
      manager.disconnect();
    };
  }, []);
  
  return (
    <>
      <LocalAvatar networkManager={networkManager} />
      {remoteUsers.map((userId) => (
        <RemoteAvatar key={userId} userId={userId} />
      ))}
    </>
  );
}

function LocalAvatar({ networkManager }: { networkManager: NetworkManager | null }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (ref.current && networkManager) {
      // Broadcast position and rotation
      networkManager.broadcastTransform(ref.current.position, ref.current.quaternion);
    }
  });
  
  return (
    <group ref={ref}>
      {/* Local player avatar */}
      <capsuleGeometry args={[0.3, 1, 4, 8]} />
    </group>
  );
}
```

## Development Workflow

### Development Mode

Start the metaverse application in development mode:

```bash
# Using the unified runner
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task dev:metaverse

# Using the Tauri builder with WebXR
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts --dev --platform webxr
```

### Building

Build the metaverse application for distribution:

```bash
# Build WebXR experience
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task build:webxr

# Build with Tauri for desktop VR
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts --build --platform webxr
```

### Testing

Test the metaverse application:

```bash
# Run unit tests
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:unit

# Run integration tests
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:integration

# Test WebXR compatibility
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:xr
```

## Browser Compatibility

### WebXR Support Detection

```typescript
// utils/XRCompatibility.ts
export const XRCompatibility = {
  async checkSupport() {
    const isSupported = {
      webXR: !!navigator.xr,
      immersiveVR: false,
      immersiveAR: false,
      handTracking: false,
      controllers: false
    };
    
    if (navigator.xr) {
      isSupported.immersiveVR = await navigator.xr.isSessionSupported('immersive-vr');
      isSupported.immersiveAR = await navigator.xr.isSessionSupported('immersive-ar');
      
      // Check for specific features
      isSupported.handTracking = 'HandTracking' in window;
      isSupported.controllers = true; // Most VR systems support controllers
    }
    
    return isSupported;
  },
  
  getRecommendedSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('xr') || 'immersive-vr';
    
    return mode as XRSessionMode;
  }
};
```

### Fallback for Non-XR Browsers

```typescript
// components/NonXRFallback.tsx
export function NonXRFallback() {
  return (
    <div className="xr-fallback">
      <h2>WebXR Not Supported</h2>
      <p>Your browser doesn't support WebXR. Please try:</p>
      <ul>
        <li>Chrome 90+ on desktop</li>
        <li>Firefox Reality on VR headsets</li>
        <li>Oculus Browser on Quest</li>
        <li>WebXR-compatible mobile browsers</li>
      </ul>
      
      {/* Fallback 3D experience */}
      <Canvas>
        <Standard3DExperience />
      </Canvas>
    </div>
  );
}
```

## Performance Considerations

### Optimization Techniques

1. **LOD (Level of Detail)**: Use simpler models for distant objects
2. **Occlusion Culling**: Don't render objects hidden behind others
3. **Instancing**: Reuse geometry for many similar objects
4. **Texture Optimization**: Use compressed texture formats
5. **Draw Call Batching**: Combine similar objects for fewer draw calls

### Monitoring Performance

```typescript
// systems/PerformanceMonitor.ts
export class PerformanceMonitor {
  private stats: {
    fps: number;
    drawCalls: number;
    triangles: number;
    memory: number;
  } = {
    fps: 0,
    drawCalls: 0,
    triangles: 0,
    memory: 0
  };
  
  update(renderer: THREE.WebGLRenderer): void {
    this.stats.fps = this.calculateFPS();
    this.stats.drawCalls = renderer.info.render.calls;
    this.stats.triangles = renderer.info.render.triangles;
    this.stats.memory = (performance as any).memory?.usedJSHeapSize || 0;
  }
  
  getStats() {
    return this.stats;
  }
  
  private calculateFPS(): number {
    // Calculate FPS based on frame timing
    return 60; // Simplified
  }
}
```

This metaverse platform provides a comprehensive foundation for building immersive 3D and WebXR experiences with performance optimization and cross-platform compatibility.
