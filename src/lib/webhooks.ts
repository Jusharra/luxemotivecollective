import {
  MAKE_VIP_WEBHOOK,
  MAKE_BOOKING_WEBHOOK,
  MAKE_CONTACT_WEBHOOK,
  MAKE_MESSAGE_WEBHOOK,
} from '../config';

type WebhookType = 'vip' | 'booking' | 'contact' | 'message';

const WEBHOOK_MAP: Record<WebhookType, string> = {
  vip:     MAKE_VIP_WEBHOOK,
  booking: MAKE_BOOKING_WEBHOOK,
  contact: MAKE_CONTACT_WEBHOOK,
  message: MAKE_MESSAGE_WEBHOOK,
};

export async function postToWebhook(
  type: WebhookType,
  payload: Record<string, unknown>,
): Promise<boolean> {
  const url = WEBHOOK_MAP[type];

  if (!url) {
    // Dev mode: no webhook configured — log and return success so UI works
    console.warn(`[webhook:${type}] No URL configured in src/config.ts. Payload:`, payload);
    return true;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error(`[webhook:${type}] Request failed:`, err);
    return false;
  }
}
