import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userString = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      console.error('OAuth error:', error);
      navigate('/login?error=' + error);
      return;
    }

    if (token && userString) {
      try {
        // Parse user data
        const user = JSON.parse(decodeURIComponent(userString));

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to events page
        navigate('/events');
      } catch (err) {
        console.error('Error processing OAuth callback:', err);
        navigate('/login?error=callback_processing_failed');
      }
    } else {
      // Missing required data
      navigate('/login?error=missing_oauth_data');
    }
  }, [searchParams, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh', backgroundColor: 'var(--background-color)'}}>
      <div className="text-center">
        <div className="spinner-border text-warning" role="status" style={{width: '4rem', height: '4rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-light mt-3">Completing sign in...</p>
      </div>
    </div>
  );
}

export default OAuthCallbackPage;
