# Media Router

The Media Router provides comprehensive media management capabilities including file uploads, processing, optimization, CDN integration, and advanced media operations for the Katalyst platform.

## Overview

This router offers a complete media management solution with features for secure file uploads, image and video processing, storage optimization, CDN integration, and advanced media operations like batch processing and sharing.

## Features

### File Upload Management
- Secure single and multipart uploads
- Presigned URL generation for direct uploads
- File metadata management
- Upload confirmation and verification

### File Management
- Complete CRUD operations for files and folders
- Advanced search and filtering capabilities
- Batch operations for efficient management
- File organization with folder structures

### Image Processing
- On-demand image transformations
- Thumbnail generation with custom sizes
- Image optimization and format conversion
- Advanced operations like watermarks and filters

### Video Processing
- Video transcoding to multiple formats
- Quality adjustments and format conversion
- Thumbnail generation from video frames
- Asynchronous processing with status tracking

### CDN & Optimization
- Content delivery network integration
- Real-time image optimization
- Progressive loading support
- Bandwidth and storage optimization

### Storage Analytics
- Storage usage monitoring and reporting
- File type breakdown analysis
- Usage statistics and trends
- Quota management and alerts

### Security & Sharing
- Secure share links with expiration
- Password-protected sharing
- Download limits and access control
- Public and private file access

## API Procedures

### Upload Management

#### `requestUpload`
**Type**: Protected Mutation  
**Description**: Request a presigned upload URL for secure file uploads.

**Input Schema**:
```typescript
{
  filename: string,
  mimeType: string,
  size: number,
  folder?: string,
  public?: boolean,
  metadata?: {
    alt?: string,
    caption?: string,
    tags?: Array<string>,
    copyright?: string
  }
}
```

**Response**:
```typescript
{
  uploadId: string,
  uploadUrl: string,
  fileId: string,
  expiresAt: Date
}
```

**Usage Example**:
```typescript
// Request upload for an image
const uploadRequest = await trpc.media.requestUpload.mutate({
  filename: 'product-image.jpg',
  mimeType: 'image/jpeg',
  size: 2048000, // 2MB
  folder: 'products/images',
  public: true,
  metadata: {
    alt: 'Product hero image',
    caption: 'Main product photo showing the item from front',
    tags: ['product', 'hero', 'main'],
    copyright: 'Company Name 2024'
  }
});

// Upload file directly to the presigned URL
const response = await fetch(uploadRequest.uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});

if (response.ok) {
  console.log(`File uploaded with ID: ${uploadRequest.fileId}`);
  
  // Confirm the upload
  const confirmation = await trpc.media.confirmUpload.mutate({
    uploadId: uploadRequest.uploadId,
    fileId: uploadRequest.fileId
  });
  
  console.log(`File available at: ${confirmation.file.url}`);
}
```

#### `confirmUpload`
**Type**: Protected Mutation  
**Description**: Confirm and finalize a completed file upload.

**Input Schema**:
```typescript
{
  uploadId: string,
  fileId: string
}
```

**Response**:
```typescript
{
  success: boolean,
  file: {
    id: string,
    url: string,
    thumbnailUrl?: string
  }
}
```

**Usage Example**:
```typescript
const confirmation = await trpc.media.confirmUpload.mutate({
  uploadId: 'upload-123',
  fileId: 'file-456'
});

console.log(`Upload confirmed. File URL: ${confirmation.file.url}`);
```

#### `initiateMultipartUpload`
**Type**: Protected Mutation  
**Description**: Initiate multipart upload for large files.

**Input Schema**:
```typescript
{
  filename: string,
  mimeType: string,
  size: number,
  parts: number
}
```

**Response**:
```typescript
{
  uploadId: string,
  partUrls: Array<{
    partNumber: number,
    uploadUrl: string
  }>
}
```

**Usage Example**:
```typescript
// Initiate multipart upload for a 100MB video
const multipartUpload = await trpc.media.initiateMultipartUpload.mutate({
  filename: 'tutorial-video.mp4',
  mimeType: 'video/mp4',
  size: 104857600, // 100MB
  parts: 10
});

// Upload each part
const uploadPromises = multipartUpload.partUrls.map(async (part) => {
  const chunk = getFileChunk(file, part.partNumber);
  const response = await fetch(part.uploadUrl, {
    method: 'PUT',
    body: chunk
  });
  
  if (response.ok) {
    return {
      partNumber: part.partNumber,
      etag: response.headers.get('ETag')
    };
  }
});

const uploadedParts = await Promise.all(uploadPromises);

// Complete the multipart upload
const completion = await trpc.media.completeMultipartUpload.mutate({
  uploadId: multipartUpload.uploadId,
  parts: uploadedParts
});

console.log(`Large file uploaded: ${completion.url}`);
```

