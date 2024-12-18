import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { retrieve_userID } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!retrieve_userID) {
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const apiUrl = `https://sf0far1zjh.execute-api.ca-central-1.amazonaws.com/Stage/get?type=post&userId=${retrieve_userID}`;
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
  }, [retrieve_userID]);

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

export default Posts;