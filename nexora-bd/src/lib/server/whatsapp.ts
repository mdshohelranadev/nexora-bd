import { toWhatsAppNumber } from './phone';

// WhatsApp Cloud API (Meta). Business-initiated messages must use an approved template.
// Create ONE template in Meta Business Manager, e.g. name "order_update", language "en",
// body with 3 variables: {{1}} order number, {{2}} message text, {{3}} tracking note.
// Env (Vercel): WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEMPLATE_NAME, WHATSAPP_TEMPLATE_LANG
export async function sendOrderWhatsApp(localPhone: string, params: [string, string, string]): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  if (!token || !phoneId || !template) return false; // not configured: skip silently

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toWhatsAppNumber(localPhone),
        type: 'template',
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
          components: [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text })) }],
        },
      }),
    });
    if (!res.ok) {
      console.error('WhatsApp send failed', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('WhatsApp send error', err);
    return false;
  }
}
