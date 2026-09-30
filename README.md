# dmk-games.com

Static portfolio site. No build step, no dependencies: plain HTML, CSS and JavaScript.

## Run locally
Open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and go to http://localhost:8000.

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages) and point `dmk-games.com` at it.
`index.html` must stay at the root of the site.

## Where things live
| To change | Edit |
|---|---|
| Colours, fonts, spacing | `css/tokens.css` |
| Projects (text, platforms, stack, links) | `js/data/projects.js` |
| Work history | `js/data/experience.js` |
| Skills | `js/data/skills.js` |
| Interface text (buttons, headings, intro) | `js/i18n.js`, and the English fallback text in `index.html` |
| Page layout | `index.html`, `css/sections.css`, `css/dialog.css` |
| Behaviour (theme, language, project window) | `js/app.js` |

Every text in the data files has an `en` and a `ru` version. Keep them in step.

## Add a project
1. Put screenshots in `assets/img/<slug>/1.webp`, `2.webp`, ... (about 1280px wide, WebP).
2. Optional video: `assets/video/<slug>.mp4` (H.264, `-movflags +faststart`).
3. Copy an object in `js/data/projects.js`, change `slug`, texts, `shots` (number of screenshots) and `aspect` (width / height of the media).

Web-ready video command:

    ffmpeg -i in.mp4 -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -crf 30 -preset medium -c:a aac -b:a 80k -movflags +faststart out.mp4

## Before publishing
- Replace `og.jpg` if you want a different social preview.
- Check the copy in `js/data/projects.js` for Hole Control, Castle Siege and Shoot 'Em Up. It follows what you told me and what is visible in the videos, nothing more.
- Add Upwork / Fiverr links to the contact list in `index.html` when you have them.