#### `completeMultipartUpload`
**Type**: Protected Mutation  
**Description**: Complete a multipart upload by combining all parts.

**Input Schema**:
```typescript
{
  uploadId: string,
  parts: Array<{
    partNumber: number,
    etag: string
  }>
}
```

**Usage Example**:
```typescript
const completion = await trpc.media.completeMultipartUpload.mutate({
  uploadId: 'multipart-upload-123',
  parts: [
    { partNumber: 1, etag: 'etag-1' },
    { partNumber: 2, etag: 'etag-2' },
    // ... more parts
  ]
});

console.log(`Multipart upload completed: ${completion.url}`);
```

### File Management

#### `getFile`
**Type**: Public Query  
**Description**: Retrieve file information and metadata.

**Input Schema**:
```typescript
{
  fileId: string
}
```

**Response**:
```typescript
{
  id: string,
  filename: string,
  mimeType: string,
  size: number,
  url: string,
  thumbnailUrl?: string,
  metadata?: {
    width?: number,
    height?: number,
    alt?: string
  },
  createdAt: Date
}
```

**Usage Example**:
```typescript
const file = await trpc.media.getFile.query({
  fileId: 'file-123'
});

console.log(`File: ${file.filename} (${file.size} bytes)`);
console.log(`URL: ${file.url}`);
if (file.thumbnailUrl) {
  console.log(`Thumbnail: ${file.thumbnailUrl}`);
}
```

#### `listFiles`
**Type**: Protected Query  
**Description**: List files with filtering, search, and pagination.

**Input Schema**:
```typescript
{
  folder?: string,
  type?: 'image' | 'video' | 'audio' | 'document' | 'archive',
  search?: string,
  tags?: Array<string>,
  sortBy?: 'name' | 'size' | 'date' | 'type',
  order?: 'asc' | 'desc',
  page?: number,
  limit?: number
}
```

**Response**:
```typescript
{
  files: Array<File>,
  folders: Array<Folder>,
  total: number,
  totalSize: number
}
```

**Usage Example**:
```typescript
// Get all images from last month, sorted by date
const images = await trpc.media.listFiles.query({
  type: 'image',
  sortBy: 'date',
  order: 'desc',
  page: 1,
  limit: 50
});

// Search for files with specific tags
const taggedFiles = await trpc.media.listFiles.query({
  tags: ['product', 'featured'],
  search: 'hero',
  limit: 20
});

// Get files from specific folder
const folderFiles = await trpc.media.listFiles.query({
  folder: '/products/images'
});

console.log(`Found ${images.total} images`);
images.files.forEach(file => {
  console.log(`${file.filename}: ${file.size} bytes`);
});
```

#### `updateFile`
**Type**: Protected Mutation  
**Description**: Update file metadata and properties.

**Input Schema**:
```typescript
{
  fileId: string,
  data: {
    filename?: string,
    folder?: string,
    metadata?: {
      alt?: string,
      caption?: string,
      tags?: Array<string>
    }
  }
}
```

**Usage Example**:
```typescript
await trpc.media.updateFile.mutate({
  fileId: 'file-123',
  data: {
    filename: 'new-product-image.jpg',
    folder: '/products/updated',
    metadata: {
      alt: 'Updated product image',
      caption: 'New product photography',
      tags: ['product', 'updated', 'hero']
    }
  }
});
```

#### `deleteFile`
**Type**: Protected Mutation  
**Description**: Delete a single file.

**Input Schema**:
```typescript
{
  fileId: string
}
```

**Usage Example**:
```typescript
await trpc.media.deleteFile.mutate({
  fileId: 'file-to-delete'
});
```

#### `deleteMultipleFiles`
**Type**: Protected Mutation  
**Description**: Delete multiple files in a single operation.

**Input Schema**:
```typescript
{
  fileIds: Array<string>
}
```

**Response**:
```typescript
{
  success: boolean,
  deleted: number
}
```

**Usage Example**:
```typescript
const result = await trpc.media.deleteMultipleFiles.mutate({
  fileIds: ['file-1', 'file-2', 'file-3']
});

console.log(`Deleted ${result.deleted} files`);
```

### Folder Management

