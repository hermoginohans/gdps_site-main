import './AuthPages.css';
import React, { useEffect, useState, useRef } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiRequest, useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../context/RouterContext';
import { assetUrl } from '../utils/assets';

const useAvailability = (field: 'name' | 'email', value: string, enabled: boolean) => {
  const normalized = value.trim();
  const [result, setResult] = useState<{ value: string; status: 'available' | 'taken' | 'error' } | null>(null);
  const valid = normalized.length > 0 && normalized.length <= 255 &&
    (field === 'name' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized));

  useEffect(() => {
    setResult(null);
    if (!enabled || !valid) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const data = await apiRequest(`/api/register/availability?${new URLSearchParams({ field, value: normalized })}`, {
          signal: controller.signal
        });
        if (!controller.signal.aborted) {
          setResult({ value: normalized, status: data.available ? 'available' : 'taken' });
        }
      } catch {
        if (!controller.signal.aborted) setResult({ value: normalized, status: 'error' });
      }
    }, 500);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [field, normalized, enabled, valid]);

  if (!enabled || !valid) return null;
  return result?.value === normalized ? result.status : 'checking';
};

const availabilityMessage = (status: ReturnType<typeof useAvailability>, label: string) => {
  if (status === 'taken') return `This ${label} is already used.`;
  if (status === 'checking') return 'Checking availability...';
  if (status === 'available') return `${label === 'email' ? 'Email' : 'Nickname'} is available.`;
  if (status === 'error') return 'Unable to check right now. We will check again when you submit.';
  return '';
};

