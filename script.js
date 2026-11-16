// LOVE.exe — Phase 1 + Phase 2. Plain JS, no dependencies, no reloads.
(function () {
  "use strict";

  var screens = {
    landing: document.getElementById("screen-landing"),
    letter: document.getElementById("screen-letter"),
    loading: document.getElementById("screen-loading"),
    coming: document.getElementById("screen-coming"),
    challenge: document.getElementById("screen-challenge"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
    compat: document.getElementById("screen-compat"),
    next: document.getElementById("screen-next"),
    phase5: document.getElementById("screen-phase5"),
    phase6: document.getElementById("screen-phase6"),
    phase7: document.getElementById("screen-phase7"),
  };
  var progressItems = Array.prototype.slice.call(document.querySelectorAll("#progress li"));
  var stepFor = { landing: 1, letter: 2, loading: 2, coming: 3, challenge: 4, quiz: 4, result: 4, compat: 4, next: 4, phase5: 4, phase6: 4, phase7: 4 };
  var loadingTimer = null;
  var compatTimer = null, compatMsgTimer = null, compatResultTimer = null;
  var secretTimer = null, secretDone = false;

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.toggle("active", k === name); });
    var step = stepFor[name] || 1;
    progressItems.forEach(function (li) {
      var n = Number(li.getAttribute("data-step"));
      li.classList.toggle("active", n === step);
      li.classList.toggle("done", n < step);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function burstHearts(container) {
    if (!container) return;
    container.innerHTML = "";
    ["💗", "💖", "❤️", "💕", "✨"].forEach(function (ch, i) {
      var s = document.createElement("span");
      s.textContent = ch;
      s.style.setProperty("--dx", ((i - 2) * 34) + "px");
      s.style.left = (50 + (i - 2) * 8) + "%";
      container.appendChild(s);
    });
  }

  function openLetter() {
    var env = document.getElementById("envelopeBtn");
    env.classList.add("open");
    burstHearts(document.getElementById("burst"));
    setTimeout(function () { show("letter"); }, 650);
  }

  function startLoading() {
    show("loading");
    var fill = document.getElementById("loadFill");
    var pct = document.getElementById("loadPct");
    var p = 0;
    clearInterval(loadingTimer);
    loadingTimer = setInterval(function () {
      p = Math.min(100, p + Math.floor(Math.random() * 14) + 6);
      fill.style.width = p + "%";
      pct.textContent = p + "%";
      if (p >= 100) { clearInterval(loadingTimer); setTimeout(function () { show("coming"); }, 350); }
    }, 220);
  }

  function restart() {
    clearInterval(loadingTimer);
    clearInterval(compatTimer);
    clearInterval(compatMsgTimer);
    clearTimeout(compatResultTimer);
    clearTimeout(quizTimer);
    clearInterval(secretTimer);
    resetSecret();
    resetCrazy();
    resetTwist();
    resetFinal();
    showCompatPanel("compatEntry");
    var fill = document.getElementById("loadFill");
    var pct = document.getElementById("loadPct");
    if (fill) fill.style.width = "0%";
    if (pct) pct.textContent = "0%";
    document.getElementById("envelopeBtn").classList.remove("open");
    quizIndex = 0; answers = [];
    show("landing");
  }

  /* ---------- Phase 2: Aariya's Funny Challenge ---------- */
  var QUESTIONS = [
    { q: "Aariya, sach bata... thodi pagal hai na? 😂", options: [
      { t: "Haan, thodi si 😂", r: "Dekha! Khud maan liya 😂", s: { drama: 12, innocence: -6 } },
      { t: "NO 🙄", r: "Aariya, itna jhoot? 😂", s: { attitude: 14, innocence: 6 } } ] },
    { q: "Do you Love me? 👀", options: [
      { t: "Yes ❤️", r: "Aman khush ho gaya ❤️", s: { innocence: 12, pareshan: -6 } },
      { t: "NO 🙄", r: "Itni nafrat bhi mat dikhao madam!", s: { attitude: 16, drama: 6 } } ] },
    { q: "Aman raja jaisa feel hota? 👑", options: [
      { t: "Yes ❤️", r: "Raja Aman, hajir ho! 👑", s: { innocence: 8, pareshan: -4 } },
      { t: "NO 😭", r: "Aman is reviewing your answer... 👀", s: { attitude: 10, drama: 8 } } ] },
    { q: "Agar Aman 2 din message na kare toh notice karegi?", options: [
      { t: "Haan, obviously 👀", r: "Madam, answer recorded successfully!", s: { innocence: 10, pareshan: -6 } },
      { t: "NO 😎", r: "Your attitude has been detected! 😎", s: { attitude: 14, pareshan: 8 } } ] },
    { q: "Roblox mein pitegi ya real life mein? 😂", options: [
      { t: "Snap par 👻", r: "Snap par bhi nahi bachogi! 👻", s: { drama: 12, attitude: 6 } },
      { t: "Roblox mein 🎮", r: "Roblox mein toh Aman hi jeetega! 🎮", s: { pareshan: 12, drama: 6 } } ] },
    { q: "Aman ki baaton par kabhi hasi aati bhi hai?", options: [
      { t: "Kabhi kabhi 🤣", r: "Kabhi kabhi hi sahi, hasi toh aati hai! 🤣", s: { innocence: 10, drama: 4 } },
      { t: "Bilkul nahi 😭", r: "Expected answer, not surprised! 🤣", s: { attitude: 12, pareshan: 6 } } ] },
    { q: "Last question... Aman achha dost hai na?", options: [
      { t: "Haan ❤️", r: "Correct answer! Best friends forever ❤️", s: { innocence: 12, pareshan: -6 } },
      { t: "NO 🙄", r: "Aariya, itna jhoot? 😂", s: { attitude: 16, drama: 6 } } ] },
  ];
  var DODGE_MESSAGES = [
    "Pakad ke dikhao 😂",
    "NO bhaag gaya! 🤣",
    "Itni nafrat bhi mat dikhao madam!",
    "Aman ne button ko bhi bhaga diya 😂",
    "Ab kya karogi? 👀",
  ];
  var RANDOM_REACTIONS = [
    "Aariya, itna jhoot? 😂",
    "Madam, answer recorded successfully!",
    "Aman is reviewing your answer... 👀",
    "Your attitude has been detected! 😎",
    "Expected answer, not surprised! 🤣",
    "Aariya's drama level is increasing!",
  ];
  var quizIndex = 0, answers = [], quizTimer = null, quizLocked = false;
  var dodgeCount = 0;

  function showDodgeMessage(text) {
    var reaction = document.getElementById("quizReaction");
    reaction.textContent = text;
    reaction.classList.add("show");
  }

  // NO dodges FOREVER — it can never be pressed, Aariya must press YES.
  function dodgeNo(btn) {
    dodgeCount++;
    // Dodge far enough that the cursor is no longer over the button, but
    // never outside the visible screen (viewport clamp, not the card —
    // a full-width button cannot move inside its own card).
    // NOTE: transform is absolute, not cumulative — measure the button's
    // layout position first (clear the old transform, same JS tick so no
    // flicker), otherwise the clamp uses the already-dodged rect and the
    // button can end up partly off-screen. The .3s dodge transition must
    // be off while measuring, or getBoundingClientRect() returns the
    // mid-animation position instead of the layout position.
    btn.style.animation = "none"; // entrance animation's fill would override the dodge transform
    btn.style.transition = "none";
    btn.style.transform = "";
    var rect = btn.getBoundingClientRect();
    var dx = (Math.random() < 0.5 ? -1 : 1) * (70 + Math.random() * 80);
    // Down only: NO is the lower option, moving up would cover the YES button above it.
    var dy = 45 + Math.random() * 55;
    var minX = 8 - rect.left;
    var maxX = window.innerWidth - 8 - rect.right;
    var minY = 8 - rect.top;
    var maxY = window.innerHeight - 8 - rect.bottom;
    dx = Math.max(minX, Math.min(maxX, dx));
    dy = Math.max(minY, Math.min(maxY, dy));
    if (maxX - minX < 20) dx = 0;
    if (maxY - minY < 20) dy = 0;
    btn.style.transition = ""; // restore the .3s dodge animation
    btn.style.transform = "translate(" + dx + "px," + dy + "px)";
    showDodgeMessage(DODGE_MESSAGES[Math.floor(Math.random() * DODGE_MESSAGES.length)]);
    return true;
  }

  function confetti() {
    var colors = ["#ff6b9d", "#a78bfa", "#ffd9b8", "#ff8fb8", "#c9b8ff"];
    for (var i = 0; i < 26; i++) {
      var c = document.createElement("span");
      c.className = "confetti";
      c.textContent = ["🎉", "💗", "✨", "⭐"][i % 4];
      c.style.left = (Math.random() * 96 + 2) + "%";
      c.style.fontSize = (Math.random() * 10 + 12) + "px";
      c.style.animationDuration = (Math.random() * 1.4 + 1.6) + "s";
      c.style.color = colors[i % colors.length];
      document.body.appendChild(c);
      (function (el) { setTimeout(function () { el.remove(); }, 3200); })(c);
    }
  }

  function renderQuestion() {
    quizLocked = false;
    dodgeCount = 0;
    var item = QUESTIONS[quizIndex];
    document.getElementById("quizCount").textContent = "Question " + (quizIndex + 1) + " of " + QUESTIONS.length;
    document.getElementById("quizFill").style.width = ((quizIndex) / QUESTIONS.length * 100) + "%";
    document.getElementById("quizQuestion").textContent = item.q;
    var box = document.getElementById("quizOptions");
    box.innerHTML = "";
    var reaction = document.getElementById("quizReaction");
    reaction.textContent = ""; reaction.classList.remove("show");
    item.options.forEach(function (opt, oi) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.textContent = opt.t;
      var isNo = opt.t.indexOf("NO") === 0;
      if (isNo) {
        b.classList.add("dodge-btn");
        b.addEventListener("mouseenter", function () { dodgeNo(b); });
        b.addEventListener("touchstart", function (e) { e.preventDefault(); dodgeNo(b); }, { passive: false });
      }
      b.addEventListener("click", function (e) {
        if (isNo) { e.preventDefault(); dodgeNo(b); return; }
        b.style.transform = "";
        answerQuestion(b, oi);
      });
      box.appendChild(b);
    });
  }

  function answerQuestion(btn, oi) {
    if (quizLocked) return;
    quizLocked = true;
    var item = QUESTIONS[quizIndex];
    var opt = item.options[oi];
    answers.push({ q: item.q, answer: opt.t, scores: opt.s });
    Array.prototype.forEach.call(document.querySelectorAll("#quizOptions .opt"), function (o) { o.disabled = true; });
    btn.classList.add("picked");
    confetti();
    var reaction = document.getElementById("quizReaction");
    var extra = Math.random() < 0.45 ? " " + RANDOM_REACTIONS[Math.floor(Math.random() * RANDOM_REACTIONS.length)] : "";
    reaction.textContent = opt.r + extra;
    reaction.classList.add("show");
    document.getElementById("quizFill").style.width = ((quizIndex + 1) / QUESTIONS.length * 100) + "%";
    clearTimeout(quizTimer);
    quizTimer = setTimeout(function () {
      quizIndex++;
      if (quizIndex < QUESTIONS.length) { renderQuestion(); }
      else { showResult(); }
    }, 1500);
  }

  function clamp(v) { return Math.max(18, Math.min(98, Math.round(v))); }
  function showResult() {
    var base = { drama: 42, innocence: 52, attitude: 46, pareshan: 44 };
    answers.forEach(function (a) {
      Object.keys(a.scores).forEach(function (k) { base[k] += a.scores[k]; });
    });
    var stats = [
      { label: "🎭 Drama Level", value: clamp(base.drama), note: base.drama > 60 ? "Full Bollywood!" : "Control mein hai" },
      { label: "😇 Innocence Level", value: clamp(base.innocence), note: base.innocence > 60 ? "Bilkul innocent!" : "Hmm, shak hai 😂" },
      { label: "😎 Attitude Level", value: clamp(base.attitude), note: base.attitude > 60 ? "Queen vibes 👑" : "Sweet madam" },
      { label: "😂 Aman Ko Pareshan Karne Ki Ability", value: clamp(base.pareshan), note: base.pareshan > 60 ? "Expert level!" : "Abhi seekh rahi ho" },
    ];
    var box = document.getElementById("resultStats");
    box.innerHTML = "";
    stats.forEach(function (s) {
      var row = document.createElement("div");
      row.className = "stat-row";
      row.innerHTML = '<label><span>' + s.label + '</span><b>' + s.value + '% · ' + s.note + '</b></label>' +
        '<div class="stat-bar"><div class="stat-fill" data-w="' + s.value + '"></div></div>';
      box.appendChild(row);
    });
    try { sessionStorage.setItem("love-exe-answers", JSON.stringify(answers.map(function (a) { return a.answer; }))); } catch (e) {}
    show("result");
    confetti();
    setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll(".stat-fill"), function (f) { f.style.width = f.getAttribute("data-w") + "%"; });
    }, 120);
  }

  function startChallenge() { quizIndex = 0; answers = []; clearTimeout(quizTimer); renderQuestion(); show("quiz"); }

  document.getElementById("challengeBtn").addEventListener("click", function () { show("challenge"); });
  document.getElementById("startTestBtn").addEventListener("click", startChallenge);
  document.getElementById("challengeBackBtn").addEventListener("click", function () { show("coming"); });
  document.getElementById("quizRestartBtn").addEventListener("click", startChallenge);
  document.getElementById("retakeBtn").addEventListener("click", startChallenge);
  document.getElementById("unlockBtn").addEventListener("click", function () { showCompatEntry(); });

  /* ---------- Phase 3: Aman & Aariya Compatibility Calculator ---------- */
  var CALC_MESSAGES = [
    "Aman ka data check ho raha hai...",
    "Aariya ki settings scan ho rahi hain...",
    "Dono ka pagalpan calculate ho raha hai...",
    "System confused hai 😂",
    "Final result ready!",
  ];
  function showCompatPanel(id) {
    ["compatEntry", "compatCalc", "compatResult"].forEach(function (p) {
      document.getElementById(p).classList.toggle("active", p === id);
    });
  }
  function showCompatEntry() { clearInterval(compatTimer); clearInterval(compatMsgTimer); showCompatPanel("compatEntry"); show("compat"); }
  function compatBand(score) {
    if (score === 100) return "ERROR! Itni compatibility kaise? System hang ho gaya! 🤣";
    if (score >= 91) return "System ko lagta hai tum dono kaafi special dost ho! ❤️";
    if (score >= 81) return "Ye friendship kuch zyada hi interesting hai! 👀";
    if (score >= 71) return "Achhi bonding hai, bas thodi nok-jhok extra hai!";
    return "Thodi understanding ki zarurat hai 😂";
  }
  function randStat() { return 55 + Math.floor(Math.random() * 45); } // 55–99
  function showCompatResult() {
    var score = 60 + Math.floor(Math.random() * 41); // 60–100, different every time
    document.getElementById("compatScore").textContent = score + "%";
    document.getElementById("compatBand").textContent = compatBand(score);
    var stats = [
      { label: "💗 Friendship Level", value: randStat() },
      { label: "😂 Pagalpan Compatibility", value: randStat() },
      { label: "🤝 Understanding Level", value: randStat() },
      { label: "🎉 Masti Percentage", value: randStat() },
      { label: "😤 Nok-Jhok Level", value: randStat() },
    ];
    var box = document.getElementById("compatStats");
    box.innerHTML = "";
    stats.forEach(function (s) {
      var row = document.createElement("div");
      row.className = "stat-row";
      row.innerHTML = '<label><span>' + s.label + '</span><b>' + s.value + '%</b></label>' +
        '<div class="stat-bar"><div class="stat-fill" data-w="' + s.value + '"></div></div>';
      box.appendChild(row);
    });
    try { sessionStorage.setItem("love-exe-compat", String(score)); } catch (e) {}
    showCompatPanel("compatResult");
    show("compat");
    confetti();
    setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll("#compatStats .stat-fill"), function (f) { f.style.width = f.getAttribute("data-w") + "%"; });
    }, 120);
  }
  function runCompatCalc() {
    clearInterval(compatTimer);
    clearInterval(compatMsgTimer);
    clearTimeout(compatResultTimer);
    showCompatPanel("compatCalc");
    show("compat");
    var pct = document.getElementById("compatPct");
    var fill = document.getElementById("compatFill");
    var msg = document.getElementById("compatMsg");
    var p = 0, mi = 0;
    pct.textContent = "0%";
    fill.style.width = "0%";
    msg.textContent = CALC_MESSAGES[0];
    compatMsgTimer = setInterval(function () {
      mi = Math.min(CALC_MESSAGES.length - 1, mi + 1);
      msg.textContent = CALC_MESSAGES[mi];
    }, 700);
    compatTimer = setInterval(function () {
      p = Math.min(100, p + 1 + Math.floor(Math.random() * 3));
      pct.textContent = p + "%";
      fill.style.width = p + "%";
      if (p >= 100) {
        clearInterval(compatTimer);
        clearInterval(compatMsgTimer);
        msg.textContent = CALC_MESSAGES[CALC_MESSAGES.length - 1];
        compatResultTimer = setTimeout(showCompatResult, 600);
      }
    }, 38);
  }
  document.getElementById("compatCalcBtn").addEventListener("click", runCompatCalc);
  document.getElementById("compatAgainBtn").addEventListener("click", runCompatCalc);
  document.getElementById("compatBackBtn").addEventListener("click", function () { show("result"); });
  document.getElementById("compatNextBtn").addEventListener("click", function () { show("next"); });

  /* ---------- Phase 4: A Secret Message From Aman ---------- */
  var SECRET_PARAS = [
    { t: "Achha Aariya, ek baat bolun? 😂" },
    { t: "Waise toh main tujhe roz pareshan karta rehta hu, kabhi faltu ki bakwaas, kabhi random messages aur kabhi bina matlab ki teasing." },
    { t: "Lekin sach mein, tu meri achhi dost hai." },
    { t: "Tere saath baat karke kabhi boring feel nahi hota. Kabhi hasi-mazaak, kabhi arguments aur kabhi ek dusre ki taang kheenchna... 😂" },
    { t: "Aur haan, zyada hawa mein mat udna. Itni tareef bhi nahi karunga!" },
    { t: "Bas aise hi rehna aur apni bakchodi continue rakhna." },
    { t: "From,", cls: "sig" },
    { t: "Tera Best Friend,", cls: "sig" },
    { t: "AMAN ❤️", cls: "sig" },
  ];
  function showSecretPanel(id) {
    ["secretIntro", "secretLetter"].forEach(function (p) {
      document.getElementById(p).classList.toggle("active", p === id);
    });
  }
  function resetSecret() {
    clearInterval(secretTimer);
    secretDone = false;
    var env = document.getElementById("secretEnvelopeBtn");
    if (env) env.classList.remove("open");
    document.getElementById("secretLetterBody").innerHTML = "";
    document.getElementById("secretReactions").hidden = true;
    document.getElementById("secretReaction").textContent = "";
    document.getElementById("secretReaction").classList.remove("show");
    document.getElementById("secretNext").hidden = true;
    document.getElementById("secretTapHint").style.display = "";
    showSecretPanel("secretIntro");
  }
  function renderSecretFull() {
    var body = document.getElementById("secretLetterBody");
    body.innerHTML = "";
    SECRET_PARAS.forEach(function (para) {
      var p = document.createElement("p");
      if (para.cls) p.className = para.cls;
      p.textContent = para.t;
      body.appendChild(p);
    });
  }
  function finishSecretLetter() {
    if (secretDone) return;
    secretDone = true;
    clearInterval(secretTimer);
    renderSecretFull();
    document.getElementById("secretTapHint").style.display = "none";
    document.getElementById("secretReactions").hidden = false;
  }
  function typeSecretLetter() {
    clearInterval(secretTimer);
    secretDone = false;
    var body = document.getElementById("secretLetterBody");
    body.innerHTML = "";
    document.getElementById("secretReactions").hidden = true;
    document.getElementById("secretReaction").textContent = "";
    document.getElementById("secretReaction").classList.remove("show");
    document.getElementById("secretNext").hidden = true;
    document.getElementById("secretTapHint").style.display = "";
    var pi = 0, ci = 0, pEl = null, caret = null;
    secretTimer = setInterval(function () {
      if (pi >= SECRET_PARAS.length) { finishSecretLetter(); return; }
      if (!pEl) {
        pEl = document.createElement("p");
        if (SECRET_PARAS[pi].cls) pEl.className = SECRET_PARAS[pi].cls;
        body.appendChild(pEl);
        caret = document.createElement("span");
        caret.className = "typing-caret";
        caret.textContent = "▍";
        pEl.appendChild(caret);
      }
      var text = SECRET_PARAS[pi].t;
      if (ci < text.length) {
        caret.before(document.createTextNode(text.charAt(ci)));
        ci++;
      } else {
        caret.remove();
        pEl = null; caret = null; pi++; ci = 0;
      }
    }, 14);
  }
  function openSecretLetter() {
    var env = document.getElementById("secretEnvelopeBtn");
    env.classList.add("open");
    setTimeout(function () {
      showSecretPanel("secretLetter");
      show("next");
      typeSecretLetter();
    }, 650);
  }
  document.getElementById("openSecretBtn").addEventListener("click", openSecretLetter);
  document.getElementById("secretEnvelopeBtn").addEventListener("click", openSecretLetter);
  document.getElementById("secretBackBtn").addEventListener("click", function () { showCompatPanel("compatResult"); show("compat"); });
  document.getElementById("secretLetterBody").addEventListener("click", finishSecretLetter);
  document.getElementById("secretReplayBtn").addEventListener("click", typeSecretLetter);
  Array.prototype.forEach.call(document.querySelectorAll("#secretReactions .opt"), function (b) {
    b.addEventListener("click", function () {
      var r = document.getElementById("secretReaction");
      r.textContent = b.getAttribute("data-reaction");
      r.classList.add("show");
      document.getElementById("secretNext").hidden = false;
      confetti();
    });
  });
  document.getElementById("secretNextBtn").addEventListener("click", function () { show("phase5"); });

  /* ---------- Phase 5: Aariya's Crazy Challenge ---------- */
  var heartsCaught = 0, guessAttempts = 0, laughIndex = 0;
  var heartMoveTimer = null, amanCard = null, game2Locked = false;
  var CATCH_MSGS = ["Wah madam! 👏", "Almost pakad liya!", "Wah madam! 👏", "Ek aur! Bas ek aur! 😂"];
  var MISS_MSGS = ["Arey miss ho gaya! 😂", "Thoda fast Aariya!", "Arey miss ho gaya! 😂", "Dil bhaag gaya, phir try karo! 😂"];
  var LAUGH_MSGS = [
    "Aman ka dimaag kabhi kabhi airplane mode pe rehta hai.",
    "Aariya ko tang karna Aman ka favourite hobby hai.",
    "Dono ki bakchodi ka koi end nahi.",
  ];
  var LAUGH_REACTIONS = [
    "Aman: Dekha, hasi aa hi gayi! 🤣",
    "Aman: Don't laugh challenge FAIL! 😂",
    "Aman: Ye toh hasne wala hi tha! 😂",
    "Aman: Bas bas, pet dukh jayega! 🤣",
  ];
  var DECOYS = ["🙄", "😂", "👻", "🤪"];
  function showCrazyPanel(id) {
    ["crazyIntro", "crazyGame1", "crazyGame2", "crazyGame3", "crazyResult"].forEach(function (p) {
      document.getElementById(p).classList.toggle("active", p === id);
    });
  }
  function resetCrazy() {
    clearInterval(heartMoveTimer);
    heartsCaught = 0; guessAttempts = 0; laughIndex = 0; amanCard = null;
    document.getElementById("heartCounter").textContent = "Hearts caught: 0/5";
    document.getElementById("heartMsg").textContent = "";
    document.getElementById("heartMsg").classList.remove("show");
    document.getElementById("guessAttempts").textContent = "Attempts: 0/5";
    document.getElementById("guessMsg").textContent = "";
    document.getElementById("guessMsg").classList.remove("show");
    document.getElementById("laughReaction").textContent = "";
    document.getElementById("laughReaction").classList.remove("show");
    showCrazyPanel("crazyIntro");
  }
  function moveHeart() {
    var arena = document.getElementById("heartArena");
    var heart = document.getElementById("catchHeart");
    var w = arena.clientWidth - 70, h = arena.clientHeight - 70;
    heart.style.left = Math.max(0, Math.floor(Math.random() * w)) + "px";
    heart.style.top = Math.max(0, Math.floor(Math.random() * h)) + "px";
  }
  function startGame1() {
    heartsCaught = 0;
    document.getElementById("heartCounter").textContent = "Hearts caught: 0/5";
    var msg = document.getElementById("heartMsg");
    msg.textContent = "Dil bhaag raha hai — pakdo use! ❤️";
    msg.classList.add("show");
    showCrazyPanel("crazyGame1");
    show("phase5");
    moveHeart();
    clearInterval(heartMoveTimer);
    heartMoveTimer = setInterval(moveHeart, 1100);
  }
  document.getElementById("catchHeart").addEventListener("click", function (e) {
    e.stopPropagation();
    heartsCaught++;
    document.getElementById("heartCounter").textContent = "Hearts caught: " + heartsCaught + "/5";
    var msg = document.getElementById("heartMsg");
    msg.textContent = CATCH_MSGS[Math.floor(Math.random() * CATCH_MSGS.length)];
    msg.classList.add("show");
    confetti();
    if (heartsCaught >= 5) {
      clearInterval(heartMoveTimer);
      msg.textContent = "Wah madam! 👏 5/5 hearts pakad liye!";
      setTimeout(startGame2, 1200);
    } else {
      moveHeart();
    }
  });
  document.getElementById("heartArena").addEventListener("click", function () {
    var msg = document.getElementById("heartMsg");
    msg.textContent = MISS_MSGS[Math.floor(Math.random() * MISS_MSGS.length)];
    msg.classList.add("show");
  });
  function shuffleAman() {
    var hidden = Array.prototype.filter.call(document.querySelectorAll("#mysteryGrid .mystery-card"), function (c) {
      return !c.disabled;
    });
    amanCard = hidden[Math.floor(Math.random() * hidden.length)];
  }
  function startGame2() {
    guessAttempts = 0;
    game2Locked = false;
    document.getElementById("guessAttempts").textContent = "Attempts: 0/5";
    var msg = document.getElementById("guessMsg");
    msg.textContent = "";
    msg.classList.remove("show");
    var grid = document.getElementById("mysteryGrid");
    grid.innerHTML = "";
    for (var i = 0; i < 4; i++) {
      (function (i) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "mystery-card";
        b.innerHTML = "?<span class='mystery-sub'>Card " + (i + 1) + "</span>";
        b.addEventListener("click", function () { pickCard(b); });
        grid.appendChild(b);
      })(i);
    }
    shuffleAman();
    showCrazyPanel("crazyGame2");
    show("phase5");
  }
  function pickCard(card) {
    if (card.disabled || game2Locked) return;
    guessAttempts++;
    document.getElementById("guessAttempts").textContent = "Attempts: " + guessAttempts + "/5";
    var msg = document.getElementById("guessMsg");
    card.disabled = true;
    if (card === amanCard) {
      game2Locked = true;
      card.classList.add("revealed-aman");
      card.innerHTML = "😎<span class='mystery-sub'>AMAN MIL GAYA!</span>";
      msg.textContent = "Finally! Aman mil gaya 😂";
      msg.classList.add("show");
      confetti();
      setTimeout(startGame3, 1400);
    } else {
      card.classList.add("revealed-wrong");
      card.innerHTML = DECOYS[Math.floor(Math.random() * DECOYS.length)] + "<span class='mystery-sub'>Yahan nahi!</span>";
      msg.textContent = "Galat jagah dhoondh rahi ho madam! 🤣";
      msg.classList.add("show");
      shuffleAman(); // Aman hides somewhere else among the remaining cards
    }
  }
  function startGame3() {
    laughIndex = 0;
    document.getElementById("laughMsg").textContent = LAUGH_MSGS[0];
    var r = document.getElementById("laughReaction");
    r.textContent = "";
    r.classList.remove("show");
    showCrazyPanel("crazyGame3");
    show("phase5");
  }
  document.getElementById("laughBtn").addEventListener("click", function () {
    if (laughIndex >= LAUGH_MSGS.length) return;
    var r = document.getElementById("laughReaction");
    r.textContent = LAUGH_REACTIONS[Math.floor(Math.random() * LAUGH_REACTIONS.length)];
    r.classList.add("show");
    confetti();
    laughIndex++;
    if (laughIndex >= LAUGH_MSGS.length) {
      setTimeout(showCrazyResult, 1200);
    } else {
      setTimeout(function () {
        document.getElementById("laughMsg").textContent = LAUGH_MSGS[laughIndex];
        r.textContent = "";
        r.classList.remove("show");
      }, 1200);
    }
  });
  function showCrazyResult() {
    var box = document.getElementById("crazyStats");
    box.innerHTML = "";
    [
      { label: "❤️ Hearts Caught", value: "5/5" },
      { label: "😎 Correct Guess", value: "Aman " + guessAttempts + (guessAttempts === 1 ? " attempt" : " attempts") + " mein mil gaya 😂" },
      { label: "🏆 Challenges Completed", value: "3/3" },
    ].forEach(function (s) {
      var row = document.createElement("div");
      row.className = "stat-row";
      row.innerHTML = '<label><span>' + s.label + '</span><b>' + s.value + '</b></label>';
      box.appendChild(row);
    });
    showCrazyPanel("crazyResult");
    show("phase5");
    confetti();
  }
  document.getElementById("crazyStartBtn").addEventListener("click", startGame1);
  document.getElementById("crazyBackBtn").addEventListener("click", function () { showSecretPanel("secretLetter"); show("next"); });
  document.getElementById("crazyFinalBtn").addEventListener("click", function () { show("phase6"); });
  document.getElementById("crazyReplayBtn").addEventListener("click", startGame1);

  /* ---------- Phase 6: The Unexpected Twist ---------- */
  // MESSAGE LINK — Aman sets this to his real chat/profile link when he wants
  // the "AMAN KO MESSAGE KARO" button to open somewhere (e.g. WhatsApp/Instagram).
  // Leave empty ("") until then: the button shows a friendly "not set yet" note
  // instead of opening a made-up link. Never invent a phone number here.
  var MESSAGE_LINK = "";
  var soundOn = true, audioCtx = null, twistTimer = null;
  function playTone(freq, dur, delay) {
    if (!soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var t = audioCtx.currentTime + (delay || 0);
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + dur);
    } catch (e) { /* sound is optional — never break the site for it */ }
  }
  function showTwistPanel(id) {
    ["twistEnd", "twistGlitch", "twistError", "twistReveal"].forEach(function (p) {
      document.getElementById(p).classList.toggle("active", p === id);
    });
  }
  function resetTwist() {
    clearTimeout(twistTimer);
    document.getElementById("twistStay").hidden = true;
    document.getElementById("twistFill").style.width = "0%";
    document.getElementById("msgHint").hidden = true;
    showTwistPanel("twistEnd");
  }
  function startTwist() {
    showTwistPanel("twistGlitch");
    show("phase6");
    playTone(180, 0.25, 0); playTone(120, 0.35, 0.22);
    var fill = document.getElementById("twistFill");
    fill.style.width = "0%";
    var p = 0;
    var grow = setInterval(function () {
      p = Math.min(100, p + 8);
      fill.style.width = p + "%";
      if (p >= 100) clearInterval(grow);
    }, 120);
    twistTimer = setTimeout(function () {
      document.getElementById("twistStay").hidden = false;
      twistTimer = setTimeout(function () {
        showTwistPanel("twistError");
        show("phase6");
        playTone(320, 0.2, 0); playTone(200, 0.3, 0.18);
      }, 1400);
    }, 1400);
  }
  document.getElementById("exitBtn").addEventListener("click", startTwist);
  document.getElementById("twistBackBtn").addEventListener("click", function () { showCrazyPanel("crazyResult"); show("phase5"); });
  document.getElementById("soundToggleBtn").addEventListener("click", function () {
    soundOn = !soundOn;
    this.textContent = soundOn ? "🔊 Sound: On" : "🔇 Sound: Off";
    if (soundOn) playTone(660, 0.15, 0);
  });
  document.getElementById("fixBtn").addEventListener("click", function () {
    showTwistPanel("twistReveal");
    show("phase6");
    confetti();
    setTimeout(confetti, 350);
    setTimeout(confetti, 700);
    playTone(523, 0.18, 0); playTone(659, 0.18, 0.15); playTone(784, 0.3, 0.3);
  });
  document.getElementById("againBtn").addEventListener("click", restart);
  document.getElementById("msgBtn").addEventListener("click", function () {
    if (MESSAGE_LINK) {
      window.open(MESSAGE_LINK, "_blank");
    } else {
      document.getElementById("msgHint").hidden = false;
    }
  });

  /* ---------- Phase 7: The Final Surprise For Aariya ---------- */
  function showFinalPanel(id) {
    ["finalWelcome", "finalCard", "finalCert"].forEach(function (p) {
      document.getElementById(p).classList.toggle("active", p === id);
    });
  }
  function resetFinal() {
    document.getElementById("lastMsgText").hidden = true;
    showFinalPanel("finalWelcome");
  }
  function drawCertificate() {
    var c = document.createElement("canvas");
    c.width = 1200; c.height = 850;
    var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 1200, 850);
    g.addColorStop(0, "#ffe3ef"); g.addColorStop(0.5, "#f3e8ff"); g.addColorStop(1, "#fff3e2");
    x.fillStyle = g; x.fillRect(0, 0, 1200, 850);
    x.strokeStyle = "#e84393"; x.lineWidth = 6; x.strokeRect(24, 24, 1152, 802);
    x.strokeStyle = "#8b7cf6"; x.lineWidth = 2; x.strokeRect(40, 40, 1120, 770);
    x.fillStyle = "#ff6b9d"; x.font = "40px Georgia, serif";
    x.fillText("♥", 70, 95); x.fillText("♥", 1090, 95); x.fillText("♥", 70, 800); x.fillText("♥", 1090, 800);
    x.textAlign = "center";
    x.fillStyle = "#e84393"; x.font = "bold 54px Georgia, serif";
    x.fillText("OFFICIAL CERTIFICATE", 600, 150);
    x.fillStyle = "#6d5566"; x.font = "italic 28px Georgia, serif";
    x.fillText("This Certificate Is Awarded To", 600, 205);
    x.fillStyle = "#e84393"; x.font = "bold 96px Georgia, serif";
    x.fillText("AARIYA", 600, 310);
    x.strokeStyle = "#e84393"; x.lineWidth = 2;
    x.beginPath(); x.moveTo(400, 340); x.lineTo(800, 340); x.stroke();
    x.fillStyle = "#4a3340"; x.font = "bold 34px Georgia, serif";
    x.fillText("Successfully Tolerating Aman!", 600, 395);
    x.fillStyle = "#8b7cf6"; x.font = "bold 24px Georgia, serif";
    x.fillText("SPECIAL SKILLS", 600, 455);
    x.fillStyle = "#4a3340"; x.font = "26px Georgia, serif";
    x.fillText("Unlimited Bakchodi  •  Professional Drama", 600, 495);
    x.fillText("Friendship Management  •  Aman Ko Jhelne Ki Special Ability", 600, 535);
    x.fillStyle = "#4a3340"; x.font = "28px Georgia, serif";
    x.fillText("Issued By: AMAN", 600, 615);
    x.fillStyle = "#e84393"; x.font = "bold 32px Georgia, serif";
    x.fillText("♥  BEST FRIEND FOREVER  ♥", 600, 685);
    x.fillStyle = "#8a6d80"; x.font = "italic 22px Georgia, serif";
    x.fillText("LOVE.exe — A Little Surprise From Your Best Friend!", 600, 760);
    return c;
  }
  document.getElementById("toPhase7Btn").addEventListener("click", function () {
    showFinalPanel("finalWelcome");
    show("phase7");
    confetti();
    setTimeout(confetti, 400);
    playTone(523, 0.18, 0); playTone(659, 0.18, 0.15); playTone(784, 0.3, 0.3);
  });
  document.getElementById("finalBackBtn").addEventListener("click", function () { showTwistPanel("twistReveal"); show("phase6"); });
  document.getElementById("openFinalBtn").addEventListener("click", function () {
    showFinalPanel("finalCard");
    show("phase7");
    confetti();
  });
  document.getElementById("showCertBtn").addEventListener("click", function () {
    showFinalPanel("finalCert");
    show("phase7");
    confetti();
    setTimeout(confetti, 350);
    setTimeout(confetti, 700);
    playTone(523, 0.18, 0); playTone(659, 0.18, 0.15); playTone(784, 0.18, 0.3); playTone(1047, 0.35, 0.45);
  });
  document.getElementById("finalAgainBtn").addEventListener("click", restart);
  document.getElementById("lastMsgBtn").addEventListener("click", function () {
    document.getElementById("lastMsgText").hidden = false;
  });
  document.getElementById("downloadCertBtn").addEventListener("click", function () {
    try {
      var canvas = drawCertificate();
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "Aariya-Certificate.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      }, "image/png");
    } catch (e) { /* download failed — the on-screen certificate is still there */ }
  });

  document.getElementById("openBtn").addEventListener("click", openLetter);
  document.getElementById("envelopeBtn").addEventListener("click", openLetter);
  document.getElementById("startBtn").addEventListener("click", startLoading);
  document.getElementById("backBtn").addEventListener("click", restart);
  document.getElementById("restartBtn").addEventListener("click", restart);
  document.getElementById("replayBtn").addEventListener("click", restart);
  document.getElementById("readAgainBtn").addEventListener("click", function () { show("letter"); });

  // Floating hearts / bubbles / stars — lightweight, capped, paused when hidden.
  var layer = document.getElementById("floatLayer");
  var chars = ["💗", "💖", "✨", "🫧", "💕", "⭐"];
  function spawnFloat() {
    if (document.hidden || !layer) return;
    if (layer.children.length > 14) return;
    var el = document.createElement("span");
    el.className = "float-item";
    el.textContent = chars[Math.floor(Math.random() * chars.length)];
    el.style.left = (Math.random() * 92 + 2) + "%";
    el.style.fontSize = (Math.random() * 14 + 14) + "px";
    el.style.animationDuration = (Math.random() * 7 + 9) + "s";
    layer.appendChild(el);
    setTimeout(function () { el.remove(); }, 17000);
  }
  for (var i = 0; i < 8; i++) setTimeout(spawnFloat, i * 350);
  setInterval(spawnFloat, 1800);

  // Subtle cursor sparkles — desktop pointers only, throttled.
  var sparkLayer = document.getElementById("cursorSparkles");
  var lastSpark = 0;
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("pointermove", function (e) {
      var now = Date.now();
      if (now - lastSpark < 90) return;
      lastSpark = now;
      var s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = Math.random() > 0.5 ? "✨" : "💗";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      sparkLayer.appendChild(s);
      setTimeout(function () { s.remove(); }, 850);
    });
  }
})();
