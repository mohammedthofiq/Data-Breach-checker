import { BreachRecord } from './breachData';

interface RecommendationsProps {
  results: BreachRecord[];
}

interface Tip {
  icon: string;
  title: string;
  description: string;
  urgency: 'immediate' | 'soon' | 'routine';
}

function getRecommendations(results: BreachRecord[]): Tip[] {
  const tips: Tip[] = [];
  const allExposed = new Set(results.flatMap(r => r.dataExposed));
  const hasCritical = results.some(r => r.severity === 'critical');
  const hasPasswordLeak = Array.from(allExposed).some(d =>
    d.toLowerCase().includes('password')
  );
  const hasFinancialLeak = Array.from(allExposed).some(d =>
    d.toLowerCase().includes('credit') || d.toLowerCase().includes('billing')
  );
  const hasPhoneLeak = allExposed.has('Phone Number');
  const hasIdentityLeak = Array.from(allExposed).some(d =>
    d.toLowerCase().includes('passport') || d.toLowerCase().includes('ssn')
  );

  if (hasPasswordLeak) {
    tips.push({
      icon: '🔑',
      title: 'Change Your Passwords Immediately',
      description: 'Your password was exposed. Change it on the breached site AND any other site where you used the same password. Use unique passwords for every account.',
      urgency: 'immediate',
    });
  }

  tips.push({
    icon: '🛡️',
    title: 'Enable Two-Factor Authentication (2FA)',
    description: 'Add an extra layer of security to all your important accounts. Use an authenticator app (like Google Authenticator or Authy) instead of SMS when possible.',
    urgency: hasCritical ? 'immediate' : 'soon',
  });

  if (hasFinancialLeak) {
    tips.push({
      icon: '💳',
      title: 'Monitor Your Financial Accounts',
      description: 'Payment data was exposed. Check your bank and credit card statements for unauthorized transactions. Consider freezing your credit with major bureaus.',
      urgency: 'immediate',
    });
  }

  if (hasPhoneLeak) {
    tips.push({
      icon: '📱',
      title: 'Watch Out for Phishing Attacks',
      description: 'Your phone number was leaked. Be extra cautious of suspicious calls, texts, or messages pretending to be from trusted services. Never share OTPs with anyone.',
      urgency: 'immediate',
    });
  }

  if (hasIdentityLeak) {
    tips.push({
      icon: '🪪',
      title: 'Protect Your Identity',
      description: 'Sensitive identity documents were exposed. Contact your government agency to report the breach and consider placing a fraud alert on your identity records.',
      urgency: 'immediate',
    });
  }

  tips.push({
    icon: '🔐',
    title: 'Use a Password Manager',
    description: 'Generate and store unique, strong passwords for every account. Popular options include 1Password, Bitwarden, and Dashlane.',
    urgency: 'soon',
  });

  tips.push({
    icon: '📧',
    title: 'Check for Suspicious Account Activity',
    description: 'Log in to the breached services and check for unauthorized changes to your profile, email forwarding rules, or connected apps. Revoke any suspicious sessions.',
    urgency: 'soon',
  });

  tips.push({
    icon: '🔄',
    title: 'Set Up Breach Monitoring',
    description: 'Use services like Have I Been Pwned to get notified when your email appears in future breaches. Stay proactive about your digital security.',
    urgency: 'routine',
  });

  return tips;
}

const urgencyConfig = {
  immediate: { label: 'Act Now', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  soon:      { label: 'Important', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  routine:   { label: 'Good Practice', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
};

export default function Recommendations({ results }: RecommendationsProps) {
  const tips = getRecommendations(results);

  return (
    <div className="recommendations-section fade-in">
      <h2 className="section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="url(#star-grad)" strokeWidth="1.5" fill="rgba(99,102,241,0.1)" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="star-grad" x1="2" y1="2" x2="22" y2="21">
              <stop stopColor="#6366f1"/>
              <stop offset="1" stopColor="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
        Security Recommendations
      </h2>
      <p className="section-subtitle">
        Based on the types of data exposed, here are your personalized action items:
      </p>

      <div className="tips-list">
        {tips.map((tip, index) => {
          const config = urgencyConfig[tip.urgency];
          return (
            <div
              key={index}
              className="tip-card fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="tip-icon-wrapper">{tip.icon}</div>
              <div className="tip-content">
                <div className="tip-header">
                  <h3 className="tip-title">{tip.title}</h3>
                  <span
                    className="urgency-badge"
                    style={{ color: config.color, backgroundColor: config.bg }}
                  >
                    {config.label}
                  </span>
                </div>
                <p className="tip-description">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
