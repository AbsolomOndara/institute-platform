import "dotenv/config"; import argon2 from "argon2"; import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const courses = [
  ["Certificate in Cyber Security & Digital Forensics", "Develop practical foundations in cyber defence, investigations and responsible digital evidence handling."],
  ["Certificate in Ethical Hacking & Penetration Testing", "Learn structured security testing, vulnerability assessment and professional reporting in controlled environments."],
  ["Certificate in Digital Forensics & Incident Response", "Build the skills to identify, preserve and analyse digital evidence while responding to security incidents."],
  ["Certificate in Kali Linux", "Use Kali Linux tools safely for security assessment, reconnaissance and authorised testing."],
  ["Certificate in Application Security", "Understand secure software practices and how to identify common application vulnerabilities."],
  ["Certificate in Network Security & Administration", "Learn to configure, monitor and defend modern network infrastructure."],
  ["Certificate in Cybersecurity & Law", "Explore cybercrime, digital evidence, privacy and the legal responsibilities surrounding digital investigations."],
];
async function main() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD");
  const passwordHash = await argon2.hash(process.env.ADMIN_PASSWORD);
  await prisma.user.upsert({ where: { email: process.env.ADMIN_EMAIL.toLowerCase() }, update: {}, create: { name: process.env.ADMIN_NAME || "Administrator", email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash, role: "ADMIN" } });
  if (await prisma.course.count() === 0) {
    for (const [title, description] of courses) await prisma.course.create({ data: { title, description, status: "PUBLISHED", deliveryMode: "Online and in-person", level: "Professional certificate", featured: title.includes("Cyber Security & Digital Forensics") } });
  }
  console.log("Admin account and ICSF course catalogue are ready.");
}
main().finally(() => prisma.$disconnect());