#### `createFolder`
**Type**: Protected Mutation  
**Description**: Create a new folder for file organization.

**Input Schema**:
```typescript
{
  name: string,
  parent?: string
}
```

**Response**:
```typescript
{
  id: string,
  name: string,
  path: string
}
```

**Usage Example**:
```typescript
const folder = await trpc.media.createFolder.mutate({
  name: 'product-images',
  parent: 'products'
});

console.log(`Created folder: ${folder.path}`);
```

#### `deleteFolder`
**Type**: Protected Mutation  
**Description**: Delete a folder and optionally its contents.

**Input Schema**:
```typescript
{
  folderId: string,
  deleteContents?: boolean
}
```

**Usage Example**:
```typescript
// Delete empty folder
await trpc.media.deleteFolder.mutate({
  folderId: 'folder-123'
});

// Delete folder and all contents
await trpc.media.deleteFolder.mutate({
  folderId: 'folder-456',
  deleteContents: true
});
```

### Image Processing

#### `processImage`
**Type**: Protected Mutation  
**Description**: Apply various image processing operations.

**Input Schema**:
```typescript
{
  fileId: string,
  operations: Array<{
    type: 'resize' | 'crop' | 'rotate' | 'flip' | 'filter' | 'watermark' | 'format',
    params: Record<string, any>
  }>,
  saveAs?: {
    filename: string,
    folder?: string,
    replace?: boolean
  }
}
```

**Response**:
```typescript
{
  processedFileId: string,
  url: string
}
```

**Usage Example**:
```typescript
// Resize and add watermark
const processed = await trpc.media.processImage.mutate({
  fileId: 'original-image',
  operations: [
    {
      type: 'resize',
      params: {
        width: 1200,
        height: 800,
        fit: 'cover'
      }
    },
    {
      type: 'watermark',
      params: {
        text: '© Company 2024',
        position: 'bottom-right',
        opacity: 0.5
      }
    }
  ],
  saveAs: {
    filename: 'processed-image.jpg',
    folder: '/processed'
  }
});

console.log(`Processed image: ${processed.url}`);

// Convert to different format
const converted = await trpc.media.processImage.mutate({
  fileId: 'original-image',
  operations: [
    {
      type: 'format',
      params: {
        format: 'webp',
        quality: 80
      }
    }
  ]
});
```

#### `generateThumbnails`
**Type**: Protected Mutation  
**Description**: Generate multiple thumbnail sizes for an image.

**Input Schema**:
```typescript
{
  fileId: string,
  sizes: Array<{
    width: number,
    height: number,
    suffix?: string
  }>
}
```

**Response**:
```typescript
{
  thumbnails: Array<{
    size: string,
    url: string
  }>
}
```

**Usage Example**:
```typescript
const thumbnails = await trpc.media.generateThumbnails.mutate({
  fileId: 'image-123',
  sizes: [
    { width: 150, height: 150, suffix: 'small' },
    { width: 300, height: 300, suffix: 'medium' },
    { width: 600, height: 400, suffix: 'large' }
  ]
});

thumbnails.thumbnails.forEach(thumb => {
  console.log(`${thumb.size}: ${thumb.url}`);
});
```

### Video Processing

#### `processVideo`
**Type**: Protected Mutation  
**Description**: Process videos with transcoding, trimming, and thumbnail generation.

**Input Schema**:
```typescript
{
  fileId: string,
  operations: {
    transcode?: {
      format: 'mp4' | 'webm' | 'hls',
      quality: 'low' | 'medium' | 'high' | '4k'
    },
    trim?: {
      start: number,
      end: number
    },
    thumbnail?: {
      time: number
    }
  }
}
```

**Response**:
```typescript
{
  jobId: string,
  status: 'processing'
}
```

**Usage Example**:
```typescript
// Transcode video to multiple formats
const transcodingJob = await trpc.media.processVideo.mutate({
  fileId: 'original-video',
  operations: {
    transcode: {
      format: 'mp4',
      quality: 'high'
    },
    thumbnail: {
      time: 5 // Generate thumbnail at 5 seconds
    }
  }
});

console.log(`Processing job: ${transcodingJob.jobId}`);

// Check processing status
const status = await trpc.media.getProcessingStatus.query({
  jobId: transcodingJob.jobId
});

if (status.status === 'completed') {
  console.log(`Processed video: ${status.result.url}`);
}
```

#### `getProcessingStatus`
**Type**: Protected Query  
**Description**: Check the status of video processing jobs.

