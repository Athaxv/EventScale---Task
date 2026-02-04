import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authenticateWithGoogle } from '../services/api';
import { useToast } from './Sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsGoogleLoading(true);
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      
      const response = await authenticateWithGoogle(credentialResponse.credential);
      login(response.admin, response.token);
      addToast('Successfully logged in!', 'success');
      navigate('/admin');
    } catch (error: any) {
      console.error('Google login error:', error);
      addToast(error.message || 'Failed to login with Google', 'info');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    addToast('Google login failed', 'info');
    setIsGoogleLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
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
            <p className="text-gray-500">Enter your details to continue.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
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

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-[#fdfdfc] px-4 text-xs uppercase tracking-widest text-gray-400 font-medium">Or</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder-gray-400 text-gray-800"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-gray-200"
              >
                <span>{isLoading ? 'Sending Link...' : 'Continue with Email'}</span>
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>
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