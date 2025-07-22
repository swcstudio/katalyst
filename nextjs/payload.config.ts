import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'

export default buildConfig({
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
    ],
  }),
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
        defaultColumns: ['name', 'email', 'roles'],
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'roles',
          type: 'select',
          hasMany: true,
          defaultValue: ['user'],
          options: [
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Editor',
              value: 'editor',
            },
            {
              label: 'User',
              value: 'user',
            },
          ],
          required: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'bio',
          type: 'textarea',
          admin: {
            position: 'sidebar',
          },
        },
      ],
      access: {
        create: ({ req: { user } }) => {
          return Boolean(user && user.roles?.includes('admin'))
        },
        read: () => true,
        update: ({ req: { user }, id }) => {
          return Boolean(user && (user.roles?.includes('admin') || user.id === id))
        },
        delete: ({ req: { user } }) => {
          return Boolean(user && user.roles?.includes('admin'))
        },
      },
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'publishedAt', 'status'],
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'excerpt',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Brief description of the post for previews and SEO',
          },
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            position: 'sidebar',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'status',
          type: 'select',
          options: [
            {
              label: 'Draft',
              value: 'draft',
            },
            {
              label: 'Published',
              value: 'published',
            },
            {
              label: 'Archived',
              value: 'archived',
            },
          ],
          defaultValue: 'draft',
          required: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'seo',
          type: 'group',
          label: 'SEO',
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'SEO title (leave blank to use post title)',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'SEO meta description (leave blank to use excerpt)',
              },
            },
            {
              name: 'keywords',
              type: 'text',
              admin: {
                description: 'Comma-separated keywords for SEO',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Open Graph image (leave blank to use featured image)',
              },
            },
            {
              name: 'canonical',
              type: 'text',
              admin: {
                description: 'Canonical URL (optional)',
              },
            },
          ],
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'marketing',
          type: 'group',
          label: 'Marketing Tools',
          fields: [
            {
              name: 'enablePopup',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable popup for this post',
              },
            },
            {
              name: 'popupContent',
              type: 'richText',
              admin: {
                condition: (data) => data.enablePopup,
                description: 'Content for the popup',
              },
            },
            {
              name: 'enableAds',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable ads for this post',
              },
            },
            {
              name: 'adSlots',
              type: 'array',
              fields: [
                {
                  name: 'position',
                  type: 'select',
                  options: [
                    { label: 'Top of Content', value: 'top' },
                    { label: 'Middle of Content', value: 'middle' },
                    { label: 'Bottom of Content', value: 'bottom' },
                    { label: 'Sidebar', value: 'sidebar' },
                  ],
                  required: true,
                },
                {
                  name: 'adCode',
                  type: 'textarea',
                  required: true,
                },
              ],
              admin: {
                condition: (data) => data.enableAds,
              },
            },
            {
              name: 'redirects',
              type: 'array',
              fields: [
                {
                  name: 'from',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL to redirect from',
                  },
                },
                {
                  name: 'to',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL to redirect to',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  options: [
                    { label: '301 Permanent', value: '301' },
                    { label: '302 Temporary', value: '302' },
                  ],
                  defaultValue: '301',
                  required: true,
                },
              ],
            },
          ],
          admin: {
            position: 'sidebar',
          },
        },
      ],
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data.publishedAt && !data.slug) {
              data.slug = data.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return data
          },
        ],
      },
    },
    {
      slug: 'categories',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'color',
          type: 'text',
          admin: {
            description: 'Hex color code for category styling',
          },
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'media',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
          {
            name: 'tablet',
            width: 1024,
            height: undefined,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
  globals: [
    {
      slug: 'blog-settings',
      label: 'Blog Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Katalyst-React Blog',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue: 'Latest insights and updates from the Katalyst-React team',
        },
        {
          name: 'postsPerPage',
          type: 'number',
          defaultValue: 10,
          min: 1,
          max: 50,
        },
        {
          name: 'enableComments',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'socialLinks',
          type: 'group',
          fields: [
            {
              name: 'twitter',
              type: 'text',
            },
            {
              name: 'github',
              type: 'text',
            },
            {
              name: 'linkedin',
              type: 'text',
            },
          ],
        },
        {
          name: 'analytics',
          type: 'group',
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
            },
            {
              name: 'googleTagManagerId',
              type: 'text',
            },
            {
              name: 'facebookPixelId',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
  secret: globalThis.process?.env?.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: './payload-types.ts',
  },
  db: sqliteAdapter({
    client: {
      url: 'file:./payload.db',
    },
  }),
  sharp,
  plugins: [],
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Katalyst-React Blog',
    },
  },
  cors: [
    'http://localhost:3000',
    'https://katalyst-react.com',
  ],
  csrf: [
    'http://localhost:3000',
    'https://katalyst-react.com',
  ],
})