**Input Schema**:
```typescript
{
  jobId: string
}
```

**Response**:
```typescript
{
  status: 'processing' | 'completed' | 'failed',
  progress: number, // 0-100
  result?: {
    fileId: string,
    url: string
  }
}
```

**Usage Example**:
```typescript
const status = await trpc.media.getProcessingStatus.query({
  jobId: 'job-123'
});

console.log(`Status: ${status.status} (${status.progress}%)`);
if (status.result) {
  console.log(`Result: ${status.result.url}`);
}
```

### CDN & Optimization

#### `optimizeFile`
**Type**: Protected Mutation  
**Description**: Optimize files for better performance and smaller file sizes.

**Input Schema**:
```typescript
{
  fileId: string,
  optimize: {
    quality?: number, // 1-100
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png',
    progressive?: boolean
  }
}
```

**Response**:
```typescript
{
  optimizedUrl: string,
  savings: {
    original: number,
    optimized: number,
    percentage: number
  }
}
```

**Usage Example**:
```typescript
const optimization = await trpc.media.optimizeFile.mutate({
  fileId: 'image-123',
  optimize: {
    quality: 80,
    format: 'webp',
    progressive: true
  }
});

console.log(`Optimized image: ${optimization.optimizedUrl}`);
console.log(`Size reduction: ${optimization.savings.percentage}%`);
```

#### `getCDNUrl`
**Type**: Public Query  
**Description**: Generate CDN URLs with real-time transformations.

**Input Schema**:
```typescript
{
  fileId: string,
  transforms?: {
    width?: number,
    height?: number,
    quality?: number,
    format?: string,
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  }
}
```

**Response**:
```typescript
{
  url: string
}
```

**Usage Example**:
```typescript
// Get responsive image URL
const responsiveUrl = await trpc.media.getCDNUrl.query({
  fileId: 'image-123',
  transforms: {
    width: 800,
    height: 600,
    quality: 80,
    fit: 'cover',
    format: 'webp'
  }
});

console.log(`CDN URL: ${responsiveUrl.url}`);

// Generate different sizes for responsive images
const sizes = [400, 800, 1200, 1600];
const urls = await Promise.all(
  sizes.map(size => 
    trpc.media.getCDNUrl.query({
      fileId: 'image-123',
      transforms: { width: size, quality: 75 }
    })
  )
);

// Use in responsive image component
console.log('srcset:', urls.map((url, index) => `${url.url} ${sizes[index]}w`).join(', '));
```

### Storage Analytics

#### `getStorageUsage`
**Type**: Protected Query  
**Description**: Get detailed storage usage statistics.

**Response**:
```typescript
{
  used: number, // bytes
  limit: number, // bytes
  fileCount: number,
  breakdown: {
    images: number,
    videos: number,
    documents: number
  }
}
```

**Usage Example**:
```typescript
const storage = await trpc.media.getStorageUsage.query();

const usedGB = (storage.used / 1024 / 1024 / 1024).toFixed(2);
const limitGB = (storage.limit / 1024 / 1024 / 1024).toFixed(2);
const percentage = ((storage.used / storage.limit) * 100).toFixed(1);

console.log(`Storage usage: ${usedGB}GB / ${limitGB}GB (${percentage}%)`);
console.log(`Total files: ${storage.fileCount}`);

console.log('Breakdown:');
console.log(`Images: ${(storage.breakdown.images / 1024 / 1024).toFixed(2)}MB`);
console.log(`Videos: ${(storage.breakdown.videos / 1024 / 1024).toFixed(2)}MB`);
console.log(`Documents: ${(storage.breakdown.documents / 1024 / 1024).toFixed(2)}MB`);
```

### Sharing & Security

#### `createShareLink`
**Type**: Protected Mutation  
**Description**: Create a secure share link for a file.

**Input Schema**:
```typescript
{
  fileId: string,
  expiresAt?: Date,
  password?: string,
  maxDownloads?: number
}
```

**Response**:
```typescript
{
  shareId: string,
  shareUrl: string
}
```

**Usage Example**:
```typescript
// Create share link that expires in 7 days
const shareLink = await trpc.media.createShareLink.mutate({
  fileId: 'file-123',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  maxDownloads: 10
});

console.log(`Share link: ${shareLink.shareUrl}`);

// Create password-protected share link
const protectedLink = await trpc.media.createShareLink.mutate({
  fileId: 'file-456',
  password: 'secret123',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
});

console.log(`Protected share: ${protectedLink.shareUrl}`);
```

