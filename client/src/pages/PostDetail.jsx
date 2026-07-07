import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, likePost, addComment, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await getPost(id);
      setPost(data.post);
    } catch (err) {
      setError('Post not found');
    }
    setLoading(false);
  };

  const handleLike = async () => {
    try {
      await likePost(id);
      fetchPost();
    } catch (err) {
      setError('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment(id, { text: commentText });
      setCommentText('');
      fetchPost();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        await deletePost(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-indigo-600 text-xl">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-600 text-xl">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">📝 FullStack Blog</Link>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-indigo-600 px-4 py-1 rounded hover:bg-indigo-100"
          >
            Back to Blog
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
              {user?.id === post.author?._id && (
                <div className="flex gap-2">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
              <span>✍️ {post.author?.name}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Like Button */}
            <div className="border-t pt-4 mb-6">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                  post.likes?.includes(user?.id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                ❤️ {post.likes?.length} {post.likes?.length === 1 ? 'Like' : 'Likes'}
              </button>
            </div>

            {/* Comments */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💬 Comments ({post.comments?.length})
              </h3>

              {/* Comment List */}
              <div className="space-y-4 mb-6">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {comment.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{comment.user?.name}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              {user ? (
                <form onSubmit={handleComment}>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                    placeholder="Write a comment..."
                    rows="3"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                  >
                    Post Comment
                  </button>
                </form>
              ) : (
                <p className="text-gray-500">
                  <Link to="/login" className="text-indigo-600 hover:underline">Login</Link> to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;