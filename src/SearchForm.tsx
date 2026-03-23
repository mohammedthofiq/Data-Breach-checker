import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (email: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onSearch(email.trim());
  };

  return (
    <div className="search-section">
      <div className="shield-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L3 7V12C3 17.25 6.75 21.75 12 23C17.25 21.75 21 17.25 21 12V7L12 2Z"
            stroke="url(#shield-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#shield-fill)"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="shield-gradient" x1="3" y1="2" x2="21" y2="23">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="shield-fill" x1="3" y1="2" x2="21" y2="23">
              <stop stopColor="rgba(99,102,241,0.15)" />
              <stop offset="1" stopColor="rgba(6,182,212,0.15)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className="hero-title">
        Data Breach <span className="gradient-text">Checker</span>
      </h1>
      <p className="hero-subtitle">
        Find out if your email has been compromised in a data breach. Enter your email below to scan our database.
      </p>

      <form onSubmit={handleSubmit} className="search-form" id="search-form">
        <div className="input-wrapper">
          <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your email address..."
            className="search-input"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        {error && <p className="input-error">{error}</p>}
        <button
          id="search-button"
          type="submit"
          className={`search-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Scanning...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Check for Breaches
            </>
          )}
        </button>
      </form>

      <p className="test-hint">
        Try: <code>john@example.com</code>, <code>alice@example.com</code>, or <code>jane@example.com</code>
      </p>
    </div>
  );
}