### Batch Operations

#### `batchOperation`
**Type**: Protected Mutation  
**Description**: Perform batch operations on multiple files.

**Input Schema**:
```typescript
{
  operation: 'move' | 'copy' | 'delete' | 'tag' | 'untag',
  fileIds: Array<string>,
  params: Record<string, any>
}
```

**Response**:
```typescript
{
  success: boolean,
  processed: number,
  failed: Array<string>
}
```

**Usage Example**:
```typescript
// Move multiple files to a folder
const moveResult = await trpc.media.batchOperation.mutate({
  operation: 'move',
  fileIds: ['file-1', 'file-2', 'file-3'],
  params: {
    destination: '/archive/2024'
  }
});

console.log(`Moved ${moveResult.processed} files`);

// Add tags to multiple files
const tagResult = await trpc.media.batchOperation.mutate({
  operation: 'tag',
  fileIds: ['file-1', 'file-2'],
  params: {
    tags: ['archived', '2024']
  }
});

// Delete multiple files
const deleteResult = await trpc.media.batchOperation.mutate({
  operation: 'delete',
  fileIds: ['file-4', 'file-5']
});
```

#### `importFromUrl`
**Type**: Protected Mutation  
**Description**: Import files from external URLs.

**Input Schema**:
```typescript
{
  url: string,
  filename?: string,
  folder?: string
}
```

**Response**:
```typescript
{
  fileId: string,
  url: string
}
```

**Usage Example**:
```typescript
// Import image from external URL
const imported = await trpc.media.importFromUrl.mutate({
  url: 'https://example.com/image.jpg',
  filename: 'imported-image.jpg',
  folder: '/imports'
});

console.log(`Imported file: ${imported.url}`);
```

#### `createZip`
**Type**: Protected Mutation  
**Description**: Create a ZIP archive from multiple files.

**Input Schema**:
```typescript
{
  fileIds: Array<string>,
  filename: string
}
```

**Response**:
```typescript
{
  zipId: string,
  downloadUrl: string,
  expiresAt: Date
}
```

**Usage Example**:
```typescript
const zipArchive = await trpc.media.createZip.mutate({
  fileIds: ['file-1', 'file-2', 'file-3'],
  filename: 'project-assets.zip'
});

console.log(`Download ZIP: ${zipArchive.downloadUrl}`);
console.log(`Expires at: ${zipArchive.expiresAt}`);
```

#### `extractZip`
**Type**: Protected Mutation  
**Description**: Extract contents of a ZIP archive.

**Input Schema**:
```typescript
{
  fileId: string,
  destination?: string
}
```

**Response**:
```typescript
{
  success: boolean,
  extractedFiles: Array<string>
}
```

**Usage Example**:
```typescript
const extraction = await trpc.media.extractZip.mutate({
  fileId: 'archive-123.zip',
  destination: '/extracted'
});

console.log(`Extracted ${extraction.extractedFiles.length} files`);
```

## Integration Examples

### React Media Upload Component
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useCallback } from 'react';

