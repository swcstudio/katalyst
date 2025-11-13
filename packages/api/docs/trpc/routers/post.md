# Post Router

The Post Router provides comprehensive blog post and content management capabilities including creating, updating, deleting, and retrieving posts with advanced filtering, pagination, and access control features.

## Overview

This router enables the management of blog posts and general content with features like rich text content, tagging, publication status control, author management, and advanced querying capabilities with cursor-based pagination and filtering.

## Features

### Post Management
- Create, read, update, delete (CRUD) operations for posts
- Rich content support with markdown and HTML
- Publication status control (draft/published)
- Author attribution and ownership verification
- Timestamp tracking for created and updated dates

### Content Organization
- Tag-based categorization system
- Search and filtering capabilities
- Multi-author support
- Content versioning history

### Querying & Pagination
- Cursor-based pagination for efficient data loading
- Advanced filtering by publication status, author, and tags
- Optimized database queries for performance
- Support for infinite scroll implementations

### Access Control
- Public read access for published content
- Protected write operations requiring authentication
- Author-level edit permissions
- Draft content access restrictions

## API Procedures

### `create`
**Type**: Protected Mutation  
**Description**: Create a new blog post with content and metadata.

**Input Schema**:
```typescript
{
  title: string, // 1-200 characters
  content: string, // Post content (markdown, HTML, or plain text)
  published?: boolean, // Default: false
  tags?: Array<string> // Optional tags for categorization
}
```

**Response**:
```typescript
{
  id: string,
  title: string,
  content: string,
  published: boolean,
  tags?: Array<string>,
  authorId: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Usage Example**:
```typescript
// Create a draft post
const draftPost = await trpc.post.create.mutate({
  title: 'Getting Started with Katalyst',
  content: `
# Getting Started with Katalyst

Katalyst is a powerful framework for building modern web applications. In this guide, we'll walk you through the basics.

## Installation

First, install the Katalyst CLI:

\`\`\`bash
npm install -g @katalyst/cli
\`\`\`

## Creating Your First Project

\`\`\`bash
katalyst create my-app
cd my-app
npm run dev
\`\`\`

That's it! You now have a running Katalyst application.
  `,
  published: false,
  tags: ['tutorial', 'getting-started', 'beginner']
});

console.log(`Draft post created: ${draftPost.id}`);

// Create and publish a post immediately
const publishedPost = await trpc.post.create.mutate({
  title: 'Advanced Katalyst Techniques',
  content: 'Full content here...',
  published: true,
  tags: ['advanced', 'techniques', 'tips']
});

console.log(`Published post: ${publishedPost.id}`);
```

### `update`
**Type**: Protected Mutation  
**Description**: Update an existing post's content and metadata.

**Input Schema**:
```typescript
{
  id: string,
  title?: string,
  content?: string,
  published?: boolean,
  tags?: Array<string>
}
```

**Response**:
```typescript
{
  id: string,
  title?: string,
  content?: string,
  published?: boolean,
  tags?: Array<string>,
  updatedAt: Date
}
```

**Usage Example**:
```typescript
// Update post title and content
const updatedPost = await trpc.post.update.mutate({
  id: 'post-123',
  title: 'Updated: Getting Started with Katalyst',
  content: 'Updated content with new sections...',
  tags: ['tutorial', 'getting-started', 'beginner', 'updated']
});

console.log(`Post updated: ${updatedPost.updatedAt}`);

// Publish a draft post
const publishedPost = await trpc.post.update.mutate({
  id: 'post-456',
  published: true
});

console.log(`Post published: ${publishedPost.published}`);

// Add new tags to a post
const taggedPost = await trpc.post.update.mutate({
  id: 'post-789',
  tags: ['tutorial', 'javascript', 'react', 'new-tag']
});
```

### `delete`
**Type**: Protected Mutation  
**Description**: Delete a post permanently.

**Input Schema**:
```typescript
{
  id: string
}
```

**Response**:
```typescript
{
  success: boolean
}
```

**Usage Example**:
```typescript
const result = await trpc.post.delete.mutate({
  id: 'post-to-delete'
});