export const AuthPages: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const mode = initialMode;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [error, setError] = useState(() => {
    const oauthError = new URLSearchParams(window.location.search).get('oauth');
    if (oauthError === 'not-configured') return 'Google sign-in is not configured yet. Add the Google OAuth credentials to backend/.env.';
    if (oauthError === 'failed') return 'Google sign-in was not completed. Please try again.';
    return '';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameAvailability = useAvailability('name', name, mode === 'register');
  const emailAvailability = useAvailability('email', email, mode === 'register');

  const { login, register, loginWithGoogle } = useAuth();
  const { navigate } = useRouter();

  const previousMode = useRef(mode);
  useEffect(() => { if (previousMode.current === mode) return; previousMode.current = mode; setPassword(''); setPasswordConfirmation(''); setShowPassword(false); setShowPasswordConfirmation(false); setError(''); setIsForgotModalOpen(false); }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'register' && (nameAvailability === 'taken' || emailAvailability === 'taken')) {
      setError(
        nameAvailability === 'taken' && emailAvailability === 'taken'
          ? 'This nickname and email are already used. Please choose different ones.'
          : nameAvailability === 'taken'
            ? 'This nickname is already used. Please choose a different nickname.'
            : 'This email is already used. Please choose a different email.'
      );
      return;
    }
    if (mode === 'register' && password !== passwordConfirmation) {
      setError('Passwords do not match. Please enter the same password in both fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await register(name, email, password, passwordConfirmation);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={mode === 'register' ? 'registration-page' : 'max-w-md mx-auto px-4 py-12 space-y-8'}>
      
      {/* Brand Header */}
      {mode === 'register' ? <header className="registration-hero"><svg viewBox="54 37 930 482" aria-hidden="true"><image href={assetUrl('/register-reference.png')} width="1037" height="1517" /></svg><h1 className="sr-only">Join the GPDS Community</h1><p className="sr-only">Create your account and explore your favorite games.</p></header> : <div className="text-center space-y-3">
        <Link to="/" className="inline-block group" aria-label="GPDS GAME SHOP Home">
          <img 
            src={assetUrl("/gpds_logo.png")} 
            alt="GPDS GAME SHOP" 
            className="h-11 w-auto mx-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_4px_16px_rgba(240,192,48,0.3)]" 
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
          {mode === 'login' ? 'Welcome Back, Gamer' : 'Create your free account'}
        </h1>
        <p className="text-xs text-gray-400">
          Sign in to manage your account and view your orders.
        </p>
      </div>}

      {/* Auth Card */}
      <div className={`auth-card p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder shadow-2xl space-y-6`}>
        
        <div className="auth-form-intro flex items-center gap-3 border-b border-brand-cardBorder pb-5"><span className="rounded-2xl bg-brand-gold/15 p-3 text-brand-gold"><User size={24} /></span><div><h2 className="text-lg font-bold text-white">{mode === 'register' ? 'Join GPDS Game Shop' : 'Sign in to your account'}</h2><p className="mt-1 text-xs text-gray-400">{mode === 'register' ? 'Your gamer profile starts here.' : 'Enter your account details below.'}</p></div></div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full py-3 px-4 rounded-xl bg-white text-gray-900 font-bold text-xs flex items-center justify-center gap-3 hover:bg-gray-100 transition-all"
        >
          <span className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center font-black text-sm">G</span>
          {mode === 'register' ? 'Continue with Google' : 'Sign in with Google'}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-brand-cardBorder w-full" />
          <span className="bg-brand-card px-3 text-[10px] text-gray-500 uppercase font-bold absolute">
            {mode === 'register' ? 'Or create your account' : 'Or sign in with email'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form space-y-4 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label htmlFor="nickname" className="font-bold text-gray-300 block">Gamer Name / Nickname</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="nickname"
                  maxLength={255}
                  aria-invalid={nameAvailability === 'taken'}
                  aria-describedby="nickname-availability"
                  required
                  placeholder="e.g. ShadowHunter"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-3.5 py-3 text-white outline-none"
                />
              </div>
              <p id="nickname-availability" aria-live="polite" className={nameAvailability === 'taken' ? 'text-red-300' : 'text-gray-400'}>
                {availabilityMessage(nameAvailability, 'nickname')}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="font-bold text-gray-300 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="email"
                maxLength={255}
                aria-invalid={emailAvailability === 'taken'}
                aria-describedby={mode === 'register' ? 'email-availability' : undefined}
                required
                placeholder="e.g. gamer@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-3.5 py-3 text-white outline-none"
              />
            </div>
            {mode === 'register' && (
              <p id="email-availability" aria-live="polite" className={emailAvailability === 'taken' ? 'text-red-300' : 'text-gray-400'}>
                {availabilityMessage(emailAvailability, 'email')}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="font-bold text-gray-300 block">{mode === 'register' ? 'Create a password' : 'Password'}</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-brand-gold hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                minLength={mode === 'register' ? 8 : undefined}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-10 py-3 text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label htmlFor="password-confirmation" className="font-bold text-gray-300 block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password-confirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Enter your password again"
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-10 py-3 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  aria-label={showPasswordConfirmation ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all mt-2"
          >
            {isSubmitting ? (mode === 'register' ? 'Creating your account...' : 'Signing in...') : mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account ?'}
          </button>
        </form>

        {mode === 'register' && <><p className="registration-terms">By creating an account, you agree to our <Link to="/terms-and-conditions">Terms of Service</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.</p><div className="registration-benefits"><span><ShieldCheck />Password protection</span><span><ArrowRight />Account access</span><span><User />GPDS community</span></div></>}
        <p className="auth-switch text-center text-sm text-gray-400">{mode === 'register' ? 'Already have an account? ' : 'New to GPDS? '}<Link to={mode === 'register' ? '/login' : '/register'} className="font-bold text-brand-gold hover:underline">{mode === 'register' ? 'Sign in' : 'Create an account'}</Link></p>
        {error && (
          <p role="alert" className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            {error}
          </p>
        )}

        <div className="auth-security text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>Your password is securely hashed.</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#151125] border border-brand-gold/40 rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Reset Your Password</h3>
            <p className="text-xs text-gray-400">Enter your email and we will send you a 6-digit recovery code.</p>

            {forgotSent ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs">
                Password recovery email has been sent! Check your inbox.
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail || email}
                  onChange={event => setForgotEmail(event.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-xs text-white outline-none"
                  placeholder="Enter email"
                />
                {forgotError && <p role="alert" className="text-xs text-red-300">{forgotError}</p>}
                <button
                  type="button"
                  disabled={forgotSubmitting}
                  onClick={async () => {
                    setForgotError('');
                    setForgotSubmitting(true);
                    try {
                      await apiRequest('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email: forgotEmail || email }) });
                      setForgotSent(true);
                    } catch (requestError) {
                      setForgotError(requestError instanceof Error ? requestError.message : 'Unable to send reset instructions.');
                    } finally {
                      setForgotSubmitting(false);
                    }
                  }}
                  className="w-full py-2.5 bg-brand-gold text-brand-dark font-bold text-xs uppercase rounded-xl"
                >
                  {forgotSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotSent(false);
              }}
              className="w-full text-center text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
