# NyayaAI — AI Legal Consultation Platform (India)

A fully static (no build step) website: an AI-operated legal information platform covering 12
practice areas of Indian law (Constitutional, Criminal (BNS/BNSS/BSA), Civil, Corporate, Family,
Property, Labour, Tax, Cyber, Consumer, Intellectual Property, Banking & Finance), plus a curated
Current Affairs feed, practical step-by-step guides, site-wide search, and an FAQ/Contact section.

Design: monochrome (black/white/gray) throughout — see `css/style.css`.

## Running it locally right now

No installation needed — it's plain HTML/CSS/JS. Just open `index.html` in a browser, or serve the
folder with any static server, e.g.:

```
npx serve .
```

(or Python: `python -m http.server 8000`)

## Project structure

```
index.html            Landing page
chat.html              AI consultation chat UI
laws.html               Practice-area hub (grid of all 12 categories)
laws/<category>.html    12 thin page shells — all content is rendered by js/law-page.js from laws-data.js
news.html               Current-affairs feed
insights.html            Practical step-by-step guides (file an FIR, register a trademark, etc.)
faq.html                 Honest, conversational FAQ (accordion)
contact.html             Feedback form (mailto-based — no backend yet)
about.html               How NyayaAI works / limitations / who maintains it
disclaimer.html          Legal Disclaimer (what NyayaAI is/isn't, limits of AI-generated legal info)
privacy.html             Privacy Policy (DPDP Act, 2023 aligned — data collected, rights, grievance contact)
terms.html               Terms of Use (acceptable use, IP, liability, governing law, grievance officer)

css/style.css            Shared design system
js/main.js               Nav toggle, active-link highlighting, site-wide search, entry disclaimer modal,
                          and JS-injected Insights/FAQ/Contact links (so no page has to hand-author them)
js/chat.js                Chat engine (demo-mode retrieval + live-backend hook)
js/law-page.js            Renders a category page from laws-data.js
js/insights-page.js       Renders insights.html from insights-data.js
js/data/laws-data.js      The legal knowledge base (edit this to add/update law content)
js/data/news-data.js      Seeded current-affairs items + NEWS_CONFIG for a future live feed
js/data/insights-data.js  Step-by-step practical guides

server/chat-proxy-example.js   Reference Express backend to proxy chat to an LLM (not run automatically)
```

## Notable behavior worth knowing about

- **Entry disclaimer modal**: shown once per browser (localStorage-gated) — the standard convention
  on Indian legal/advocate websites, given Bar Council of India restrictions on solicitation.
- **Site-wide search**: a 🔍 button injected into the nav on every page (press `/` to open it too),
  searching across practice areas, provisions, news, and guides — entirely client-side, no backend.
- **Insights/FAQ/Contact links are not hand-written into every page's HTML.** `js/main.js` injects
  them into the nav and footer at runtime. This means adding a 13th practice area or a new top-level
  page mostly just requires adding data — not editing 20 HTML files by hand.
- **Contact form** builds a `mailto:` link (to a placeholder `hello@nyayaai.example` address — swap
  this for a real inbox in `contact.html`) rather than pretending to submit to a backend that doesn't
  exist yet.
- **Placeholder email addresses to replace before going live**: `hello@nyayaai.example` (contact.html),
  `privacy@nyayaai.example` (privacy.html — the DPDP Act "Grievance Officer / Data Protection" contact),
  and `grievance@nyayaai.example` (terms.html — the IT Rules, 2021 grievance officer contact). All three
  use the reserved, non-resolving `.example` domain deliberately — swap them for real inboxes you
  actually monitor before this goes live, since the IT Rules require a working, published channel.

## The AI chat currently runs in "demo mode"

`js/chat.js` has an empty `CHAT_CONFIG.apiEndpoint`, so it answers using a local keyword-matching
engine over `js/data/laws-data.js` — no external API calls, no cost, works offline. This is enough to
demo the full UX, but it is **not a general-purpose LLM**: it can only surface what's in the seeded
knowledge base.

### To wire up a real AI (recommended: Anthropic Claude)

1. Install [Node.js](https://nodejs.org) (LTS) — not currently installed on this machine.
2. `cd server && npm init -y && npm install express cors @anthropic-ai/sdk dotenv`
3. Create `server/.env` with `ANTHROPIC_API_KEY=sk-ant-...` (get a key at console.anthropic.com — keep
   it server-side, never put it in frontend JS).
4. `node server/chat-proxy-example.js` — starts a proxy on `http://localhost:8787`.
5. In `js/chat.js`, set `CHAT_CONFIG.apiEndpoint = "http://localhost:8787/api/chat"`.
6. For production, deploy the proxy (Vercel/Netlify function, Render, Railway, etc.) and point
   `apiEndpoint` at the deployed URL instead of localhost.

The frontend already POSTs `{ system, messages }` and expects `{ reply }` back — any backend that
speaks that contract works, so you can swap in OpenAI, a self-hosted model, or a RAG pipeline instead.

## Making Current Affairs live

`js/data/news-data.js` currently holds ~9 real, sourced items curated as of 15 July 2026. To make it
live:

1. Get an API key from a news source — e.g. [NewsAPI.org](https://newsapi.org), or scrape/subscribe to
   [PRS Legislative Research](https://prsindia.org) RSS for bill tracking, or [PIB](https://pib.gov.in)
   press releases for government/ministry announcements.
2. Build a small backend route (similar pattern to the chat proxy) that fetches and normalises articles
   into the same shape as items in `NEWS_DB` (`id, date, category, tag, title, summary, source, url,
   lawArea`).
3. Set `NEWS_CONFIG.liveFeedEndpoint` in `js/data/news-data.js`, and update `news.html`'s script to
   `fetch()` that endpoint and merge/replace the seeded array.

## Expanding the legal knowledge base

Everything in `laws/*.html` is a 10-line shell — all real content (acts, sections, articles, current
status) lives in `js/data/laws-data.js` as one object per category. To add a new provision, amendment,
or an entirely new practice area (e.g. Environmental Law, IP Law, Banking Law), add an entry to that
file; the category page, chat retrieval engine, and homepage grid all pick it up automatically. To add
a new category page shell, copy any existing `laws/*.html` file and change only the
`const CATEGORY_ID = "...")` line to match the new `id` in `laws-data.js`.

## Important: this is legal information, not legal advice

See [`disclaimer.html`](disclaimer.html). Keep the topbar disclaimer banner and the in-chat disclaimer
line intact on any deployment — this is both an ethical requirement and reduces legal risk to whoever
operates the site. Courts (including the Indian Supreme Court, July 2026) have begun explicitly warning
against AI-hallucinated case citations — treat demo-mode and even live-LLM answers as a research
starting point requiring verification against the official bare act/judgment text, not a final answer.
