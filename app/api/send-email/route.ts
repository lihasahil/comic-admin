import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { getBetaWelcomeEmailHtml } from "@/lib/mail-template";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const EMAIL_LINKS = {
  discordLink: requireEnv("COMICSMITH_DISCORD_INVITE_URL"),
  rulesLink: requireEnv("COMICSMITH_GIVEAWAY_RULES_URL"),
  websiteUrl: requireEnv("COMICSMITH_WEBSITE_URL"),
  contactEmail: requireEnv("COMICSMITH_CONTACT_EMAIL"),
  facebookUrl: requireEnv("COMICSMITH_FACEBOOK_URL"),
  instagramUrl: requireEnv("COMICSMITH_INSTAGRAM_URL"),
  xUrl: requireEnv("COMICSMITH_X_URL"),
  whatsappUrl: requireEnv("COMICSMITH_WHATSAPP_URL"),
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, fullName } = body ?? {};

    if (!to || typeof to !== "string" || !EMAIL_REGEX.test(to)) {
      return NextResponse.json(
        { error: "A valid recipient email address is required." },
        { status: 400 },
      );
    }

    const html = getBetaWelcomeEmailHtml(
      typeof fullName === "string" && fullName.trim()
        ? fullName.trim()
        : "there",
      EMAIL_LINKS,
    );

    await sendMail({
      to,
      subject: "You're in. Welcome to the ComicSmith beta.",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send-email error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 },
    );
  }
}
