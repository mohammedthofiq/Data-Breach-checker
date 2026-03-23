import { useState } from 'react';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
  const totalExposed = new Set(results.flatMap(r => r.DataClasses)).size;

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
          const isExpanded = expandedId === breach.Name;

          return (
            <div
              key={breach.Name}
              className={`breach-card fade-in ${isExpanded ? 'expanded' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* ── Header ── */}
              <div
                className="breach-card-header clickable"
                onClick={() => setExpandedId(isExpanded ? null : breach.Name)}
              >
                <div className="breach-company-info">
                  <div className="breach-title-row">
                    <img
                      src={breach.LogoPath}
                      alt=""
                      className="breach-logo"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <h3 className="breach-company">{breach.Title}</h3>
                  </div>
                  <span className="breach-date">{formatDate(breach.BreachDate)}</span>
                </div>
                <div className="breach-header-right">
                  <span
                    className="severity-badge"
                    style={{ color: config.color, backgroundColor: config.bg }}
                  >
                    {config.label}
                  </span>
                  <span className={`expand-arrow ${isExpanded ? 'open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* ── Expanded verbose details ── */}
              <div className={`breach-details ${isExpanded ? 'show' : ''}`}>
                {/* Breach Name & Domain */}
                <div className="detail-row">
                  <span className="detail-label">Breach Name</span>
                  <span className="detail-value">{breach.Name}</span>
                </div>
                {breach.Domain && (
                  <div className="detail-row">
                    <span className="detail-label">Domain</span>
                    <span className="detail-value domain-link">{breach.Domain}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Breach Date</span>
                  <span className="detail-value">{formatDate(breach.BreachDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Added to DB</span>
                  <span className="detail-value">{formatDate(breach.AddedDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Affected Accounts</span>
                  <span className="detail-value highlight">{formatNumber(breach.PwnCount)}</span>
                </div>

                {/* Verification flags */}
                <div className="breach-flags">
                  {breach.IsVerified && <span className="flag verified">✓ Verified</span>}
                  {breach.IsSensitive && <span className="flag sensitive">⚠ Sensitive</span>}
                  {breach.IsFabricated && <span className="flag fabricated">⊘ Fabricated</span>}
                  {breach.IsMalware && <span className="flag malware">☣ Malware</span>}
                </div>

                {/* Description (rendered as HTML from HIBP) */}
                <div className="breach-description-full">
                  <span className="detail-label">Description</span>
                  <p
                    className="breach-desc-text"
                    dangerouslySetInnerHTML={{ __html: breach.Description }}
                  />
                </div>

                {/* Compromised Data Types */}
                <div className="data-classes-section">
                  <span className="detail-label">Compromised Data Types</span>
                  <div className="data-classes-grid">
                    {breach.DataClasses.map((cls) => (
                      <span key={cls} className="data-class-chip">
                        <span className="chip-icon">{getDataClassIcon(cls)}</span>
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Collapsed summary ── */}
              {!isExpanded && (
                <div className="breach-summary">
                  <div className="data-exposed">
                    <span className="meta-label">Compromised Data:</span>
                    <div className="tag-list">
                      {breach.DataClasses.slice(0, 4).map((item) => (
                        <span key={item} className="data-tag">{item}</span>
                      ))}
                      {breach.DataClasses.length > 4 && (
                        <span className="data-tag more-tag">+{breach.DataClasses.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  <div className="affected-users">
                    <span className="meta-label">Affected:</span>
                    <span className="meta-value">{formatNumber(breach.PwnCount)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── icon helper for data classes ── */
function getDataClassIcon(cls: string): string {
  const lower = cls.toLowerCase();
  if (lower.includes('password'))   return '🔑';
  if (lower.includes('email'))      return '📧';
  if (lower.includes('phone'))      return '📱';
  if (lower.includes('credit') || lower.includes('financial') || lower.includes('bank')) return '💳';
  if (lower.includes('address') && !lower.includes('email'))  return '📍';
  if (lower.includes('name'))       return '👤';
  if (lower.includes('date') || lower.includes('birth'))      return '📅';
  if (lower.includes('username'))   return '🏷️';
  if (lower.includes('ip'))         return '🌐';
  if (lower.includes('passport') || lower.includes('government') || lower.includes('ssn')) return '🪪';
  if (lower.includes('health') || lower.includes('medical'))  return '🏥';
  if (lower.includes('photo') || lower.includes('image'))     return '📷';
  if (lower.includes('location') || lower.includes('geographic')) return '📍';
  if (lower.includes('message') || lower.includes('chat'))    return '💬';
  if (lower.includes('auth') || lower.includes('token'))      return '🔐';
  if (lower.includes('purchase') || lower.includes('transaction')) return '🛒';
  if (lower.includes('security') || lower.includes('question')) return '❓';
  if (lower.includes('travel') || lower.includes('itinerar')) return '✈️';
  if (lower.includes('file'))      return '📁';
  return '📋';
}
