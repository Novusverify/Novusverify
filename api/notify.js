const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY;
const BASE_ID = 'appR1m6YjF4I5hTQB';
const TABLE_NAME = 'Waitlist';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    // Log to Airtable
const airtableRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fields: {
      'Email': email,
      'Submitted At': new Date().toISOString(),
      'Source': 'novusverify.com'
    }
  })
});
const airtableData = await airtableRes.json();
console.log('Airtable response:', JSON.stringify(airtableData));

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
      subject: "You're on the list.",
      html: `<p style="font-family:monospace">Access forthcoming.<br><br>— NOVUS Verify</p>`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
