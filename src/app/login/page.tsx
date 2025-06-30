'use client';
import { useState, FormEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        {/* Left: ISTC Logo fills the panel */}
        <div className="login-visual" aria-label="ISTC Logo" />
        {/* Right: Login Form */}
        <div className="login-form-wrap">
          <form className="login-form" onSubmit={handleLogin} autoComplete="off">
            <h2 className="login-title">Sign In</h2>
            {error && <div className="login-error">{error}</div>}
            <div className="login-field">
              <input
                type="email"
                value={email}
                autoFocus
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="login-field password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                // No need to add style here
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .login-bg {
          min-height: 100vh;
          width: 100vw;
          background: #f6f8fa;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .login-container {
          display: flex;
          flex-direction: row;
          border-radius: 24px;
          box-shadow: 0 8px 32px 0 rgba(16, 38, 70, 0.13);
          overflow: hidden;
          min-width: 420px;
          max-width: 650px;
          width: 100%;
          background: #fff;
        }
        .login-visual {
          background: #fff url('/images/istc-logo.jpg') center center / 80% 80% no-repeat;
          min-width: 180px;
          width: 200px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-form-wrap {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          padding: 36px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 320px; /* Ensure vertical centering */
        }
        .login-form {
          width: 100%;
          max-width: 260px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .login-title {
          color: #fff;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 1.6rem;
          text-align: center;
        }
        .login-field {
  margin-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-right: 8px; /* Shift the entire field slightly to the right */
}

.login-field input[type='email'],
.login-field input[type='password'],
.login-field input[type='text'] {
  width: 100%;
  padding: 14px 18px;
  font-size: 1rem;
  border: none;
  border-radius: 999px;
  background: #e3edfa;
  color: #222;
  outline: none;
  box-shadow: 0 2px 8px rgba(16, 38, 70, 0.03);
  margin-right: 8px; /* Optional: tweak input position slightly to match parent */
}

        .login-field input:focus {
          box-shadow: 0 0 0 2px #2563eb33;
        }
        .password-field input {
          padding-right: 42px;
        }
        .eye-icon {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #a0aec0;
          transition: color 0.2s;
        }
        .eye-icon:hover,
        .eye-icon:focus {
          color: #2563eb;
        }
        .login-btn {
          width: 100%;
          padding: 12px 0;
          background: #fff;
          color: #2563eb;
          font-weight: 700;
          font-size: 1.08rem;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 2px 8px rgba(16, 38, 70, 0.07);
          transition: background 0.2s, box-shadow 0.2s, color 0.2s;
        }
        .login-btn:disabled {
          background: #e3edfa;
          color: #93c5fd;
          cursor: not-allowed;
        }
        .login-error {
          background: #fee2e2;
          color: #b91c1c;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 1.1rem;
          font-size: 0.98rem;
          text-align: center;
        }
        /* Hide browser's default password reveal icon (Edge, Chrome, Safari) */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        input[type="password"]::-webkit-credentials-auto-fill-button {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
          height: 0;
          width: 0;
          margin: 0;
          padding: 0;
        }
        @media (max-width: 700px) {
          .login-container {
            flex-direction: column;
            min-width: 0;
            max-width: 98vw;
            border-radius: 14px;
          }
          .login-visual {
            width: 100%;
            min-width: 0;
            height: 100px;
            background-size: contain;
          }
          .login-form-wrap {
            padding: 24px 6vw;
          }
        }
        @media (max-width: 400px) {
          .login-form-wrap {
            padding: 12px 2vw;
          }
        }
      `}</style>
    </div>
  );
}