export function MediaUploader({ folder, onUploadComplete }: {
  folder?: string,
  onUploadComplete?: (file: any) => void
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const requestUpload = trpc.media.requestUpload.useMutation();
  const confirmUpload = trpc.media.confirmUpload.useMutation();

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      // Request upload URL
      const uploadRequest = await requestUpload.mutateAsync({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        folder,
        public: false
      });

      // Upload file with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      });

      await new Promise((resolve, reject) => {
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.open('PUT', uploadRequest.uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // Confirm upload
      const confirmation = await confirmUpload.mutateAsync({
        uploadId: uploadRequest.uploadId,
        fileId: uploadRequest.fileId
      });

      onUploadComplete?.(confirmation.file);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder, requestUpload, confirmUpload, onUploadComplete]);

  return (
    <div className="media-uploader">
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        disabled={uploading}
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
      
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
```

### Image Gallery with CDN Integration
```typescript
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export function ImageGallery({ folder }: { folder: string }) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const { data: files } = trpc.media.listFiles.useQuery({
    folder,
    type: 'image',
    sortBy: 'date',
    order: 'desc'
  });

  const getResponsiveUrl = trpc.media.getCDNUrl;

  return (
    <div className="image-gallery">
      <div className="image-grid">
        {files?.files.map((file: any) => (
          <div 
            key={file.id} 
            className="image-item"
            onClick={() => setSelectedImage(file)}
          >
            <img
              src={getResponsiveUrl.query({
                fileId: file.id,
                transforms: {
                  width: 300,
                  height: 200,
                  quality: 75,
                  fit: 'cover'
                }
              }).url}
              alt={file.metadata?.alt || file.filename}
              loading="lazy"
            />
            <div className="image-overlay">
              <span>{file.filename}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img
              src={getResponsiveUrl.query({
                fileId: selectedImage.id,
                transforms: {
                  width: 1200,
                  height: 800,
                  quality: 90
                }
              }).url}
              alt={selectedImage.metadata?.alt}
            />
            <div className="image-info">
              <h3>{selectedImage.filename}</h3>
              <p>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              {selectedImage.metadata?.alt && (
                <p>Alt: {selectedImage.metadata.alt}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Video Processing Dashboard
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useEffect } from 'react';

export function VideoProcessingDashboard() {
  const [processingJobs, setProcessingJobs] = useState([]);
  
  const processVideo = trpc.media.processVideo.useMutation();
  const getProcessingStatus = trpc.media.getProcessingStatus.useQuery();

  const handleVideoProcess = async (fileId: string, options: any) => {
    const job = await processVideo.mutateAsync({
      fileId,
      operations: options
    });
    
    setProcessingJobs(prev => [...prev, {
      id: job.jobId,
      fileId,
      status: 'processing',
      progress: 0
    }]);
  };

  // Poll for job status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedJobs = await Promise.all(
        processingJobs.map(async (job) => {
          if (job.status === 'completed') return job;
          
          const status = await getProcessingStatus.query({ jobId: job.id });
          return {
            ...job,
            status: status.status,
            progress: status.progress,
            result: status.result
          };
        })
      );
      
      setProcessingJobs(updatedJobs);
    }, 2000);

    return () => clearInterval(interval);
  }, [processingJobs, getProcessingStatus]);

  return (
    <div className="video-dashboard">
      <div className="processing-jobs">
        <h3>Processing Jobs</h3>
        {processingJobs.map((job) => (
          <div key={job.id} className="job-item">
            <div className="job-info">
              <span>File ID: {job.fileId}</span>
              <span>Status: {job.status}</span>
            </div>
            {job.status === 'processing' && (
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${job.progress}%` }}
                />
                <span>{job.progress}%</span>
              </div>
            )}
            {job.status === 'completed' && (
              <a href={job.result?.url} target="_blank" rel="noopener noreferrer">
                View Processed Video
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

### File Upload
- Use presigned URLs for secure uploads
- Implement client-side file validation before upload
- Show upload progress to users
- Handle upload failures gracefully
- Use multipart uploads for large files (>10MB)

### Image Optimization
- Always optimize images before serving
- Use modern formats like WebP and AVIF
- Implement responsive images with CDN transforms
- Generate appropriate thumbnail sizes
- Consider progressive loading for large images

### Video Processing
- Use asynchronous processing for large videos
- Generate thumbnails for video previews
- Support multiple formats and qualities
- Implement proper error handling for failed jobs
- Monitor processing queue and performance

### Storage Management
- Monitor storage usage regularly
- Implement cleanup policies for old files
- Use folder structures for organization
- Tag files for better searchability
- Set appropriate expiration times for temporary files

### Security
- Validate file types and sizes
- Implement virus scanning for uploads
- Use secure share links with expiration
- Control access to sensitive files
- Monitor for abuse and unusual activity

## Error Handling

```typescript
try {
  const uploadRequest = await trpc.media.requestUpload.mutate({
    filename: 'image.jpg',
    mimeType: 'image/jpeg',
    size: 2048000
  });
} catch (error) {
  if (error.data?.code === 'BAD_REQUEST') {
    // Handle validation error
    console.error('Invalid file data:', error.data.message);
  } else if (error.data?.code === 'PAYLOAD_TOO_LARGE') {
    // Handle file size error
    console.error('File too large');
  } else if (error.data?.code === 'STORAGE_EXCEEDED') {
    // Handle storage limit error
    console.error('Storage quota exceeded');
  } else {
    // Handle other errors
    console.error('Upload failed:', error.message);
  }
}
```

## Integration with tRPC

The media router integrates seamlessly with the tRPC system:

```typescript
// In your main tRPC router
export const appRouter = router({
  media: mediaRouter,
  forms: formsRouter,
  builder: builderRouter,
  // ... other routers
});

export type AppRouter = typeof appRouter;
```

This provides type-safe access to all media procedures throughout your application, enabling seamless integration with comprehensive media management functionality.