if (result.success) {
  console.log('Post deleted successfully');
}
```

### `getById`
**Type**: Public Query  
**Description**: Retrieve a single post by its ID.

**Input Schema**:
```typescript
{
  id: string
}
```

**Response**:
```typescript
{
  id: string,
  title: string,
  content: string,
  published: boolean,
  tags?: Array<string>,
  authorId: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Usage Example**:
```typescript
const post = await trpc.post.getById.query({
  id: 'post-123'
});

console.log(`Title: ${post.title}`);
console.log(`Author: ${post.authorId}`);
console.log(`Published: ${post.published}`);
console.log(`Created: ${post.createdAt.toLocaleDateString()}`);

if (post.tags && post.tags.length > 0) {
  console.log(`Tags: ${post.tags.join(', ')}`);
}

// Render content (assuming markdown)
const renderedContent = renderMarkdown(post.content);
```

### `list`
**Type**: Public Query  
**Description**: List posts with filtering and cursor-based pagination.

**Input Schema**:
```typescript
{
  limit?: number, // 1-100, default: 10
  cursor?: string, // Pagination cursor
  filter?: {
    published?: boolean,
    authorId?: string,
    tags?: Array<string>
  }
}
```

**Response**:
```typescript
{
  posts: Array<{
    id: string,
    title: string,
    content: string,
    published: boolean,
    tags?: Array<string>,
    authorId: string,
    createdAt: Date,
    updatedAt: Date
  }>,
  nextCursor?: string // For pagination
}
```

**Usage Example**:
```typescript
// Get first 10 published posts
const firstPage = await trpc.post.list.query({
  limit: 10,
  filter: {
    published: true
  }
});

console.log(`Found ${firstPage.posts.length} posts`);

// Get next page
if (firstPage.nextCursor) {
  const secondPage = await trpc.post.list.query({
    limit: 10,
    cursor: firstPage.nextCursor,
    filter: {
      published: true
    }
  });
  
  console.log(`Next page: ${secondPage.posts.length} posts`);
}

// Get posts by specific author
const authorPosts = await trpc.post.list.query({
  limit: 20,
  filter: {
    authorId: 'user-123',
    published: true
  }
});

// Get posts with specific tags
const tutorialPosts = await trpc.post.list.query({
  limit: 15,
  filter: {
    tags: ['tutorial', 'javascript'],
    published: true
  }
});

// Get all posts (including drafts) - for admin use
const allPosts = await trpc.post.list.query({
  limit: 50
  // No published filter - includes both published and draft posts
});
```

### `myPosts`
**Type**: Protected Query  
**Description**: Get posts created by the current authenticated user.

**Input Schema**:
```typescript
{
  limit?: number, // 1-100, default: 10
  cursor?: string // Pagination cursor
}
```

**Response**:
```typescript
{
  posts: Array<{
    id: string,
    title: string,
    content: string,
    published: boolean,
    tags?: Array<string>,
    authorId: string,
    createdAt: Date,
    updatedAt: Date
  }>,
  nextCursor?: string
}
```

**Usage Example**:
```typescript
// Get current user's posts
const myPosts = await trpc.post.myPosts.query({
  limit: 10
});

console.log(`You have ${myPosts.posts.length} posts`);

// Separate drafts and published posts
const drafts = myPosts.posts.filter(post => !post.published);
const published = myPosts.posts.filter(post => post.published);

console.log(`Drafts: ${drafts.length}`);
console.log(`Published: ${published.length}`);

// Display posts with status
myPosts.posts.forEach(post => {
  const status = post.published ? '✅ Published' : '📝 Draft';
  console.log(`${status} ${post.title}`);
});
```

## Integration Examples

### Blog Post Editor Component
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useCallback } from 'react';

