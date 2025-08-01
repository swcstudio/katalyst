import RichTextRenderer from '@/components/RichTextRenderer';
import config from '@payload-config';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const payload = await getPayload({ config });

  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  });

  const post = posts.docs[0];

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const seoTitle = post.seo?.title || post.title;
  const seoDescription = post.seo?.description || post.excerpt;
  const ogImage = post.seo?.ogImage || post.featuredImage;

  return {
    title: seoTitle,
    description: seoDescription || undefined,
    keywords: post.seo?.keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription || undefined,
      images: ogImage && typeof ogImage === 'object' && ogImage.url ? [ogImage.url] : undefined,
    },
    alternates: {
      canonical: post.seo?.canonical,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const payload = await getPayload({ config });

  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: params.slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  });

  const post = posts.docs[0];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
            >
              ← Back to Blog
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {post.categories?.map((category: { id: string; name: string } | string) => (
              <span
                key={typeof category === 'string' ? category : category.id}
                className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
              >
                {typeof category === 'string' ? category : category.name}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {typeof post.author === 'object' && post.author.name}
              </p>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'No date'}
              </time>
            </div>
          </div>

          {post.featuredImage &&
            typeof post.featuredImage === 'object' &&
            post.featuredImage.url && (
              <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
        </header>

        <RichTextRenderer content={post.content} className="max-w-none" />

        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                Tags:
              </span>
              {post.tags.map((tagObj: { tag: string }, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                >
                  #{tagObj.tag}
                </span>
              ))}
            </div>
          </footer>
        )}

        {/* Marketing Tools Integration */}
        {post.marketing?.enablePopup && post.marketing.popupContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-md mx-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: post.marketing.popupContent,
                }}
              />
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => {}}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Ad Slots */}
        {post.marketing?.enableAds &&
          post.marketing.adSlots?.map(
            (adSlot: { position: string; adCode: string }, index: number) => (
              <div
                key={index}
                className={`my-8 ${
                  adSlot.position === 'sidebar' ? 'float-right ml-4 w-64' : 'w-full'
                }`}
                dangerouslySetInnerHTML={{ __html: adSlot.adCode }}
              />
            )
          )}
      </article>
    </div>
  );
}
