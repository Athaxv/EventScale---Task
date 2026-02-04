import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Shield } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onAdminLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    // Mock Google Login interaction
    console.log("Google login initiated");
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
          onClick={onBack}
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
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium text-gray-700 group-hover:text-black">Continue with Google</span>
            </button>

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
             <button onClick={onAdminLogin} className="text-xs text-gray-400 hover:text-black flex items-center justify-center space-x-1 mx-auto transition-colors">
                <Shield size={12} />
                <span>Admin Access</span>
             </button>
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