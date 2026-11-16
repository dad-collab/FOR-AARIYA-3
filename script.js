// LOVE.exe — Phase 1. Plain JS, no dependencies, no reloads.
(function () {
  "use strict";

  var screens = {
    landing: document.getElementById("screen-landing"),
    letter: document.getElementById("screen-letter"),
    loading: document.getElementById("screen-loading"),
    coming: document.getElementById("screen-coming"),
  };
  var progressItems = Array.prototype.slice.call(document.querySelectorAll("#progress li"));
  var stepFor = { landing: 1, letter: 2, loading: 2, coming: 3 };
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
    var fill = document.getElementById("loadFill");
    var pct = document.getElementById("loadPct");
    if (fill) fill.style.width = "0%";
    if (pct) pct.textContent = "0%";
    document.getElementById("envelopeBtn").classList.remove("open");
    show("landing");
  }

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
