import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { authenticateWithGoogle } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsGoogleLoading(true);
      console.log('Google OAuth success, credential received');
      
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      
      console.log('Authenticating with backend...');
      const response = await authenticateWithGoogle(credentialResponse.credential);
      console.log('Backend authentication successful:', response);
      
      login(response.admin, response.token);
      console.log('Admin logged in, redirecting to /admin');
      toast.success('Successfully logged in!', {
        description: `Welcome back, ${response.admin.name}!`
      });
      
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 100);
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed', {
      description: 'Please try again or contact support'
    });
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#fdfdfc] animate-in fade-in duration-500">
      {/* Left: Image Side (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
          alt="Event Atmosphere"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <div className="font-serif text-2xl font-bold tracking-tight">EventScale</div>
          <div>
            <h2 className="text-5xl font-serif leading-tight mb-6">
              Discover the <br /> extraordinary.
            </h2>
            <p className="text-lg opacity-80 max-w-md font-light leading-relaxed">
              Join a curated community of creators, tastemakers, and culture-seekers.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 justify-center relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 md:top-12 md:left-12 p-3 hover:bg-gray-100 rounded-full transition-colors group"
        >
          <ArrowLeft size={20} className="text-gray-500 group-hover:text-black transition-colors" />
        </button>

        <div className="max-w-sm w-full mx-auto space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-medium mb-3">Welcome</h1>
            <p className="text-gray-500">Sign in with Google to access the admin dashboard.</p>
          </div>

          <div className="space-y-4">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <div className="w-full flex justify-center">
                <div className="w-full max-w-[320px]">
                  <div className="[&>div]:w-full [&>div>div]:w-full [&>div>div>div]:w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="outline"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                      logo_alignment="left"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                <p className="font-semibold mb-1">Google OAuth not configured</p>
                <p>Please set VITE_GOOGLE_CLIENT_ID in your .env file</p>
              </div>
            )}
          </div>

          <div className="text-center pt-8 border-t border-gray-100 mt-4">
             <p className="text-xs text-gray-400">
                Admin access requires Google authentication
             </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            By clicking continue, you agree to our <br/> 
            <a href="#" className="underline hover:text-black transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-black transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;