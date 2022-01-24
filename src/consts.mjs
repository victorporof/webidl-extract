// In the spec, ".extract" classes represent examples.
// In the HTML spec, all IDL definitions are in <code> nodes.
// In the other specs, all IDL definitions are in <pre> nodes.

export const HTML_SPECIFICATION = {
  url: new URL("../spec/html-build/output/index.html", import.meta.url),
  selector: ":not(.extract) > code.idl",
};

export const DOM_SPECIFICATION = {
  url: new URL("../spec/dom/dom.html", import.meta.url),
  selector: ":not(.extract) > pre.idl",
};

export const UIEVENTS_SPECIFICATION = {
  url: new URL("../spec/uievents/index.html", import.meta.url),
  selector: ":not(.extract) > pre.idl",
};

export const POINTEREVENTS_SPECIFICATION = {
  url: new URL("../spec/pointerevents/index.html", import.meta.url),
  selector: ":not(.extract) > pre.idl",
};

export const CSSOM_SPECIFICATION = {
  url: new URL("../spec/csswg-drafts/cssom-1/Overview.html", import.meta.url),
  selector: ":not(.extract) > pre.idl",
};

export const ARIA_SPECIFICATION = {
  url: new URL("../spec/aria/index.html", import.meta.url),
  selector: ":not(.extract) > pre.idl",
};
