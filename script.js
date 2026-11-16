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
    next: document.getElementById("screen-next"),
  };
  var progressItems = Array.prototype.slice.call(document.querySelectorAll("#progress li"));
  var stepFor = { landing: 1, letter: 2, loading: 2, coming: 3, challenge: 4, quiz: 4, result: 4, next: 4 };
  var loadingTimer = null;

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
    clearTimeout(quizTimer);
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
    { q: "Aariya, are you always innocent?", options: [
      { t: "Yes, 100% 😇", r: "Aariya, itna jhoot? 😂", s: { innocence: 18, attitude: -6 } },
      { t: "Innocent? Me? 😂", r: "At least honest to ho, madam! 😂", s: { innocence: -8, attitude: 12 } } ] },
    { q: "Who is more intelligent?", options: [
      { t: "Obviously Me 👑", r: "Your attitude has been detected! 😎", s: { attitude: 16, drama: 6 } },
      { t: "Aman, I guess 😂", r: "Madam, answer recorded successfully!", s: { innocence: 8, pareshan: -4 } } ] },
    { q: "How much drama do you have?", options: [
      { t: "Zero drama 😇", r: "Expected answer, not surprised! 🤣", s: { drama: -14, innocence: 10 } },
      { t: "Full Bollywood package 🎬", r: "Aariya's drama level is increasing!", s: { drama: 20, attitude: 8 } } ] },
    { q: "If Aman irritates you, what will you do?", options: [
      { t: "Ignore him 🙄", r: "Aman is reviewing your answer... 👀", s: { attitude: 12, pareshan: 8 } },
      { t: "Give him a lecture 😂", r: "Aman ko lecture? Bechara Aman! 😂", s: { drama: 10, pareshan: 14 } } ] },
    { q: "Who is your favourite best friend?", options: [
      { t: "Aman ❤️", r: "Correct answer! Aman khush ho gaya ❤️", s: { innocence: 10, pareshan: -6 } },
      { t: "I need more options 😂", r: "Options khatam, madam — sirf Aman hai! 😂", s: { attitude: 14, drama: 6 } } ] },
    { q: "Do you enjoy annoying Aman?", options: [
      { t: "Never! 😇", r: "Aariya, itna jhoot? 😂", s: { innocence: 14, pareshan: -12 } },
      { t: "It's my favourite hobby 🤣", r: "Aman ko pareshan karna — certified hobby! 🤣", s: { pareshan: 20, drama: 8 } } ] },
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
      b.addEventListener("click", function () { answerQuestion(b, oi); });
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
  document.getElementById("unlockBtn").addEventListener("click", function () { show("next"); });
  document.getElementById("nextBackBtn").addEventListener("click", function () { show("result"); });
  document.getElementById("nextRestartBtn").addEventListener("click", restart);

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
