import { BreachRecord, formatNumber, formatDate } from './breachData';

interface BreachResultsProps {
  results: BreachRecord[];
  searchedEmail: string;
}

const severityConfig = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  high:     { label: 'High',     color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  medium:   { label: 'Medium',   color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  low:      { label: 'Low',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};

export default function BreachResults({ results, searchedEmail }: BreachResultsProps) {
  if (results.length === 0) {
    return (
      <div className="results-section fade-in">
        <div className="safe-card">
          <div className="safe-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="1.5" fill="rgba(34,197,94,0.1)"/>
              <path d="M8 12L11 15L16 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="safe-title">No Breaches Found!</h2>
          <p className="safe-description">
            Great news! <strong>{searchedEmail}</strong> was not found in any known data breaches in our database.
          </p>
          <p className="safe-note">
            This doesn't guarantee your data is completely safe. Continue practicing good security hygiene.
          </p>
        </div>
      </div>
    );
  }

  const criticalCount = results.filter(r => r.severity === 'critical').length;
  const totalExposed = new Set(results.flatMap(r => r.dataExposed)).size;

  return (
    <div className="results-section fade-in">
      <div className="results-header">
        <div className="alert-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18A2 2 0 003.64 21H20.36A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="#ef4444" strokeWidth="1.5" fill="rgba(239,68,68,0.1)"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h2 className="results-title">
            {results.length} Breach{results.length > 1 ? 'es' : ''} Found
          </h2>
          <p className="results-subtitle">
            <strong>{searchedEmail}</strong> appeared in {results.length} data breach{results.length > 1 ? 'es' : ''}.
            {criticalCount > 0 && (
              <span className="critical-warn"> {criticalCount} critical!</span>
            )}
          </p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{results.length}</span>
          <span className="stat-label">Breaches</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalExposed}</span>
          <span className="stat-label">Data Types Exposed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{criticalCount}</span>
          <span className="stat-label">Critical</span>
        </div>
      </div>

      <div className="breach-list">
        {results.map((breach, index) => {
          const config = severityConfig[breach.severity];
          return (
            <div
              key={breach.id}
              className="breach-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="breach-card-header">
                <div className="breach-company-info">
                  <h3 className="breach-company">{breach.company}</h3>
                  <span className="breach-date">{formatDate(breach.date)}</span>
                </div>
                <span
                  className="severity-badge"
                  style={{ color: config.color, backgroundColor: config.bg }}
                >
                  {config.label}
                </span>
              </div>

              <p className="breach-description">{breach.description}</p>

              <div className="breach-meta">
                <div className="data-exposed">
                  <span className="meta-label">Exposed Data:</span>
                  <div className="tag-list">
                    {breach.dataExposed.map((item) => (
                      <span key={item} className="data-tag">{item}</span>
                    ))}
                  </div>
                </div>
                <div className="affected-users">
                  <span className="meta-label">Affected Users:</span>
                  <span className="meta-value">{formatNumber(breach.affectedUsers)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
