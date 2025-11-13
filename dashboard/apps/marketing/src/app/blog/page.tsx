import config from '@payload-config';
import Image from 'next/image';
import Link from 'next/link';
import { getPayload } from 'payload';

export default async function BlogPage() {
  const payload = await getPayload({ config });

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 12,
  });

  const blogSettings = await payload.findGlobal({
    slug: 'blog-settings',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.docs.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {post.featuredImage &&
              typeof post.featuredImage === 'object' &&
              post.featuredImage.url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {post.categories?.map((category: { id: string; name: string } | string) => (
                  <span
                    key={typeof category === 'string' ? category : category.id}
                    className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                  >
                    {typeof category === 'string' ? category : category.name}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {typeof post.author === 'object' && post.author.name}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'No date'}
                  </time>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium text-sm transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.docs.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            No posts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Check back soon for the latest updates from the Katalyst-React team.
          </p>
        </div>
      )}
    </div>
  );
}
