/********************************************************************* 
Author: Sukanta Manna  
Purpose: Send webmail.
**********************************************************************/
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false; // Ensures this endpoint runs dynamically on the server

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const SMTP_USER = import.meta.env.SMTP_USER || process.env.SMTP_USER;
    const SMTP_PASS = import.meta.env.SMTP_PASS || process.env.SMTP_PASS;    
    
    // Configure your SMTP transporter using environment variables
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

    // Send email
    await transporter.sendMail({
      from: SMTP_USER,
      to: 'contact@gloneax.org',
      subject: subject ? `[App Contact] ${subject}` : 'New Inquiry from Contact Form',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: 'Message sent successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to send message. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};