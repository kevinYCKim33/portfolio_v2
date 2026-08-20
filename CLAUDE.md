# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## No build step

Static single-page site. No package.json, no bundler, no Sass, no tests, no CI. Editing a file and reloading the browser is the entire feedback loop — never suggest `npm install`/`npm run build`.

To preview: open `index.html` directly, or serve the repo root (`python3 -m http.server`) and visit `index.html`. Since there is no test suite, **visually verify changes in a browser** — that is the only verification this project has.

Deploy: Netlify auto-deploys from `master`. Pushing to `master` publishes.

## Vendor vs. authored files

Only these two files are hand-written. Everything else in `css/` and `js/` is vendored — do not edit, reformat, or "clean up":

- `css/style.css` — all authored CSS. Loaded **last** in `<head>`, which is what lets it override Bootstrap. Keep it last.
- `js/script.js` — all authored JS (Owl Carousel init, fancybox init, smooth scroll, sticky nav).

**Never re-add a `jQuery.event.special.touchstart` override that marks listeners `passive`.** One lived at the top of `script.js` until it was removed; it silenced Chrome's non-passive-listener console warning, but a passive listener makes `preventDefault()` a no-op, and both touchstart consumers on this page — Owl Carousel's drag and fancybox's arrow buttons — depend on it. In the lightbox that meant a tap ran `next()` on `touchstart` and then again on the click the browser synthesized because the `preventDefault()` was ignored, so every tap skipped two slides on mobile.

`css/bootstrap.css` is minified vendor Bootstrap 4.0.0 despite the plain `.css` name. Style changes go in `style.css` as overrides, never by editing vendor files.

**Fonts come from two places.** `css/fonts.google.css` is vendored but ships **weight 400 only** — anything bold set in those families renders as faux-bold. The real type system (Archivo / Newsreader / JetBrains Mono, with actual weights) loads from the Google Fonts CDN link in `<head>`; `style.css` references them through `--font-display`, `--font-body`, and `--font-mono`. Use those variables rather than naming families directly.

**`css/fontawesome.uncss.css` is a UnCSS-pruned subset** containing only the ~16 icon classes currently used. Adding a new `<i class="fas fa-xyz">` to the HTML renders _nothing_ — the rule was stripped out. Either reuse an existing icon or re-enable the full Font Awesome CDN link (commented out near the top of `index.html`).

## Portfolio slide markup

Projects are hand-written HTML in `#portfolio` — there is no JS data array or templating. Each project is one `<div class="row">`: `col-md-7` holds the carousel, `col-md-5` holds the copy. Adding a project means copying an existing row block plus its `<hr />`; Owl Carousel is initialized globally on `.owl-carousel`, so no JS change is needed.

Per-slide rules that are easy to get wrong:

- **The image path appears twice** — `<a href="img/X.webp">` (full-size, opened by fancybox) and `<img src="img/X.webp">` (thumbnail). Change both or the lightbox opens the wrong picture.
- **`data-fancybox="<group>"` must be unique per project.** All slides in one project share the group so fancybox can arrow between them; reusing another project's group merges the two galleries.
- **`title`, `alt`, and `data-caption` are three separate hand-maintained strings.** `data-caption` is the long prose shown in the lightbox.
- **`class="item item__arthur"` is misnamed** — it is a sizing variant (`min-height: 300px`) used by Caesars, PointsBet, and Arthur for tall phone screenshots. Desktop-screenshot projects (Single Stop, Beat45, QPi) use bare `class="item"`. Pick by screenshot shape, not by project.
- New `<img>` tags need `loading="lazy" class="img-fluid rounded mb-3 mb-md-0"` to match the others.
- **Never hand-write carousel dots or arrows** — Owl generates them from `dots: true`.

The fancybox init in `script.js` carries two deliberate departures from the defaults: `idleTime: false`, because the default hides the close button after 3s of no interaction, and an `onInit`/`afterClose` pair that pins `<body>` via the `fb-lock` class in `style.css`. That class is applied only from JS and appears nowhere in `index.html` — deleting it as an unused rule silently lets the page scroll behind the open lightbox.

## Nav

Adding a nav link requires both a `<li>` in `<ul class="navbar-nav">` and a matching `id` on a `.section` div. The smooth-scroll handler in `script.js` resolves the `href` straight to an element and throws if the target is missing. `script.js` also reads `$(".skillsSection").offset()`, so removing that class breaks everything after it in the ready handler.

**The sticky bar depends on two divs that only exist at runtime.** `script.js` injects `.nav-sentinel` before the nav and `.nav-spacer` after it; both are styled in `style.css` but appear nowhere in `index.html`, so they look like dead rules — they are not. The sentinel is what the IntersectionObserver watches and its size must never change, or the observer stops getting crossings and the bar will not un-stick. The spacer is what holds the nav's height open while it is fixed. Never merge the two jobs into one element, and never compensate with padding on `<body>` — anything that moves the trigger point as a side effect of tripping it oscillates. Don't trust a cached document offset here either: `.splash` is `100vh`, so the hero resizes whenever a mobile browser hides its address bar.

## Formatting

Prettier with **default settings** (`.prettierrc` is `{}`) is the formatting contract. This is why attributes and even text nodes wrap oddly mid-tag in `index.html`. Reformatting with different settings produces an enormous spurious diff — match the surrounding style rather than reflowing.

Commit messages: lowercase, short, imperative-ish, no prefixes or issue refs (e.g. `update about me section`).
