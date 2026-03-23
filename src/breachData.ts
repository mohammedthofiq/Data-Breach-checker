/* ──────────────────────────────────────────────
   HIBP-compatible types & data layer
   ────────────────────────────────────────────── */

/** Matches the Have I Been Pwned v3 breachedaccount response shape */
export interface BreachRecord {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
  /* Derived fields (not from HIBP – computed locally) */
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/* ── severity heuristic ── */
function deriveSeverity(b: Omit<BreachRecord, 'severity'>): BreachRecord['severity'] {
  const cls = b.DataClasses.map(d => d.toLowerCase());
  const hasPasswords  = cls.some(c => c.includes('password'));
  const hasFinancial  = cls.some(c => c.includes('credit') || c.includes('bank') || c.includes('financial'));
  const hasIdentity   = cls.some(c => c.includes('passport') || c.includes('ssn') || c.includes('government'));
  const isMassive     = b.PwnCount >= 100_000_000;

  if ((hasPasswords && isMassive) || hasFinancial || hasIdentity) return 'critical';
  if (hasPasswords || b.PwnCount >= 10_000_000) return 'high';
  if (b.PwnCount >= 1_000_000) return 'medium';
  return 'low';
}

/* ──────────────────────────────────────────────
   HIBP API integration
   ────────────────────────────────────────────── */

const HIBP_API_BASE = 'https://haveibeenpwned.com/api/v3';

export type DataSource = 'hibp' | 'demo';

export interface SearchOptions {
  dataSource: DataSource;
  apiKey: string;
}

async function fetchHIBP(email: string, apiKey: string): Promise<BreachRecord[]> {
  const encoded = encodeURIComponent(email.trim().toLowerCase());
  const res = await fetch(`${HIBP_API_BASE}/breachedaccount/${encoded}?truncateResponse=false`, {
    headers: {
      'hibp-api-key': apiKey,
      'user-agent': 'BreachGuard-DataBreachChecker',
    },
  });

  if (res.status === 404) return [];       // no breaches found
  if (res.status === 401) throw new Error('Invalid API key. Please check your HIBP API key.');
  if (res.status === 429) throw new Error('Rate limited. Please wait a moment and try again.');
  if (!res.ok) throw new Error(`HIBP API error: ${res.status} ${res.statusText}`);

  const raw: Omit<BreachRecord, 'severity'>[] = await res.json();
  return raw.map(b => ({ ...b, severity: deriveSeverity(b) }));
}

/* ──────────────────────────────────────────────
   Rich demo database (HIBP-shaped)
   ────────────────────────────────────────────── */

function makeRecord(
  partial: Partial<BreachRecord> & Pick<BreachRecord, 'Name' | 'Title' | 'Domain' | 'BreachDate' | 'PwnCount' | 'Description' | 'DataClasses'>
): BreachRecord {
  const base: Omit<BreachRecord, 'severity'> = {
    AddedDate: partial.AddedDate ?? partial.BreachDate,
    ModifiedDate: partial.ModifiedDate ?? partial.BreachDate,
    LogoPath: partial.LogoPath ?? `https://haveibeenpwned.com/Content/Images/PwnedLogos/${partial.Name}.png`,
    IsVerified: partial.IsVerified ?? true,
    IsFabricated: false,
    IsSensitive: partial.IsSensitive ?? false,
    IsRetired: false,
    IsSpamList: false,
    IsMalware: false,
    IsSubscriptionFree: false,
    ...partial,
  } as Omit<BreachRecord, 'severity'>;
  return { ...base, severity: deriveSeverity(base) };
}

const demoDatabase: Record<string, BreachRecord[]> = {
  'john@example.com': [
    makeRecord({
      Name: 'SocialMediaCo',
      Title: 'SocialMediaCo',
      Domain: 'socialmediaco.com',
      BreachDate: '2024-09-15',
      PwnCount: 530_000_000,
      Description: 'In September 2024, the social media platform SocialMediaCo suffered a massive data breach that exposed over <strong>530 million</strong> user records. The compromised data included email addresses, hashed passwords, phone numbers, IP addresses, and dates of birth. The incident was attributed to a misconfigured cloud storage bucket that remained publicly accessible for several months.',
      DataClasses: ['Email addresses', 'Passwords', 'Phone numbers', 'IP addresses', 'Dates of birth', 'Usernames'],
    }),
    makeRecord({
      Name: 'ShopEasy',
      Title: 'ShopEasy',
      Domain: 'shopeasy.com',
      BreachDate: '2024-03-22',
      PwnCount: 12_000_000,
      Description: 'In March 2024, e-commerce platform ShopEasy disclosed a data breach resulting from a <strong>SQL injection attack</strong>. The attackers gained access to partial credit card numbers (last 4 digits and expiry dates), billing addresses, purchase histories, and email addresses of approximately 12 million customers. ShopEasy engaged a third-party forensics firm and notified affected users within 72&nbsp;hours.',
      DataClasses: ['Email addresses', 'Partial credit card data', 'Physical addresses', 'Purchase histories', 'Names'],
    }),
    makeRecord({
      Name: 'FitTrack',
      Title: 'FitTrack',
      Domain: 'fittrack.io',
      BreachDate: '2023-11-05',
      PwnCount: 3_500_000,
      Description: 'In November 2023, fitness tracking application FitTrack exposed user data through an <strong>unprotected API endpoint</strong>. The leaked information included email addresses, usernames, health metrics (weight, BMI, heart rate data), GPS workout routes, and profile photos. The API was secured within 48&nbsp;hours of disclosure by security researchers.',
      DataClasses: ['Email addresses', 'Usernames', 'Health records', 'Geographic locations', 'Profile photos'],
      IsSensitive: true,
    }),
  ],
  'jane@example.com': [
    makeRecord({
      Name: 'CloudDrive',
      Title: 'CloudDrive',
      Domain: 'clouddrive.net',
      BreachDate: '2025-01-10',
      PwnCount: 80_000_000,
      Description: 'In January 2025, cloud storage provider CloudDrive experienced an <strong>insider threat</strong> incident. A disgruntled employee exfiltrated a database containing 80&nbsp;million user records including email addresses, hashed passwords (bcrypt), file metadata (file names, sizes, creation dates), and OAuth tokens. The breach was discovered when the data appeared on a dark-web marketplace.',
      DataClasses: ['Email addresses', 'Passwords', 'Auth tokens', 'File metadata', 'IP addresses'],
    }),
  ],
  'alice@example.com': [
    makeRecord({
      Name: 'GameVault',
      Title: 'GameVault',
      Domain: 'gamevault.gg',
      BreachDate: '2024-06-18',
      PwnCount: 750_000,
      Description: 'In June 2024, gaming platform GameVault exposed usernames and purchase histories through a <strong>misconfigured public S3 bucket</strong>. The breach affected 750,000 users and included email addresses, gamertags, purchase history with amounts, and time-played statistics. No payment card data was directly exposed.',
      DataClasses: ['Email addresses', 'Usernames', 'Purchase histories'],
    }),
    makeRecord({
      Name: 'MailFast',
      Title: 'MailFast',
      Domain: 'mailfast.com',
      BreachDate: '2024-12-01',
      PwnCount: 25_000_000,
      Description: 'In December 2024, email service provider MailFast suffered a catastrophic breach after it was discovered that user passwords were stored in <strong>plaintext</strong>. A full database dump containing 25&nbsp;million records appeared on the dark web, including email addresses, plaintext passwords, security question/answer pairs, and recovery phone numbers. MailFast forced a global password reset.',
      DataClasses: ['Email addresses', 'Passwords', 'Security questions and answers', 'Phone numbers'],
    }),
    makeRecord({
      Name: 'BookNow',
      Title: 'BookNow',
      Domain: 'booknow.travel',
      BreachDate: '2023-08-30',
      PwnCount: 9_200_000,
      Description: 'In August 2023, travel booking platform BookNow confirmed a data breach that exposed <strong>passport numbers</strong> and travel itineraries of 9.2&nbsp;million customers. The compromised data also included full names, email addresses, phone numbers, and booking details with dates and destinations. The breach originated from a compromised third-party reservation system.',
      DataClasses: ['Email addresses', 'Government issued IDs', 'Travel itineraries', 'Phone numbers', 'Names', 'Physical addresses'],
    }),
  ],
  'test@test.com': [
    makeRecord({
      Name: 'DevForum',
      Title: 'DevForum',
      Domain: 'devforum.dev',
      BreachDate: '2024-07-14',
      PwnCount: 1_500_000,
      Description: 'In July 2024, developer community DevForum was compromised through a <strong>vulnerable phpBB plugin</strong>. The breach exposed 1.5&nbsp;million records including email addresses, usernames, bcrypt-hashed passwords, IP addresses, and private messages. DevForum notified users and enforced a password reset within 24&nbsp;hours.',
      DataClasses: ['Email addresses', 'Usernames', 'Passwords', 'IP addresses', 'Private messages'],
    }),
  ],
};

/* ──────────────────────────────────────────────
   Main public API
   ────────────────────────────────────────────── */

export async function checkBreaches(
  email: string,
  options: SearchOptions = { dataSource: 'demo', apiKey: '' },
): Promise<BreachRecord[]> {
  if (options.dataSource === 'hibp' && options.apiKey) {
    return fetchHIBP(email, options.apiKey);
  }
  // Demo mode – simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalized = email.trim().toLowerCase();
      resolve(demoDatabase[normalized] || []);
    }, 1500);
  });
}

/* ──────────────────────────────────────────────
   Utilities
   ────────────────────────────────────────────── */

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
