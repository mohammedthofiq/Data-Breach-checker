import { useState } from 'react';
import { BreachRecord, checkBreaches } from './breachData';
import SearchForm from './SearchForm';
import BreachResults from './BreachResults';
import Recommendations from './Recommendations';
import './index.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BreachRecord[] | null>(null);
  const [searchedEmail, setSearchedEmail] = useState('');

  const handleSearch = async (email: string) => {
    setIsLoading(true);
    setResults(null);
    setSearchedEmail(email);

    try {
      const data = await checkBreaches(email);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSearchedEmail('');
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
      </header>

      <main className="app-main">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

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
        <p>&copy; 2025 BreachGuard. For educational purposes. Data is simulated.</p>
      </footer>
    </div>
  );
}
