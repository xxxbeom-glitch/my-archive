/**
 * 타이핑 완료 후 "박성범"에 드래그 선택 연출 (커서 이동 + 파란 하이라이트 → 최종 역강조).
 */
(function (global) {
  "use strict";

  function runHeroNameDragSelect(selector) {
    var out = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!out) return;

    var html = out.innerHTML;
    if (html.indexOf("박성범") === -1) return;

    var wrapped = html.replace(
      "박성범",
      '<span class="hero-name-slot" style="position:relative;display:inline-block;vertical-align:baseline;">' +
        '<span class="hero-name-text-content" style="position:relative;display:inline;">박성범</span>' +
        "</span>"
    );
    out.innerHTML = wrapped;

    var slot = out.querySelector(".hero-name-slot");
    var nameEl = out.querySelector(".hero-name-text-content");
    if (!slot || !nameEl) return;

    function applyFinalStyle() {
      var parent = slot.parentNode;
      if (!parent) return;
      var finalSpan = document.createElement("span");
      finalSpan.style.backgroundColor = "#202020";
      finalSpan.style.color = "#ffffff";
      finalSpan.style.fontWeight = "700";
      finalSpan.style.padding = "0 6px";
      finalSpan.textContent = "박성범";
      parent.replaceChild(finalSpan, slot);
    }

    function fallbackFinalOnly() {
      applyFinalStyle();
    }

    function play() {
      var w = nameEl.offsetWidth;
      if (w <= 0) {
        fallbackFinalOnly();
        return;
      }

      var overlay = document.createElement("span");
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.cssText =
        "position:absolute;top:0;bottom:0;right:0;width:0;" +
        "background:rgba(0,120,215,0.35);pointer-events:none;z-index:1;border-radius:1px;";

      var cursor = document.createElement("span");
      cursor.setAttribute("aria-hidden", "true");
      cursor.textContent = "\u27A4";
      cursor.style.cssText =
        "position:absolute;right:0;top:50%;z-index:2;" +
        "color:#ffffff;line-height:1;font-size:inherit;" +
        "pointer-events:none;text-shadow:0 0 2px rgba(0,0,0,0.45);" +
        "transform:translateY(-50%);";

      slot.appendChild(overlay);
      slot.appendChild(cursor);

      var easing = "ease-in-out";
      var duration = 600;

      if (!cursor.animate || !overlay.animate) {
        cursor.remove();
        overlay.remove();
        setTimeout(fallbackFinalOnly, 500);
        return;
      }

      var animCursor = cursor.animate(
        [
          { transform: "translateY(-50%) translateX(0)" },
          { transform: "translateY(-50%) translateX(-" + w + "px)" }
        ],
        { duration: duration, easing: easing, fill: "forwards" }
      );

      var animOverlay = overlay.animate(
        [{ width: "0" }, { width: w + "px" }],
        { duration: duration, easing: easing, fill: "forwards" }
      );

      var done = Promise.all([animCursor.finished, animOverlay.finished]);
      done.then(function () {
        setTimeout(function () {
          cursor.remove();
          overlay.remove();
          applyFinalStyle();
        }, 500);
      }).catch(function () {
        cursor.remove();
        overlay.remove();
        fallbackFinalOnly();
      });
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(play);
    });
  }

  global.runHeroNameDragSelect = runHeroNameDragSelect;
})(typeof window !== "undefined" ? window : this);
