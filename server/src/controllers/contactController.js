import { prisma } from "../config/prisma.js";
export async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: "Name, email and message are required." });
    await prisma.contactMessage.create({ data: { name, email: email.toLowerCase(), phone: phone || null, subject: subject || null, message } });
    res.status(201).json({ message: "Thank you. The admissions team will respond to your enquiry." });
  } catch (error) { next(error); }
}
