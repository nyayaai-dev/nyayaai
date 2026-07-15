/**
 * NyayaAI — FAQ content shown on faq.html.
 */
const FAQS = [
  {
    q: "Is NyayaAI actually free?",
    a: "Yes — asking a question costs nothing and there's no sign-up wall. We built this precisely because a lot of people avoid asking a lawyer a \"simple\" question purely because of the cost or the awkwardness of booking a consultation for something small."
  },
  {
    q: "Can I actually rely on this in court, or when signing something important?",
    a: "Treat NyayaAI as a strong starting point, not a final word. It cites the specific Act or Article so you (or a lawyer) can verify it, but for anything with real money, liberty, or a signature on the line — a contract, a court filing, a police matter — get a licensed advocate to look at your specific facts before you act. We say this not as a legal disclaimer reflex, but because we've built the system to know its own limits."
  },
  {
    q: "Is a real human ever involved, or is it AI the whole way through?",
    a: "The conversation itself is 100% AI — no call centre, no human reviewing your chat before you see a reply. That said, real people (a small team of engineers and legal researchers) build and maintain the underlying knowledge base, check it against the official Gazette text, and update it as laws change. So: AI-operated, human-maintained."
  },
  {
    q: "How do you keep the legal information current?",
    a: "India's laws have changed a lot in the last two years — new criminal codes, four Labour Codes, a new Income Tax Act, a data-protection law. Every practice-area page shows a \"status as of\" date, and our Current Affairs feed tracks Parliament and Supreme Court developments as they happen. Nothing here is static — but nothing beats checking the primary source for anything time-sensitive either."
  },
  {
    q: "Is my conversation private?",
    a: "We don't ask for your name, phone number, or any identifying details to use the chat. Don't type in sensitive identifiers like your Aadhaar or PAN number, passwords, or financial account numbers — there's just no reason the chat needs them, and we'd rather you didn't hand them over. Full details are in our Privacy Policy."
  },
  {
    q: "Can NyayaAI file a case, send a notice, or represent me somewhere?",
    a: "No. It can tell you what BNSS §173 says about filing an FIR, or walk you through the steps to send a legal notice — but it can't file the FIR, sign the notice, or stand up in a courtroom for you. Those need a human — either you, or a licensed advocate you engage separately."
  },
  {
    q: "What happens if the AI gets something wrong?",
    a: "It can happen — laws change, and AI systems (including this one, and including courts' own AI tools, per a Supreme Court ruling in July 2026 on AI-hallucinated case law) can get details wrong. That's exactly why every answer cites its source: check it. If you spot an error, please tell us — see the Contact page — we'd genuinely rather know."
  },
  {
    q: "Which languages does NyayaAI support?",
    a: "Right now, English. Given how much of India doesn't primarily operate in English, that's a real gap — Hindi and other regional-language support is something we want to add, not a \"maybe someday\" line."
  },
  {
    q: "How is this different from just asking a general AI chatbot?",
    a: "A general AI chatbot wasn't built around a maintained, cited knowledge base of current Indian statutes — it's improvising from whatever it was trained on, which can be outdated or India-agnostic. NyayaAI is scoped specifically to Indian law, structured around real Acts and Sections, and kept aligned with current affairs — narrower, but more grounded for this particular purpose."
  }
];

if (typeof module !== "undefined") module.exports = FAQS;
