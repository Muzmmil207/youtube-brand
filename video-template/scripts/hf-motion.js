/* ==========================================================================
   HF motion engine
   Builds one paused, seekable GSAP timeline per scene from data attributes.
   No CSS transitions, no infinite loops, no randomness.

   Usage in a scene:
     <script>HF.register("my-scene");</script>
   ========================================================================== */

(function () {
  if (window.HF) return;

  var DURATION = {
    fade: 0.4,
    "fade-up": 0.5,
    "fade-down": 0.5,
    "slide-left": 0.55,
    "slide-right": 0.55,
    "scale-in": 0.5,
    "grow-x": 0.6,
    "grow-y": 0.6,
    draw: 0.8,
    count: 1.2,
    highlight: 0.5,
    pulse: 0.8,
    cursor: 0.7,
  };

  var EASE = "power3.out";

  function num(value, fallback) {
    var n = parseFloat(value);
    return isFinite(n) ? n : fallback;
  }

  function formatCount(value, decimals) {
    return value
      .toFixed(decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function animate(tl, el, type, at) {
    var duration = num(el.dataset.animDur, DURATION[type] || 0.5);

    switch (type) {
      case "fade":
        tl.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: duration, ease: EASE },
          at
        );
        break;

      case "fade-up":
        tl.fromTo(
          el,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: duration, ease: EASE },
          at
        );
        break;

      case "fade-down":
        tl.fromTo(
          el,
          { opacity: 0, y: -24 },
          { opacity: 1, y: 0, duration: duration, ease: EASE },
          at
        );
        break;

      case "slide-left":
        tl.fromTo(
          el,
          { opacity: 0, x: -48 },
          { opacity: 1, x: 0, duration: duration, ease: EASE },
          at
        );
        break;

      case "slide-right":
        tl.fromTo(
          el,
          { opacity: 0, x: 48 },
          { opacity: 1, x: 0, duration: duration, ease: EASE },
          at
        );
        break;

      case "scale-in":
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: duration, ease: EASE },
          at
        );
        break;

      case "grow-x":
        tl.fromTo(
          el,
          { scaleX: 0 },
          { scaleX: 1, duration: duration, ease: "power2.out" },
          at
        );
        break;

      case "grow-y":
        tl.fromTo(
          el,
          { scaleY: 0 },
          { scaleY: 1, duration: duration, ease: "power2.out" },
          at
        );
        break;

      case "draw":
        el.setAttribute("pathLength", "100");
        tl.fromTo(
          el,
          { strokeDasharray: 100, strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: duration, ease: "power2.inOut" },
          at
        );
        break;

      case "count": {
        var target = num(el.dataset.to, 0);
        var decimals = num(el.dataset.decimals, 0);
        var prefix = el.dataset.prefix || "";
        var suffix = el.dataset.suffix || "";
        var proxy = { value: 0 };
        el.textContent = prefix + formatCount(0, decimals) + suffix;
        tl.fromTo(
          proxy,
          { value: 0 },
          {
            value: target,
            duration: duration,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent =
                prefix + formatCount(proxy.value, decimals) + suffix;
            },
          },
          at
        );
        break;
      }

      case "highlight":
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: duration, ease: EASE },
          at
        );
        break;

      case "pulse": {
        tl.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.14,
            duration: duration / 2,
            repeat: 1,
            yoyo: true,
            ease: "power2.inOut",
          },
          at
        );
        var ring = el.querySelector(".hf-pulse__ring");
        if (ring) {
          tl.fromTo(
            ring,
            { scale: 1, opacity: 0.65 },
            {
              scale: 1.9,
              opacity: 0,
              duration: duration,
              repeat: 1,
              ease: "power2.out",
            },
            at
          );
        }
        break;
      }

      case "cursor":
        tl.fromTo(
          el,
          {
            opacity: 0,
            x: num(el.dataset.fromX, -40),
            y: num(el.dataset.fromY, 30),
          },
          { opacity: 1, x: 0, y: 0, duration: duration, ease: EASE },
          at
        );
        break;

      default:
        break;
    }
  }

  function build(root) {
    var tl = gsap.timeline({ paused: true });
    var sequenced = 0;

    var groups = root.querySelectorAll("[data-anim-group]");
    var groupChildren = [];

    groups.forEach(function (group) {
      var type = group.dataset.animGroup;
      var start = num(group.dataset.animAt, 0.2);
      var stagger = num(group.dataset.stagger, 0.08);

      Array.prototype.forEach.call(group.children, function (child, i) {
        groupChildren.push(child);
        animate(tl, child, type, start + i * stagger);
      });
    });

    root.querySelectorAll("[data-anim]").forEach(function (el) {
      if (groupChildren.indexOf(el) !== -1) return;
      var at =
        el.dataset.animAt != null ? num(el.dataset.animAt, 0) : 0.2 + sequenced * 0.06;
      sequenced += 1;
      animate(tl, el, el.dataset.anim, at);
    });

    return tl;
  }

  var HF = {};

  HF.scene = function (id) {
    var root =
      document.getElementById("root") ||
      document.querySelector('[data-composition-id="' + id + '"]');
    if (!root) return null;
    return build(root);
  };

  HF.register = function (id) {
    var tl = HF.scene(id);
    if (!tl) return null;
    window.__timelines = window.__timelines || {};
    window.__timelines[id] = tl;
    tl.seek(0);
    return tl;
  };

  window.HF = HF;
})();
