import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    try {
      const { data } = await getPosts({ category, search });
      setPosts(data.posts);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-indigo-600 text-xl">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">📝 FullStack Blog</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/create-post" className="hover:text-indigo-200">Write Post</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="bg-yellow-400 text-indigo-800 px-3 py-1 rounded hover:bg-yellow-500">
                    👑 Admin
                  </Link>
                )}
                <span className="text-indigo-200">Hi, {user.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-4 py-1 rounded hover:bg-indigo-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">Login</Link>
                <Link to="/register" className="bg-white text-indigo-600 px-4 py-1 rounded hover:bg-indigo-100">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              placeholder="Search posts..."
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {['', 'technology', 'lifestyle', 'travel', 'food', 'health', 'education', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-indigo-100'
                }`}
              >
                {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No posts found!</p>
            {user && (
              <Link to="/create-post" className="text-indigo-600 hover:underline mt-4 block">
                Write the first post!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="p-6">
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-2 text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt || post.content.substring(0, 100) + '...'}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>✍️ {post.author?.name}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>❤️ {post.likes.length} Likes</span>
                    <span>💬 {post.comments.length} Comments</span>
                  </div>
                  <Link
                    to={`/post/${post._id}`}
                    className="mt-4 block text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;