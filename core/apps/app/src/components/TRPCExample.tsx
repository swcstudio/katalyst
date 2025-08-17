import React from 'react';
import { trpc, useUser, usePosts, useCreatePost, useAIChat } from '../../../shared/src/index';

export function TRPCExample() {
  const { user, isLoading: userLoading, updateProfile } = useUser();
  const { posts, isLoading: postsLoading, fetchNextPage, hasNextPage } = usePosts({ limit: 5 });
  const createPost = useCreatePost();
  const { sendMessage, isLoading: aiLoading, response: aiResponse } = useAIChat();

  // Example: Using direct tRPC hooks
  const { data: activeUsers } = trpc.analytics.activeUsers.useQuery();

  const handleCreatePost = () => {
    createPost.mutate({
      title: 'New Post from tRPC',
      content: 'This post was created using tRPC!',
      published: true,
      tags: ['trpc', 'example'],
    });
  };

  const handleUpdateProfile = () => {
    updateProfile({
      name: 'Updated Name',
      bio: 'Updated bio from tRPC',
    });
  };

  const handleAIChat = () => {
    sendMessage({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, how does tRPC work?' }
      ],
      model: 'gpt-4-turbo-preview',
    });
  };

  return (
    <div className="space-y-6 p-6">
      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        {userLoading ? (
          <p>Loading user...</p>
        ) : user ? (
          <div>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.name}</p>
            <button
              onClick={handleUpdateProfile}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        <button
          onClick={handleCreatePost}
          disabled={createPost.isLoading}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {createPost.isLoading ? 'Creating...' : 'Create New Post'}
        </button>
        
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.id} className="border p-2 rounded">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.content}</p>
              </div>
            ))}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">AI Chat</h2>
        <button
          onClick={handleAIChat}
          disabled={aiLoading}
          className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {aiLoading ? 'Thinking...' : 'Ask AI'}
        </button>
        
        {aiResponse && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>{aiResponse.choices[0].message.content}</p>
          </div>
        )}
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Active Users</h2>
        {activeUsers && (
          <div>
            <p>Current: {activeUsers.current}</p>
            <p>Last Hour: {activeUsers.lastHour}</p>
            <p>Last 24 Hours: {activeUsers.last24Hours}</p>
          </div>
        )}
      </section>
    </div>
  );
}