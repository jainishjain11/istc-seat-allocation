'use client';
import { useState } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.wrapper}>
      <form className={styles.form}>
        <h2 className={styles.formTitle}>Login</h2>
        <div className={styles.inputContainer}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submit}>Login</button>
      </form>
    </div>
  );
}
