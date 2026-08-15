import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ArrowRight, Github, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: { name: string; email: string; avatar: string }) => void;
}

interface RegisteredUser {
  name: string;
  email: string;
  avatar: string;
}

const getRegisteredUsers = (): RegisteredUser[] => {
  try {
    const data = localStorage.getItem('aicentral_registered_accounts');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  const defaultAccounts: RegisteredUser[] = [
    {
      name: 'Yoseph Emwaye',
      email: 'u15041338@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Yoseph+Emwaye&background=0284C7&color=fff&bold=true'
    }
  ];
  try {
    localStorage.setItem('aicentral_registered_accounts', JSON.stringify(defaultAccounts));
  } catch (e) {
    console.error(e);
  }
  return defaultAccounts;
};

const saveRegisteredUser = (newUser: RegisteredUser) => {
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = newUser;
  } else {
    users.push(newUser);
  }
  try {
    localStorage.setItem('aicentral_registered_accounts', JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot' && !password.trim()) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'forgot') {
        setSuccessMsg(`Password reset link sent to ${cleanEmail}`);
        return;
      }

      const users = getRegisteredUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (mode === 'signin') {
        if (!existingUser) {
          setError(`No account found for "${cleanEmail}". You must sign up first before signing in!`);
          return;
        }
        onLoginSuccess(existingUser);
        onClose();
        return;
      }

      if (mode === 'signup') {
        const rawName = name.trim() || cleanEmail.split('@')[0] || 'AI Pioneer';
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const newUser: RegisteredUser = {
          name: formattedName,
          email: cleanEmail,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=0284C7&color=fff&bold=true`
        };

        saveRegisteredUser(newUser);
        onLoginSuccess(newUser);
        onClose();
      }
    }, 400);
  };

  const handleSocialClick = (provider: string) => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      
      let socialEmail = (provider === 'Google' ? 'u15041338@gmail.com' : 'user@github.com').toLowerCase();
      if (email.trim()) socialEmail = email.trim().toLowerCase();

      let socialName = provider === 'Google' ? 'Yoseph Emwaye' : 'GitHub Pioneer';
      if (name.trim()) socialName = name.trim();

      const users = getRegisteredUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === socialEmail);

      if (mode === 'signin') {
        if (!existingUser) {
          setError(`No registered account found for "${socialEmail}". Please click Sign Up first to create your account!`);
          return;
        }
        onLoginSuccess(existingUser);
        onClose();
        return;
      }

      if (mode === 'signup') {
        const newUser: RegisteredUser = {
          name: socialName,
          email: socialEmail,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(socialName)}&background=0284C7&color=fff&bold=true`
        };

        saveRegisteredUser(newUser);
        onLoginSuccess(newUser);
        onClose();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0A0A0C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow backdrop blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0A0A0C] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'signin' && 'Welcome Back to AICentral'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin' && 'Sign in to access saved tools, custom stacks & AI workflows'}
            {mode === 'signup' && 'Join 85,000+ pioneers building with verified AI tools'}
            {mode === 'forgot' && 'Enter your email to receive a recovery link'}
          </p>
        </div>

        {/* Form Mode Selector */}
        {mode !== 'forgot' && (
          <div className="flex rounded-full bg-white/5 border border-white/10 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Social Logins */}
        {mode !== 'forgot' && (
          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleSocialClick('Google')}
              className="w-full py-2.5 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all hover:border-white/20"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialClick('GitHub')}
              className="w-full py-2.5 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all hover:border-white/20"
            >
              <Github className="w-4 h-4 text-white" />
              <span>Continue with GitHub</span>
            </button>

            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">or with email</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="shrink-0 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-bold text-[11px] hover:bg-cyan-400 transition-all shadow-sm"
              >
                Sign Up Now
              </button>
            )}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'signin' && 'Sign In to AICentral'}
                  {mode === 'signup' && 'Create Pioneer Account'}
                  {mode === 'forgot' && 'Send Recovery Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-slate-400 hover:text-white font-semibold"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
