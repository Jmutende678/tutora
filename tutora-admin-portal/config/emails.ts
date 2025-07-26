// Canonical email addresses for Tutora
// These are the public-facing emails used in UI, forms, and transactional copy

export const CANONICAL_EMAILS = {
  admin: 'admin@tutoralearn.com',
  support: 'support@tutoralearn.com', 
  sales: 'sales@tutoralearn.com',
  careers: 'careers@tutoralearn.com',
  hello: 'hello@tutoralearn.com',
  billing: 'billing@tutoralearn.com',
  marketing: 'marketing@tutoralearn.com'
} as const

// Internal routing aliases (Google Workspace auto-forward)
// Do not surface these externally unless debugging
export const EMAIL_ALIASES = {
  'admin@tutoralearn.com.test-google-a.com': CANONICAL_EMAILS.admin,
  'support@tutoralearn.com.test-google-a.com': CANONICAL_EMAILS.support,
  'sales@tutoralearn.com.test-google-a.com': CANONICAL_EMAILS.sales,
  'careers@tutoralearn.com.test-google-a.com': CANONICAL_EMAILS.careers,
  'hello@tutoralearn.com.test-google-a.com': CANONICAL_EMAILS.hello,
  'billing@tutoralearn.com.test-google-a.com': CANONICAL_EMAILS.billing,
  'marketing@tutoralearn.com.test-google-a.com': CANONICAL_EMAILS.marketing
} as const

// Email descriptions for documentation
export const EMAIL_DESCRIPTIONS = {
  admin: 'System notifications to tenant owners',
  support: 'Support tickets, help contact', 
  sales: 'Lead capture, pricing inquiries',
  careers: 'Hiring, talent outreach',
  hello: 'General inbound inquiries',
  billing: 'Invoices, payment issues',
  marketing: 'Partnerships, campaigns'
} as const

// Helper function to get canonical email by key
export function getCanonicalEmail(key: keyof typeof CANONICAL_EMAILS): string {
  return CANONICAL_EMAILS[key]
}

// Helper function to resolve any email to its canonical form
export function resolveToCanonical(email: string): string {
  return EMAIL_ALIASES[email as keyof typeof EMAIL_ALIASES] || email
}

export type EmailKey = keyof typeof CANONICAL_EMAILS 