export function PostEditor({ postId, onSave }: {
  postId?: string,
  onSave?: (post: any) => void
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const createPost = trpc.post.create.useMutation();
  const updatePost = trpc.post.update.useMutation();

  const handleSave = useCallback(async (publish: boolean = false) => {
    setIsSaving(true);
    
    try {
      const postData = {
        title,
        content,
        published: publish,
        tags: tags.length > 0 ? tags : undefined
      };

      let result;
      if (postId) {
        result = await updatePost.mutateAsync({
          id: postId,
          ...postData
        });
      } else {
        result = await createPost.mutateAsync(postData);
      }

      onSave?.(result);
      if (publish) {
        setPublished(true);
      }
      
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSaving(false);
    }
  }, [title, content, tags, postId, createPost, updatePost, onSave]);

  const addTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  return (
    <div className="post-editor">
      <div className="editor-header">
        <input
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        
        <div className="editor-actions">
          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="save-draft"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="publish"
          >
            {published ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="tags-section">
        <div className="tag-input">
          <input
            type="text"
            placeholder="Add tags..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <button onClick={addTag}>Add</button>
        </div>
        
        <div className="tags-list">
          {tags.map(tag => (
            <span key={tag} className="tag">
              {tag}
              <button onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Write your post content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="content-editor"
        rows={20}
      />

      <div className="editor-footer">
        <span className="status">
          {published ? '✅ Published' : '📝 Draft'}
        </span>
        <span className="word-count">
          {content.split(/\s+/).filter(word => word.length > 0).length} words
        </span>
      </div>
    </div>
  );
}
```

### Post List Component with Infinite Scroll
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';

export function PostList({ filter }: {
  filter?: {
    published?: boolean,
    authorId?: string,
    tags?: string[]
  }
}) {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);

  const listPosts = trpc.post.list.useQuery({
    limit: 10,
    cursor: cursor || undefined,
    filter
  }, {
    enabled: true,
    keepPreviousData: true
  });

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore || !listPosts.data?.nextCursor) return;
    
    setIsLoading(true);
    setCursor(listPosts.data.nextCursor);
  }, [isLoading, hasMore, listPosts.data?.nextCursor]);

  // Reset when filter changes
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
  }, [filter]);

  // Update posts when new data arrives
  useEffect(() => {
    if (listPosts.data) {
      setPosts(prev => [...prev, ...listPosts.data.posts]);
      setHasMore(!!listPosts.data.nextCursor);
      setIsLoading(false);
    }
  }, [listPosts.data]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <div className="post-list">
      <div className="posts-grid">
        {posts.map((post: any) => (
          <article key={post.id} className="post-card">
            <header className="post-header">
              <h2 className="post-title">
                <a href={`/posts/${post.id}`}>{post.title}</a>
              </h2>
              <div className="post-meta">
                <span>By {post.authorId}</span>
                <span>{post.createdAt.toLocaleDateString()}</span>
                {!post.published && (
                  <span className="draft-badge">Draft</span>
                )}
              </div>
            </header>
            
            <div className="post-excerpt">
              {post.content.substring(0, 200)}...
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <footer className="post-footer">
              <a href={`/posts/${post.id}`} className="read-more">
                Read More →
              </a>
            </footer>
          </article>
        ))}
      </div>

      {isLoading && (
        <div className="loading">Loading more posts...</div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="end">No more posts to load</div>
      )}
      
      {posts.length === 0 && !listPosts.isLoading && (
        <div className="empty">No posts found</div>
      )}
    </div>
  );
}
```

### My Posts Dashboard
```typescript
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export function MyPostsDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts'>('all');
  
  const { data: myPosts, refetch } = trpc.post.myPosts.useQuery({
    limit: 20
  });

  const deletePost = trpc.post.delete.useMutation();
  const updatePost = trpc.post.update.useMutation();

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost.mutateAsync({ id: postId });
      refetch();
    }
  };

  const handleTogglePublish = async (post: any) => {
    await updatePost.mutateAsync({
      id: post.id,
      published: !post.published
    });
    refetch();
  };

  const filteredPosts = myPosts?.posts.filter(post => {
    switch (activeTab) {
      case 'published':
        return post.published;
      case 'drafts':
        return !post.published;
      default:
        return true;
    }
  }) || [];

  return (
    <div className="my-posts-dashboard">
      <div className="dashboard-header">
        <h1>My Posts</h1>
        <a href="/posts/new" className="create-button">
          Create New Post
        </a>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All ({myPosts?.posts.length || 0})
        </button>
        <button
          className={activeTab === 'published' ? 'active' : ''}
          onClick={() => setActiveTab('published')}
        >
          Published ({myPosts?.posts.filter(p => p.published).length || 0})
        </button>
        <button
          className={activeTab === 'drafts' ? 'active' : ''}
          onClick={() => setActiveTab('drafts')}
        >
          Drafts ({myPosts?.posts.filter(p => !p.published).length || 0})
        </button>
      </div>

      <div className="posts-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post: any) => (
              <tr key={post.id}>
                <td>
                  <a href={`/posts/${post.id}/edit`}>
                    {post.title}
                  </a>
                </td>
                <td>
                  <span className={`status ${post.published ? 'published' : 'draft'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{post.createdAt.toLocaleDateString()}</td>
                <td>{post.updatedAt.toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <a href={`/posts/${post.id}/edit`} className="edit">
                      Edit
                    </a>
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className="toggle-publish"
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPosts.length === 0 && (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p>
            {activeTab === 'drafts' 
              ? 'You don\'t have any draft posts.'
              : activeTab === 'published'
              ? 'You haven\'t published any posts yet.'
              : 'You haven\'t created any posts yet.'
            }
          </p>
          <a href="/posts/new" className="create-button">
            Create Your First Post
          </a>
        </div>
      )}
    </div>
  );
}
```

### Post Search and Filter Component
```typescript
import { trpc } from '@/utils/trpc';
import { useState, useEffect } from 'react';

export function PostSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOnlyPublished, setShowOnlyPublished] = useState(true);
  
  const { data: posts, refetch } = trpc.post.list.useQuery({
    limit: 20,
    filter: {
      published: showOnlyPublished,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    }
  });

  // Available tags from posts
  const availableTags = posts?.posts
    .flatMap(post => post.tags || [])
    .filter((tag, index, arr) => arr.indexOf(tag) === index) || [];

  const filteredPosts = posts?.posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [showOnlyPublished, selectedTags, refetch]);

  return (
    <div className="post-search">
      <div className="search-filters">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={showOnlyPublished}
              onChange={(e) => setShowOnlyPublished(e.target.checked)}
            />
            Only published posts
          </label>
        </div>

        {availableTags.length > 0 && (
          <div className="tag-filter">
            <h4>Filter by tags:</h4>
            <div className="available-tags">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTags.length > 0 && (
          <div className="selected-tags">
            <h4>Selected tags:</h4>
            <div className="tags">
              {selectedTags.map(tag => (
                <span key={tag} className="tag selected">
                  {tag}
                  <button onClick={() => toggleTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="search-results">
        <h3>
          Found {filteredPosts.length} posts
          {searchTerm && ` for "${searchTerm}"`}
          {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
        </h3>

        <div className="posts-grid">
          {filteredPosts.map((post: any) => (
            <article key={post.id} className="post-card">
              <h3>
                <a href={`/posts/${post.id}`}>{post.title}</a>
              </h3>
              <p>{post.content.substring(0, 150)}...</p>
              <div className="post-meta">
                <span>{post.createdAt.toLocaleDateString()}</span>
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="no-results">
            <p>No posts found matching your criteria.</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedTags([]);
              setShowOnlyPublished(true);
            }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Best Practices

### Content Structure
- Use semantic HTML for post content
- Implement proper heading hierarchy (h1, h2, h3)
- Include meta descriptions for SEO
- Use appropriate image alt tags
- Structure content for readability

### Performance
- Implement cursor-based pagination for large datasets
- Cache frequently accessed posts
- Use content delivery networks for media
- Optimize images and assets
- Implement lazy loading for post lists

### SEO Optimization
- Use descriptive titles and URLs
- Include proper meta tags
- Implement structured data (JSON-LD)
- Create XML sitemaps
- Use clean URL structures

### Security
- Sanitize user input to prevent XSS
- Implement content validation
- Use CSRF protection for forms
- Rate limit post creation and updates
- Validate file uploads for media content

### User Experience
- Provide auto-save functionality for drafts
- Implement preview mode for posts
- Show word count and reading time
- Provide keyboard shortcuts
- Offer content templates

## Error Handling

```typescript
try {
  const post = await trpc.post.create.mutate({
    title: 'My New Post',
    content: 'Post content here...',
    published: true
  });
} catch (error) {
  if (error.data?.code === 'UNAUTHORIZED') {
    // Handle authentication error
    alert('Please log in to create posts.');
  } else if (error.data?.code === 'BAD_REQUEST') {
    // Handle validation error
    const validationErrors = error.data?.validationErrors;
    if (validationErrors?.title) {
      alert('Title is required and must be 1-200 characters.');
    }
    if (validationErrors?.content) {
      alert('Content is required.');
    }
  } else {
    // Handle other errors
    alert('Failed to create post. Please try again.');
  }
}
```

## Integration with tRPC

The post router integrates seamlessly with the tRPC system:

```typescript
// In your main tRPC router
export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  // ... other routers
});

export type AppRouter = typeof appRouter;
```

This provides type-safe access to all post procedures throughout your application, enabling seamless integration with comprehensive blog post and content management functionality.
