/**
 * Central Valley Auto Care — Site Configuration
 *
 * 1. Create a Make.com account at make.com
 * 2. Create a scenario for each webhook below
 * 3. Each scenario: Webhook trigger → Airtable "Create Record" → Send SMS/email confirmation
 * 4. Paste the webhook URLs below
 */

// Make.com Webhook URLs — set these in your .env file
export const MAKE_VIP_WEBHOOK     = import.meta.env.VITE_MAKE_VIP_WEBHOOK     ?? '';
export const MAKE_BOOKING_WEBHOOK = import.meta.env.VITE_MAKE_BOOKING_WEBHOOK ?? '';
export const MAKE_CONTACT_WEBHOOK = import.meta.env.VITE_MAKE_CONTACT_WEBHOOK ?? '';
export const MAKE_MESSAGE_WEBHOOK = import.meta.env.VITE_MAKE_MESSAGE_WEBHOOK ?? '';

// Owner Dashboard password — set VITE_DASHBOARD_PASSWORD in your .env file
export const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD ?? 'change-me';

// Business info (update with real values)
export const BUSINESS = {
  name:    'Central Valley Auto Care',
  phone:   '(559) 555-0100',
  phoneHref: 'tel:+15595550100',
  smsHref:   'sms:+15595550100',
  email:   'info@centralvalleyautocare.com',
  address: '[Street Address], [City], CA [ZIP]',
  hoursWeekday: '7:30 AM – 5:30 PM',
  hoursSaturday: '8:00 AM – 3:00 PM',
  hoursSunday: 'Closed',
} as const;
