'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

interface RichTextNode {
  type: string;
  version?: number;
  [key: string]: any;
}

interface RichTextContent {
  root: {
    children: RichTextNode[];
    direction: string | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

interface RichTextRendererProps {
  content: RichTextContent | string;
  className?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  // Handle legacy HTML content
  if (typeof content === 'string') {
    return (
      <div
        className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (!content?.root?.children) {
    return null;
  }

  const renderNode = (node: RichTextNode, index: number): React.ReactNode => {
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {node.children?.map((child: RichTextNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${node.tag}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          h1: 'text-4xl font-bold mb-6 mt-8',
          h2: 'text-3xl font-bold mb-4 mt-6',
          h3: 'text-2xl font-semibold mb-3 mt-5',
          h4: 'text-xl font-semibold mb-2 mt-4',
          h5: 'text-lg font-semibold mb-2 mt-3',
          h6: 'text-base font-semibold mb-2 mt-2',
        };

        return (
          <HeadingTag
            key={index}
            className={`${headingClasses[`h${node.tag}` as keyof typeof headingClasses]} text-gray-900 dark:text-white`}
          >
            {node.children?.map((child: RichTextNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </HeadingTag>
        );

      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul';
        const listClasses =
          node.listType === 'number'
            ? 'list-decimal list-inside mb-4 space-y-2'
            : 'list-disc list-inside mb-4 space-y-2';

        return (
          <ListTag key={index} className={listClasses}>
            {node.children?.map((child: RichTextNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </ListTag>
        );

      case 'listitem':
        return (
          <li key={index} className="leading-relaxed">
            {node.children?.map((child: RichTextNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </li>
        );

      case 'quote':
        return (
          <blockquote
            key={index}
            className="border-l-4 border-blue-500 pl-6 my-6 italic text-gray-700 dark:text-gray-300"
          >
            {node.children?.map((child: RichTextNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </blockquote>
        );

      case 'link':
        const isExternal = node.url?.startsWith('http');
        const linkClasses =
          'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline transition-colors';

        if (isExternal) {
          return (
            <a
              key={index}
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              {node.children?.map((child: RichTextNode, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </a>
          );
        }

        return (
          <Link key={index} href={node.url} className={linkClasses}>
            {node.children?.map((child: RichTextNode, childIndex: number) =>
              renderNode(child, childIndex)
            )}
          </Link>
        );

      case 'upload':
        if (node.value && typeof node.value === 'object' && node.value.url) {
          return (
            <figure key={index} className="my-8">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={node.value.url}
                  alt={node.value.alt || 'Blog image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
              {(node.value.caption || node.value.alt) && (
                <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                  {node.value.caption || node.value.alt}
                </figcaption>
              )}
            </figure>
          );
        }
        return null;

      case 'code':
        return (
          <pre
            key={index}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"
          >
            <code className="text-sm font-mono">
              {node.children?.map((child: RichTextNode, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </code>
          </pre>
        );

      case 'horizontalrule':
        return <hr key={index} className="my-8 border-gray-300 dark:border-gray-600" />;

      case 'text':
        const textContent = node.text || '';
        let element: React.ReactNode = textContent;

        // Apply text formatting
        if (node.format) {
          if (node.format & 1) {
            // Bold
            element = <strong className="font-semibold">{element}</strong>;
          }
          if (node.format & 2) {
            // Italic
            element = <em className="italic">{element}</em>;
          }
          if (node.format & 8) {
            // Strikethrough
            element = <s className="line-through">{element}</s>;
          }
          if (node.format & 16) {
            // Underline
            element = <u className="underline">{element}</u>;
          }
          if (node.format & 32) {
            // Code
            element = (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                {element}
              </code>
            );
          }
        }

        return <span key={index}>{element}</span>;

      case 'linebreak':
        return <br key={index} />;

      case 'tab':
        return <span key={index} className="inline-block w-8"></span>;

      default:
        // Fallback for unknown node types
        if (node.children) {
          return (
            <div key={index}>
              {node.children.map((child: RichTextNode, childIndex: number) =>
                renderNode(child, childIndex)
              )}
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      {content.root.children.map((node: RichTextNode, index: number) => renderNode(node, index))}
    </div>
  );
};

export default RichTextRenderer;
