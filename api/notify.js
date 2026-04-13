import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    // Notify you
    await resend.emails.send({
      from: 'NOVUS <onboarding@resend.dev>',
      to: 'jovan@novusverify.com',
      subject: 'New NOVUS Waitlist Signup',
      html: `<p>New signup: <strong>${email}</strong></p>`
    });

    // Confirm to them
    await resend.emails.send({
      from: 'NOVUS <onboarding@resend.dev>',
      to: email,
      subject: 'You\'re on the list.',
      html: `<p style="font-family:monospace">Access forthcoming.<br><br>— NOVUS Verify</p>`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
