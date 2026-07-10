type BetaWelcomeEmailLinks = {
  discordLink: string;
  rulesLink: string;
  websiteUrl: string;
  contactEmail: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  whatsappUrl: string;
};

const LOGO_TOP_URL = "https://comicsmithai.net/Comic_Top.png";
const LOGO_BOTTOM_URL = "https://comicsmithai.net/Comic_Bottom.png";

export function getBetaWelcomeEmailHtml(
  fullName: string,
  links: BetaWelcomeEmailLinks,
) {
  const {
    discordLink,
    rulesLink,
    websiteUrl,
    contactEmail,
    facebookUrl,
    instagramUrl,
    xUrl,
    whatsappUrl,
  } = links;

  const websiteDisplay = websiteUrl.replace(/^https?:\/\//, "");

  const p = (text: string) =>
    `<tr><td style="font-size: 14px; line-height: 24px; color: #111111; font-family: 'Inter', Arial, sans-serif; padding-bottom: 18px;">${text}</td></tr>`;

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to the ComicSmith Beta</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">

            <!-- Header -->
            <tr>
              <td>
                <img src="${LOGO_TOP_URL}"
                     width="600"
                     style="display: block; width: 100%; height: auto;"
                     alt="ComicSmith AI" />
              </td>
            </tr>

            <!-- Plain text content, no card / no border -->
            <tr>
              <td style="padding: 32px 40px 8px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                  ${p(`Subject: You're in. Welcome to the ComicSmith beta.`)}

                  ${p(`Hey ${fullName},`)}

                  ${p(`A while back you gave me your email so you could get in early on ComicSmith. Thank you for that, and thanks for your patience. It's time.`)}

                  ${p(`Quick reminder on what this is. ComicSmith started because I could not figure out what my own collection was worth. Now it can identify your books, read their condition, and keep the whole collection in one place. To get it right, I need a small crew I actually trust to break it with me before the rest of the world sees it. You made the list, and I'm glad you did.`)}

                  ${p(`Here's exactly where things stand, because I want to be straight with you. Today the app grades from the front and back covers, shot flat. That's what our model was trained on, and it's good at it. What it does not do yet is read the interior pages or the angled shots. Nobody has ever built a comic condition model that does, and that's the whole reason I need you. The angle and interior photos you take are how we build the next model, the one that finally sees the entire book. Every tool out there stops at a flat cover. I want to go all the way, and you're the one who gets to help me create the data that has never existed.`)}

                  ${p(`When you scan a book, the app walks you through the whole capture, so you never have to guess what to shoot. It starts with the front and back covers, flat and straight on, since that's what it reads to grade the book. Then it takes you further for the next model: a few angles on the cover to catch what hides in glare and along the spine, and the interior pages, the staples, and the centerfold once you open it up. Just follow the prompts and you'll have exactly what we need. Those extra angle and interior shots won't change your grade today, but they're the raw material for what's coming.`)}

                  ${p(`This part matters. Right now I want your damaged books, not your treasures. The beat up, low grade, reading copy stuff is gold to us, because it's covered in the very flaws the model needs to learn. A flawless slab teaches us almost nothing at this stage, so please do not crack one open or put a valuable key at risk on my account. Leave those right where they are. Grab the dollar bin beaters, the ones with tape and tears and spine roll, and open those up. The rougher the book, the more we get from it.`)}

                  ${p(`Now, how you get paid. After the app grades a book, go through it and mark any damage it missed. That's anything it skipped on the covers, plus everything on the interior and at the angles, since the model is not reading those yet. Two separate things happen, and they work differently:`)}

                  ${p(`1. You get your scan back. If the app missed even one defect on a book, that scan is on me, saved as a free scan credit for when we launch. It's one free scan per book, no matter how many defects you find on it. Upload about half your collection now and, as long as we miss something on each one, you'll bank a free scan for every book, which covers the rest of your collection later.`)}

                  ${p(`2. Every defect is a giveaway entry. Each individual defect you mark that we missed is one entry to win a Spawn #1, 9.6 Newsstand. This one is not capped. Ten misses on a book is ten entries. The more you catch, the better your odds.`)}

                  ${p(`The part I love is this. Even though today's model isn't looking at those interior pages, you still get everything I promised, because every defect you mark is what teaches the next model to see them. Your scan comes back, your entries stack up, and the next version gets built, all from you catching what we can't. That's the whole idea.`)}

                  ${p(`We're running the beta on Discord and I'd love to have you in there. Show off a book, tell me what broke, tell me what you wish it did. It's the fastest way to reach me directly, and probably the best part of the whole thing.`)}

                  ${p(`Join here: <a href="${discordLink}" target="_blank" style="color:#111111;">[Discord invite link]</a>`)}

                  ${p(`One bit of quick fine print. Before you get access, you'll agree to a short beta agreement. Nothing scary. In plain words: keep the unreleased stuff between us until we go public, the feedback you send helps me make this better, and you're okay with us using the photos you upload to sharpen our condition reads for everyone. That's really the whole of it. You're getting an early look, so I'm just asking you to keep it in the family for now.`)}

                  ${p(`I'll keep you posted as we roll new things out. This is going to change fast, and you'll see all of it first. If something feels off or you have an idea, tell me. The shape of this thing is going to come partly from you, and that's not a small deal to me.`)}

                  ${p(`Thanks for jumping in. Let's have some fun with it.`)}

                  ${p(`Jeff<br />Founder, ComicSmith`)}

                  ${p(`P.S. Just hit reply anytime. I read everything.`)}

                  ${p(`Giveaway open to eligible participants. No purchase necessary. Full official rules: <a href="${rulesLink}" target="_blank" style="color:#111111;">[link]</a>.`)}

                </table>
              </td>
            </tr>

            <!-- Footer with Background Image and Overlay Content -->
            <tr>
              <td style="padding-top: 12px">
                <table
                  width="600"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    background-image: url(&quot;${LOGO_BOTTOM_URL}&quot;);
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                  "
                >
                 <!-- Spacer to push content down into the black area -->
                  <tr>
                    <td height="70" style="font-size: 1px; line-height: 1px">&nbsp;</td>
                  </tr>

                  <!-- Two-column content block: unsubscribe (left, design-only text) + contact/social (right) -->
                  <tr>
                    <td>
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >
                        <tr>
                          <!-- Left column: Unsubscribe text (design only, not a real link yet) -->
                          <td
                            width="50%"
                            valign="bottom"
                            style="padding: 50px 20px 30px 60px"
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    font-size: 13px;
                                    line-height: 20px;
                                    color: #ffffff;
                                    font-family:
                                      &quot;Inter&quot;, Arial, sans-serif;
                                  "
                                >
                                  You are receiving this email as you signed
                                  up for our newsletters.
                                </td>
                              </tr>
                           
                            </table>
                          </td>

                          <!-- Right column: Website, Email, Follow Us On, Social icons - anchored to bottom -->
                           <td
                            width="50%"
                            valign="bottom"
                            style="padding: 0 40px 20px 70px"
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                              align="center"
                              style="margin: 0 auto"
                            >
                              <!-- Website -->
                              <tr>
                                <td align="center" style="padding-bottom: 12px">
                                  <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 8px; vertical-align: middle">
                                        <a href="${websiteUrl}" target="_blank">
                                          <img
                                            src="https://comicsmithai.net/globe.png"
                                            width="16"
                                            height="16"
                                            alt="Website"
                                            style="display: block"
                                          />
                                        </a>
                                      </td>
                                      <td style="vertical-align: middle">
                                        <a
                                          href="${websiteUrl}"
                                          target="_blank"
                                          style="
                                            color: #ffffff;
                                            font-size: 15px;
                                            font-weight: 200;
                                            font-family: &quot;Inter&quot;, Arial, sans-serif;
                                            text-decoration: none;
                                          "
                                        >
                                          ${websiteDisplay}
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Email -->
                              <tr>
                                <td align="center" style="padding-bottom: 12px">
                                  <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 8px; vertical-align: middle">
                                        <a href="mailto:${contactEmail}">
                                          <img
                                            src="https://comicsmithai.net/mail.png"
                                            width="16"
                                            height="16"
                                            alt="Email"
                                            style="display: block"
                                          />
                                        </a>
                                      </td>
                                      <td style="vertical-align: middle">
                                        <a
                                          href="mailto:${contactEmail}"
                                          style="
                                            color: #ffffff;
                                            font-size: 15px;
                                            font-weight: 200;
                                            font-family: &quot;Inter&quot;, Arial, sans-serif;
                                            text-decoration: none;
                                          "
                                        >
                                          ${contactEmail}
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Follow Us On -->
                              <tr>
                                <td align="center" style="padding-bottom: 8px">
                                  <span
                                    style="
                                      color: #ffffff;
                                      font-size: 13px;
                                      font-family: &quot;Inter&quot;, Arial, sans-serif;
                                    "
                                    >Follow Us On</span
                                  >
                                </td>
                              </tr>

                              <!-- Social icons -->
                              <tr>
                                <td align="center">
                                  <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding: 0 5px">
                                        <a
                                          href="${facebookUrl}"
                                          target="_blank"
                                          aria-label="Facebook"
                                        >
                                          <img
                                            src="https://comicsmithai.net/fb.png"
                                            width="20"
                                            height="20"
                                            alt="Facebook"
                                            style="display: block"
                                          />
                                        </a>
                                      </td>
                                      <td style="padding: 0 5px">
                                        <a
                                          href="${instagramUrl}"
                                          target="_blank"
                                          aria-label="Instagram"
                                        >
                                          <img
                                            src="https://comicsmithai.net/insta.png"
                                            width="20"
                                            height="20"
                                            alt="Instagram"
                                            style="display: block"
                                          />
                                        </a>
                                      </td>
                                      <td style="padding: 0 5px">
                                        <a
                                          href="${xUrl}"
                                          target="_blank"
                                          aria-label="X"
                                        >
                                          <img
                                            src="https://comicsmithai.net/x.png"
                                            width="20"
                                            height="20"
                                            alt="X"
                                            style="display: block"
                                          />
                                        </a>
                                      </td>
                                      <td style="padding: 0 5px">
                                        <a
                                          href="${whatsappUrl}"
                                          target="_blank"
                                          aria-label="Whatsapp"
                                        >
                                          <img
                                            src="https://comicsmithai.net/whatsapp.png"
                                            width="20"
                                            height="20"
                                            alt="YouTube"
                                            style="display: block"
                                          />
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td height="20" style="font-size: 1px; line-height: 1px">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
    </table>
  </body>
</html>
  `;
}
