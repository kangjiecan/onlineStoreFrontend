import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { retrieve_userID } = useParams(); // Get userId from URL parameter
  
  // Get authentication info
  const currentUserId = location.state?.userId || localStorage.getItem('userId');
  const viewUserId = retrieve_userID || currentUserId; // Use URL parameter first, then auth userId
  const accessToken = localStorage.getItem('accessToken');
  const isAuthenticated = !!accessToken && currentUserId === viewUserId;

  useEffect(() => {
    const fetchPosts = async () => {
      if (!viewUserId) {
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const apiUrl = `https://sf0far1zjh.execute-api.ca-central-1.amazonaws.com/Stage/get?type=post&userId=${viewUserId}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [viewUserId]);

  const handleDelete = async (postId) => {
    if (!isAuthenticated) return;
    // Add your delete logic here
    console.log('Deleting post:', postId);
  };

  const handleEdit = async (postId) => {
    if (!isAuthenticated) return;
    // Add your edit logic here
    console.log('Editing post:', postId);
  };

  // Function to generate shareable link
  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/posts/${currentUserId}`;
  };

  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">Error loading posts: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Posts</h1>
      
      {/* Controls for authenticated user */}
      {isAuthenticated && (
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <button className="btn btn-primary">Create New Post</button>
          <div className="input-group w-50">
            <input 
              type="text" 
              className="form-control" 
              value={getShareableLink()} 
              readOnly
            />
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigator.clipboard.writeText(getShareableLink())}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      <div className="row">
        {posts.map((post) => (
          <div className="col-12 mb-4" key={post.post_id || post.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {new Date(post.timestamp || post.created_at).toLocaleString()}
                </h6>
                <p className="card-text">{post.content}</p>
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    className="img-fluid mb-3" 
                    alt="Post attachment"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-primary me-2">
                      {post.category || 'Uncategorized'}
                    </span>
                    {post.tags && post.tags.map((tag, index) => (
                      <span key={index} className="badge bg-secondary me-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Only show edit/delete buttons if authenticated */}
                  {isAuthenticated && (
                    <div className="btn-group">
                      <button 
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleEdit(post.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="col-12 text-center">
            <p className="text-muted">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;