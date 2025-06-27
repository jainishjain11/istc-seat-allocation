'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.user.is_admin ? '/admin' : `/candidate/${data.user.id}`;
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
      <form className="login-card" onSubmit={handleLogin} autoComplete="off">
        <h1 className="login-title">Welcome</h1>
        {error && <div className="login-error">{error}</div>}
        <div className="login-field">
          <input
            type="email"
            value={email}
            autoFocus
            autoComplete="username"
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
        </div>
        <div className="login-field">
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <style jsx>{`
        .login-bg {
          height: 100vh;
          width: 100vw;
          background: #fff;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(16, 38, 70, 0.10);
          padding: 32px 24px 28px 24px;
          min-width: 280px;
          max-width: 340px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .login-title {
          text-align: center;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 2.1rem;
          color: #111928;
          letter-spacing: -0.5px;
        }
        .login-field {
          margin-bottom: 1.3rem;
          display: flex;
          flex-direction: column;
        }
        .login-field input {
          width: 100%;
          padding: 8px 0;
          font-size: 1rem;
          border: none;
          border-bottom: 2px solid #bcd0ee;
          outline: none;
          background: transparent;
          transition: border-color 0.2s;
        }
        .login-field input:focus {
          border-bottom: 2px solid #2563eb;
        }
        .login-btn {
          width: 100%;
          padding: 12px 0;
          background: #2563eb;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 0.2rem;
          box-shadow: 0 2px 8px rgba(37,99,235,0.09);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .login-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        .login-error {
          background: #fee2e2;
          color: #b91c1c;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 1.2rem;
          font-size: 0.98rem;
          text-align: center;
        }
        @media (max-width: 500px) {
          .login-card {
            min-width: 90vw;
            max-width: 98vw;
            padding: 18px 4vw 18px 4vw;
          }
        }
      `}</style>
    </div>
  );
}
