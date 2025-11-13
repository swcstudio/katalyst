import BlogLayout from '@/components/BlogLayout';
import config from '@payload-config';
import { getPayload } from 'payload';
import type React from 'react';

interface BlogLayoutWrapperProps {
  children: React.ReactNode;
}

export default async function BlogLayoutWrapper({ children }: BlogLayoutWrapperProps) {
  // Fetch blog settings from Payload CMS
  let blogSettings = null;

  try {
    const payload = await getPayload({ config });
    blogSettings = await payload.findGlobal({
      slug: 'blog-settings',
    });
  } catch (error) {
    console.error('Failed to fetch blog settings:', error);
    // Fallback settings
    blogSettings = {
      title: 'Blog',
      description: 'Latest insights and updates',
    };
  }

  return (
    <BlogLayout
      title={blogSettings?.title || 'Blog'}
      description={blogSettings?.description || 'Latest insights and updates'}
      showBackButton={false}
    >
      {children}
    </BlogLayout>
  );
}
