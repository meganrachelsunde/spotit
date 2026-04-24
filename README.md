# spot it.

> Saw it on Pinterest. Saw it on TikTok. Saw it on a stranger at Target. Now find it.

A photo-to-product finder for your daughter. Upload a photo of an outfit or piece of clothing she saw, and the app uses Claude's vision API to analyze the garment (type, color, fabric, fit, aesthetic) and generate:

- A specific, shoppable search query
- Likely brands that make that style
- One-tap deep links to Google Shopping, Pinterest, Depop, and Poshmark

A **prettyunknown.** project. Clarity shouldn't be a luxury.

---

## What's in this folder

- `index.html` — the entire app. Single file. No build step. No npm install.
- `vercel.json` — clean URLs config.

That's it. Everything runs in the browser. Claude's API is called directly from the client.

---

## Deploy to Vercel (fastest path — ~2 min)

### Option A: Drag & drop (no git needed)

1. Go to https://vercel.com/new
2. Click **"Upload"** → drag the `spotit` folder in
3. Project name: `spotit` (or whatever she names it)
4. Framework preset: **Other** (it's a static site)
5. Deploy → done

Vercel gives you a `spotit-xxx.vercel.app` URL instantly.

### Option B: Git (if you want it in a repo)

```bash
cd spotit
git init
git add .
git commit -m "spot it — first ship"
# create a new repo on github.com/meganrachelsunde
git remote add origin https://github.com/meganrachelsunde/spotit.git
git push -u origin main
```

Then in Vercel: New Project → Import that repo → Deploy.

### Attaching it to prettyunknown.org as a subdomain

Once deployed:

1. In Vercel → the spotit project → **Settings** → **Domains**
2. Add: `spotit.prettyunknown.org` (or whatever she picks)
3. Vercel gives you a CNAME record. Go to Namecheap → prettyunknown.org → Advanced DNS → add the CNAME.
4. Done — usually propagates in a few minutes.

---

## The API key question (important)

This app calls Claude's API directly from the browser. **This means the API key would be exposed in the browser if you used a real key on a public site.**

For tonight's demo (just showing your daughter), it works as-is because the fetch call goes to `api.anthropic.com` with no key — which means it will only work **inside this Claude session preview**, not on the live deployed site.

To make it actually work on the deployed Vercel site, you have two options:

**Option 1 (recommended, ~10 min): Add a Vercel serverless function**

Create `/api/analyze.js` in the project:

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
```

Then in `index.html`, change the fetch URL from `https://api.anthropic.com/v1/messages` to `/api/analyze`.

In Vercel → Settings → Environment Variables: add `ANTHROPIC_API_KEY` with your key. Redeploy.

**Option 2 (tonight, if she just wants to show a friend):** Run it locally.

```bash
cd spotit
python3 -m http.server 8000
```

Then open `http://localhost:8000`. It will work in this Claude session only because it routes through the sandbox.

For a public demo, do Option 1 — it's fast and it's the same pattern you already used for Abort Mission and ClearDent.

---

## What's next (v2 ideas, for when she wants more)

- Save history of "spotted" items so she can browse past finds
- Share a result as a little card (screenshot + search links)
- "Find it on Amazon / Shein / Princess Polly" direct deep links per brand
- Reverse image search integration (Google Lens-style) if you ever want to add a paid image-search API

---

Built by Meg &amp; daughter. One night. ♥
