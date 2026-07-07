import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminStats, getAdminUsers, deleteAdminUser, makeAdminUser, getAdminPosts, deleteAdminPost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    fetchStats();
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getAdminStats();
      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data } = await getAdminUsers();
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await getAdminPosts();
      setPosts(data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await deleteAdminUser(id);
        setMessage('User deleted!');
        fetchUsers();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await makeAdminUser(id);
      setMessage('User is now admin!');
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Delete this post?')) {
      try {
        await deleteAdminPost(id);
        setMessage('Post deleted!');
        fetchPosts();
      } catch (error) {
        console.log(error);
      }
    }
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
      <nav className="bg-indigo-800 text-white px-6 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">👑 Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Hi, {user?.name}!</span>
            <Link to="/" className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700">
              View Blog
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-800 px-4 py-1 rounded hover:bg-indigo-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{message}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {['stats', 'users', 'posts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {tab === 'stats' ? '📊 Stats' : tab === 'users' ? '👥 Users' : '📝 Posts'}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: stats.totalUsers, color: 'indigo' },
              { label: 'Total Posts', value: stats.totalPosts, color: 'green' },
              { label: 'Published Posts', value: stats.publishedPosts, color: 'blue' },
              { label: 'Total Comments', value: stats.totalComments, color: 'purple' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 mb-2">{stat.label}</p>
                <p className={`text-4xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(u._id)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                        >
                          Make Admin
                        </button>
                      )}
                      {u._id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Author</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 max-w-xs truncate">{p.title}</td>
                    <td className="p-4">{p.author?.name}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeletePost(p._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;