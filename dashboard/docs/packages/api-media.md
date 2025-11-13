# Katalyst API Media Router Documentation

## Overview

The Media Router provides comprehensive media management capabilities for the Katalyst platform, including file uploads, processing, optimization, and CDN integration. This router handles all media-related operations through a secure, scalable, and efficient API.

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Upload Workflows](#upload-workflows)
3. [File Management](#file-management)
4. [Image Processing](#image-processing)
5. [Video & Audio Handling](#video--audio-handling)
6. [CDN Integration & Optimization](#cdn-integration--optimization)
7. [Storage & Organization](#storage--organization)
8. [Security & Rights Management](#security--rights-management)
9. [API Reference](#api-reference)
10. [Best Practices](#best-practices)

## Core Architecture

### Design Principles

- **Security-first**: All uploads require authentication and validation
- **Scalability**: Supports both single and multipart uploads for files of any size
- **Performance**: Built-in optimization and CDN integration
- **Flexibility**: Comprehensive metadata and tagging system
- **Reliability**: Robust error handling and processing status tracking

### File Types Supported

| Category | Types | Processing Support |
|----------|-------|-------------------|
| **Images** | JPEG, PNG, GIF, WebP, AVIF | Resize, crop, optimize, watermark |
| **Videos** | MP4, WebM, MOV, AVI | Transcode, trim, thumbnail generation |
| **Audio** | MP3, WAV, AAC, OGG | Format conversion, optimization |
| **Documents** | PDF, DOC, DOCX, TXT | Text extraction, preview generation |
| **Archives** | ZIP, RAR, TAR | Extraction, compression |

## Upload Workflows

### Standard Upload Flow

The standard upload process involves three main steps:

```typescript
// 1. Request upload credentials
const uploadRequest = await media.requestUpload.mutate({
  filename: "profile-image.jpg",
  mimeType: "image/jpeg",
  size: 2048576, // 2MB
  folder: "avatars",
  public: true,
  metadata: {
    alt: "User profile image",
    caption: "Profile picture for John Doe",
    tags: ["profile", "avatar", "user"],
    copyright: "© 2024 John Doe"
  }
});

// 2. Upload file directly to storage
await fetch(uploadRequest.uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'image/jpeg',
    'Content-Length': file.size.toString()
  }
});

// 3. Confirm upload completion
const result = await media.confirmUpload.mutate({
  uploadId: uploadRequest.uploadId,
  fileId: uploadRequest.fileId
});
```

### Multipart Upload (Large Files)

For files larger than 100MB, use multipart uploads:

```typescript
// 1. Initiate multipart upload
const multipartInit = await media.initiateMultipartUpload.mutate({
  filename: "large-video.mp4",
  mimeType: "video/mp4",
  size: 5368709120, // 5GB
  parts: 50 // Number of parts
});

// 2. Upload each part
const uploadPromises = multipartInit.partUrls.map(async (part) => {
  const chunk = getFileChunk(file, part.partNumber);
  await fetch(part.uploadUrl, {
    method: 'PUT',
    body: chunk
  });
  return {
    partNumber: part.partNumber,
    etag: getETagFromResponse(response)
  };
});

const uploadedParts = await Promise.all(uploadPromises);

// 3. Complete multipart upload
const completion = await media.completeMultipartUpload.mutate({
  uploadId: multipartInit.uploadId,
  parts: uploadedParts
});
```

## File Management

### Retrieving Files

```typescript
// Get single file
const file = await media.getFile.query({
  fileId: "file-123"
});

// List files with filters
const fileList = await media.listFiles.query({
  folder: "images/2024",
  type: "image",
  search: "profile",
  tags: ["avatar", "user"],
  sortBy: "date",
  order: "desc",
  page: 1,
  limit: 50
});
```

### Updating File Metadata

```typescript
await media.updateFile.mutate({
  fileId: "file-123",
  data: {
    filename: "new-filename.jpg",
    folder: "images/updated",
    metadata: {
      alt: "Updated alt text",
      caption: "Updated caption",
      tags: ["new-tag", "updated"]
    }
  }
});
```

### Batch Operations

```typescript
// Batch tag files
await media.batchOperation.mutate({
  operation: "tag",
  fileIds: ["file-1", "file-2", "file-3"],
  params: { tags: ["featured", "2024-collection"] }
});

// Batch move files
await media.batchOperation.mutate({
  operation: "move",
  fileIds: ["file-1", "file-2"],
  params: { destination: "archive/2024" }
});

// Batch delete files
await media.batchOperation.mutate({
  operation: "delete",
  fileIds: ["file-1", "file-2", "file-3"],
  params: {}
});
```

## Image Processing

### Basic Operations

```typescript
// Process image with multiple operations
const processed = await media.processImage.mutate({
  fileId: "image-123",
  operations: [
    {
      type: "resize",
      params: {
        width: 800,
        height: 600,
        fit: "cover"
      }
    },
    {
      type: "crop",
      params: {
        x: 100,
        y: 100,
        width: 400,
        height: 300
      }
    },
    {
      type: "watermark",
      params: {
        text: "© My Brand",
        position: "bottom-right",
        opacity: 0.7
      }
    },
    {
      type: "format",
      params: {
        format: "webp",
        quality: 85
      }
    }
  ],
  saveAs: {
    filename: "processed-image.webp",
    folder: "processed",
    replace: false
  }
});
```

### Thumbnail Generation

```typescript
// Generate multiple thumbnail sizes
const thumbnails = await media.generateThumbnails.mutate({
  fileId: "image-123",
  sizes: [
    { width: 150, height: 150, suffix: "small" },
    { width: 300, height: 300, suffix: "medium" },
    { width: 800, height: 600, suffix: "large" }
  ]
});
```

### Advanced Image Operations

| Operation | Parameters | Description |
|-----------|------------|-------------|
| **resize** | width, height, fit, quality | Resize image with various fitting modes |
| **crop** | x, y, width, height | Crop to specific coordinates |
| **rotate** | angle, background | Rotate by degrees with background fill |
| **flip** | axis (horizontal/vertical) | Flip image along specified axis |
| **filter** | type, intensity | Apply filters (blur, sharpen, brightness, etc.) |
| **watermark** | text/image, position, opacity | Add watermark overlay |
| **format** | format, quality | Convert image format |

## Video & Audio Handling

### Video Processing

```typescript
// Process video with multiple operations
const videoJob = await media.processVideo.mutate({
  fileId: "video-123",
  operations: {
    transcode: {
      format: "hls", // or "mp4", "webm"
      quality: "high" // "low", "medium", "high", "4k"
    },
    trim: {
      start: 30, // seconds
      end: 120   // seconds
    },
    thumbnail: {
      time: 60 // seconds (generate thumbnail at this time)
    }
  }
});

// Check processing status
const status = await media.getProcessingStatus.query({
  jobId: videoJob.jobId
});
```

### Processing States

| State | Description |
|-------|-------------|
| **pending** | Job queued but not started |
| **processing** | Currently being processed |
| **completed** | Processing finished successfully |
| **failed** | Processing failed (check error details) |
| **cancelled** | Job was cancelled |

### Audio Processing

```typescript
// Audio format conversion and optimization
const audioJob = await media.processVideo.mutate({
  fileId: "audio-123",
  operations: {
    transcode: {
      format: "mp3",
      quality: "medium" // affects bitrate
    }
  }
});
```

## CDN Integration & Optimization

### Dynamic Image Transformation

```typescript
// Get optimized CDN URL with transformations
const cdnUrl = await media.getCDNUrl.query({
  fileId: "image-123",
  transforms: {
    width: 800,
    height: 600,
    quality: 80,
    format: "webp",
    fit: "cover"
  }
});

// Result: "https://cdn.katalyst.io/t/w_800,h_600,q_80,f_webp,fit_cover/files/image.jpg"
```

### File Optimization

```typescript
// Optimize existing file
const optimized = await media.optimizeFile.mutate({
  fileId: "image-123",
  optimize: {
    quality: 85,
    format: "auto", // Automatically choose best format
    progressive: true // For JPEG images
  }
});
```

### CDN Features

- **Automatic Format Selection**: Converts to WebP/AVIF for supported browsers
- **Responsive Images**: Dynamic resizing based on device capabilities
- **Quality Optimization**: Balance between file size and visual quality
- **Global Caching**: Edge caching for fast delivery worldwide
- **URL Signing**: Secure access to private files

## Storage & Organization

### Folder Structure

```typescript
// Create folder
const folder = await media.createFolder.mutate({
  name: "2024",
  parent: "blog/images" // optional
});

// Delete folder
await media.deleteFolder.mutate({
  folderId: "folder-123",
  deleteContents: false // Safety: set to true to delete contents
});
```

### Recommended Organization Patterns

```
media/
├── images/
│   ├── 2024/
│   │   ├── blog/
│   │   ├── products/
│   │   └── users/
│   └── 2023/
├── videos/
│   ├── tutorials/
│   ├── marketing/
│   └── user-generated/
├── documents/
│   ├── contracts/
│   ├── invoices/
│   └── reports/
└── assets/
    ├── logos/
    ├── icons/
    └── brand/
```

### Storage Analytics

```typescript
// Monitor storage usage
const usage = await media.getStorageUsage.query();
console.log(`
  Used: ${usage.used / 1024 / 1024} MB
  Limit: ${usage.limit / 1024 / 1024} MB
  Files: ${usage.fileCount}
  
  Breakdown:
  - Images: ${usage.breakdown.images / 1024 / 1024} MB
  - Videos: ${usage.breakdown.videos / 1024 / 1024} MB
  - Documents: ${usage.breakdown.documents / 1024 / 1024} MB
`);
```

## Metadata & Tagging

### Metadata Schema

```typescript
interface MediaMetadata {
  // Basic metadata
  alt?: string;          // Alt text for accessibility
  caption?: string;      // Caption or description
  tags?: string[];       // Searchable tags
  
  // Technical metadata (auto-populated)
  width?: number;        // Image/video width
  height?: number;       // Image/video height
  duration?: number;     // Video/audio duration in seconds
  
  // Rights management
  copyright?: string;    // Copyright information
  license?: string;      // License type
  attribution?: string;  // Attribution requirements
  
  // Custom metadata
  custom?: Record<string, any>;
}
```

### Tagging Best Practices

```typescript
// Hierarchical tagging
const tags = [
  "type:image",
  "category:product",
  "collection:summer-2024",
  "status:published",
  "featured:true"
];

// Search by tags
const images = await media.listFiles.query({
  tags: ["type:image", "category:product"],
  search: "summer"
});
```

## Security & Rights Management

### Access Control

| Operation | Authentication Required | Public Access |
|-----------|------------------------|---------------|
| **Upload** | Required | No |
| **List Files** | Required | No |
| **Get File** | Optional | Yes (if public) |
| **Update File** | Required | No |
| **Delete File** | Required | No |
| **CDN URL** | Optional | Yes (if public) |

### File Permissions

```typescript
// Public file (accessible via CDN)
await media.requestUpload.mutate({
  filename: "public-image.jpg",
  mimeType: "image/jpeg",
  size: 1024000,
  public: true // Accessible to anyone
});

// Private file (requires authentication)
await media.requestUpload.mutate({
  filename: "private-document.pdf",
  mimeType: "application/pdf",
  size: 2048000,
  public: false // Only accessible by authenticated users
});
```

### Share Links

```typescript
// Create temporary share link
const shareLink = await media.createShareLink.mutate({
  fileId: "file-123",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  password: "secure-password",
  maxDownloads: 10
});

// Result: https://share.katalyst.io/s/xxxx
```

## API Reference

### Upload Procedures

#### `requestUpload`
```typescript
requestUpload(input: {
  filename: string;
  mimeType: string;
  size: number;
  folder?: string;
  public?: boolean;
  metadata?: {
    alt?: string;
    caption?: string;
    tags?: string[];
    copyright?: string;
  };
}) -> {
  uploadId: string;
  uploadUrl: string;
  fileId: string;
  expiresAt: Date;
}
```

#### `confirmUpload`
```typescript
confirmUpload(input: {
  uploadId: string;
  fileId: string;
}) -> {
  success: boolean;
  file: {
    id: string;
    url: string;
    thumbnailUrl?: string;
  };
}
```

#### `initiateMultipartUpload`
```typescript
initiateMultipartUpload(input: {
  filename: string;
  mimeType: string;
  size: number;
  parts: number;
}) -> {
  uploadId: string;
  partUrls: Array<{
    partNumber: number;
    uploadUrl: string;
  }>;
}
```

#### `completeMultipartUpload`
```typescript
completeMultipartUpload(input: {
  uploadId: string;
  parts: Array<{
    partNumber: number;
    etag: string;
  }>;
}) -> {
  success: boolean;
  fileId: string;
  url: string;
}
```

### File Management Procedures

#### `getFile`
```typescript
getFile(input: {
  fileId: string;
}) -> {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata: {
    width?: number;
    height?: number;
    alt?: string;
    [key: string]: any;
  };
  createdAt: Date;
}
```

#### `listFiles`
```typescript
listFiles(input: {
  folder?: string;
  type?: 'image' | 'video' | 'audio' | 'document' | 'archive';
  search?: string;
  tags?: string[];
  sortBy?: 'name' | 'size' | 'date' | 'type';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) -> {
  files: FileItem[];
  folders: FolderItem[];
  total: number;
  totalSize: number;
}
```

#### `updateFile`
```typescript
updateFile(input: {
  fileId: string;
  data: {
    filename?: string;
    folder?: string;
    metadata?: {
      alt?: string;
      caption?: string;
      tags?: string[];
    };
  };
}) -> { success: boolean }
```

### Processing Procedures

#### `processImage`
```typescript
processImage(input: {
  fileId: string;
  operations: Array<{
    type: 'resize' | 'crop' | 'rotate' | 'flip' | 'filter' | 'watermark' | 'format';
    params: Record<string, any>;
  }>;
  saveAs?: {
    filename: string;
    folder?: string;
    replace?: boolean;
  };
}) -> {
  processedFileId: string;
  url: string;
}
```

#### `processVideo`
```typescript
processVideo(input: {
  fileId: string;
  operations: {
    transcode?: {
      format: 'mp4' | 'webm' | 'hls';
      quality: 'low' | 'medium' | 'high' | '4k';
    };
    trim?: {
      start: number;
      end: number;
    };
    thumbnail?: {
      time: number;
    };
  };
}) -> {
  jobId: string;
  status: 'pending' | 'processing';
}
```

## Best Practices

### Upload Optimization

1. **File Size Limits**
   - Images: Keep under 10MB for optimal performance
   - Videos: Use multipart uploads for files > 100MB
   - Documents: Compress before uploading when possible

2. **Format Selection**
   - Use WebP for images (better compression than JPEG/PNG)
   - Use MP4 for videos (best compatibility)
   - Use WebM for videos when quality is priority

3. **Metadata Best Practices**
   - Always provide alt text for images
   - Use descriptive filenames
   - Implement consistent tagging strategy
   - Include copyright information when applicable

### Performance Optimization

1. **CDN Usage**
   - Use public files for frequently accessed assets
   - Implement appropriate caching headers
   - Leverage format negotiation for optimal delivery

2. **Image Optimization**
   - Generate multiple sizes for responsive design
   - Use WebP/AVIF for modern browsers
   - Implement lazy loading for image-heavy pages

3. **Video Optimization**
   - Use HLS for streaming large videos
   - Generate thumbnails for video previews
   - Consider adaptive bitrate streaming

### Security Considerations

1. **Access Control**
   - Set appropriate public/private flags
   - Use share links for temporary access
   - Implement proper authentication

2. **File Validation**
   - Validate file types before upload
   - Scan uploaded files for malware
   - Implement size restrictions

3. **Rights Management**
   - Keep track of licensing information
   - Implement attribution requirements
   - Respect copyright and usage terms

### Error Handling

```typescript
// Robust upload with error handling
async function uploadFile(file: File, options: UploadOptions) {
  try {
    // Request upload
    const uploadRequest = await media.requestUpload.mutate({
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      ...options
    });

    // Upload with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const response = await fetch(uploadRequest.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
            'Content-Length': file.size.toString()
          }
        });

        if (!response.ok) throw new Error('Upload failed');
        break;
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    // Confirm upload
    return await media.confirmUpload.mutate({
      uploadId: uploadRequest.uploadId,
      fileId: uploadRequest.fileId
    });

  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }
}
```

### Integration Examples

#### React Component Example

```typescript
import { useState } from 'react';
import { trpc } from '../utils/trpc';

function MediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const uploadFile = trpc.media.requestUpload.useMutation();
  const confirmUpload = trpc.media.confirmUpload.useMutation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Request upload
      const uploadData = await uploadFile.mutateAsync({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        folder: 'uploads',
        public: true
      });

      // Upload to S3/Cloud storage
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      await new Promise((resolve, reject) => {
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.open('PUT', uploadData.uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // Confirm upload
      await confirmUpload.mutateAsync({
        uploadId: uploadData.uploadId,
        fileId: uploadData.fileId
      });

      console.log('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileSelect} 
        disabled={uploading}
      />
      {uploading && (
        <div>
          <progress value={progress} max={100} />
          <span>{progress}%</span>
        </div>
      )}
    </div>
  );
}
```

---

## Additional Resources

- [API Documentation](../API_DOCUMENTATION.md)
- [Core Package Documentation](../core/README.md)
- [Design System Documentation](../../design-system/)
- [Build System Guide](../../build-system/)

For more information or support, refer to the main Katalyst documentation or contact the development team.
