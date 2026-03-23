import { useState } from 'react';
import { BreachRecord, DataSource, checkBreaches } from './breachData';
import SearchForm from './SearchForm';
import BreachResults from './BreachResults';
import Recommendations from './Recommendations';
import './index.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BreachRecord[] | null>(null);
  const [searchedEmail, setSearchedEmail] = useState('');
  const [error, setError] = useState('');

  /* Data source settings */
  const [dataSource, setDataSource] = useState<DataSource>('demo');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleSearch = async (email: string) => {
    setIsLoading(true);
    setResults(null);
    setSearchedEmail(email);
    setError('');

    try {
      const data = await checkBreaches(email, { dataSource, apiKey });
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSearchedEmail('');
    setError('');
  };

  return (
    <div className="app">
      <div className="bg-grid"></div>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <header className="app-header">
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7V12C3 17.25 6.75 21.75 12 23C17.25 21.75 21 17.25 21 12V7L12 2Z" stroke="url(#logo-grad)" strokeWidth="1.5" fill="rgba(99,102,241,0.1)"/>
            <defs>
              <linearGradient id="logo-grad" x1="3" y1="2" x2="21" y2="23">
                <stop stopColor="#6366f1"/>
                <stop offset="1" stopColor="#06b6d4"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">BreachGuard</span>
        </div>
        <button
          id="settings-toggle"
          className={`settings-btn ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
          title="Data source settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="settings-panel fade-in">
          <div className="settings-inner">
            <h3 className="settings-title">Data Source</h3>
            <div className="source-toggle">
              <button
                className={`source-btn ${dataSource === 'demo' ? 'active' : ''}`}
                onClick={() => setDataSource('demo')}
              >
                🧪 Demo Data
              </button>
              <button
                className={`source-btn ${dataSource === 'hibp' ? 'active' : ''}`}
                onClick={() => setDataSource('hibp')}
              >
                🔐 HIBP API
              </button>
            </div>
            {dataSource === 'hibp' && (
              <div className="api-key-section fade-in">
                <label className="api-key-label" htmlFor="api-key-input">
                  HIBP API Key
                  <a
                    href="https://haveibeenpwned.com/API/Key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="api-key-link"
                  >
                    Get a key →
                  </a>
                </label>
                <input
                  id="api-key-input"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your HIBP API key..."
                  className="api-key-input"
                />
                <p className="api-key-note">
                  Your key stays in your browser and is never stored or sent anywhere except HIBP.
                </p>
              </div>
            )}
            {dataSource === 'demo' && (
              <p className="demo-note fade-in">
                Using simulated breach data. Try <code>john@example.com</code>, <code>alice@example.com</code>, or <code>jane@example.com</code>.
              </p>
            )}
          </div>
        </div>
      )}

      <main className="app-main">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} dataSource={dataSource} />

        {error && (
          <div className="error-banner fade-in">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {results !== null && (
          <>
            <BreachResults results={results} searchedEmail={searchedEmail} />
            {results.length > 0 && <Recommendations results={results} />}

            <div className="reset-wrapper fade-in">
              <button id="reset-button" className="reset-button" onClick={handleReset}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.51 15A9 9 0 105.64 5.64L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Check Another Email
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          &copy; 2025 BreachGuard.
          {dataSource === 'hibp'
            ? ' Powered by HaveIBeenPwned.com API.'
            : ' For educational purposes. Data is simulated.'}
        </p>
      </footer>
    </div>
  );
}
