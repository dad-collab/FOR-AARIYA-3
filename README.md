# LOVE.exe 💌

A little surprise from Aman for his best friend Aariya.

> “A Little Surprise From Your Best Friend!”

## Phase 1 — what is built

- Full-screen landing: badge, “Hey Aariya! ❤️”, subtitle, warning line, animated envelope, **OPEN YOUR SURPRISE 💌** button.
- Envelope opens with a floating-heart animation and shows the letter, with **CHALO SHURU KARTE HAIN 😂**.
- Loading screen: “Setting up Aariya's special experience...” with animated hearts and a progress bar.
- Placeholder screen: “Something interesting is coming, Aariya! 👀” — ready for Phase 2.
- Progress indicator (Surprise → Letter → Coming soon) + Restart on every screen.
- Footer: “Designed with ❤️ by Aman — Specially made for Aariya — Best Friends Forever! 😂”

## Design

Soft blush pink, lavender, cream white, rose pink, light peach. Glassmorphism cards, soft moving gradient, floating hearts / bubbles / stars, subtle desktop cursor sparkles. No neon, no ZINX / VYBEX / Instagram copy.

## Run locally

Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Phase 2 — Aariya's Funny Challenge

- Challenge welcome: “Welcome to Aariya's Test! 😂” → **START MY TEST 😎**
- 7 funny questions, one at a time, with animated answer buttons, a progress bar and question number.
- NO button dodge: a NO answer dodges FOREVER on hover/touch/click with a random funny message, stays inside the visible screen, and can never be pressed — Aariya must press YES (or the other option). YES and other buttons work normally.
- Phase 3 — Compatibility Calculator: from the Phase 2 result, "CHALO AAGE DEKHTE HAIN" opens the Aman & Aariya compatibility check. Two name cards (AMAN ❤️ / AARIYA 💗), CALCULATE KARO runs an animated 0–100% counter with funny loading messages, then a random 60–100% score with a band message and 5 random animated stats (Friendship, Pagalpan Compatibility, Understanding, Masti, Nok-Jhok). "EK AUR BAAR CHECK KARO" recalculates with a new random score; "NEXT SURPRISE" goes to Phase 4.
- Phase 4 — A Secret Message From Aman: "Wait Aariya... Ek Last Baat Hai 👀" with a sealed envelope (clickable, opens like the Phase 1 envelope). "OPEN KARKE DEKHTI HU 💌" reveals Aman's letter with a smooth typing effect (tap the letter to skip to the full text). After the letter: "Acha bata Aariya, kaisa laga? 😂" with 3 reaction buttons, each showing its own funny Aman reply, then "Abhi khatam nahi hua madam! 👀" + "NEXT SURPRISE DEKHAO 🎁" → Phase 5.
- Phase 5 — Aariya's Crazy Challenge: "Challenge Level: IMPOSSIBLE 😈". Three playable mini-games: (1) Catch The Heart — a heart moves randomly in an arena (auto-moves + dodges on click), catch it 5 times (counter 0/5, funny catch/miss messages); (2) Find Aman — 4 mystery cards, one hides Aman, reshuffled among hidden cards after each wrong pick, max 5 attempts; (3) Don't Laugh — 3 funny messages one by one, HAHAHA button shows a funny reaction each time. Final "MISSION COMPLETED AARIYA! 🏆" with Hearts Caught 5/5, Correct Guess (attempts), Challenges Completed 3/3, and "FINAL SURPRISE UNLOCK KARO 🎁" → Phase 6.
- Phase 6 — The Unexpected Twist: fake ending "CONGRATULATIONS AARIYA! 🎉 / Bas madam, website khatam!" with "EXIT WEBSITE 👋" — clicking it does NOT close anything; instead a dark glitch animation ("WAIT... EK MINUTE! 👀" → "ITNI JALDI JAANE NAHI DENGE MADAM! 😂") leads to a funny fake error screen "LOVE.exe HAS STOPPED WORKING" with System Status (Aman.exe: Confused, Aariya.exe: Too Smart, Friendship.exe: Running, Bakchodi.exe: Unlimited). "FIX KARO 😂" triggers a confetti explosion and the final reveal "AREY AARIYA! 😂" (Aman's message + "From Aman ❤️"). Final buttons: "DOBARA SHURU KARO 🔄" restarts the whole site from Phase 1; "AMAN KO MESSAGE KARO 💬" opens a configurable link — `MESSAGE_LINK` in script.js (empty by default; the button shows a "not set yet" note instead of opening a made-up link; no phone number invented). Optional WebAudio sound blips with a 🔊/🔇 toggle (fully guarded, never breaks the site). A third button "EK LAST CHEEZ AUR 👀" leads to Phase 7.
- Phase 7 — The Final Surprise For Aariya (FINAL phase): grand welcome "WAIT AARIYA... LAST THING! ❤️" with confetti + floating hearts; "OPEN FINAL SURPRISE 🎁" reveals the personalized memory card ("FOR MY BEST FRIEND AARIYA ❤️" + Aman's full message); "CERTIFICATE DEKHO 🏆" opens the animated Official Certificate (AARIYA — "Successfully Tolerating Aman!", 4 special skills, Issued By AMAN, "BEST FRIEND FOREVER ❤️") with a confetti explosion and "THE END... OR MAYBE NOT? 😂". Final buttons: "START AGAIN 🔄" (full restart from Phase 1), "TAKE MY CERTIFICATE 📜" (downloads a real 1200×850 PNG certificate drawn on canvas — "Aariya-Certificate.png"), "ONE LAST MESSAGE 💬" (shows Aman's last message). No Phase 8.
- Background music: the user's provided theme song "Ishq Wala Love" (`theme-song.mp3`, 3.6 MB, ~3:45) plays softly on loop throughout the site at 13% volume with a ~3s fade-in. It starts on the user's first tap/keypress (browser autoplay rules), never restarts between screens, and a 🎵 toggle in the top bar mutes/unmutes it (preference saved in sessionStorage).
- After every answer: a funny reaction (answer-specific, sometimes plus a random one) + confetti, then the next question.
- Final screen: “Bas Aariya, bahut ho gaya! 😂” + Friendship Personality Report — Drama, Innocence, Attitude and Aman Ko Pareshan Karne Ki Ability, calculated from her answers (just for fun) — plus **CHALO AAGE DEKHTE HAIN 😂** (Phase 3 placeholder, not built yet).
- Answers are stored for the session (in memory + sessionStorage). Restart the challenge any time; the global Restart goes back to the landing page. Phase 1 is unchanged.

## Deploy (GitHub Pages)

Push this folder to a public GitHub repo, then enable **Settings → Pages → Deploy from a branch → main / (root)**.

## Files

- `index.html` — screens + content
- `style.css` — design system (keep this for future phases)
- `script.js` — screen flow, envelope, loading, floating effects
