// sendgridEmailService.ts
import sgMail from '@sendgrid/mail';
import config from '../config/config.js';

sgMail.setApiKey(config.EMAIL_API_KEY);

/**
 * Sends an email using SendGrid with optional HTML.
 *
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML body content
 * @param {string} [textContent] - Plain text fallback (optional)
 */
export async function sendEmail(to, subject, htmlContent, textContent = '') {
    const msg = {
        to,
        from: config.SENDER_EMAIL,
        subject,
        text: textContent || 'Please use an HTML-compatible email viewer.',
        html: htmlContent,
    };

    try {
        const response = await sgMail.send(msg);
        console.log('✅ Email sent:', response[0].statusCode);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending email:', error?.response?.body || error.message);
        return { success: false, error: error.message };
    }
}
