var __DecapPreviews = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react-jsx-runtime.production.js
  var require_react_jsx_runtime_production = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      function jsxProd(type, config, maybeKey) {
        var key = null;
        void 0 !== maybeKey && (key = "" + maybeKey);
        void 0 !== config.key && (key = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        config = maybeKey.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== config ? config : null,
          props: maybeKey
        };
      }
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = jsxProd;
      exports.jsxs = jsxProd;
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_jsx_runtime_production();
      } else {
        module.exports = null;
      }
    }
  });

  // src/components/ui/SponsorCard.jsx
  var import_jsx_runtime = __toESM(require_jsx_runtime());
  function SponsorCard({ logo, alt }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sponsor-card", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: logo, alt }) });
  }

  // src/components/ui/SponsorStrip.jsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime());
  function SponsorStrip({ sponsors }) {
    const active = sponsors.filter((s) => s.enabled !== false);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "sponsor-strip-grid", children: active.map((s) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SponsorCard, { logo: s.logo, alt: s.alt }, s.name)) });
  }

  // src/components/ui/StatBandSection.jsx
  var import_jsx_runtime3 = __toESM(require_jsx_runtime());
  function StatBandSection({ stats }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "stat-band", style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "#d8242f" }, children: stats.map((stat, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        style: {
          padding: i === 0 ? "30px 6vw" : "30px",
          textAlign: "center",
          borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,.2)" : "none"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontFamily: "'Anton',sans-serif", fontSize: "46px", color: "#fff", lineHeight: 1 }, children: stat.value }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { color: "#ffd9db", fontWeight: 700, fontSize: "13px", letterSpacing: ".12em", marginTop: "8px" }, children: stat.label })
        ]
      },
      i
    )) });
  }

  // src/components/ui/GetInvolvedSection.jsx
  var import_jsx_runtime4 = __toESM(require_jsx_runtime());
  var cardStyle = {
    textAlign: "left",
    background: "linear-gradient(160deg,#16285c,#0e1d45)",
    borderRadius: "5px",
    padding: "34px",
    borderTop: "4px solid #d8242f",
    display: "block",
    width: "100%"
  };
  function GetInvolvedSection({ items, formUrls }) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { id: "getinvolved", style: { padding: "84px 6vw", background: "#0b1838", scrollMarginTop: "72px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { textAlign: "center", marginBottom: "38px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { color: "#7fa0ff", fontWeight: 800, fontSize: "13px", letterSpacing: ".18em" }, children: "GET INVOLVED" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { style: { fontFamily: "'Anton',sans-serif", fontSize: "46px", color: "#fff", margin: "12px 0 0" }, children: "WAYS TO BACK THE WARRIORS" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "ways-grid", style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }, children: items.map(
        (item, i) => item.coming_soon ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: cardStyle, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { color: "#fff", fontFamily: "'Anton',sans-serif", fontSize: "28px" }, children: item.title }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { color: "#aebbe0", fontSize: "15px", lineHeight: 1.55 }, children: item.description }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { display: "inline-block", color: "#7fa0ff", fontWeight: 800, fontSize: "13px", letterSpacing: ".06em", border: "1px solid rgba(127,160,255,.35)", padding: "5px 12px", borderRadius: "3px" }, children: "COMING SOON" })
        ] }, i) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "button",
          {
            className: "form-trigger",
            "data-form-src": formUrls[item.form],
            "data-form-title": item.form_title,
            style: { ...cardStyle, cursor: "pointer", border: "none", borderTop: "4px solid #d8242f" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { color: "#fff", fontFamily: "'Anton',sans-serif", fontSize: "28px" }, children: item.title }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { color: "#aebbe0", fontSize: "15px", lineHeight: 1.55 }, children: item.description }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { color: "#7fa0ff", fontWeight: 800, fontSize: "14px" }, children: item.link_label })
            ]
          },
          i
        )
      ) })
    ] });
  }

  // src/components/ui/SponsorCTASection.jsx
  var import_jsx_runtime5 = __toESM(require_jsx_runtime());
  function SponsorCTASection({ headline, intro, benefits, contacts, sponsorshipFormUrl }) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { id: "sponsor", style: { padding: "84px 6vw", background: "#f3f5fb", scrollMarginTop: "72px" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "sponsor-layout", style: { display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: "48px", alignItems: "start" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "sponsor-sticky", style: { position: "sticky", top: "90px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { color: "#1c3fb0", fontWeight: 800, fontSize: "13px", letterSpacing: ".18em" }, children: "BECOME A SPONSOR" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { style: { fontFamily: "'Anton',sans-serif", fontSize: "48px", color: "#0b1838", margin: "12px 0 16px", lineHeight: 1 }, children: headline.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
          line,
          i < headline.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("br", {})
        ] }, i)) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { style: { color: "#55585f", fontSize: "16px", lineHeight: 1.6, margin: "0 0 22px" }, children: intro }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: "11px" }, children: benefits.map((benefit, i) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", gap: "11px", alignItems: "flex-start", color: "#2c2f36", fontSize: "15px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "#d8242f", fontWeight: 900 }, children: "\u2713" }),
          benefit
        ] }, i)) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { style: { color: "#797c83", fontSize: "14px", marginTop: "24px", lineHeight: 1.6 }, children: [
          "Questions? Contact ",
          contacts[0].name,
          " & ",
          contacts[1].name,
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("br", {}),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("a", { href: `mailto:${contacts[0].email}`, children: contacts[0].email }),
          " \xB7 ",
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("a", { href: `mailto:${contacts[1].email}`, children: contacts[1].email })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { background: "#f3f5fb", borderRadius: "6px", padding: "48px 36px", border: "1px solid #dde3f0", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          className: "form-trigger",
          "data-form-src": sponsorshipFormUrl,
          "data-form-title": "SPONSORSHIP INQUIRY",
          style: { background: "#0b1838", color: "#fff", fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: "17px", letterSpacing: ".06em", padding: "18px 52px", borderRadius: "3px", border: "none", cursor: "pointer" },
          children: "BECOME A SPONSOR \u2192"
        }
      ) })
    ] }) });
  }

  // src/admin/preview.jsx
  var import_jsx_runtime6 = __toESM(require_jsx_runtime());
  function toArray(value) {
    if (!value) return [];
    if (typeof value.toJS === "function") return value.toJS();
    return Array.isArray(value) ? value : [];
  }
  function toObject(value) {
    if (!value) return {};
    if (typeof value.toJS === "function") return value.toJS();
    return value;
  }
  function previewAssetPath(path) {
    if (!path) return "";
    if (/^(https?:)?\/\//.test(path) || path.charAt(0) === "/") return path;
    return "/" + path;
  }
  function normalizeSponsor(s) {
    const obj = toObject(s);
    return { ...obj, logo: previewAssetPath(obj.logo) };
  }
  CMS.registerPreviewTemplate("sponsors", function SponsorsPreview({ entry }) {
    const items = toArray(entry.getIn(["data", "items"])).filter(Boolean).map(normalizeSponsor);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { minHeight: "100vh", background: "#f3f5fb", padding: "54px 6vw", fontFamily: "Arial, sans-serif" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "sponsor-strip-label", style: { textAlign: "center", color: "#0b1838", fontWeight: 800, fontSize: "13px", letterSpacing: ".18em", marginBottom: "26px" }, children: "PROUDLY SUPPORTED BY OUR SPONSORS" }),
      items.length ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SponsorStrip, { sponsors: items }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { style: { textAlign: "center", color: "#55585f" }, children: "No enabled sponsors to preview." })
    ] });
  });
  CMS.registerPreviewTemplate("tournament", function TournamentPreview({ entry }) {
    const data = toObject(entry.getIn(["data"]));
    const stats = [
      { value: "20+", label: "PROGRAMS SUPPORTED" },
      { value: `$${data.price_foursome ?? 580}`, label: "PER FOURSOME" },
      { value: String(data.holes ?? 18), label: `HOLES \xB7 ${(data.format ?? "SCRAMBLE").toUpperCase()}` }
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { fontFamily: "Arial, sans-serif", background: "#0b1838", minHeight: "100vh" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { padding: "32px 6vw", background: "#14275e", color: "#fff" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { fontSize: "12px", letterSpacing: ".16em", color: "#7fa0ff", fontWeight: 800, marginBottom: "8px" }, children: [
          "NOW REGISTERING \xB7 ",
          (data.edition ?? "").toUpperCase()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { fontSize: "36px", fontWeight: 900, lineHeight: 1 }, children: "CENTAURUS GOLF TOURNAMENT" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { marginTop: "12px", color: "#cdd6ee", fontSize: "15px", fontWeight: 700 }, children: [
          (data.date ?? "").toUpperCase(),
          " \xA0|\xA0 ",
          (data.time ?? "").toUpperCase(),
          " \xA0|\xA0 ",
          (data.venue ?? "").toUpperCase()
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(StatBandSection, { stats }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { padding: "32px 6vw", color: "#aebbe0", fontSize: "15px", lineHeight: 1.6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { color: "#fff", fontWeight: 800, fontSize: "18px", marginBottom: "8px" }, children: data.section_headline }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { style: { margin: "0 0 16px" }, children: data.section_intro }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { color: "#fff", fontWeight: 800 }, children: "Inclusions: " }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { children: toArray(data.inclusions).join(" \xB7 ") }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { marginTop: "16px", color: "#fff", fontWeight: 800 }, children: "Pricing" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
          "$",
          data.price_player,
          " per player \xA0\xB7\xA0 $",
          data.price_foursome,
          " foursome"
        ] })
      ] })
    ] });
  });
  CMS.registerPreviewTemplate("site_data_get_involved", function GetInvolvedPreview({ entry }) {
    const items = toArray(entry.getIn(["data", "items"])).filter(Boolean).map(toObject);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(GetInvolvedSection, { items, formUrls: {} });
  });
  CMS.registerPreviewTemplate("site_data_sponsor_benefits", function SponsorBenefitsPreview({ entry }) {
    const benefits = toArray(entry.getIn(["data", "items"])).filter(Boolean);
    const contacts = [
      { name: "Sponsor Contact A", email: "sponsor-a@example.com" },
      { name: "Sponsor Contact B", email: "sponsor-b@example.com" }
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      SponsorCTASection,
      {
        headline: ["PUT YOUR BRAND", "BEHIND THE WARRIORS"],
        intro: "Annual and sport-specific options that reach families across every Centaurus program and the golf tournament.",
        benefits,
        contacts,
        sponsorshipFormUrl: "#"
      }
    );
  });
})();
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
