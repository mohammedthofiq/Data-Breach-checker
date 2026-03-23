export interface BreachRecord {
  id: string;
  company: string;
  date: string;
  dataExposed: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedUsers: number;
}

const breachDatabase: Record<string, BreachRecord[]> = {
  'john@example.com': [
    {
      id: 'b1',
      company: 'SocialMediaCo',
      date: '2024-09-15',
      dataExposed: ['Email', 'Password (hashed)', 'Phone Number', 'IP Address'],
      severity: 'critical',
      description: 'A massive data breach exposed over 530 million user records including phone numbers, emails, and personal information.',
      affectedUsers: 530000000,
    },
    {
      id: 'b2',
      company: 'ShopEasy',
      date: '2024-03-22',
      dataExposed: ['Email', 'Credit Card (partial)', 'Billing Address'],
      severity: 'high',
      description: 'E-commerce platform suffered a SQL injection attack, exposing payment data and personal addresses.',
      affectedUsers: 12000000,
    },
    {
      id: 'b3',
      company: 'FitTrack',
      date: '2023-11-05',
      dataExposed: ['Email', 'Username', 'Health Data'],
      severity: 'medium',
      description: 'Fitness tracking app leaked health metrics and personal information through an unprotected API endpoint.',
      affectedUsers: 3500000,
    },
  ],
  'jane@example.com': [
    {
      id: 'b4',
      company: 'CloudDrive',
      date: '2025-01-10',
      dataExposed: ['Email', 'Stored Files Metadata', 'Password (hashed)'],
      severity: 'critical',
      description: 'Cloud storage provider experienced an insider threat, leaking file metadata and authentication data.',
      affectedUsers: 80000000,
    },
  ],
  'alice@example.com': [
    {
      id: 'b5',
      company: 'GameVault',
      date: '2024-06-18',
      dataExposed: ['Email', 'Username', 'Purchase History'],
      severity: 'low',
      description: 'Gaming platform exposed usernames and purchase history through a misconfigured public bucket.',
      affectedUsers: 750000,
    },
    {
      id: 'b6',
      company: 'MailFast',
      date: '2024-12-01',
      dataExposed: ['Email', 'Password (plaintext)', 'Security Questions'],
      severity: 'critical',
      description: 'Email provider stored passwords in plaintext. Full database dump was found on the dark web.',
      affectedUsers: 25000000,
    },
    {
      id: 'b7',
      company: 'BookNow',
      date: '2023-08-30',
      dataExposed: ['Email', 'Passport Number', 'Travel Itinerary'],
      severity: 'high',
      description: 'Travel booking site exposed passport numbers and travel data of millions of customers.',
      affectedUsers: 9200000,
    },
  ],
  'test@test.com': [
    {
      id: 'b8',
      company: 'DevForum',
      date: '2024-07-14',
      dataExposed: ['Email', 'Username', 'IP Address'],
      severity: 'medium',
      description: 'Developer forum database was compromised, exposing email addresses and IP logs.',
      affectedUsers: 1500000,
    },
  ],
};

export function checkBreaches(email: string): Promise<BreachRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalized = email.trim().toLowerCase();
      resolve(breachDatabase[normalized] || []);
    }, 1500);
  });
}

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
