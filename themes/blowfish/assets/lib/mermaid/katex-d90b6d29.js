class u0 {
  // The + prefix indicates that these fields aren't writeable
  // Lexer holding the input string.
  // Start offset, zero-based inclusive.
  // End offset, zero-based exclusive.
  constructor(e, t, a) {
    this.lexer = void 0, this.start = void 0, this.end = void 0, this.lexer = e, this.start = t, this.end = a;
  }
  /**
   * Merges two `SourceLocation`s from location providers, given they are
   * provided in order of appearance.
   * - Returns the first one's location if only the first is provided.
   * - Returns a merged range of the first and the last if both are provided
   *   and their lexers match.
   * - Otherwise, returns null.
   */
  static range(e, t) {
    return t ? !e || !e.loc || !t.loc || e.loc.lexer !== t.loc.lexer ? null : new u0(e.loc.lexer, e.loc.start, t.loc.end) : e && e.loc;
  }
}
class x0 {
  // don't expand the token
  // used in \noexpand
  constructor(e, t) {
    this.text = void 0, this.loc = void 0, this.noexpand = void 0, this.treatAsRelax = void 0, this.text = e, this.loc = t;
  }
  /**
   * Given a pair of tokens (this and endToken), compute a `Token` encompassing
   * the whole input range enclosed by these two.
   */
  range(e, t) {
    return new x0(t, u0.range(this, e));
  }
}
class M {
  // Error start position based on passed-in Token or ParseNode.
  // Length of affected text based on passed-in Token or ParseNode.
  // The underlying error message without any context added.
  constructor(e, t) {
    this.name = void 0, this.position = void 0, this.length = void 0, this.rawMessage = void 0;
    var a = "KaTeX parse error: " + e, n, s, o = t && t.loc;
    if (o && o.start <= o.end) {
      var h = o.lexer.input;
      n = o.start, s = o.end, n === h.length ? a += " at end of input: " : a += " at position " + (n + 1) + ": ";
      var c = h.slice(n, s).replace(/[^]/g, "$&̲"), p;
      n > 15 ? p = "…" + h.slice(n - 15, n) : p = h.slice(0, n);
      var g;
      s + 15 < h.length ? g = h.slice(s, s + 15) + "…" : g = h.slice(s), a += p + c + g;
    }
    var y = new Error(a);
    return y.name = "ParseError", y.__proto__ = M.prototype, y.position = n, n != null && s != null && (y.length = s - n), y.rawMessage = e, y;
  }
}
M.prototype.__proto__ = Error.prototype;
var da = function(e, t) {
  return e.indexOf(t) !== -1;
}, fa = function(e, t) {
  return e === void 0 ? t : e;
}, pa = /([A-Z])/g, va = function(e) {
  return e.replace(pa, "-$1").toLowerCase();
}, ga = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  '"': "&quot;",
  "'": "&#x27;"
}, ba = /[&><"']/g;
function ya(r) {
  return String(r).replace(ba, (e) => ga[e]);
}
var pr = function r(e) {
  return e.type === "ordgroup" || e.type === "color" ? e.body.length === 1 ? r(e.body[0]) : e : e.type === "font" ? r(e.body) : e;
}, xa = function(e) {
  var t = pr(e);
  return t.type === "mathord" || t.type === "textord" || t.type === "atom";
}, wa = function(e) {
  if (!e)
    throw new Error("Expected non-null, but got " + String(e));
  return e;
}, ka = function(e) {
  var t = /^\s*([^\\/#]*?)(?::|&#0*58|&#x0*3a)/i.exec(e);
  return t != null ? t[1] : "_relative";
}, I = {
  contains: da,
  deflt: fa,
  escape: ya,
  hyphenate: va,
  getBaseElem: pr,
  isCharacterBox: xa,
  protocolFromUrl: ka
}, Ae = {
  displayMode: {
    type: "boolean",
    description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
    cli: "-d, --display-mode"
  },
  output: {
    type: {
      enum: ["htmlAndMathml", "html", "mathml"]
    },
    description: "Determines the markup language of the output.",
    cli: "-F, --format <type>"
  },
  leqno: {
    type: "boolean",
    description: "Render display math in leqno style (left-justified tags)."
  },
  fleqn: {
    type: "boolean",
    description: "Render display math flush left."
  },
  throwOnError: {
    type: "boolean",
    default: !0,
    cli: "-t, --no-throw-on-error",
    cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
  },
  errorColor: {
    type: "string",
    default: "#cc0000",
    cli: "-c, --error-color <color>",
    cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
    cliProcessor: (r) => "#" + r
  },
  macros: {
    type: "object",
    cli: "-m, --macro <def>",
    cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
    cliDefault: [],
    cliProcessor: (r, e) => (e.push(r), e)
  },
  minRuleThickness: {
    type: "number",
    description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
    processor: (r) => Math.max(0, r),
    cli: "--min-rule-thickness <size>",
    cliProcessor: parseFloat
  },
  colorIsTextColor: {
    type: "boolean",
    description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
    cli: "-b, --color-is-text-color"
  },
  strict: {
    type: [{
      enum: ["warn", "ignore", "error"]
    }, "boolean", "function"],
    description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
    cli: "-S, --strict",
    cliDefault: !1
  },
  trust: {
    type: ["boolean", "function"],
    description: "Trust the input, enabling all HTML features such as \\url.",
    cli: "-T, --trust"
  },
  maxSize: {
    type: "number",
    default: 1 / 0,
    description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
    processor: (r) => Math.max(0, r),
    cli: "-s, --max-size <n>",
    cliProcessor: parseInt
  },
  maxExpand: {
    type: "number",
    default: 1e3,
    description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
    processor: (r) => Math.max(0, r),
    cli: "-e, --max-expand <n>",
    cliProcessor: (r) => r === "Infinity" ? 1 / 0 : parseInt(r)
  },
  globalGroup: {
    type: "boolean",
    cli: !1
  }
};
function Sa(r) {
  if (r.default)
    return r.default;
  var e = r.type, t = Array.isArray(e) ? e[0] : e;
  if (typeof t != "string")
    return t.enum[0];
  switch (t) {
    case "boolean":
      return !1;
    case "string":
      return "";
    case "number":
      return 0;
    case "object":
      return {};
  }
}
class ct {
  constructor(e) {
    this.displayMode = void 0, this.output = void 0, this.leqno = void 0, this.fleqn = void 0, this.throwOnError = void 0, this.errorColor = void 0, this.macros = void 0, this.minRuleThickness = void 0, this.colorIsTextColor = void 0, this.strict = void 0, this.trust = void 0, this.maxSize = void 0, this.maxExpand = void 0, this.globalGroup = void 0, e = e || {};
    for (var t in Ae)
      if (Ae.hasOwnProperty(t)) {
        var a = Ae[t];
        this[t] = e[t] !== void 0 ? a.processor ? a.processor(e[t]) : e[t] : Sa(a);
      }
  }
  /**
   * Report nonstrict (non-LaTeX-compatible) input.
   * Can safely not be called if `this.strict` is false in JavaScript.
   */
  reportNonstrict(e, t, a) {
    var n = this.strict;
    if (typeof n == "function" && (n = n(e, t, a)), !(!n || n === "ignore")) {
      if (n === !0 || n === "error")
        throw new M("LaTeX-incompatible input and strict mode is set to 'error': " + (t + " [" + e + "]"), a);
      n === "warn" ? typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (t + " [" + e + "]")) : typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + n + "': " + t + " [" + e + "]"));
    }
  }
  /**
   * Check whether to apply strict (LaTeX-adhering) behavior for unusual
   * input (like `\\`).  Unlike `nonstrict`, will not throw an error;
   * instead, "error" translates to a return value of `true`, while "ignore"
   * translates to a return value of `false`.  May still print a warning:
   * "warn" prints a warning and returns `false`.
   * This is for the second category of `errorCode`s listed in the README.
   */
  useStrictBehavior(e, t, a) {
    var n = this.strict;
    if (typeof n == "function")
      try {
        n = n(e, t, a);
      } catch {
        n = "error";
      }
    return !n || n === "ignore" ? !1 : n === !0 || n === "error" ? !0 : n === "warn" ? (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (t + " [" + e + "]")), !1) : (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + n + "': " + t + " [" + e + "]")), !1);
  }
  /**
   * Check whether to test potentially dangerous input, and return
   * `true` (trusted) or `false` (untrusted).  The sole argument `context`
   * should be an object with `command` field specifying the relevant LaTeX
   * command (as a string starting with `\`), and any other arguments, etc.
   * If `context` has a `url` field, a `protocol` field will automatically
   * get added by this function (changing the specified object).
   */
  isTrusted(e) {
    e.url && !e.protocol && (e.protocol = I.protocolFromUrl(e.url));
    var t = typeof this.trust == "function" ? this.trust(e) : this.trust;
    return !!t;
  }
}
class O0 {
  constructor(e, t, a) {
    this.id = void 0, this.size = void 0, this.cramped = void 0, this.id = e, this.size = t, this.cramped = a;
  }
  /**
   * Get the style of a superscript given a base in the current style.
   */
  sup() {
    return b0[Ma[this.id]];
  }
  /**
   * Get the style of a subscript given a base in the current style.
   */
  sub() {
    return b0[za[this.id]];
  }
  /**
   * Get the style of a fraction numerator given the fraction in the current
   * style.
   */
  fracNum() {
    return b0[Aa[this.id]];
  }
  /**
   * Get the style of a fraction denominator given the fraction in the current
   * style.
   */
  fracDen() {
    return b0[Ta[this.id]];
  }
  /**
   * Get the cramped version of a style (in particular, cramping a cramped style
   * doesn't change the style).
   */
  cramp() {
    return b0[Ba[this.id]];
  }
  /**
   * Get a text or display version of this style.
   */
  text() {
    return b0[Da[this.id]];
  }
  /**
   * Return true if this style is tightly spaced (scriptstyle/scriptscriptstyle)
   */
  isTight() {
    return this.size >= 2;
  }
}
var dt = 0, Be = 1, _0 = 2, T0 = 3, le = 4, d0 = 5, ee = 6, n0 = 7, b0 = [new O0(dt, 0, !1), new O0(Be, 0, !0), new O0(_0, 1, !1), new O0(T0, 1, !0), new O0(le, 2, !1), new O0(d0, 2, !0), new O0(ee, 3, !1), new O0(n0, 3, !0)], Ma = [le, d0, le, d0, ee, n0, ee, n0], za = [d0, d0, d0, d0, n0, n0, n0, n0], Aa = [_0, T0, le, d0, ee, n0, ee, n0], Ta = [T0, T0, d0, d0, n0, n0, n0, n0], Ba = [Be, Be, T0, T0, d0, d0, n0, n0], Da = [dt, Be, _0, T0, _0, T0, _0, T0], R = {
  DISPLAY: b0[dt],
  TEXT: b0[_0],
  SCRIPT: b0[le],
  SCRIPTSCRIPT: b0[ee]
}, at = [{
  // Latin characters beyond the Latin-1 characters we have metrics for.
  // Needed for Czech, Hungarian and Turkish text, for example.
  name: "latin",
  blocks: [
    [256, 591],
    // Latin Extended-A and Latin Extended-B
    [768, 879]
    // Combining Diacritical marks
  ]
}, {
  // The Cyrillic script used by Russian and related languages.
  // A Cyrillic subset used to be supported as explicitly defined
  // symbols in symbols.js
  name: "cyrillic",
  blocks: [[1024, 1279]]
}, {
  // Armenian
  name: "armenian",
  blocks: [[1328, 1423]]
}, {
  // The Brahmic scripts of South and Southeast Asia
  // Devanagari (0900–097F)
  // Bengali (0980–09FF)
  // Gurmukhi (0A00–0A7F)
  // Gujarati (0A80–0AFF)
  // Oriya (0B00–0B7F)
  // Tamil (0B80–0BFF)
  // Telugu (0C00–0C7F)
  // Kannada (0C80–0CFF)
  // Malayalam (0D00–0D7F)
  // Sinhala (0D80–0DFF)
  // Thai (0E00–0E7F)
  // Lao (0E80–0EFF)
  // Tibetan (0F00–0FFF)
  // Myanmar (1000–109F)
  name: "brahmic",
  blocks: [[2304, 4255]]
}, {
  name: "georgian",
  blocks: [[4256, 4351]]
}, {
  // Chinese and Japanese.
  // The "k" in cjk is for Korean, but we've separated Korean out
  name: "cjk",
  blocks: [
    [12288, 12543],
    // CJK symbols and punctuation, Hiragana, Katakana
    [19968, 40879],
    // CJK ideograms
    [65280, 65376]
    // Fullwidth punctuation
    // TODO: add halfwidth Katakana and Romanji glyphs
  ]
}, {
  // Korean
  name: "hangul",
  blocks: [[44032, 55215]]
}];
function Ca(r) {
  for (var e = 0; e < at.length; e++)
    for (var t = at[e], a = 0; a < t.blocks.length; a++) {
      var n = t.blocks[a];
      if (r >= n[0] && r <= n[1])
        return t.name;
    }
  return null;
}
var Te = [];
at.forEach((r) => r.blocks.forEach((e) => Te.push(...e)));
function vr(r) {
  for (var e = 0; e < Te.length; e += 2)
    if (r >= Te[e] && r <= Te[e + 1])
      return !0;
  return !1;
}
var Q0 = 80, Na = function(e, t) {
  return "M95," + (622 + e + t) + `
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l` + e / 2.075 + " -" + e + `
c5.3,-9.3,12,-14,20,-14
H400000v` + (40 + e) + `H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M` + (834 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
}, qa = function(e, t) {
  return "M263," + (601 + e + t) + `c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l` + e / 2.084 + " -" + e + `
c4.7,-7.3,11,-11,19,-11
H40000v` + (40 + e) + `H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
}, Ra = function(e, t) {
  return "M983 " + (10 + e + t) + `
l` + e / 3.13 + " -" + e + `
c4,-6.7,10,-10,18,-10 H400000v` + (40 + e) + `
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
}, Ea = function(e, t) {
  return "M424," + (2398 + e + t) + `
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l` + e / 4.223 + " -" + e + `c4,-6.7,10,-10,18,-10 H400000
v` + (40 + e) + `H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M` + (1001 + e) + " " + t + `
h400000v` + (40 + e) + "h-400000z";
}, Ia = function(e, t) {
  return "M473," + (2713 + e + t) + `
c339.3,-1799.3,509.3,-2700,510,-2702 l` + e / 5.298 + " -" + e + `
c3.3,-7.3,9.3,-11,18,-11 H400000v` + (40 + e) + `H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "H1017.7z";
}, Oa = function(e) {
  var t = e / 2;
  return "M400000 " + e + " H0 L" + t + " 0 l65 45 L145 " + (e - 80) + " H400000z";
}, Ha = function(e, t, a) {
  var n = a - 54 - t - e;
  return "M702 " + (e + t) + "H400000" + (40 + e) + `
H742v` + n + `l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 ` + t + "H400000v" + (40 + e) + "H742z";
}, Fa = function(e, t, a) {
  t = 1e3 * t;
  var n = "";
  switch (e) {
    case "sqrtMain":
      n = Na(t, Q0);
      break;
    case "sqrtSize1":
      n = qa(t, Q0);
      break;
    case "sqrtSize2":
      n = Ra(t, Q0);
      break;
    case "sqrtSize3":
      n = Ea(t, Q0);
      break;
    case "sqrtSize4":
      n = Ia(t, Q0);
      break;
    case "sqrtTall":
      n = Ha(t, Q0, a);
  }
  return n;
}, La = function(e, t) {
  switch (e) {
    case "⎜":
      return "M291 0 H417 V" + t + " H291z M291 0 H417 V" + t + " H291z";
    case "∣":
      return "M145 0 H188 V" + t + " H145z M145 0 H188 V" + t + " H145z";
    case "∥":
      return "M145 0 H188 V" + t + " H145z M145 0 H188 V" + t + " H145z" + ("M367 0 H410 V" + t + " H367z M367 0 H410 V" + t + " H367z");
    case "⎟":
      return "M457 0 H583 V" + t + " H457z M457 0 H583 V" + t + " H457z";
    case "⎢":
      return "M319 0 H403 V" + t + " H319z M319 0 H403 V" + t + " H319z";
    case "⎥":
      return "M263 0 H347 V" + t + " H263z M263 0 H347 V" + t + " H263z";
    case "⎪":
      return "M384 0 H504 V" + t + " H384z M384 0 H504 V" + t + " H384z";
    case "⏐":
      return "M312 0 H355 V" + t + " H312z M312 0 H355 V" + t + " H312z";
    case "‖":
      return "M257 0 H300 V" + t + " H257z M257 0 H300 V" + t + " H257z" + ("M478 0 H521 V" + t + " H478z M478 0 H521 V" + t + " H478z");
    default:
      return "";
  }
}, It = {
  // The doubleleftarrow geometry is from glyph U+21D0 in the font KaTeX Main
  doubleleftarrow: `M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,
  // doublerightarrow is from glyph U+21D2 in font KaTeX Main
  doublerightarrow: `M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,
  // leftarrow is from glyph U+2190 in font KaTeX Main
  leftarrow: `M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,
  // overbrace is from glyphs U+23A9/23A8/23A7 in font KaTeX_Size4-Regular
  leftbrace: `M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,
  leftbraceunder: `M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,
  // overgroup is from the MnSymbol package (public domain)
  leftgroup: `M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,
  leftgroupunder: `M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,
  // Harpoons are from glyph U+21BD in font KaTeX Main
  leftharpoon: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,
  leftharpoonplus: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,
  leftharpoondown: `M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,
  leftharpoondownplus: `M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,
  // hook is from glyph U+21A9 in font KaTeX Main
  lefthook: `M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,
  leftlinesegment: `M40 281 V428 H0 V94 H40 V241 H400000 v40z
M40 281 V428 H0 V94 H40 V241 H400000 v40z`,
  leftmapsto: `M40 281 V448H0V74H40V241H400000v40z
M40 281 V448H0V74H40V241H400000v40z`,
  // tofrom is from glyph U+21C4 in font KaTeX AMS Regular
  leftToFrom: `M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,
  longequal: `M0 50 h400000 v40H0z m0 194h40000v40H0z
M0 50 h400000 v40H0z m0 194h40000v40H0z`,
  midbrace: `M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,
  midbraceunder: `M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,
  oiintSize1: `M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,
  oiintSize2: `M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,
  oiiintSize1: `M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,
  oiiintSize2: `M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,
  rightarrow: `M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,
  rightbrace: `M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,
  rightbraceunder: `M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,
  rightgroup: `M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,
  rightgroupunder: `M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,
  rightharpoon: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,
  rightharpoonplus: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,
  rightharpoondown: `M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,
  rightharpoondownplus: `M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,
  righthook: `M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,
  rightlinesegment: `M399960 241 V94 h40 V428 h-40 V281 H0 v-40z
M399960 241 V94 h40 V428 h-40 V281 H0 v-40z`,
  rightToFrom: `M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,
  // twoheadleftarrow is from glyph U+219E in font KaTeX AMS Regular
  twoheadleftarrow: `M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,
  twoheadrightarrow: `M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,
  // tilde1 is a modified version of a glyph from the MnSymbol package
  tilde1: `M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,
  // ditto tilde2, tilde3, & tilde4
  tilde2: `M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,
  tilde3: `M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,
  tilde4: `M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,
  // vec is from glyph U+20D7 in font KaTeX Main
  vec: `M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,
  // widehat1 is a modified version of a glyph from the MnSymbol package
  widehat1: `M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,
  // ditto widehat2, widehat3, & widehat4
  widehat2: `M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  widehat3: `M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  widehat4: `M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  // widecheck paths are all inverted versions of widehat
  widecheck1: `M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,
  widecheck2: `M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  widecheck3: `M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  widecheck4: `M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  // The next ten paths support reaction arrows from the mhchem package.
  // Arrows for \ce{<-->} are offset from xAxis by 0.22ex, per mhchem in LaTeX
  // baraboveleftarrow is mostly from glyph U+2190 in font KaTeX Main
  baraboveleftarrow: `M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,
  // rightarrowabovebar is mostly from glyph U+2192, KaTeX Main
  rightarrowabovebar: `M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,
  // The short left harpoon has 0.5em (i.e. 500 units) kern on the left end.
  // Ref from mhchem.sty: \rlap{\raisebox{-.22ex}{$\kern0.5em
  baraboveshortleftharpoon: `M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,
  rightharpoonaboveshortbar: `M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,
  shortbaraboveleftharpoon: `M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,
  shortrightharpoonabovebar: `M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`
}, Pa = function(e, t) {
  switch (e) {
    case "lbrack":
      return "M403 1759 V84 H666 V0 H319 V1759 v" + t + ` v1759 h347 v-84
H403z M403 1759 V0 H319 V1759 v` + t + " v1759 h84z";
    case "rbrack":
      return "M347 1759 V0 H0 V84 H263 V1759 v" + t + ` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v` + t + " v1759 h84z";
    case "vert":
      return "M145 15 v585 v" + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + t + " v585 h43z";
    case "doublevert":
      return "M145 15 v585 v" + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + t + ` v585 h43z
M367 15 v585 v` + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v` + t + " v585 h43z";
    case "lfloor":
      return "M319 602 V0 H403 V602 v" + t + ` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v` + t + " v1715 H319z";
    case "rfloor":
      return "M319 602 V0 H403 V602 v" + t + ` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v` + t + " v1715 H319z";
    case "lceil":
      return "M403 1759 V84 H666 V0 H319 V1759 v" + t + ` v602 h84z
M403 1759 V0 H319 V1759 v` + t + " v602 h84z";
    case "rceil":
      return "M347 1759 V0 H0 V84 H263 V1759 v" + t + ` v602 h84z
M347 1759 V0 h-84 V1759 v` + t + " v602 h84z";
    case "lparen":
      return `M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,` + (t + 84) + `c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-` + (t + 92) + `c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;
    case "rparen":
      return `M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,` + (t + 9) + `
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-` + (t + 144) + `c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;
    default:
      throw new Error("Unknown stretchy delimiter.");
  }
};
class he {
  // HtmlDomNode
  // Never used; needed for satisfying interface.
  constructor(e) {
    this.children = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.children = e, this.classes = [], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = {};
  }
  hasClass(e) {
    return I.contains(this.classes, e);
  }
  /** Convert the fragment into a node. */
  toNode() {
    for (var e = document.createDocumentFragment(), t = 0; t < this.children.length; t++)
      e.appendChild(this.children[t].toNode());
    return e;
  }
  /** Convert the fragment into HTML markup. */
  toMarkup() {
    for (var e = "", t = 0; t < this.children.length; t++)
      e += this.children[t].toMarkup();
    return e;
  }
  /**
   * Converts the math node into a string, similar to innerText. Applies to
   * MathDomNode's only.
   */
  toText() {
    var e = (t) => t.toText();
    return this.children.map(e).join("");
  }
}
var y0 = {
  "AMS-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.68889, 0, 0, 0.72222],
    66: [0, 0.68889, 0, 0, 0.66667],
    67: [0, 0.68889, 0, 0, 0.72222],
    68: [0, 0.68889, 0, 0, 0.72222],
    69: [0, 0.68889, 0, 0, 0.66667],
    70: [0, 0.68889, 0, 0, 0.61111],
    71: [0, 0.68889, 0, 0, 0.77778],
    72: [0, 0.68889, 0, 0, 0.77778],
    73: [0, 0.68889, 0, 0, 0.38889],
    74: [0.16667, 0.68889, 0, 0, 0.5],
    75: [0, 0.68889, 0, 0, 0.77778],
    76: [0, 0.68889, 0, 0, 0.66667],
    77: [0, 0.68889, 0, 0, 0.94445],
    78: [0, 0.68889, 0, 0, 0.72222],
    79: [0.16667, 0.68889, 0, 0, 0.77778],
    80: [0, 0.68889, 0, 0, 0.61111],
    81: [0.16667, 0.68889, 0, 0, 0.77778],
    82: [0, 0.68889, 0, 0, 0.72222],
    83: [0, 0.68889, 0, 0, 0.55556],
    84: [0, 0.68889, 0, 0, 0.66667],
    85: [0, 0.68889, 0, 0, 0.72222],
    86: [0, 0.68889, 0, 0, 0.72222],
    87: [0, 0.68889, 0, 0, 1],
    88: [0, 0.68889, 0, 0, 0.72222],
    89: [0, 0.68889, 0, 0, 0.72222],
    90: [0, 0.68889, 0, 0, 0.66667],
    107: [0, 0.68889, 0, 0, 0.55556],
    160: [0, 0, 0, 0, 0.25],
    165: [0, 0.675, 0.025, 0, 0.75],
    174: [0.15559, 0.69224, 0, 0, 0.94666],
    240: [0, 0.68889, 0, 0, 0.55556],
    295: [0, 0.68889, 0, 0, 0.54028],
    710: [0, 0.825, 0, 0, 2.33334],
    732: [0, 0.9, 0, 0, 2.33334],
    770: [0, 0.825, 0, 0, 2.33334],
    771: [0, 0.9, 0, 0, 2.33334],
    989: [0.08167, 0.58167, 0, 0, 0.77778],
    1008: [0, 0.43056, 0.04028, 0, 0.66667],
    8245: [0, 0.54986, 0, 0, 0.275],
    8463: [0, 0.68889, 0, 0, 0.54028],
    8487: [0, 0.68889, 0, 0, 0.72222],
    8498: [0, 0.68889, 0, 0, 0.55556],
    8502: [0, 0.68889, 0, 0, 0.66667],
    8503: [0, 0.68889, 0, 0, 0.44445],
    8504: [0, 0.68889, 0, 0, 0.66667],
    8513: [0, 0.68889, 0, 0, 0.63889],
    8592: [-0.03598, 0.46402, 0, 0, 0.5],
    8594: [-0.03598, 0.46402, 0, 0, 0.5],
    8602: [-0.13313, 0.36687, 0, 0, 1],
    8603: [-0.13313, 0.36687, 0, 0, 1],
    8606: [0.01354, 0.52239, 0, 0, 1],
    8608: [0.01354, 0.52239, 0, 0, 1],
    8610: [0.01354, 0.52239, 0, 0, 1.11111],
    8611: [0.01354, 0.52239, 0, 0, 1.11111],
    8619: [0, 0.54986, 0, 0, 1],
    8620: [0, 0.54986, 0, 0, 1],
    8621: [-0.13313, 0.37788, 0, 0, 1.38889],
    8622: [-0.13313, 0.36687, 0, 0, 1],
    8624: [0, 0.69224, 0, 0, 0.5],
    8625: [0, 0.69224, 0, 0, 0.5],
    8630: [0, 0.43056, 0, 0, 1],
    8631: [0, 0.43056, 0, 0, 1],
    8634: [0.08198, 0.58198, 0, 0, 0.77778],
    8635: [0.08198, 0.58198, 0, 0, 0.77778],
    8638: [0.19444, 0.69224, 0, 0, 0.41667],
    8639: [0.19444, 0.69224, 0, 0, 0.41667],
    8642: [0.19444, 0.69224, 0, 0, 0.41667],
    8643: [0.19444, 0.69224, 0, 0, 0.41667],
    8644: [0.1808, 0.675, 0, 0, 1],
    8646: [0.1808, 0.675, 0, 0, 1],
    8647: [0.1808, 0.675, 0, 0, 1],
    8648: [0.19444, 0.69224, 0, 0, 0.83334],
    8649: [0.1808, 0.675, 0, 0, 1],
    8650: [0.19444, 0.69224, 0, 0, 0.83334],
    8651: [0.01354, 0.52239, 0, 0, 1],
    8652: [0.01354, 0.52239, 0, 0, 1],
    8653: [-0.13313, 0.36687, 0, 0, 1],
    8654: [-0.13313, 0.36687, 0, 0, 1],
    8655: [-0.13313, 0.36687, 0, 0, 1],
    8666: [0.13667, 0.63667, 0, 0, 1],
    8667: [0.13667, 0.63667, 0, 0, 1],
    8669: [-0.13313, 0.37788, 0, 0, 1],
    8672: [-0.064, 0.437, 0, 0, 1.334],
    8674: [-0.064, 0.437, 0, 0, 1.334],
    8705: [0, 0.825, 0, 0, 0.5],
    8708: [0, 0.68889, 0, 0, 0.55556],
    8709: [0.08167, 0.58167, 0, 0, 0.77778],
    8717: [0, 0.43056, 0, 0, 0.42917],
    8722: [-0.03598, 0.46402, 0, 0, 0.5],
    8724: [0.08198, 0.69224, 0, 0, 0.77778],
    8726: [0.08167, 0.58167, 0, 0, 0.77778],
    8733: [0, 0.69224, 0, 0, 0.77778],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8737: [0, 0.69224, 0, 0, 0.72222],
    8738: [0.03517, 0.52239, 0, 0, 0.72222],
    8739: [0.08167, 0.58167, 0, 0, 0.22222],
    8740: [0.25142, 0.74111, 0, 0, 0.27778],
    8741: [0.08167, 0.58167, 0, 0, 0.38889],
    8742: [0.25142, 0.74111, 0, 0, 0.5],
    8756: [0, 0.69224, 0, 0, 0.66667],
    8757: [0, 0.69224, 0, 0, 0.66667],
    8764: [-0.13313, 0.36687, 0, 0, 0.77778],
    8765: [-0.13313, 0.37788, 0, 0, 0.77778],
    8769: [-0.13313, 0.36687, 0, 0, 0.77778],
    8770: [-0.03625, 0.46375, 0, 0, 0.77778],
    8774: [0.30274, 0.79383, 0, 0, 0.77778],
    8776: [-0.01688, 0.48312, 0, 0, 0.77778],
    8778: [0.08167, 0.58167, 0, 0, 0.77778],
    8782: [0.06062, 0.54986, 0, 0, 0.77778],
    8783: [0.06062, 0.54986, 0, 0, 0.77778],
    8785: [0.08198, 0.58198, 0, 0, 0.77778],
    8786: [0.08198, 0.58198, 0, 0, 0.77778],
    8787: [0.08198, 0.58198, 0, 0, 0.77778],
    8790: [0, 0.69224, 0, 0, 0.77778],
    8791: [0.22958, 0.72958, 0, 0, 0.77778],
    8796: [0.08198, 0.91667, 0, 0, 0.77778],
    8806: [0.25583, 0.75583, 0, 0, 0.77778],
    8807: [0.25583, 0.75583, 0, 0, 0.77778],
    8808: [0.25142, 0.75726, 0, 0, 0.77778],
    8809: [0.25142, 0.75726, 0, 0, 0.77778],
    8812: [0.25583, 0.75583, 0, 0, 0.5],
    8814: [0.20576, 0.70576, 0, 0, 0.77778],
    8815: [0.20576, 0.70576, 0, 0, 0.77778],
    8816: [0.30274, 0.79383, 0, 0, 0.77778],
    8817: [0.30274, 0.79383, 0, 0, 0.77778],
    8818: [0.22958, 0.72958, 0, 0, 0.77778],
    8819: [0.22958, 0.72958, 0, 0, 0.77778],
    8822: [0.1808, 0.675, 0, 0, 0.77778],
    8823: [0.1808, 0.675, 0, 0, 0.77778],
    8828: [0.13667, 0.63667, 0, 0, 0.77778],
    8829: [0.13667, 0.63667, 0, 0, 0.77778],
    8830: [0.22958, 0.72958, 0, 0, 0.77778],
    8831: [0.22958, 0.72958, 0, 0, 0.77778],
    8832: [0.20576, 0.70576, 0, 0, 0.77778],
    8833: [0.20576, 0.70576, 0, 0, 0.77778],
    8840: [0.30274, 0.79383, 0, 0, 0.77778],
    8841: [0.30274, 0.79383, 0, 0, 0.77778],
    8842: [0.13597, 0.63597, 0, 0, 0.77778],
    8843: [0.13597, 0.63597, 0, 0, 0.77778],
    8847: [0.03517, 0.54986, 0, 0, 0.77778],
    8848: [0.03517, 0.54986, 0, 0, 0.77778],
    8858: [0.08198, 0.58198, 0, 0, 0.77778],
    8859: [0.08198, 0.58198, 0, 0, 0.77778],
    8861: [0.08198, 0.58198, 0, 0, 0.77778],
    8862: [0, 0.675, 0, 0, 0.77778],
    8863: [0, 0.675, 0, 0, 0.77778],
    8864: [0, 0.675, 0, 0, 0.77778],
    8865: [0, 0.675, 0, 0, 0.77778],
    8872: [0, 0.69224, 0, 0, 0.61111],
    8873: [0, 0.69224, 0, 0, 0.72222],
    8874: [0, 0.69224, 0, 0, 0.88889],
    8876: [0, 0.68889, 0, 0, 0.61111],
    8877: [0, 0.68889, 0, 0, 0.61111],
    8878: [0, 0.68889, 0, 0, 0.72222],
    8879: [0, 0.68889, 0, 0, 0.72222],
    8882: [0.03517, 0.54986, 0, 0, 0.77778],
    8883: [0.03517, 0.54986, 0, 0, 0.77778],
    8884: [0.13667, 0.63667, 0, 0, 0.77778],
    8885: [0.13667, 0.63667, 0, 0, 0.77778],
    8888: [0, 0.54986, 0, 0, 1.11111],
    8890: [0.19444, 0.43056, 0, 0, 0.55556],
    8891: [0.19444, 0.69224, 0, 0, 0.61111],
    8892: [0.19444, 0.69224, 0, 0, 0.61111],
    8901: [0, 0.54986, 0, 0, 0.27778],
    8903: [0.08167, 0.58167, 0, 0, 0.77778],
    8905: [0.08167, 0.58167, 0, 0, 0.77778],
    8906: [0.08167, 0.58167, 0, 0, 0.77778],
    8907: [0, 0.69224, 0, 0, 0.77778],
    8908: [0, 0.69224, 0, 0, 0.77778],
    8909: [-0.03598, 0.46402, 0, 0, 0.77778],
    8910: [0, 0.54986, 0, 0, 0.76042],
    8911: [0, 0.54986, 0, 0, 0.76042],
    8912: [0.03517, 0.54986, 0, 0, 0.77778],
    8913: [0.03517, 0.54986, 0, 0, 0.77778],
    8914: [0, 0.54986, 0, 0, 0.66667],
    8915: [0, 0.54986, 0, 0, 0.66667],
    8916: [0, 0.69224, 0, 0, 0.66667],
    8918: [0.0391, 0.5391, 0, 0, 0.77778],
    8919: [0.0391, 0.5391, 0, 0, 0.77778],
    8920: [0.03517, 0.54986, 0, 0, 1.33334],
    8921: [0.03517, 0.54986, 0, 0, 1.33334],
    8922: [0.38569, 0.88569, 0, 0, 0.77778],
    8923: [0.38569, 0.88569, 0, 0, 0.77778],
    8926: [0.13667, 0.63667, 0, 0, 0.77778],
    8927: [0.13667, 0.63667, 0, 0, 0.77778],
    8928: [0.30274, 0.79383, 0, 0, 0.77778],
    8929: [0.30274, 0.79383, 0, 0, 0.77778],
    8934: [0.23222, 0.74111, 0, 0, 0.77778],
    8935: [0.23222, 0.74111, 0, 0, 0.77778],
    8936: [0.23222, 0.74111, 0, 0, 0.77778],
    8937: [0.23222, 0.74111, 0, 0, 0.77778],
    8938: [0.20576, 0.70576, 0, 0, 0.77778],
    8939: [0.20576, 0.70576, 0, 0, 0.77778],
    8940: [0.30274, 0.79383, 0, 0, 0.77778],
    8941: [0.30274, 0.79383, 0, 0, 0.77778],
    8994: [0.19444, 0.69224, 0, 0, 0.77778],
    8995: [0.19444, 0.69224, 0, 0, 0.77778],
    9416: [0.15559, 0.69224, 0, 0, 0.90222],
    9484: [0, 0.69224, 0, 0, 0.5],
    9488: [0, 0.69224, 0, 0, 0.5],
    9492: [0, 0.37788, 0, 0, 0.5],
    9496: [0, 0.37788, 0, 0, 0.5],
    9585: [0.19444, 0.68889, 0, 0, 0.88889],
    9586: [0.19444, 0.74111, 0, 0, 0.88889],
    9632: [0, 0.675, 0, 0, 0.77778],
    9633: [0, 0.675, 0, 0, 0.77778],
    9650: [0, 0.54986, 0, 0, 0.72222],
    9651: [0, 0.54986, 0, 0, 0.72222],
    9654: [0.03517, 0.54986, 0, 0, 0.77778],
    9660: [0, 0.54986, 0, 0, 0.72222],
    9661: [0, 0.54986, 0, 0, 0.72222],
    9664: [0.03517, 0.54986, 0, 0, 0.77778],
    9674: [0.11111, 0.69224, 0, 0, 0.66667],
    9733: [0.19444, 0.69224, 0, 0, 0.94445],
    10003: [0, 0.69224, 0, 0, 0.83334],
    10016: [0, 0.69224, 0, 0, 0.83334],
    10731: [0.11111, 0.69224, 0, 0, 0.66667],
    10846: [0.19444, 0.75583, 0, 0, 0.61111],
    10877: [0.13667, 0.63667, 0, 0, 0.77778],
    10878: [0.13667, 0.63667, 0, 0, 0.77778],
    10885: [0.25583, 0.75583, 0, 0, 0.77778],
    10886: [0.25583, 0.75583, 0, 0, 0.77778],
    10887: [0.13597, 0.63597, 0, 0, 0.77778],
    10888: [0.13597, 0.63597, 0, 0, 0.77778],
    10889: [0.26167, 0.75726, 0, 0, 0.77778],
    10890: [0.26167, 0.75726, 0, 0, 0.77778],
    10891: [0.48256, 0.98256, 0, 0, 0.77778],
    10892: [0.48256, 0.98256, 0, 0, 0.77778],
    10901: [0.13667, 0.63667, 0, 0, 0.77778],
    10902: [0.13667, 0.63667, 0, 0, 0.77778],
    10933: [0.25142, 0.75726, 0, 0, 0.77778],
    10934: [0.25142, 0.75726, 0, 0, 0.77778],
    10935: [0.26167, 0.75726, 0, 0, 0.77778],
    10936: [0.26167, 0.75726, 0, 0, 0.77778],
    10937: [0.26167, 0.75726, 0, 0, 0.77778],
    10938: [0.26167, 0.75726, 0, 0, 0.77778],
    10949: [0.25583, 0.75583, 0, 0, 0.77778],
    10950: [0.25583, 0.75583, 0, 0, 0.77778],
    10955: [0.28481, 0.79383, 0, 0, 0.77778],
    10956: [0.28481, 0.79383, 0, 0, 0.77778],
    57350: [0.08167, 0.58167, 0, 0, 0.22222],
    57351: [0.08167, 0.58167, 0, 0, 0.38889],
    57352: [0.08167, 0.58167, 0, 0, 0.77778],
    57353: [0, 0.43056, 0.04028, 0, 0.66667],
    57356: [0.25142, 0.75726, 0, 0, 0.77778],
    57357: [0.25142, 0.75726, 0, 0, 0.77778],
    57358: [0.41951, 0.91951, 0, 0, 0.77778],
    57359: [0.30274, 0.79383, 0, 0, 0.77778],
    57360: [0.30274, 0.79383, 0, 0, 0.77778],
    57361: [0.41951, 0.91951, 0, 0, 0.77778],
    57366: [0.25142, 0.75726, 0, 0, 0.77778],
    57367: [0.25142, 0.75726, 0, 0, 0.77778],
    57368: [0.25142, 0.75726, 0, 0, 0.77778],
    57369: [0.25142, 0.75726, 0, 0, 0.77778],
    57370: [0.13597, 0.63597, 0, 0, 0.77778],
    57371: [0.13597, 0.63597, 0, 0, 0.77778]
  },
  "Caligraphic-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.68333, 0, 0.19445, 0.79847],
    66: [0, 0.68333, 0.03041, 0.13889, 0.65681],
    67: [0, 0.68333, 0.05834, 0.13889, 0.52653],
    68: [0, 0.68333, 0.02778, 0.08334, 0.77139],
    69: [0, 0.68333, 0.08944, 0.11111, 0.52778],
    70: [0, 0.68333, 0.09931, 0.11111, 0.71875],
    71: [0.09722, 0.68333, 0.0593, 0.11111, 0.59487],
    72: [0, 0.68333, 965e-5, 0.11111, 0.84452],
    73: [0, 0.68333, 0.07382, 0, 0.54452],
    74: [0.09722, 0.68333, 0.18472, 0.16667, 0.67778],
    75: [0, 0.68333, 0.01445, 0.05556, 0.76195],
    76: [0, 0.68333, 0, 0.13889, 0.68972],
    77: [0, 0.68333, 0, 0.13889, 1.2009],
    78: [0, 0.68333, 0.14736, 0.08334, 0.82049],
    79: [0, 0.68333, 0.02778, 0.11111, 0.79611],
    80: [0, 0.68333, 0.08222, 0.08334, 0.69556],
    81: [0.09722, 0.68333, 0, 0.11111, 0.81667],
    82: [0, 0.68333, 0, 0.08334, 0.8475],
    83: [0, 0.68333, 0.075, 0.13889, 0.60556],
    84: [0, 0.68333, 0.25417, 0, 0.54464],
    85: [0, 0.68333, 0.09931, 0.08334, 0.62583],
    86: [0, 0.68333, 0.08222, 0, 0.61278],
    87: [0, 0.68333, 0.08222, 0.08334, 0.98778],
    88: [0, 0.68333, 0.14643, 0.13889, 0.7133],
    89: [0.09722, 0.68333, 0.08222, 0.08334, 0.66834],
    90: [0, 0.68333, 0.07944, 0.13889, 0.72473],
    160: [0, 0, 0, 0, 0.25]
  },
  "Fraktur-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69141, 0, 0, 0.29574],
    34: [0, 0.69141, 0, 0, 0.21471],
    38: [0, 0.69141, 0, 0, 0.73786],
    39: [0, 0.69141, 0, 0, 0.21201],
    40: [0.24982, 0.74947, 0, 0, 0.38865],
    41: [0.24982, 0.74947, 0, 0, 0.38865],
    42: [0, 0.62119, 0, 0, 0.27764],
    43: [0.08319, 0.58283, 0, 0, 0.75623],
    44: [0, 0.10803, 0, 0, 0.27764],
    45: [0.08319, 0.58283, 0, 0, 0.75623],
    46: [0, 0.10803, 0, 0, 0.27764],
    47: [0.24982, 0.74947, 0, 0, 0.50181],
    48: [0, 0.47534, 0, 0, 0.50181],
    49: [0, 0.47534, 0, 0, 0.50181],
    50: [0, 0.47534, 0, 0, 0.50181],
    51: [0.18906, 0.47534, 0, 0, 0.50181],
    52: [0.18906, 0.47534, 0, 0, 0.50181],
    53: [0.18906, 0.47534, 0, 0, 0.50181],
    54: [0, 0.69141, 0, 0, 0.50181],
    55: [0.18906, 0.47534, 0, 0, 0.50181],
    56: [0, 0.69141, 0, 0, 0.50181],
    57: [0.18906, 0.47534, 0, 0, 0.50181],
    58: [0, 0.47534, 0, 0, 0.21606],
    59: [0.12604, 0.47534, 0, 0, 0.21606],
    61: [-0.13099, 0.36866, 0, 0, 0.75623],
    63: [0, 0.69141, 0, 0, 0.36245],
    65: [0, 0.69141, 0, 0, 0.7176],
    66: [0, 0.69141, 0, 0, 0.88397],
    67: [0, 0.69141, 0, 0, 0.61254],
    68: [0, 0.69141, 0, 0, 0.83158],
    69: [0, 0.69141, 0, 0, 0.66278],
    70: [0.12604, 0.69141, 0, 0, 0.61119],
    71: [0, 0.69141, 0, 0, 0.78539],
    72: [0.06302, 0.69141, 0, 0, 0.7203],
    73: [0, 0.69141, 0, 0, 0.55448],
    74: [0.12604, 0.69141, 0, 0, 0.55231],
    75: [0, 0.69141, 0, 0, 0.66845],
    76: [0, 0.69141, 0, 0, 0.66602],
    77: [0, 0.69141, 0, 0, 1.04953],
    78: [0, 0.69141, 0, 0, 0.83212],
    79: [0, 0.69141, 0, 0, 0.82699],
    80: [0.18906, 0.69141, 0, 0, 0.82753],
    81: [0.03781, 0.69141, 0, 0, 0.82699],
    82: [0, 0.69141, 0, 0, 0.82807],
    83: [0, 0.69141, 0, 0, 0.82861],
    84: [0, 0.69141, 0, 0, 0.66899],
    85: [0, 0.69141, 0, 0, 0.64576],
    86: [0, 0.69141, 0, 0, 0.83131],
    87: [0, 0.69141, 0, 0, 1.04602],
    88: [0, 0.69141, 0, 0, 0.71922],
    89: [0.18906, 0.69141, 0, 0, 0.83293],
    90: [0.12604, 0.69141, 0, 0, 0.60201],
    91: [0.24982, 0.74947, 0, 0, 0.27764],
    93: [0.24982, 0.74947, 0, 0, 0.27764],
    94: [0, 0.69141, 0, 0, 0.49965],
    97: [0, 0.47534, 0, 0, 0.50046],
    98: [0, 0.69141, 0, 0, 0.51315],
    99: [0, 0.47534, 0, 0, 0.38946],
    100: [0, 0.62119, 0, 0, 0.49857],
    101: [0, 0.47534, 0, 0, 0.40053],
    102: [0.18906, 0.69141, 0, 0, 0.32626],
    103: [0.18906, 0.47534, 0, 0, 0.5037],
    104: [0.18906, 0.69141, 0, 0, 0.52126],
    105: [0, 0.69141, 0, 0, 0.27899],
    106: [0, 0.69141, 0, 0, 0.28088],
    107: [0, 0.69141, 0, 0, 0.38946],
    108: [0, 0.69141, 0, 0, 0.27953],
    109: [0, 0.47534, 0, 0, 0.76676],
    110: [0, 0.47534, 0, 0, 0.52666],
    111: [0, 0.47534, 0, 0, 0.48885],
    112: [0.18906, 0.52396, 0, 0, 0.50046],
    113: [0.18906, 0.47534, 0, 0, 0.48912],
    114: [0, 0.47534, 0, 0, 0.38919],
    115: [0, 0.47534, 0, 0, 0.44266],
    116: [0, 0.62119, 0, 0, 0.33301],
    117: [0, 0.47534, 0, 0, 0.5172],
    118: [0, 0.52396, 0, 0, 0.5118],
    119: [0, 0.52396, 0, 0, 0.77351],
    120: [0.18906, 0.47534, 0, 0, 0.38865],
    121: [0.18906, 0.47534, 0, 0, 0.49884],
    122: [0.18906, 0.47534, 0, 0, 0.39054],
    160: [0, 0, 0, 0, 0.25],
    8216: [0, 0.69141, 0, 0, 0.21471],
    8217: [0, 0.69141, 0, 0, 0.21471],
    58112: [0, 0.62119, 0, 0, 0.49749],
    58113: [0, 0.62119, 0, 0, 0.4983],
    58114: [0.18906, 0.69141, 0, 0, 0.33328],
    58115: [0.18906, 0.69141, 0, 0, 0.32923],
    58116: [0.18906, 0.47534, 0, 0, 0.50343],
    58117: [0, 0.69141, 0, 0, 0.33301],
    58118: [0, 0.62119, 0, 0, 0.33409],
    58119: [0, 0.47534, 0, 0, 0.50073]
  },
  "Main-Bold": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.35],
    34: [0, 0.69444, 0, 0, 0.60278],
    35: [0.19444, 0.69444, 0, 0, 0.95833],
    36: [0.05556, 0.75, 0, 0, 0.575],
    37: [0.05556, 0.75, 0, 0, 0.95833],
    38: [0, 0.69444, 0, 0, 0.89444],
    39: [0, 0.69444, 0, 0, 0.31944],
    40: [0.25, 0.75, 0, 0, 0.44722],
    41: [0.25, 0.75, 0, 0, 0.44722],
    42: [0, 0.75, 0, 0, 0.575],
    43: [0.13333, 0.63333, 0, 0, 0.89444],
    44: [0.19444, 0.15556, 0, 0, 0.31944],
    45: [0, 0.44444, 0, 0, 0.38333],
    46: [0, 0.15556, 0, 0, 0.31944],
    47: [0.25, 0.75, 0, 0, 0.575],
    48: [0, 0.64444, 0, 0, 0.575],
    49: [0, 0.64444, 0, 0, 0.575],
    50: [0, 0.64444, 0, 0, 0.575],
    51: [0, 0.64444, 0, 0, 0.575],
    52: [0, 0.64444, 0, 0, 0.575],
    53: [0, 0.64444, 0, 0, 0.575],
    54: [0, 0.64444, 0, 0, 0.575],
    55: [0, 0.64444, 0, 0, 0.575],
    56: [0, 0.64444, 0, 0, 0.575],
    57: [0, 0.64444, 0, 0, 0.575],
    58: [0, 0.44444, 0, 0, 0.31944],
    59: [0.19444, 0.44444, 0, 0, 0.31944],
    60: [0.08556, 0.58556, 0, 0, 0.89444],
    61: [-0.10889, 0.39111, 0, 0, 0.89444],
    62: [0.08556, 0.58556, 0, 0, 0.89444],
    63: [0, 0.69444, 0, 0, 0.54305],
    64: [0, 0.69444, 0, 0, 0.89444],
    65: [0, 0.68611, 0, 0, 0.86944],
    66: [0, 0.68611, 0, 0, 0.81805],
    67: [0, 0.68611, 0, 0, 0.83055],
    68: [0, 0.68611, 0, 0, 0.88194],
    69: [0, 0.68611, 0, 0, 0.75555],
    70: [0, 0.68611, 0, 0, 0.72361],
    71: [0, 0.68611, 0, 0, 0.90416],
    72: [0, 0.68611, 0, 0, 0.9],
    73: [0, 0.68611, 0, 0, 0.43611],
    74: [0, 0.68611, 0, 0, 0.59444],
    75: [0, 0.68611, 0, 0, 0.90138],
    76: [0, 0.68611, 0, 0, 0.69166],
    77: [0, 0.68611, 0, 0, 1.09166],
    78: [0, 0.68611, 0, 0, 0.9],
    79: [0, 0.68611, 0, 0, 0.86388],
    80: [0, 0.68611, 0, 0, 0.78611],
    81: [0.19444, 0.68611, 0, 0, 0.86388],
    82: [0, 0.68611, 0, 0, 0.8625],
    83: [0, 0.68611, 0, 0, 0.63889],
    84: [0, 0.68611, 0, 0, 0.8],
    85: [0, 0.68611, 0, 0, 0.88472],
    86: [0, 0.68611, 0.01597, 0, 0.86944],
    87: [0, 0.68611, 0.01597, 0, 1.18888],
    88: [0, 0.68611, 0, 0, 0.86944],
    89: [0, 0.68611, 0.02875, 0, 0.86944],
    90: [0, 0.68611, 0, 0, 0.70277],
    91: [0.25, 0.75, 0, 0, 0.31944],
    92: [0.25, 0.75, 0, 0, 0.575],
    93: [0.25, 0.75, 0, 0, 0.31944],
    94: [0, 0.69444, 0, 0, 0.575],
    95: [0.31, 0.13444, 0.03194, 0, 0.575],
    97: [0, 0.44444, 0, 0, 0.55902],
    98: [0, 0.69444, 0, 0, 0.63889],
    99: [0, 0.44444, 0, 0, 0.51111],
    100: [0, 0.69444, 0, 0, 0.63889],
    101: [0, 0.44444, 0, 0, 0.52708],
    102: [0, 0.69444, 0.10903, 0, 0.35139],
    103: [0.19444, 0.44444, 0.01597, 0, 0.575],
    104: [0, 0.69444, 0, 0, 0.63889],
    105: [0, 0.69444, 0, 0, 0.31944],
    106: [0.19444, 0.69444, 0, 0, 0.35139],
    107: [0, 0.69444, 0, 0, 0.60694],
    108: [0, 0.69444, 0, 0, 0.31944],
    109: [0, 0.44444, 0, 0, 0.95833],
    110: [0, 0.44444, 0, 0, 0.63889],
    111: [0, 0.44444, 0, 0, 0.575],
    112: [0.19444, 0.44444, 0, 0, 0.63889],
    113: [0.19444, 0.44444, 0, 0, 0.60694],
    114: [0, 0.44444, 0, 0, 0.47361],
    115: [0, 0.44444, 0, 0, 0.45361],
    116: [0, 0.63492, 0, 0, 0.44722],
    117: [0, 0.44444, 0, 0, 0.63889],
    118: [0, 0.44444, 0.01597, 0, 0.60694],
    119: [0, 0.44444, 0.01597, 0, 0.83055],
    120: [0, 0.44444, 0, 0, 0.60694],
    121: [0.19444, 0.44444, 0.01597, 0, 0.60694],
    122: [0, 0.44444, 0, 0, 0.51111],
    123: [0.25, 0.75, 0, 0, 0.575],
    124: [0.25, 0.75, 0, 0, 0.31944],
    125: [0.25, 0.75, 0, 0, 0.575],
    126: [0.35, 0.34444, 0, 0, 0.575],
    160: [0, 0, 0, 0, 0.25],
    163: [0, 0.69444, 0, 0, 0.86853],
    168: [0, 0.69444, 0, 0, 0.575],
    172: [0, 0.44444, 0, 0, 0.76666],
    176: [0, 0.69444, 0, 0, 0.86944],
    177: [0.13333, 0.63333, 0, 0, 0.89444],
    184: [0.17014, 0, 0, 0, 0.51111],
    198: [0, 0.68611, 0, 0, 1.04166],
    215: [0.13333, 0.63333, 0, 0, 0.89444],
    216: [0.04861, 0.73472, 0, 0, 0.89444],
    223: [0, 0.69444, 0, 0, 0.59722],
    230: [0, 0.44444, 0, 0, 0.83055],
    247: [0.13333, 0.63333, 0, 0, 0.89444],
    248: [0.09722, 0.54167, 0, 0, 0.575],
    305: [0, 0.44444, 0, 0, 0.31944],
    338: [0, 0.68611, 0, 0, 1.16944],
    339: [0, 0.44444, 0, 0, 0.89444],
    567: [0.19444, 0.44444, 0, 0, 0.35139],
    710: [0, 0.69444, 0, 0, 0.575],
    711: [0, 0.63194, 0, 0, 0.575],
    713: [0, 0.59611, 0, 0, 0.575],
    714: [0, 0.69444, 0, 0, 0.575],
    715: [0, 0.69444, 0, 0, 0.575],
    728: [0, 0.69444, 0, 0, 0.575],
    729: [0, 0.69444, 0, 0, 0.31944],
    730: [0, 0.69444, 0, 0, 0.86944],
    732: [0, 0.69444, 0, 0, 0.575],
    733: [0, 0.69444, 0, 0, 0.575],
    915: [0, 0.68611, 0, 0, 0.69166],
    916: [0, 0.68611, 0, 0, 0.95833],
    920: [0, 0.68611, 0, 0, 0.89444],
    923: [0, 0.68611, 0, 0, 0.80555],
    926: [0, 0.68611, 0, 0, 0.76666],
    928: [0, 0.68611, 0, 0, 0.9],
    931: [0, 0.68611, 0, 0, 0.83055],
    933: [0, 0.68611, 0, 0, 0.89444],
    934: [0, 0.68611, 0, 0, 0.83055],
    936: [0, 0.68611, 0, 0, 0.89444],
    937: [0, 0.68611, 0, 0, 0.83055],
    8211: [0, 0.44444, 0.03194, 0, 0.575],
    8212: [0, 0.44444, 0.03194, 0, 1.14999],
    8216: [0, 0.69444, 0, 0, 0.31944],
    8217: [0, 0.69444, 0, 0, 0.31944],
    8220: [0, 0.69444, 0, 0, 0.60278],
    8221: [0, 0.69444, 0, 0, 0.60278],
    8224: [0.19444, 0.69444, 0, 0, 0.51111],
    8225: [0.19444, 0.69444, 0, 0, 0.51111],
    8242: [0, 0.55556, 0, 0, 0.34444],
    8407: [0, 0.72444, 0.15486, 0, 0.575],
    8463: [0, 0.69444, 0, 0, 0.66759],
    8465: [0, 0.69444, 0, 0, 0.83055],
    8467: [0, 0.69444, 0, 0, 0.47361],
    8472: [0.19444, 0.44444, 0, 0, 0.74027],
    8476: [0, 0.69444, 0, 0, 0.83055],
    8501: [0, 0.69444, 0, 0, 0.70277],
    8592: [-0.10889, 0.39111, 0, 0, 1.14999],
    8593: [0.19444, 0.69444, 0, 0, 0.575],
    8594: [-0.10889, 0.39111, 0, 0, 1.14999],
    8595: [0.19444, 0.69444, 0, 0, 0.575],
    8596: [-0.10889, 0.39111, 0, 0, 1.14999],
    8597: [0.25, 0.75, 0, 0, 0.575],
    8598: [0.19444, 0.69444, 0, 0, 1.14999],
    8599: [0.19444, 0.69444, 0, 0, 1.14999],
    8600: [0.19444, 0.69444, 0, 0, 1.14999],
    8601: [0.19444, 0.69444, 0, 0, 1.14999],
    8636: [-0.10889, 0.39111, 0, 0, 1.14999],
    8637: [-0.10889, 0.39111, 0, 0, 1.14999],
    8640: [-0.10889, 0.39111, 0, 0, 1.14999],
    8641: [-0.10889, 0.39111, 0, 0, 1.14999],
    8656: [-0.10889, 0.39111, 0, 0, 1.14999],
    8657: [0.19444, 0.69444, 0, 0, 0.70277],
    8658: [-0.10889, 0.39111, 0, 0, 1.14999],
    8659: [0.19444, 0.69444, 0, 0, 0.70277],
    8660: [-0.10889, 0.39111, 0, 0, 1.14999],
    8661: [0.25, 0.75, 0, 0, 0.70277],
    8704: [0, 0.69444, 0, 0, 0.63889],
    8706: [0, 0.69444, 0.06389, 0, 0.62847],
    8707: [0, 0.69444, 0, 0, 0.63889],
    8709: [0.05556, 0.75, 0, 0, 0.575],
    8711: [0, 0.68611, 0, 0, 0.95833],
    8712: [0.08556, 0.58556, 0, 0, 0.76666],
    8715: [0.08556, 0.58556, 0, 0, 0.76666],
    8722: [0.13333, 0.63333, 0, 0, 0.89444],
    8723: [0.13333, 0.63333, 0, 0, 0.89444],
    8725: [0.25, 0.75, 0, 0, 0.575],
    8726: [0.25, 0.75, 0, 0, 0.575],
    8727: [-0.02778, 0.47222, 0, 0, 0.575],
    8728: [-0.02639, 0.47361, 0, 0, 0.575],
    8729: [-0.02639, 0.47361, 0, 0, 0.575],
    8730: [0.18, 0.82, 0, 0, 0.95833],
    8733: [0, 0.44444, 0, 0, 0.89444],
    8734: [0, 0.44444, 0, 0, 1.14999],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8739: [0.25, 0.75, 0, 0, 0.31944],
    8741: [0.25, 0.75, 0, 0, 0.575],
    8743: [0, 0.55556, 0, 0, 0.76666],
    8744: [0, 0.55556, 0, 0, 0.76666],
    8745: [0, 0.55556, 0, 0, 0.76666],
    8746: [0, 0.55556, 0, 0, 0.76666],
    8747: [0.19444, 0.69444, 0.12778, 0, 0.56875],
    8764: [-0.10889, 0.39111, 0, 0, 0.89444],
    8768: [0.19444, 0.69444, 0, 0, 0.31944],
    8771: [222e-5, 0.50222, 0, 0, 0.89444],
    8773: [0.027, 0.638, 0, 0, 0.894],
    8776: [0.02444, 0.52444, 0, 0, 0.89444],
    8781: [222e-5, 0.50222, 0, 0, 0.89444],
    8801: [222e-5, 0.50222, 0, 0, 0.89444],
    8804: [0.19667, 0.69667, 0, 0, 0.89444],
    8805: [0.19667, 0.69667, 0, 0, 0.89444],
    8810: [0.08556, 0.58556, 0, 0, 1.14999],
    8811: [0.08556, 0.58556, 0, 0, 1.14999],
    8826: [0.08556, 0.58556, 0, 0, 0.89444],
    8827: [0.08556, 0.58556, 0, 0, 0.89444],
    8834: [0.08556, 0.58556, 0, 0, 0.89444],
    8835: [0.08556, 0.58556, 0, 0, 0.89444],
    8838: [0.19667, 0.69667, 0, 0, 0.89444],
    8839: [0.19667, 0.69667, 0, 0, 0.89444],
    8846: [0, 0.55556, 0, 0, 0.76666],
    8849: [0.19667, 0.69667, 0, 0, 0.89444],
    8850: [0.19667, 0.69667, 0, 0, 0.89444],
    8851: [0, 0.55556, 0, 0, 0.76666],
    8852: [0, 0.55556, 0, 0, 0.76666],
    8853: [0.13333, 0.63333, 0, 0, 0.89444],
    8854: [0.13333, 0.63333, 0, 0, 0.89444],
    8855: [0.13333, 0.63333, 0, 0, 0.89444],
    8856: [0.13333, 0.63333, 0, 0, 0.89444],
    8857: [0.13333, 0.63333, 0, 0, 0.89444],
    8866: [0, 0.69444, 0, 0, 0.70277],
    8867: [0, 0.69444, 0, 0, 0.70277],
    8868: [0, 0.69444, 0, 0, 0.89444],
    8869: [0, 0.69444, 0, 0, 0.89444],
    8900: [-0.02639, 0.47361, 0, 0, 0.575],
    8901: [-0.02639, 0.47361, 0, 0, 0.31944],
    8902: [-0.02778, 0.47222, 0, 0, 0.575],
    8968: [0.25, 0.75, 0, 0, 0.51111],
    8969: [0.25, 0.75, 0, 0, 0.51111],
    8970: [0.25, 0.75, 0, 0, 0.51111],
    8971: [0.25, 0.75, 0, 0, 0.51111],
    8994: [-0.13889, 0.36111, 0, 0, 1.14999],
    8995: [-0.13889, 0.36111, 0, 0, 1.14999],
    9651: [0.19444, 0.69444, 0, 0, 1.02222],
    9657: [-0.02778, 0.47222, 0, 0, 0.575],
    9661: [0.19444, 0.69444, 0, 0, 1.02222],
    9667: [-0.02778, 0.47222, 0, 0, 0.575],
    9711: [0.19444, 0.69444, 0, 0, 1.14999],
    9824: [0.12963, 0.69444, 0, 0, 0.89444],
    9825: [0.12963, 0.69444, 0, 0, 0.89444],
    9826: [0.12963, 0.69444, 0, 0, 0.89444],
    9827: [0.12963, 0.69444, 0, 0, 0.89444],
    9837: [0, 0.75, 0, 0, 0.44722],
    9838: [0.19444, 0.69444, 0, 0, 0.44722],
    9839: [0.19444, 0.69444, 0, 0, 0.44722],
    10216: [0.25, 0.75, 0, 0, 0.44722],
    10217: [0.25, 0.75, 0, 0, 0.44722],
    10815: [0, 0.68611, 0, 0, 0.9],
    10927: [0.19667, 0.69667, 0, 0, 0.89444],
    10928: [0.19667, 0.69667, 0, 0, 0.89444],
    57376: [0.19444, 0.69444, 0, 0, 0]
  },
  "Main-BoldItalic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.11417, 0, 0.38611],
    34: [0, 0.69444, 0.07939, 0, 0.62055],
    35: [0.19444, 0.69444, 0.06833, 0, 0.94444],
    37: [0.05556, 0.75, 0.12861, 0, 0.94444],
    38: [0, 0.69444, 0.08528, 0, 0.88555],
    39: [0, 0.69444, 0.12945, 0, 0.35555],
    40: [0.25, 0.75, 0.15806, 0, 0.47333],
    41: [0.25, 0.75, 0.03306, 0, 0.47333],
    42: [0, 0.75, 0.14333, 0, 0.59111],
    43: [0.10333, 0.60333, 0.03306, 0, 0.88555],
    44: [0.19444, 0.14722, 0, 0, 0.35555],
    45: [0, 0.44444, 0.02611, 0, 0.41444],
    46: [0, 0.14722, 0, 0, 0.35555],
    47: [0.25, 0.75, 0.15806, 0, 0.59111],
    48: [0, 0.64444, 0.13167, 0, 0.59111],
    49: [0, 0.64444, 0.13167, 0, 0.59111],
    50: [0, 0.64444, 0.13167, 0, 0.59111],
    51: [0, 0.64444, 0.13167, 0, 0.59111],
    52: [0.19444, 0.64444, 0.13167, 0, 0.59111],
    53: [0, 0.64444, 0.13167, 0, 0.59111],
    54: [0, 0.64444, 0.13167, 0, 0.59111],
    55: [0.19444, 0.64444, 0.13167, 0, 0.59111],
    56: [0, 0.64444, 0.13167, 0, 0.59111],
    57: [0, 0.64444, 0.13167, 0, 0.59111],
    58: [0, 0.44444, 0.06695, 0, 0.35555],
    59: [0.19444, 0.44444, 0.06695, 0, 0.35555],
    61: [-0.10889, 0.39111, 0.06833, 0, 0.88555],
    63: [0, 0.69444, 0.11472, 0, 0.59111],
    64: [0, 0.69444, 0.09208, 0, 0.88555],
    65: [0, 0.68611, 0, 0, 0.86555],
    66: [0, 0.68611, 0.0992, 0, 0.81666],
    67: [0, 0.68611, 0.14208, 0, 0.82666],
    68: [0, 0.68611, 0.09062, 0, 0.87555],
    69: [0, 0.68611, 0.11431, 0, 0.75666],
    70: [0, 0.68611, 0.12903, 0, 0.72722],
    71: [0, 0.68611, 0.07347, 0, 0.89527],
    72: [0, 0.68611, 0.17208, 0, 0.8961],
    73: [0, 0.68611, 0.15681, 0, 0.47166],
    74: [0, 0.68611, 0.145, 0, 0.61055],
    75: [0, 0.68611, 0.14208, 0, 0.89499],
    76: [0, 0.68611, 0, 0, 0.69777],
    77: [0, 0.68611, 0.17208, 0, 1.07277],
    78: [0, 0.68611, 0.17208, 0, 0.8961],
    79: [0, 0.68611, 0.09062, 0, 0.85499],
    80: [0, 0.68611, 0.0992, 0, 0.78721],
    81: [0.19444, 0.68611, 0.09062, 0, 0.85499],
    82: [0, 0.68611, 0.02559, 0, 0.85944],
    83: [0, 0.68611, 0.11264, 0, 0.64999],
    84: [0, 0.68611, 0.12903, 0, 0.7961],
    85: [0, 0.68611, 0.17208, 0, 0.88083],
    86: [0, 0.68611, 0.18625, 0, 0.86555],
    87: [0, 0.68611, 0.18625, 0, 1.15999],
    88: [0, 0.68611, 0.15681, 0, 0.86555],
    89: [0, 0.68611, 0.19803, 0, 0.86555],
    90: [0, 0.68611, 0.14208, 0, 0.70888],
    91: [0.25, 0.75, 0.1875, 0, 0.35611],
    93: [0.25, 0.75, 0.09972, 0, 0.35611],
    94: [0, 0.69444, 0.06709, 0, 0.59111],
    95: [0.31, 0.13444, 0.09811, 0, 0.59111],
    97: [0, 0.44444, 0.09426, 0, 0.59111],
    98: [0, 0.69444, 0.07861, 0, 0.53222],
    99: [0, 0.44444, 0.05222, 0, 0.53222],
    100: [0, 0.69444, 0.10861, 0, 0.59111],
    101: [0, 0.44444, 0.085, 0, 0.53222],
    102: [0.19444, 0.69444, 0.21778, 0, 0.4],
    103: [0.19444, 0.44444, 0.105, 0, 0.53222],
    104: [0, 0.69444, 0.09426, 0, 0.59111],
    105: [0, 0.69326, 0.11387, 0, 0.35555],
    106: [0.19444, 0.69326, 0.1672, 0, 0.35555],
    107: [0, 0.69444, 0.11111, 0, 0.53222],
    108: [0, 0.69444, 0.10861, 0, 0.29666],
    109: [0, 0.44444, 0.09426, 0, 0.94444],
    110: [0, 0.44444, 0.09426, 0, 0.64999],
    111: [0, 0.44444, 0.07861, 0, 0.59111],
    112: [0.19444, 0.44444, 0.07861, 0, 0.59111],
    113: [0.19444, 0.44444, 0.105, 0, 0.53222],
    114: [0, 0.44444, 0.11111, 0, 0.50167],
    115: [0, 0.44444, 0.08167, 0, 0.48694],
    116: [0, 0.63492, 0.09639, 0, 0.385],
    117: [0, 0.44444, 0.09426, 0, 0.62055],
    118: [0, 0.44444, 0.11111, 0, 0.53222],
    119: [0, 0.44444, 0.11111, 0, 0.76777],
    120: [0, 0.44444, 0.12583, 0, 0.56055],
    121: [0.19444, 0.44444, 0.105, 0, 0.56166],
    122: [0, 0.44444, 0.13889, 0, 0.49055],
    126: [0.35, 0.34444, 0.11472, 0, 0.59111],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.69444, 0.11473, 0, 0.59111],
    176: [0, 0.69444, 0, 0, 0.94888],
    184: [0.17014, 0, 0, 0, 0.53222],
    198: [0, 0.68611, 0.11431, 0, 1.02277],
    216: [0.04861, 0.73472, 0.09062, 0, 0.88555],
    223: [0.19444, 0.69444, 0.09736, 0, 0.665],
    230: [0, 0.44444, 0.085, 0, 0.82666],
    248: [0.09722, 0.54167, 0.09458, 0, 0.59111],
    305: [0, 0.44444, 0.09426, 0, 0.35555],
    338: [0, 0.68611, 0.11431, 0, 1.14054],
    339: [0, 0.44444, 0.085, 0, 0.82666],
    567: [0.19444, 0.44444, 0.04611, 0, 0.385],
    710: [0, 0.69444, 0.06709, 0, 0.59111],
    711: [0, 0.63194, 0.08271, 0, 0.59111],
    713: [0, 0.59444, 0.10444, 0, 0.59111],
    714: [0, 0.69444, 0.08528, 0, 0.59111],
    715: [0, 0.69444, 0, 0, 0.59111],
    728: [0, 0.69444, 0.10333, 0, 0.59111],
    729: [0, 0.69444, 0.12945, 0, 0.35555],
    730: [0, 0.69444, 0, 0, 0.94888],
    732: [0, 0.69444, 0.11472, 0, 0.59111],
    733: [0, 0.69444, 0.11472, 0, 0.59111],
    915: [0, 0.68611, 0.12903, 0, 0.69777],
    916: [0, 0.68611, 0, 0, 0.94444],
    920: [0, 0.68611, 0.09062, 0, 0.88555],
    923: [0, 0.68611, 0, 0, 0.80666],
    926: [0, 0.68611, 0.15092, 0, 0.76777],
    928: [0, 0.68611, 0.17208, 0, 0.8961],
    931: [0, 0.68611, 0.11431, 0, 0.82666],
    933: [0, 0.68611, 0.10778, 0, 0.88555],
    934: [0, 0.68611, 0.05632, 0, 0.82666],
    936: [0, 0.68611, 0.10778, 0, 0.88555],
    937: [0, 0.68611, 0.0992, 0, 0.82666],
    8211: [0, 0.44444, 0.09811, 0, 0.59111],
    8212: [0, 0.44444, 0.09811, 0, 1.18221],
    8216: [0, 0.69444, 0.12945, 0, 0.35555],
    8217: [0, 0.69444, 0.12945, 0, 0.35555],
    8220: [0, 0.69444, 0.16772, 0, 0.62055],
    8221: [0, 0.69444, 0.07939, 0, 0.62055]
  },
  "Main-Italic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.12417, 0, 0.30667],
    34: [0, 0.69444, 0.06961, 0, 0.51444],
    35: [0.19444, 0.69444, 0.06616, 0, 0.81777],
    37: [0.05556, 0.75, 0.13639, 0, 0.81777],
    38: [0, 0.69444, 0.09694, 0, 0.76666],
    39: [0, 0.69444, 0.12417, 0, 0.30667],
    40: [0.25, 0.75, 0.16194, 0, 0.40889],
    41: [0.25, 0.75, 0.03694, 0, 0.40889],
    42: [0, 0.75, 0.14917, 0, 0.51111],
    43: [0.05667, 0.56167, 0.03694, 0, 0.76666],
    44: [0.19444, 0.10556, 0, 0, 0.30667],
    45: [0, 0.43056, 0.02826, 0, 0.35778],
    46: [0, 0.10556, 0, 0, 0.30667],
    47: [0.25, 0.75, 0.16194, 0, 0.51111],
    48: [0, 0.64444, 0.13556, 0, 0.51111],
    49: [0, 0.64444, 0.13556, 0, 0.51111],
    50: [0, 0.64444, 0.13556, 0, 0.51111],
    51: [0, 0.64444, 0.13556, 0, 0.51111],
    52: [0.19444, 0.64444, 0.13556, 0, 0.51111],
    53: [0, 0.64444, 0.13556, 0, 0.51111],
    54: [0, 0.64444, 0.13556, 0, 0.51111],
    55: [0.19444, 0.64444, 0.13556, 0, 0.51111],
    56: [0, 0.64444, 0.13556, 0, 0.51111],
    57: [0, 0.64444, 0.13556, 0, 0.51111],
    58: [0, 0.43056, 0.0582, 0, 0.30667],
    59: [0.19444, 0.43056, 0.0582, 0, 0.30667],
    61: [-0.13313, 0.36687, 0.06616, 0, 0.76666],
    63: [0, 0.69444, 0.1225, 0, 0.51111],
    64: [0, 0.69444, 0.09597, 0, 0.76666],
    65: [0, 0.68333, 0, 0, 0.74333],
    66: [0, 0.68333, 0.10257, 0, 0.70389],
    67: [0, 0.68333, 0.14528, 0, 0.71555],
    68: [0, 0.68333, 0.09403, 0, 0.755],
    69: [0, 0.68333, 0.12028, 0, 0.67833],
    70: [0, 0.68333, 0.13305, 0, 0.65277],
    71: [0, 0.68333, 0.08722, 0, 0.77361],
    72: [0, 0.68333, 0.16389, 0, 0.74333],
    73: [0, 0.68333, 0.15806, 0, 0.38555],
    74: [0, 0.68333, 0.14028, 0, 0.525],
    75: [0, 0.68333, 0.14528, 0, 0.76888],
    76: [0, 0.68333, 0, 0, 0.62722],
    77: [0, 0.68333, 0.16389, 0, 0.89666],
    78: [0, 0.68333, 0.16389, 0, 0.74333],
    79: [0, 0.68333, 0.09403, 0, 0.76666],
    80: [0, 0.68333, 0.10257, 0, 0.67833],
    81: [0.19444, 0.68333, 0.09403, 0, 0.76666],
    82: [0, 0.68333, 0.03868, 0, 0.72944],
    83: [0, 0.68333, 0.11972, 0, 0.56222],
    84: [0, 0.68333, 0.13305, 0, 0.71555],
    85: [0, 0.68333, 0.16389, 0, 0.74333],
    86: [0, 0.68333, 0.18361, 0, 0.74333],
    87: [0, 0.68333, 0.18361, 0, 0.99888],
    88: [0, 0.68333, 0.15806, 0, 0.74333],
    89: [0, 0.68333, 0.19383, 0, 0.74333],
    90: [0, 0.68333, 0.14528, 0, 0.61333],
    91: [0.25, 0.75, 0.1875, 0, 0.30667],
    93: [0.25, 0.75, 0.10528, 0, 0.30667],
    94: [0, 0.69444, 0.06646, 0, 0.51111],
    95: [0.31, 0.12056, 0.09208, 0, 0.51111],
    97: [0, 0.43056, 0.07671, 0, 0.51111],
    98: [0, 0.69444, 0.06312, 0, 0.46],
    99: [0, 0.43056, 0.05653, 0, 0.46],
    100: [0, 0.69444, 0.10333, 0, 0.51111],
    101: [0, 0.43056, 0.07514, 0, 0.46],
    102: [0.19444, 0.69444, 0.21194, 0, 0.30667],
    103: [0.19444, 0.43056, 0.08847, 0, 0.46],
    104: [0, 0.69444, 0.07671, 0, 0.51111],
    105: [0, 0.65536, 0.1019, 0, 0.30667],
    106: [0.19444, 0.65536, 0.14467, 0, 0.30667],
    107: [0, 0.69444, 0.10764, 0, 0.46],
    108: [0, 0.69444, 0.10333, 0, 0.25555],
    109: [0, 0.43056, 0.07671, 0, 0.81777],
    110: [0, 0.43056, 0.07671, 0, 0.56222],
    111: [0, 0.43056, 0.06312, 0, 0.51111],
    112: [0.19444, 0.43056, 0.06312, 0, 0.51111],
    113: [0.19444, 0.43056, 0.08847, 0, 0.46],
    114: [0, 0.43056, 0.10764, 0, 0.42166],
    115: [0, 0.43056, 0.08208, 0, 0.40889],
    116: [0, 0.61508, 0.09486, 0, 0.33222],
    117: [0, 0.43056, 0.07671, 0, 0.53666],
    118: [0, 0.43056, 0.10764, 0, 0.46],
    119: [0, 0.43056, 0.10764, 0, 0.66444],
    120: [0, 0.43056, 0.12042, 0, 0.46389],
    121: [0.19444, 0.43056, 0.08847, 0, 0.48555],
    122: [0, 0.43056, 0.12292, 0, 0.40889],
    126: [0.35, 0.31786, 0.11585, 0, 0.51111],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.66786, 0.10474, 0, 0.51111],
    176: [0, 0.69444, 0, 0, 0.83129],
    184: [0.17014, 0, 0, 0, 0.46],
    198: [0, 0.68333, 0.12028, 0, 0.88277],
    216: [0.04861, 0.73194, 0.09403, 0, 0.76666],
    223: [0.19444, 0.69444, 0.10514, 0, 0.53666],
    230: [0, 0.43056, 0.07514, 0, 0.71555],
    248: [0.09722, 0.52778, 0.09194, 0, 0.51111],
    338: [0, 0.68333, 0.12028, 0, 0.98499],
    339: [0, 0.43056, 0.07514, 0, 0.71555],
    710: [0, 0.69444, 0.06646, 0, 0.51111],
    711: [0, 0.62847, 0.08295, 0, 0.51111],
    713: [0, 0.56167, 0.10333, 0, 0.51111],
    714: [0, 0.69444, 0.09694, 0, 0.51111],
    715: [0, 0.69444, 0, 0, 0.51111],
    728: [0, 0.69444, 0.10806, 0, 0.51111],
    729: [0, 0.66786, 0.11752, 0, 0.30667],
    730: [0, 0.69444, 0, 0, 0.83129],
    732: [0, 0.66786, 0.11585, 0, 0.51111],
    733: [0, 0.69444, 0.1225, 0, 0.51111],
    915: [0, 0.68333, 0.13305, 0, 0.62722],
    916: [0, 0.68333, 0, 0, 0.81777],
    920: [0, 0.68333, 0.09403, 0, 0.76666],
    923: [0, 0.68333, 0, 0, 0.69222],
    926: [0, 0.68333, 0.15294, 0, 0.66444],
    928: [0, 0.68333, 0.16389, 0, 0.74333],
    931: [0, 0.68333, 0.12028, 0, 0.71555],
    933: [0, 0.68333, 0.11111, 0, 0.76666],
    934: [0, 0.68333, 0.05986, 0, 0.71555],
    936: [0, 0.68333, 0.11111, 0, 0.76666],
    937: [0, 0.68333, 0.10257, 0, 0.71555],
    8211: [0, 0.43056, 0.09208, 0, 0.51111],
    8212: [0, 0.43056, 0.09208, 0, 1.02222],
    8216: [0, 0.69444, 0.12417, 0, 0.30667],
    8217: [0, 0.69444, 0.12417, 0, 0.30667],
    8220: [0, 0.69444, 0.1685, 0, 0.51444],
    8221: [0, 0.69444, 0.06961, 0, 0.51444],
    8463: [0, 0.68889, 0, 0, 0.54028]
  },
  "Main-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.27778],
    34: [0, 0.69444, 0, 0, 0.5],
    35: [0.19444, 0.69444, 0, 0, 0.83334],
    36: [0.05556, 0.75, 0, 0, 0.5],
    37: [0.05556, 0.75, 0, 0, 0.83334],
    38: [0, 0.69444, 0, 0, 0.77778],
    39: [0, 0.69444, 0, 0, 0.27778],
    40: [0.25, 0.75, 0, 0, 0.38889],
    41: [0.25, 0.75, 0, 0, 0.38889],
    42: [0, 0.75, 0, 0, 0.5],
    43: [0.08333, 0.58333, 0, 0, 0.77778],
    44: [0.19444, 0.10556, 0, 0, 0.27778],
    45: [0, 0.43056, 0, 0, 0.33333],
    46: [0, 0.10556, 0, 0, 0.27778],
    47: [0.25, 0.75, 0, 0, 0.5],
    48: [0, 0.64444, 0, 0, 0.5],
    49: [0, 0.64444, 0, 0, 0.5],
    50: [0, 0.64444, 0, 0, 0.5],
    51: [0, 0.64444, 0, 0, 0.5],
    52: [0, 0.64444, 0, 0, 0.5],
    53: [0, 0.64444, 0, 0, 0.5],
    54: [0, 0.64444, 0, 0, 0.5],
    55: [0, 0.64444, 0, 0, 0.5],
    56: [0, 0.64444, 0, 0, 0.5],
    57: [0, 0.64444, 0, 0, 0.5],
    58: [0, 0.43056, 0, 0, 0.27778],
    59: [0.19444, 0.43056, 0, 0, 0.27778],
    60: [0.0391, 0.5391, 0, 0, 0.77778],
    61: [-0.13313, 0.36687, 0, 0, 0.77778],
    62: [0.0391, 0.5391, 0, 0, 0.77778],
    63: [0, 0.69444, 0, 0, 0.47222],
    64: [0, 0.69444, 0, 0, 0.77778],
    65: [0, 0.68333, 0, 0, 0.75],
    66: [0, 0.68333, 0, 0, 0.70834],
    67: [0, 0.68333, 0, 0, 0.72222],
    68: [0, 0.68333, 0, 0, 0.76389],
    69: [0, 0.68333, 0, 0, 0.68056],
    70: [0, 0.68333, 0, 0, 0.65278],
    71: [0, 0.68333, 0, 0, 0.78472],
    72: [0, 0.68333, 0, 0, 0.75],
    73: [0, 0.68333, 0, 0, 0.36111],
    74: [0, 0.68333, 0, 0, 0.51389],
    75: [0, 0.68333, 0, 0, 0.77778],
    76: [0, 0.68333, 0, 0, 0.625],
    77: [0, 0.68333, 0, 0, 0.91667],
    78: [0, 0.68333, 0, 0, 0.75],
    79: [0, 0.68333, 0, 0, 0.77778],
    80: [0, 0.68333, 0, 0, 0.68056],
    81: [0.19444, 0.68333, 0, 0, 0.77778],
    82: [0, 0.68333, 0, 0, 0.73611],
    83: [0, 0.68333, 0, 0, 0.55556],
    84: [0, 0.68333, 0, 0, 0.72222],
    85: [0, 0.68333, 0, 0, 0.75],
    86: [0, 0.68333, 0.01389, 0, 0.75],
    87: [0, 0.68333, 0.01389, 0, 1.02778],
    88: [0, 0.68333, 0, 0, 0.75],
    89: [0, 0.68333, 0.025, 0, 0.75],
    90: [0, 0.68333, 0, 0, 0.61111],
    91: [0.25, 0.75, 0, 0, 0.27778],
    92: [0.25, 0.75, 0, 0, 0.5],
    93: [0.25, 0.75, 0, 0, 0.27778],
    94: [0, 0.69444, 0, 0, 0.5],
    95: [0.31, 0.12056, 0.02778, 0, 0.5],
    97: [0, 0.43056, 0, 0, 0.5],
    98: [0, 0.69444, 0, 0, 0.55556],
    99: [0, 0.43056, 0, 0, 0.44445],
    100: [0, 0.69444, 0, 0, 0.55556],
    101: [0, 0.43056, 0, 0, 0.44445],
    102: [0, 0.69444, 0.07778, 0, 0.30556],
    103: [0.19444, 0.43056, 0.01389, 0, 0.5],
    104: [0, 0.69444, 0, 0, 0.55556],
    105: [0, 0.66786, 0, 0, 0.27778],
    106: [0.19444, 0.66786, 0, 0, 0.30556],
    107: [0, 0.69444, 0, 0, 0.52778],
    108: [0, 0.69444, 0, 0, 0.27778],
    109: [0, 0.43056, 0, 0, 0.83334],
    110: [0, 0.43056, 0, 0, 0.55556],
    111: [0, 0.43056, 0, 0, 0.5],
    112: [0.19444, 0.43056, 0, 0, 0.55556],
    113: [0.19444, 0.43056, 0, 0, 0.52778],
    114: [0, 0.43056, 0, 0, 0.39167],
    115: [0, 0.43056, 0, 0, 0.39445],
    116: [0, 0.61508, 0, 0, 0.38889],
    117: [0, 0.43056, 0, 0, 0.55556],
    118: [0, 0.43056, 0.01389, 0, 0.52778],
    119: [0, 0.43056, 0.01389, 0, 0.72222],
    120: [0, 0.43056, 0, 0, 0.52778],
    121: [0.19444, 0.43056, 0.01389, 0, 0.52778],
    122: [0, 0.43056, 0, 0, 0.44445],
    123: [0.25, 0.75, 0, 0, 0.5],
    124: [0.25, 0.75, 0, 0, 0.27778],
    125: [0.25, 0.75, 0, 0, 0.5],
    126: [0.35, 0.31786, 0, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    163: [0, 0.69444, 0, 0, 0.76909],
    167: [0.19444, 0.69444, 0, 0, 0.44445],
    168: [0, 0.66786, 0, 0, 0.5],
    172: [0, 0.43056, 0, 0, 0.66667],
    176: [0, 0.69444, 0, 0, 0.75],
    177: [0.08333, 0.58333, 0, 0, 0.77778],
    182: [0.19444, 0.69444, 0, 0, 0.61111],
    184: [0.17014, 0, 0, 0, 0.44445],
    198: [0, 0.68333, 0, 0, 0.90278],
    215: [0.08333, 0.58333, 0, 0, 0.77778],
    216: [0.04861, 0.73194, 0, 0, 0.77778],
    223: [0, 0.69444, 0, 0, 0.5],
    230: [0, 0.43056, 0, 0, 0.72222],
    247: [0.08333, 0.58333, 0, 0, 0.77778],
    248: [0.09722, 0.52778, 0, 0, 0.5],
    305: [0, 0.43056, 0, 0, 0.27778],
    338: [0, 0.68333, 0, 0, 1.01389],
    339: [0, 0.43056, 0, 0, 0.77778],
    567: [0.19444, 0.43056, 0, 0, 0.30556],
    710: [0, 0.69444, 0, 0, 0.5],
    711: [0, 0.62847, 0, 0, 0.5],
    713: [0, 0.56778, 0, 0, 0.5],
    714: [0, 0.69444, 0, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0, 0, 0.5],
    729: [0, 0.66786, 0, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.75],
    732: [0, 0.66786, 0, 0, 0.5],
    733: [0, 0.69444, 0, 0, 0.5],
    915: [0, 0.68333, 0, 0, 0.625],
    916: [0, 0.68333, 0, 0, 0.83334],
    920: [0, 0.68333, 0, 0, 0.77778],
    923: [0, 0.68333, 0, 0, 0.69445],
    926: [0, 0.68333, 0, 0, 0.66667],
    928: [0, 0.68333, 0, 0, 0.75],
    931: [0, 0.68333, 0, 0, 0.72222],
    933: [0, 0.68333, 0, 0, 0.77778],
    934: [0, 0.68333, 0, 0, 0.72222],
    936: [0, 0.68333, 0, 0, 0.77778],
    937: [0, 0.68333, 0, 0, 0.72222],
    8211: [0, 0.43056, 0.02778, 0, 0.5],
    8212: [0, 0.43056, 0.02778, 0, 1],
    8216: [0, 0.69444, 0, 0, 0.27778],
    8217: [0, 0.69444, 0, 0, 0.27778],
    8220: [0, 0.69444, 0, 0, 0.5],
    8221: [0, 0.69444, 0, 0, 0.5],
    8224: [0.19444, 0.69444, 0, 0, 0.44445],
    8225: [0.19444, 0.69444, 0, 0, 0.44445],
    8230: [0, 0.123, 0, 0, 1.172],
    8242: [0, 0.55556, 0, 0, 0.275],
    8407: [0, 0.71444, 0.15382, 0, 0.5],
    8463: [0, 0.68889, 0, 0, 0.54028],
    8465: [0, 0.69444, 0, 0, 0.72222],
    8467: [0, 0.69444, 0, 0.11111, 0.41667],
    8472: [0.19444, 0.43056, 0, 0.11111, 0.63646],
    8476: [0, 0.69444, 0, 0, 0.72222],
    8501: [0, 0.69444, 0, 0, 0.61111],
    8592: [-0.13313, 0.36687, 0, 0, 1],
    8593: [0.19444, 0.69444, 0, 0, 0.5],
    8594: [-0.13313, 0.36687, 0, 0, 1],
    8595: [0.19444, 0.69444, 0, 0, 0.5],
    8596: [-0.13313, 0.36687, 0, 0, 1],
    8597: [0.25, 0.75, 0, 0, 0.5],
    8598: [0.19444, 0.69444, 0, 0, 1],
    8599: [0.19444, 0.69444, 0, 0, 1],
    8600: [0.19444, 0.69444, 0, 0, 1],
    8601: [0.19444, 0.69444, 0, 0, 1],
    8614: [0.011, 0.511, 0, 0, 1],
    8617: [0.011, 0.511, 0, 0, 1.126],
    8618: [0.011, 0.511, 0, 0, 1.126],
    8636: [-0.13313, 0.36687, 0, 0, 1],
    8637: [-0.13313, 0.36687, 0, 0, 1],
    8640: [-0.13313, 0.36687, 0, 0, 1],
    8641: [-0.13313, 0.36687, 0, 0, 1],
    8652: [0.011, 0.671, 0, 0, 1],
    8656: [-0.13313, 0.36687, 0, 0, 1],
    8657: [0.19444, 0.69444, 0, 0, 0.61111],
    8658: [-0.13313, 0.36687, 0, 0, 1],
    8659: [0.19444, 0.69444, 0, 0, 0.61111],
    8660: [-0.13313, 0.36687, 0, 0, 1],
    8661: [0.25, 0.75, 0, 0, 0.61111],
    8704: [0, 0.69444, 0, 0, 0.55556],
    8706: [0, 0.69444, 0.05556, 0.08334, 0.5309],
    8707: [0, 0.69444, 0, 0, 0.55556],
    8709: [0.05556, 0.75, 0, 0, 0.5],
    8711: [0, 0.68333, 0, 0, 0.83334],
    8712: [0.0391, 0.5391, 0, 0, 0.66667],
    8715: [0.0391, 0.5391, 0, 0, 0.66667],
    8722: [0.08333, 0.58333, 0, 0, 0.77778],
    8723: [0.08333, 0.58333, 0, 0, 0.77778],
    8725: [0.25, 0.75, 0, 0, 0.5],
    8726: [0.25, 0.75, 0, 0, 0.5],
    8727: [-0.03472, 0.46528, 0, 0, 0.5],
    8728: [-0.05555, 0.44445, 0, 0, 0.5],
    8729: [-0.05555, 0.44445, 0, 0, 0.5],
    8730: [0.2, 0.8, 0, 0, 0.83334],
    8733: [0, 0.43056, 0, 0, 0.77778],
    8734: [0, 0.43056, 0, 0, 1],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8739: [0.25, 0.75, 0, 0, 0.27778],
    8741: [0.25, 0.75, 0, 0, 0.5],
    8743: [0, 0.55556, 0, 0, 0.66667],
    8744: [0, 0.55556, 0, 0, 0.66667],
    8745: [0, 0.55556, 0, 0, 0.66667],
    8746: [0, 0.55556, 0, 0, 0.66667],
    8747: [0.19444, 0.69444, 0.11111, 0, 0.41667],
    8764: [-0.13313, 0.36687, 0, 0, 0.77778],
    8768: [0.19444, 0.69444, 0, 0, 0.27778],
    8771: [-0.03625, 0.46375, 0, 0, 0.77778],
    8773: [-0.022, 0.589, 0, 0, 0.778],
    8776: [-0.01688, 0.48312, 0, 0, 0.77778],
    8781: [-0.03625, 0.46375, 0, 0, 0.77778],
    8784: [-0.133, 0.673, 0, 0, 0.778],
    8801: [-0.03625, 0.46375, 0, 0, 0.77778],
    8804: [0.13597, 0.63597, 0, 0, 0.77778],
    8805: [0.13597, 0.63597, 0, 0, 0.77778],
    8810: [0.0391, 0.5391, 0, 0, 1],
    8811: [0.0391, 0.5391, 0, 0, 1],
    8826: [0.0391, 0.5391, 0, 0, 0.77778],
    8827: [0.0391, 0.5391, 0, 0, 0.77778],
    8834: [0.0391, 0.5391, 0, 0, 0.77778],
    8835: [0.0391, 0.5391, 0, 0, 0.77778],
    8838: [0.13597, 0.63597, 0, 0, 0.77778],
    8839: [0.13597, 0.63597, 0, 0, 0.77778],
    8846: [0, 0.55556, 0, 0, 0.66667],
    8849: [0.13597, 0.63597, 0, 0, 0.77778],
    8850: [0.13597, 0.63597, 0, 0, 0.77778],
    8851: [0, 0.55556, 0, 0, 0.66667],
    8852: [0, 0.55556, 0, 0, 0.66667],
    8853: [0.08333, 0.58333, 0, 0, 0.77778],
    8854: [0.08333, 0.58333, 0, 0, 0.77778],
    8855: [0.08333, 0.58333, 0, 0, 0.77778],
    8856: [0.08333, 0.58333, 0, 0, 0.77778],
    8857: [0.08333, 0.58333, 0, 0, 0.77778],
    8866: [0, 0.69444, 0, 0, 0.61111],
    8867: [0, 0.69444, 0, 0, 0.61111],
    8868: [0, 0.69444, 0, 0, 0.77778],
    8869: [0, 0.69444, 0, 0, 0.77778],
    8872: [0.249, 0.75, 0, 0, 0.867],
    8900: [-0.05555, 0.44445, 0, 0, 0.5],
    8901: [-0.05555, 0.44445, 0, 0, 0.27778],
    8902: [-0.03472, 0.46528, 0, 0, 0.5],
    8904: [5e-3, 0.505, 0, 0, 0.9],
    8942: [0.03, 0.903, 0, 0, 0.278],
    8943: [-0.19, 0.313, 0, 0, 1.172],
    8945: [-0.1, 0.823, 0, 0, 1.282],
    8968: [0.25, 0.75, 0, 0, 0.44445],
    8969: [0.25, 0.75, 0, 0, 0.44445],
    8970: [0.25, 0.75, 0, 0, 0.44445],
    8971: [0.25, 0.75, 0, 0, 0.44445],
    8994: [-0.14236, 0.35764, 0, 0, 1],
    8995: [-0.14236, 0.35764, 0, 0, 1],
    9136: [0.244, 0.744, 0, 0, 0.412],
    9137: [0.244, 0.745, 0, 0, 0.412],
    9651: [0.19444, 0.69444, 0, 0, 0.88889],
    9657: [-0.03472, 0.46528, 0, 0, 0.5],
    9661: [0.19444, 0.69444, 0, 0, 0.88889],
    9667: [-0.03472, 0.46528, 0, 0, 0.5],
    9711: [0.19444, 0.69444, 0, 0, 1],
    9824: [0.12963, 0.69444, 0, 0, 0.77778],
    9825: [0.12963, 0.69444, 0, 0, 0.77778],
    9826: [0.12963, 0.69444, 0, 0, 0.77778],
    9827: [0.12963, 0.69444, 0, 0, 0.77778],
    9837: [0, 0.75, 0, 0, 0.38889],
    9838: [0.19444, 0.69444, 0, 0, 0.38889],
    9839: [0.19444, 0.69444, 0, 0, 0.38889],
    10216: [0.25, 0.75, 0, 0, 0.38889],
    10217: [0.25, 0.75, 0, 0, 0.38889],
    10222: [0.244, 0.744, 0, 0, 0.412],
    10223: [0.244, 0.745, 0, 0, 0.412],
    10229: [0.011, 0.511, 0, 0, 1.609],
    10230: [0.011, 0.511, 0, 0, 1.638],
    10231: [0.011, 0.511, 0, 0, 1.859],
    10232: [0.024, 0.525, 0, 0, 1.609],
    10233: [0.024, 0.525, 0, 0, 1.638],
    10234: [0.024, 0.525, 0, 0, 1.858],
    10236: [0.011, 0.511, 0, 0, 1.638],
    10815: [0, 0.68333, 0, 0, 0.75],
    10927: [0.13597, 0.63597, 0, 0, 0.77778],
    10928: [0.13597, 0.63597, 0, 0, 0.77778],
    57376: [0.19444, 0.69444, 0, 0, 0]
  },
  "Math-BoldItalic": {
    32: [0, 0, 0, 0, 0.25],
    48: [0, 0.44444, 0, 0, 0.575],
    49: [0, 0.44444, 0, 0, 0.575],
    50: [0, 0.44444, 0, 0, 0.575],
    51: [0.19444, 0.44444, 0, 0, 0.575],
    52: [0.19444, 0.44444, 0, 0, 0.575],
    53: [0.19444, 0.44444, 0, 0, 0.575],
    54: [0, 0.64444, 0, 0, 0.575],
    55: [0.19444, 0.44444, 0, 0, 0.575],
    56: [0, 0.64444, 0, 0, 0.575],
    57: [0.19444, 0.44444, 0, 0, 0.575],
    65: [0, 0.68611, 0, 0, 0.86944],
    66: [0, 0.68611, 0.04835, 0, 0.8664],
    67: [0, 0.68611, 0.06979, 0, 0.81694],
    68: [0, 0.68611, 0.03194, 0, 0.93812],
    69: [0, 0.68611, 0.05451, 0, 0.81007],
    70: [0, 0.68611, 0.15972, 0, 0.68889],
    71: [0, 0.68611, 0, 0, 0.88673],
    72: [0, 0.68611, 0.08229, 0, 0.98229],
    73: [0, 0.68611, 0.07778, 0, 0.51111],
    74: [0, 0.68611, 0.10069, 0, 0.63125],
    75: [0, 0.68611, 0.06979, 0, 0.97118],
    76: [0, 0.68611, 0, 0, 0.75555],
    77: [0, 0.68611, 0.11424, 0, 1.14201],
    78: [0, 0.68611, 0.11424, 0, 0.95034],
    79: [0, 0.68611, 0.03194, 0, 0.83666],
    80: [0, 0.68611, 0.15972, 0, 0.72309],
    81: [0.19444, 0.68611, 0, 0, 0.86861],
    82: [0, 0.68611, 421e-5, 0, 0.87235],
    83: [0, 0.68611, 0.05382, 0, 0.69271],
    84: [0, 0.68611, 0.15972, 0, 0.63663],
    85: [0, 0.68611, 0.11424, 0, 0.80027],
    86: [0, 0.68611, 0.25555, 0, 0.67778],
    87: [0, 0.68611, 0.15972, 0, 1.09305],
    88: [0, 0.68611, 0.07778, 0, 0.94722],
    89: [0, 0.68611, 0.25555, 0, 0.67458],
    90: [0, 0.68611, 0.06979, 0, 0.77257],
    97: [0, 0.44444, 0, 0, 0.63287],
    98: [0, 0.69444, 0, 0, 0.52083],
    99: [0, 0.44444, 0, 0, 0.51342],
    100: [0, 0.69444, 0, 0, 0.60972],
    101: [0, 0.44444, 0, 0, 0.55361],
    102: [0.19444, 0.69444, 0.11042, 0, 0.56806],
    103: [0.19444, 0.44444, 0.03704, 0, 0.5449],
    104: [0, 0.69444, 0, 0, 0.66759],
    105: [0, 0.69326, 0, 0, 0.4048],
    106: [0.19444, 0.69326, 0.0622, 0, 0.47083],
    107: [0, 0.69444, 0.01852, 0, 0.6037],
    108: [0, 0.69444, 88e-4, 0, 0.34815],
    109: [0, 0.44444, 0, 0, 1.0324],
    110: [0, 0.44444, 0, 0, 0.71296],
    111: [0, 0.44444, 0, 0, 0.58472],
    112: [0.19444, 0.44444, 0, 0, 0.60092],
    113: [0.19444, 0.44444, 0.03704, 0, 0.54213],
    114: [0, 0.44444, 0.03194, 0, 0.5287],
    115: [0, 0.44444, 0, 0, 0.53125],
    116: [0, 0.63492, 0, 0, 0.41528],
    117: [0, 0.44444, 0, 0, 0.68102],
    118: [0, 0.44444, 0.03704, 0, 0.56666],
    119: [0, 0.44444, 0.02778, 0, 0.83148],
    120: [0, 0.44444, 0, 0, 0.65903],
    121: [0.19444, 0.44444, 0.03704, 0, 0.59028],
    122: [0, 0.44444, 0.04213, 0, 0.55509],
    160: [0, 0, 0, 0, 0.25],
    915: [0, 0.68611, 0.15972, 0, 0.65694],
    916: [0, 0.68611, 0, 0, 0.95833],
    920: [0, 0.68611, 0.03194, 0, 0.86722],
    923: [0, 0.68611, 0, 0, 0.80555],
    926: [0, 0.68611, 0.07458, 0, 0.84125],
    928: [0, 0.68611, 0.08229, 0, 0.98229],
    931: [0, 0.68611, 0.05451, 0, 0.88507],
    933: [0, 0.68611, 0.15972, 0, 0.67083],
    934: [0, 0.68611, 0, 0, 0.76666],
    936: [0, 0.68611, 0.11653, 0, 0.71402],
    937: [0, 0.68611, 0.04835, 0, 0.8789],
    945: [0, 0.44444, 0, 0, 0.76064],
    946: [0.19444, 0.69444, 0.03403, 0, 0.65972],
    947: [0.19444, 0.44444, 0.06389, 0, 0.59003],
    948: [0, 0.69444, 0.03819, 0, 0.52222],
    949: [0, 0.44444, 0, 0, 0.52882],
    950: [0.19444, 0.69444, 0.06215, 0, 0.50833],
    951: [0.19444, 0.44444, 0.03704, 0, 0.6],
    952: [0, 0.69444, 0.03194, 0, 0.5618],
    953: [0, 0.44444, 0, 0, 0.41204],
    954: [0, 0.44444, 0, 0, 0.66759],
    955: [0, 0.69444, 0, 0, 0.67083],
    956: [0.19444, 0.44444, 0, 0, 0.70787],
    957: [0, 0.44444, 0.06898, 0, 0.57685],
    958: [0.19444, 0.69444, 0.03021, 0, 0.50833],
    959: [0, 0.44444, 0, 0, 0.58472],
    960: [0, 0.44444, 0.03704, 0, 0.68241],
    961: [0.19444, 0.44444, 0, 0, 0.6118],
    962: [0.09722, 0.44444, 0.07917, 0, 0.42361],
    963: [0, 0.44444, 0.03704, 0, 0.68588],
    964: [0, 0.44444, 0.13472, 0, 0.52083],
    965: [0, 0.44444, 0.03704, 0, 0.63055],
    966: [0.19444, 0.44444, 0, 0, 0.74722],
    967: [0.19444, 0.44444, 0, 0, 0.71805],
    968: [0.19444, 0.69444, 0.03704, 0, 0.75833],
    969: [0, 0.44444, 0.03704, 0, 0.71782],
    977: [0, 0.69444, 0, 0, 0.69155],
    981: [0.19444, 0.69444, 0, 0, 0.7125],
    982: [0, 0.44444, 0.03194, 0, 0.975],
    1009: [0.19444, 0.44444, 0, 0, 0.6118],
    1013: [0, 0.44444, 0, 0, 0.48333],
    57649: [0, 0.44444, 0, 0, 0.39352],
    57911: [0.19444, 0.44444, 0, 0, 0.43889]
  },
  "Math-Italic": {
    32: [0, 0, 0, 0, 0.25],
    48: [0, 0.43056, 0, 0, 0.5],
    49: [0, 0.43056, 0, 0, 0.5],
    50: [0, 0.43056, 0, 0, 0.5],
    51: [0.19444, 0.43056, 0, 0, 0.5],
    52: [0.19444, 0.43056, 0, 0, 0.5],
    53: [0.19444, 0.43056, 0, 0, 0.5],
    54: [0, 0.64444, 0, 0, 0.5],
    55: [0.19444, 0.43056, 0, 0, 0.5],
    56: [0, 0.64444, 0, 0, 0.5],
    57: [0.19444, 0.43056, 0, 0, 0.5],
    65: [0, 0.68333, 0, 0.13889, 0.75],
    66: [0, 0.68333, 0.05017, 0.08334, 0.75851],
    67: [0, 0.68333, 0.07153, 0.08334, 0.71472],
    68: [0, 0.68333, 0.02778, 0.05556, 0.82792],
    69: [0, 0.68333, 0.05764, 0.08334, 0.7382],
    70: [0, 0.68333, 0.13889, 0.08334, 0.64306],
    71: [0, 0.68333, 0, 0.08334, 0.78625],
    72: [0, 0.68333, 0.08125, 0.05556, 0.83125],
    73: [0, 0.68333, 0.07847, 0.11111, 0.43958],
    74: [0, 0.68333, 0.09618, 0.16667, 0.55451],
    75: [0, 0.68333, 0.07153, 0.05556, 0.84931],
    76: [0, 0.68333, 0, 0.02778, 0.68056],
    77: [0, 0.68333, 0.10903, 0.08334, 0.97014],
    78: [0, 0.68333, 0.10903, 0.08334, 0.80347],
    79: [0, 0.68333, 0.02778, 0.08334, 0.76278],
    80: [0, 0.68333, 0.13889, 0.08334, 0.64201],
    81: [0.19444, 0.68333, 0, 0.08334, 0.79056],
    82: [0, 0.68333, 773e-5, 0.08334, 0.75929],
    83: [0, 0.68333, 0.05764, 0.08334, 0.6132],
    84: [0, 0.68333, 0.13889, 0.08334, 0.58438],
    85: [0, 0.68333, 0.10903, 0.02778, 0.68278],
    86: [0, 0.68333, 0.22222, 0, 0.58333],
    87: [0, 0.68333, 0.13889, 0, 0.94445],
    88: [0, 0.68333, 0.07847, 0.08334, 0.82847],
    89: [0, 0.68333, 0.22222, 0, 0.58056],
    90: [0, 0.68333, 0.07153, 0.08334, 0.68264],
    97: [0, 0.43056, 0, 0, 0.52859],
    98: [0, 0.69444, 0, 0, 0.42917],
    99: [0, 0.43056, 0, 0.05556, 0.43276],
    100: [0, 0.69444, 0, 0.16667, 0.52049],
    101: [0, 0.43056, 0, 0.05556, 0.46563],
    102: [0.19444, 0.69444, 0.10764, 0.16667, 0.48959],
    103: [0.19444, 0.43056, 0.03588, 0.02778, 0.47697],
    104: [0, 0.69444, 0, 0, 0.57616],
    105: [0, 0.65952, 0, 0, 0.34451],
    106: [0.19444, 0.65952, 0.05724, 0, 0.41181],
    107: [0, 0.69444, 0.03148, 0, 0.5206],
    108: [0, 0.69444, 0.01968, 0.08334, 0.29838],
    109: [0, 0.43056, 0, 0, 0.87801],
    110: [0, 0.43056, 0, 0, 0.60023],
    111: [0, 0.43056, 0, 0.05556, 0.48472],
    112: [0.19444, 0.43056, 0, 0.08334, 0.50313],
    113: [0.19444, 0.43056, 0.03588, 0.08334, 0.44641],
    114: [0, 0.43056, 0.02778, 0.05556, 0.45116],
    115: [0, 0.43056, 0, 0.05556, 0.46875],
    116: [0, 0.61508, 0, 0.08334, 0.36111],
    117: [0, 0.43056, 0, 0.02778, 0.57246],
    118: [0, 0.43056, 0.03588, 0.02778, 0.48472],
    119: [0, 0.43056, 0.02691, 0.08334, 0.71592],
    120: [0, 0.43056, 0, 0.02778, 0.57153],
    121: [0.19444, 0.43056, 0.03588, 0.05556, 0.49028],
    122: [0, 0.43056, 0.04398, 0.05556, 0.46505],
    160: [0, 0, 0, 0, 0.25],
    915: [0, 0.68333, 0.13889, 0.08334, 0.61528],
    916: [0, 0.68333, 0, 0.16667, 0.83334],
    920: [0, 0.68333, 0.02778, 0.08334, 0.76278],
    923: [0, 0.68333, 0, 0.16667, 0.69445],
    926: [0, 0.68333, 0.07569, 0.08334, 0.74236],
    928: [0, 0.68333, 0.08125, 0.05556, 0.83125],
    931: [0, 0.68333, 0.05764, 0.08334, 0.77986],
    933: [0, 0.68333, 0.13889, 0.05556, 0.58333],
    934: [0, 0.68333, 0, 0.08334, 0.66667],
    936: [0, 0.68333, 0.11, 0.05556, 0.61222],
    937: [0, 0.68333, 0.05017, 0.08334, 0.7724],
    945: [0, 0.43056, 37e-4, 0.02778, 0.6397],
    946: [0.19444, 0.69444, 0.05278, 0.08334, 0.56563],
    947: [0.19444, 0.43056, 0.05556, 0, 0.51773],
    948: [0, 0.69444, 0.03785, 0.05556, 0.44444],
    949: [0, 0.43056, 0, 0.08334, 0.46632],
    950: [0.19444, 0.69444, 0.07378, 0.08334, 0.4375],
    951: [0.19444, 0.43056, 0.03588, 0.05556, 0.49653],
    952: [0, 0.69444, 0.02778, 0.08334, 0.46944],
    953: [0, 0.43056, 0, 0.05556, 0.35394],
    954: [0, 0.43056, 0, 0, 0.57616],
    955: [0, 0.69444, 0, 0, 0.58334],
    956: [0.19444, 0.43056, 0, 0.02778, 0.60255],
    957: [0, 0.43056, 0.06366, 0.02778, 0.49398],
    958: [0.19444, 0.69444, 0.04601, 0.11111, 0.4375],
    959: [0, 0.43056, 0, 0.05556, 0.48472],
    960: [0, 0.43056, 0.03588, 0, 0.57003],
    961: [0.19444, 0.43056, 0, 0.08334, 0.51702],
    962: [0.09722, 0.43056, 0.07986, 0.08334, 0.36285],
    963: [0, 0.43056, 0.03588, 0, 0.57141],
    964: [0, 0.43056, 0.1132, 0.02778, 0.43715],
    965: [0, 0.43056, 0.03588, 0.02778, 0.54028],
    966: [0.19444, 0.43056, 0, 0.08334, 0.65417],
    967: [0.19444, 0.43056, 0, 0.05556, 0.62569],
    968: [0.19444, 0.69444, 0.03588, 0.11111, 0.65139],
    969: [0, 0.43056, 0.03588, 0, 0.62245],
    977: [0, 0.69444, 0, 0.08334, 0.59144],
    981: [0.19444, 0.69444, 0, 0.08334, 0.59583],
    982: [0, 0.43056, 0.02778, 0, 0.82813],
    1009: [0.19444, 0.43056, 0, 0.08334, 0.51702],
    1013: [0, 0.43056, 0, 0.05556, 0.4059],
    57649: [0, 0.43056, 0, 0.02778, 0.32246],
    57911: [0.19444, 0.43056, 0, 0.08334, 0.38403]
  },
  "SansSerif-Bold": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.36667],
    34: [0, 0.69444, 0, 0, 0.55834],
    35: [0.19444, 0.69444, 0, 0, 0.91667],
    36: [0.05556, 0.75, 0, 0, 0.55],
    37: [0.05556, 0.75, 0, 0, 1.02912],
    38: [0, 0.69444, 0, 0, 0.83056],
    39: [0, 0.69444, 0, 0, 0.30556],
    40: [0.25, 0.75, 0, 0, 0.42778],
    41: [0.25, 0.75, 0, 0, 0.42778],
    42: [0, 0.75, 0, 0, 0.55],
    43: [0.11667, 0.61667, 0, 0, 0.85556],
    44: [0.10556, 0.13056, 0, 0, 0.30556],
    45: [0, 0.45833, 0, 0, 0.36667],
    46: [0, 0.13056, 0, 0, 0.30556],
    47: [0.25, 0.75, 0, 0, 0.55],
    48: [0, 0.69444, 0, 0, 0.55],
    49: [0, 0.69444, 0, 0, 0.55],
    50: [0, 0.69444, 0, 0, 0.55],
    51: [0, 0.69444, 0, 0, 0.55],
    52: [0, 0.69444, 0, 0, 0.55],
    53: [0, 0.69444, 0, 0, 0.55],
    54: [0, 0.69444, 0, 0, 0.55],
    55: [0, 0.69444, 0, 0, 0.55],
    56: [0, 0.69444, 0, 0, 0.55],
    57: [0, 0.69444, 0, 0, 0.55],
    58: [0, 0.45833, 0, 0, 0.30556],
    59: [0.10556, 0.45833, 0, 0, 0.30556],
    61: [-0.09375, 0.40625, 0, 0, 0.85556],
    63: [0, 0.69444, 0, 0, 0.51945],
    64: [0, 0.69444, 0, 0, 0.73334],
    65: [0, 0.69444, 0, 0, 0.73334],
    66: [0, 0.69444, 0, 0, 0.73334],
    67: [0, 0.69444, 0, 0, 0.70278],
    68: [0, 0.69444, 0, 0, 0.79445],
    69: [0, 0.69444, 0, 0, 0.64167],
    70: [0, 0.69444, 0, 0, 0.61111],
    71: [0, 0.69444, 0, 0, 0.73334],
    72: [0, 0.69444, 0, 0, 0.79445],
    73: [0, 0.69444, 0, 0, 0.33056],
    74: [0, 0.69444, 0, 0, 0.51945],
    75: [0, 0.69444, 0, 0, 0.76389],
    76: [0, 0.69444, 0, 0, 0.58056],
    77: [0, 0.69444, 0, 0, 0.97778],
    78: [0, 0.69444, 0, 0, 0.79445],
    79: [0, 0.69444, 0, 0, 0.79445],
    80: [0, 0.69444, 0, 0, 0.70278],
    81: [0.10556, 0.69444, 0, 0, 0.79445],
    82: [0, 0.69444, 0, 0, 0.70278],
    83: [0, 0.69444, 0, 0, 0.61111],
    84: [0, 0.69444, 0, 0, 0.73334],
    85: [0, 0.69444, 0, 0, 0.76389],
    86: [0, 0.69444, 0.01528, 0, 0.73334],
    87: [0, 0.69444, 0.01528, 0, 1.03889],
    88: [0, 0.69444, 0, 0, 0.73334],
    89: [0, 0.69444, 0.0275, 0, 0.73334],
    90: [0, 0.69444, 0, 0, 0.67223],
    91: [0.25, 0.75, 0, 0, 0.34306],
    93: [0.25, 0.75, 0, 0, 0.34306],
    94: [0, 0.69444, 0, 0, 0.55],
    95: [0.35, 0.10833, 0.03056, 0, 0.55],
    97: [0, 0.45833, 0, 0, 0.525],
    98: [0, 0.69444, 0, 0, 0.56111],
    99: [0, 0.45833, 0, 0, 0.48889],
    100: [0, 0.69444, 0, 0, 0.56111],
    101: [0, 0.45833, 0, 0, 0.51111],
    102: [0, 0.69444, 0.07639, 0, 0.33611],
    103: [0.19444, 0.45833, 0.01528, 0, 0.55],
    104: [0, 0.69444, 0, 0, 0.56111],
    105: [0, 0.69444, 0, 0, 0.25556],
    106: [0.19444, 0.69444, 0, 0, 0.28611],
    107: [0, 0.69444, 0, 0, 0.53056],
    108: [0, 0.69444, 0, 0, 0.25556],
    109: [0, 0.45833, 0, 0, 0.86667],
    110: [0, 0.45833, 0, 0, 0.56111],
    111: [0, 0.45833, 0, 0, 0.55],
    112: [0.19444, 0.45833, 0, 0, 0.56111],
    113: [0.19444, 0.45833, 0, 0, 0.56111],
    114: [0, 0.45833, 0.01528, 0, 0.37222],
    115: [0, 0.45833, 0, 0, 0.42167],
    116: [0, 0.58929, 0, 0, 0.40417],
    117: [0, 0.45833, 0, 0, 0.56111],
    118: [0, 0.45833, 0.01528, 0, 0.5],
    119: [0, 0.45833, 0.01528, 0, 0.74445],
    120: [0, 0.45833, 0, 0, 0.5],
    121: [0.19444, 0.45833, 0.01528, 0, 0.5],
    122: [0, 0.45833, 0, 0, 0.47639],
    126: [0.35, 0.34444, 0, 0, 0.55],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.69444, 0, 0, 0.55],
    176: [0, 0.69444, 0, 0, 0.73334],
    180: [0, 0.69444, 0, 0, 0.55],
    184: [0.17014, 0, 0, 0, 0.48889],
    305: [0, 0.45833, 0, 0, 0.25556],
    567: [0.19444, 0.45833, 0, 0, 0.28611],
    710: [0, 0.69444, 0, 0, 0.55],
    711: [0, 0.63542, 0, 0, 0.55],
    713: [0, 0.63778, 0, 0, 0.55],
    728: [0, 0.69444, 0, 0, 0.55],
    729: [0, 0.69444, 0, 0, 0.30556],
    730: [0, 0.69444, 0, 0, 0.73334],
    732: [0, 0.69444, 0, 0, 0.55],
    733: [0, 0.69444, 0, 0, 0.55],
    915: [0, 0.69444, 0, 0, 0.58056],
    916: [0, 0.69444, 0, 0, 0.91667],
    920: [0, 0.69444, 0, 0, 0.85556],
    923: [0, 0.69444, 0, 0, 0.67223],
    926: [0, 0.69444, 0, 0, 0.73334],
    928: [0, 0.69444, 0, 0, 0.79445],
    931: [0, 0.69444, 0, 0, 0.79445],
    933: [0, 0.69444, 0, 0, 0.85556],
    934: [0, 0.69444, 0, 0, 0.79445],
    936: [0, 0.69444, 0, 0, 0.85556],
    937: [0, 0.69444, 0, 0, 0.79445],
    8211: [0, 0.45833, 0.03056, 0, 0.55],
    8212: [0, 0.45833, 0.03056, 0, 1.10001],
    8216: [0, 0.69444, 0, 0, 0.30556],
    8217: [0, 0.69444, 0, 0, 0.30556],
    8220: [0, 0.69444, 0, 0, 0.55834],
    8221: [0, 0.69444, 0, 0, 0.55834]
  },
  "SansSerif-Italic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.05733, 0, 0.31945],
    34: [0, 0.69444, 316e-5, 0, 0.5],
    35: [0.19444, 0.69444, 0.05087, 0, 0.83334],
    36: [0.05556, 0.75, 0.11156, 0, 0.5],
    37: [0.05556, 0.75, 0.03126, 0, 0.83334],
    38: [0, 0.69444, 0.03058, 0, 0.75834],
    39: [0, 0.69444, 0.07816, 0, 0.27778],
    40: [0.25, 0.75, 0.13164, 0, 0.38889],
    41: [0.25, 0.75, 0.02536, 0, 0.38889],
    42: [0, 0.75, 0.11775, 0, 0.5],
    43: [0.08333, 0.58333, 0.02536, 0, 0.77778],
    44: [0.125, 0.08333, 0, 0, 0.27778],
    45: [0, 0.44444, 0.01946, 0, 0.33333],
    46: [0, 0.08333, 0, 0, 0.27778],
    47: [0.25, 0.75, 0.13164, 0, 0.5],
    48: [0, 0.65556, 0.11156, 0, 0.5],
    49: [0, 0.65556, 0.11156, 0, 0.5],
    50: [0, 0.65556, 0.11156, 0, 0.5],
    51: [0, 0.65556, 0.11156, 0, 0.5],
    52: [0, 0.65556, 0.11156, 0, 0.5],
    53: [0, 0.65556, 0.11156, 0, 0.5],
    54: [0, 0.65556, 0.11156, 0, 0.5],
    55: [0, 0.65556, 0.11156, 0, 0.5],
    56: [0, 0.65556, 0.11156, 0, 0.5],
    57: [0, 0.65556, 0.11156, 0, 0.5],
    58: [0, 0.44444, 0.02502, 0, 0.27778],
    59: [0.125, 0.44444, 0.02502, 0, 0.27778],
    61: [-0.13, 0.37, 0.05087, 0, 0.77778],
    63: [0, 0.69444, 0.11809, 0, 0.47222],
    64: [0, 0.69444, 0.07555, 0, 0.66667],
    65: [0, 0.69444, 0, 0, 0.66667],
    66: [0, 0.69444, 0.08293, 0, 0.66667],
    67: [0, 0.69444, 0.11983, 0, 0.63889],
    68: [0, 0.69444, 0.07555, 0, 0.72223],
    69: [0, 0.69444, 0.11983, 0, 0.59722],
    70: [0, 0.69444, 0.13372, 0, 0.56945],
    71: [0, 0.69444, 0.11983, 0, 0.66667],
    72: [0, 0.69444, 0.08094, 0, 0.70834],
    73: [0, 0.69444, 0.13372, 0, 0.27778],
    74: [0, 0.69444, 0.08094, 0, 0.47222],
    75: [0, 0.69444, 0.11983, 0, 0.69445],
    76: [0, 0.69444, 0, 0, 0.54167],
    77: [0, 0.69444, 0.08094, 0, 0.875],
    78: [0, 0.69444, 0.08094, 0, 0.70834],
    79: [0, 0.69444, 0.07555, 0, 0.73611],
    80: [0, 0.69444, 0.08293, 0, 0.63889],
    81: [0.125, 0.69444, 0.07555, 0, 0.73611],
    82: [0, 0.69444, 0.08293, 0, 0.64584],
    83: [0, 0.69444, 0.09205, 0, 0.55556],
    84: [0, 0.69444, 0.13372, 0, 0.68056],
    85: [0, 0.69444, 0.08094, 0, 0.6875],
    86: [0, 0.69444, 0.1615, 0, 0.66667],
    87: [0, 0.69444, 0.1615, 0, 0.94445],
    88: [0, 0.69444, 0.13372, 0, 0.66667],
    89: [0, 0.69444, 0.17261, 0, 0.66667],
    90: [0, 0.69444, 0.11983, 0, 0.61111],
    91: [0.25, 0.75, 0.15942, 0, 0.28889],
    93: [0.25, 0.75, 0.08719, 0, 0.28889],
    94: [0, 0.69444, 0.0799, 0, 0.5],
    95: [0.35, 0.09444, 0.08616, 0, 0.5],
    97: [0, 0.44444, 981e-5, 0, 0.48056],
    98: [0, 0.69444, 0.03057, 0, 0.51667],
    99: [0, 0.44444, 0.08336, 0, 0.44445],
    100: [0, 0.69444, 0.09483, 0, 0.51667],
    101: [0, 0.44444, 0.06778, 0, 0.44445],
    102: [0, 0.69444, 0.21705, 0, 0.30556],
    103: [0.19444, 0.44444, 0.10836, 0, 0.5],
    104: [0, 0.69444, 0.01778, 0, 0.51667],
    105: [0, 0.67937, 0.09718, 0, 0.23889],
    106: [0.19444, 0.67937, 0.09162, 0, 0.26667],
    107: [0, 0.69444, 0.08336, 0, 0.48889],
    108: [0, 0.69444, 0.09483, 0, 0.23889],
    109: [0, 0.44444, 0.01778, 0, 0.79445],
    110: [0, 0.44444, 0.01778, 0, 0.51667],
    111: [0, 0.44444, 0.06613, 0, 0.5],
    112: [0.19444, 0.44444, 0.0389, 0, 0.51667],
    113: [0.19444, 0.44444, 0.04169, 0, 0.51667],
    114: [0, 0.44444, 0.10836, 0, 0.34167],
    115: [0, 0.44444, 0.0778, 0, 0.38333],
    116: [0, 0.57143, 0.07225, 0, 0.36111],
    117: [0, 0.44444, 0.04169, 0, 0.51667],
    118: [0, 0.44444, 0.10836, 0, 0.46111],
    119: [0, 0.44444, 0.10836, 0, 0.68334],
    120: [0, 0.44444, 0.09169, 0, 0.46111],
    121: [0.19444, 0.44444, 0.10836, 0, 0.46111],
    122: [0, 0.44444, 0.08752, 0, 0.43472],
    126: [0.35, 0.32659, 0.08826, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.67937, 0.06385, 0, 0.5],
    176: [0, 0.69444, 0, 0, 0.73752],
    184: [0.17014, 0, 0, 0, 0.44445],
    305: [0, 0.44444, 0.04169, 0, 0.23889],
    567: [0.19444, 0.44444, 0.04169, 0, 0.26667],
    710: [0, 0.69444, 0.0799, 0, 0.5],
    711: [0, 0.63194, 0.08432, 0, 0.5],
    713: [0, 0.60889, 0.08776, 0, 0.5],
    714: [0, 0.69444, 0.09205, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0.09483, 0, 0.5],
    729: [0, 0.67937, 0.07774, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.73752],
    732: [0, 0.67659, 0.08826, 0, 0.5],
    733: [0, 0.69444, 0.09205, 0, 0.5],
    915: [0, 0.69444, 0.13372, 0, 0.54167],
    916: [0, 0.69444, 0, 0, 0.83334],
    920: [0, 0.69444, 0.07555, 0, 0.77778],
    923: [0, 0.69444, 0, 0, 0.61111],
    926: [0, 0.69444, 0.12816, 0, 0.66667],
    928: [0, 0.69444, 0.08094, 0, 0.70834],
    931: [0, 0.69444, 0.11983, 0, 0.72222],
    933: [0, 0.69444, 0.09031, 0, 0.77778],
    934: [0, 0.69444, 0.04603, 0, 0.72222],
    936: [0, 0.69444, 0.09031, 0, 0.77778],
    937: [0, 0.69444, 0.08293, 0, 0.72222],
    8211: [0, 0.44444, 0.08616, 0, 0.5],
    8212: [0, 0.44444, 0.08616, 0, 1],
    8216: [0, 0.69444, 0.07816, 0, 0.27778],
    8217: [0, 0.69444, 0.07816, 0, 0.27778],
    8220: [0, 0.69444, 0.14205, 0, 0.5],
    8221: [0, 0.69444, 316e-5, 0, 0.5]
  },
  "SansSerif-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.31945],
    34: [0, 0.69444, 0, 0, 0.5],
    35: [0.19444, 0.69444, 0, 0, 0.83334],
    36: [0.05556, 0.75, 0, 0, 0.5],
    37: [0.05556, 0.75, 0, 0, 0.83334],
    38: [0, 0.69444, 0, 0, 0.75834],
    39: [0, 0.69444, 0, 0, 0.27778],
    40: [0.25, 0.75, 0, 0, 0.38889],
    41: [0.25, 0.75, 0, 0, 0.38889],
    42: [0, 0.75, 0, 0, 0.5],
    43: [0.08333, 0.58333, 0, 0, 0.77778],
    44: [0.125, 0.08333, 0, 0, 0.27778],
    45: [0, 0.44444, 0, 0, 0.33333],
    46: [0, 0.08333, 0, 0, 0.27778],
    47: [0.25, 0.75, 0, 0, 0.5],
    48: [0, 0.65556, 0, 0, 0.5],
    49: [0, 0.65556, 0, 0, 0.5],
    50: [0, 0.65556, 0, 0, 0.5],
    51: [0, 0.65556, 0, 0, 0.5],
    52: [0, 0.65556, 0, 0, 0.5],
    53: [0, 0.65556, 0, 0, 0.5],
    54: [0, 0.65556, 0, 0, 0.5],
    55: [0, 0.65556, 0, 0, 0.5],
    56: [0, 0.65556, 0, 0, 0.5],
    57: [0, 0.65556, 0, 0, 0.5],
    58: [0, 0.44444, 0, 0, 0.27778],
    59: [0.125, 0.44444, 0, 0, 0.27778],
    61: [-0.13, 0.37, 0, 0, 0.77778],
    63: [0, 0.69444, 0, 0, 0.47222],
    64: [0, 0.69444, 0, 0, 0.66667],
    65: [0, 0.69444, 0, 0, 0.66667],
    66: [0, 0.69444, 0, 0, 0.66667],
    67: [0, 0.69444, 0, 0, 0.63889],
    68: [0, 0.69444, 0, 0, 0.72223],
    69: [0, 0.69444, 0, 0, 0.59722],
    70: [0, 0.69444, 0, 0, 0.56945],
    71: [0, 0.69444, 0, 0, 0.66667],
    72: [0, 0.69444, 0, 0, 0.70834],
    73: [0, 0.69444, 0, 0, 0.27778],
    74: [0, 0.69444, 0, 0, 0.47222],
    75: [0, 0.69444, 0, 0, 0.69445],
    76: [0, 0.69444, 0, 0, 0.54167],
    77: [0, 0.69444, 0, 0, 0.875],
    78: [0, 0.69444, 0, 0, 0.70834],
    79: [0, 0.69444, 0, 0, 0.73611],
    80: [0, 0.69444, 0, 0, 0.63889],
    81: [0.125, 0.69444, 0, 0, 0.73611],
    82: [0, 0.69444, 0, 0, 0.64584],
    83: [0, 0.69444, 0, 0, 0.55556],
    84: [0, 0.69444, 0, 0, 0.68056],
    85: [0, 0.69444, 0, 0, 0.6875],
    86: [0, 0.69444, 0.01389, 0, 0.66667],
    87: [0, 0.69444, 0.01389, 0, 0.94445],
    88: [0, 0.69444, 0, 0, 0.66667],
    89: [0, 0.69444, 0.025, 0, 0.66667],
    90: [0, 0.69444, 0, 0, 0.61111],
    91: [0.25, 0.75, 0, 0, 0.28889],
    93: [0.25, 0.75, 0, 0, 0.28889],
    94: [0, 0.69444, 0, 0, 0.5],
    95: [0.35, 0.09444, 0.02778, 0, 0.5],
    97: [0, 0.44444, 0, 0, 0.48056],
    98: [0, 0.69444, 0, 0, 0.51667],
    99: [0, 0.44444, 0, 0, 0.44445],
    100: [0, 0.69444, 0, 0, 0.51667],
    101: [0, 0.44444, 0, 0, 0.44445],
    102: [0, 0.69444, 0.06944, 0, 0.30556],
    103: [0.19444, 0.44444, 0.01389, 0, 0.5],
    104: [0, 0.69444, 0, 0, 0.51667],
    105: [0, 0.67937, 0, 0, 0.23889],
    106: [0.19444, 0.67937, 0, 0, 0.26667],
    107: [0, 0.69444, 0, 0, 0.48889],
    108: [0, 0.69444, 0, 0, 0.23889],
    109: [0, 0.44444, 0, 0, 0.79445],
    110: [0, 0.44444, 0, 0, 0.51667],
    111: [0, 0.44444, 0, 0, 0.5],
    112: [0.19444, 0.44444, 0, 0, 0.51667],
    113: [0.19444, 0.44444, 0, 0, 0.51667],
    114: [0, 0.44444, 0.01389, 0, 0.34167],
    115: [0, 0.44444, 0, 0, 0.38333],
    116: [0, 0.57143, 0, 0, 0.36111],
    117: [0, 0.44444, 0, 0, 0.51667],
    118: [0, 0.44444, 0.01389, 0, 0.46111],
    119: [0, 0.44444, 0.01389, 0, 0.68334],
    120: [0, 0.44444, 0, 0, 0.46111],
    121: [0.19444, 0.44444, 0.01389, 0, 0.46111],
    122: [0, 0.44444, 0, 0, 0.43472],
    126: [0.35, 0.32659, 0, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.67937, 0, 0, 0.5],
    176: [0, 0.69444, 0, 0, 0.66667],
    184: [0.17014, 0, 0, 0, 0.44445],
    305: [0, 0.44444, 0, 0, 0.23889],
    567: [0.19444, 0.44444, 0, 0, 0.26667],
    710: [0, 0.69444, 0, 0, 0.5],
    711: [0, 0.63194, 0, 0, 0.5],
    713: [0, 0.60889, 0, 0, 0.5],
    714: [0, 0.69444, 0, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0, 0, 0.5],
    729: [0, 0.67937, 0, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.66667],
    732: [0, 0.67659, 0, 0, 0.5],
    733: [0, 0.69444, 0, 0, 0.5],
    915: [0, 0.69444, 0, 0, 0.54167],
    916: [0, 0.69444, 0, 0, 0.83334],
    920: [0, 0.69444, 0, 0, 0.77778],
    923: [0, 0.69444, 0, 0, 0.61111],
    926: [0, 0.69444, 0, 0, 0.66667],
    928: [0, 0.69444, 0, 0, 0.70834],
    931: [0, 0.69444, 0, 0, 0.72222],
    933: [0, 0.69444, 0, 0, 0.77778],
    934: [0, 0.69444, 0, 0, 0.72222],
    936: [0, 0.69444, 0, 0, 0.77778],
    937: [0, 0.69444, 0, 0, 0.72222],
    8211: [0, 0.44444, 0.02778, 0, 0.5],
    8212: [0, 0.44444, 0.02778, 0, 1],
    8216: [0, 0.69444, 0, 0, 0.27778],
    8217: [0, 0.69444, 0, 0, 0.27778],
    8220: [0, 0.69444, 0, 0, 0.5],
    8221: [0, 0.69444, 0, 0, 0.5]
  },
  "Script-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.7, 0.22925, 0, 0.80253],
    66: [0, 0.7, 0.04087, 0, 0.90757],
    67: [0, 0.7, 0.1689, 0, 0.66619],
    68: [0, 0.7, 0.09371, 0, 0.77443],
    69: [0, 0.7, 0.18583, 0, 0.56162],
    70: [0, 0.7, 0.13634, 0, 0.89544],
    71: [0, 0.7, 0.17322, 0, 0.60961],
    72: [0, 0.7, 0.29694, 0, 0.96919],
    73: [0, 0.7, 0.19189, 0, 0.80907],
    74: [0.27778, 0.7, 0.19189, 0, 1.05159],
    75: [0, 0.7, 0.31259, 0, 0.91364],
    76: [0, 0.7, 0.19189, 0, 0.87373],
    77: [0, 0.7, 0.15981, 0, 1.08031],
    78: [0, 0.7, 0.3525, 0, 0.9015],
    79: [0, 0.7, 0.08078, 0, 0.73787],
    80: [0, 0.7, 0.08078, 0, 1.01262],
    81: [0, 0.7, 0.03305, 0, 0.88282],
    82: [0, 0.7, 0.06259, 0, 0.85],
    83: [0, 0.7, 0.19189, 0, 0.86767],
    84: [0, 0.7, 0.29087, 0, 0.74697],
    85: [0, 0.7, 0.25815, 0, 0.79996],
    86: [0, 0.7, 0.27523, 0, 0.62204],
    87: [0, 0.7, 0.27523, 0, 0.80532],
    88: [0, 0.7, 0.26006, 0, 0.94445],
    89: [0, 0.7, 0.2939, 0, 0.70961],
    90: [0, 0.7, 0.24037, 0, 0.8212],
    160: [0, 0, 0, 0, 0.25]
  },
  "Size1-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.35001, 0.85, 0, 0, 0.45834],
    41: [0.35001, 0.85, 0, 0, 0.45834],
    47: [0.35001, 0.85, 0, 0, 0.57778],
    91: [0.35001, 0.85, 0, 0, 0.41667],
    92: [0.35001, 0.85, 0, 0, 0.57778],
    93: [0.35001, 0.85, 0, 0, 0.41667],
    123: [0.35001, 0.85, 0, 0, 0.58334],
    125: [0.35001, 0.85, 0, 0, 0.58334],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.72222, 0, 0, 0.55556],
    732: [0, 0.72222, 0, 0, 0.55556],
    770: [0, 0.72222, 0, 0, 0.55556],
    771: [0, 0.72222, 0, 0, 0.55556],
    8214: [-99e-5, 0.601, 0, 0, 0.77778],
    8593: [1e-5, 0.6, 0, 0, 0.66667],
    8595: [1e-5, 0.6, 0, 0, 0.66667],
    8657: [1e-5, 0.6, 0, 0, 0.77778],
    8659: [1e-5, 0.6, 0, 0, 0.77778],
    8719: [0.25001, 0.75, 0, 0, 0.94445],
    8720: [0.25001, 0.75, 0, 0, 0.94445],
    8721: [0.25001, 0.75, 0, 0, 1.05556],
    8730: [0.35001, 0.85, 0, 0, 1],
    8739: [-599e-5, 0.606, 0, 0, 0.33333],
    8741: [-599e-5, 0.606, 0, 0, 0.55556],
    8747: [0.30612, 0.805, 0.19445, 0, 0.47222],
    8748: [0.306, 0.805, 0.19445, 0, 0.47222],
    8749: [0.306, 0.805, 0.19445, 0, 0.47222],
    8750: [0.30612, 0.805, 0.19445, 0, 0.47222],
    8896: [0.25001, 0.75, 0, 0, 0.83334],
    8897: [0.25001, 0.75, 0, 0, 0.83334],
    8898: [0.25001, 0.75, 0, 0, 0.83334],
    8899: [0.25001, 0.75, 0, 0, 0.83334],
    8968: [0.35001, 0.85, 0, 0, 0.47222],
    8969: [0.35001, 0.85, 0, 0, 0.47222],
    8970: [0.35001, 0.85, 0, 0, 0.47222],
    8971: [0.35001, 0.85, 0, 0, 0.47222],
    9168: [-99e-5, 0.601, 0, 0, 0.66667],
    10216: [0.35001, 0.85, 0, 0, 0.47222],
    10217: [0.35001, 0.85, 0, 0, 0.47222],
    10752: [0.25001, 0.75, 0, 0, 1.11111],
    10753: [0.25001, 0.75, 0, 0, 1.11111],
    10754: [0.25001, 0.75, 0, 0, 1.11111],
    10756: [0.25001, 0.75, 0, 0, 0.83334],
    10758: [0.25001, 0.75, 0, 0, 0.83334]
  },
  "Size2-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.65002, 1.15, 0, 0, 0.59722],
    41: [0.65002, 1.15, 0, 0, 0.59722],
    47: [0.65002, 1.15, 0, 0, 0.81111],
    91: [0.65002, 1.15, 0, 0, 0.47222],
    92: [0.65002, 1.15, 0, 0, 0.81111],
    93: [0.65002, 1.15, 0, 0, 0.47222],
    123: [0.65002, 1.15, 0, 0, 0.66667],
    125: [0.65002, 1.15, 0, 0, 0.66667],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.75, 0, 0, 1],
    732: [0, 0.75, 0, 0, 1],
    770: [0, 0.75, 0, 0, 1],
    771: [0, 0.75, 0, 0, 1],
    8719: [0.55001, 1.05, 0, 0, 1.27778],
    8720: [0.55001, 1.05, 0, 0, 1.27778],
    8721: [0.55001, 1.05, 0, 0, 1.44445],
    8730: [0.65002, 1.15, 0, 0, 1],
    8747: [0.86225, 1.36, 0.44445, 0, 0.55556],
    8748: [0.862, 1.36, 0.44445, 0, 0.55556],
    8749: [0.862, 1.36, 0.44445, 0, 0.55556],
    8750: [0.86225, 1.36, 0.44445, 0, 0.55556],
    8896: [0.55001, 1.05, 0, 0, 1.11111],
    8897: [0.55001, 1.05, 0, 0, 1.11111],
    8898: [0.55001, 1.05, 0, 0, 1.11111],
    8899: [0.55001, 1.05, 0, 0, 1.11111],
    8968: [0.65002, 1.15, 0, 0, 0.52778],
    8969: [0.65002, 1.15, 0, 0, 0.52778],
    8970: [0.65002, 1.15, 0, 0, 0.52778],
    8971: [0.65002, 1.15, 0, 0, 0.52778],
    10216: [0.65002, 1.15, 0, 0, 0.61111],
    10217: [0.65002, 1.15, 0, 0, 0.61111],
    10752: [0.55001, 1.05, 0, 0, 1.51112],
    10753: [0.55001, 1.05, 0, 0, 1.51112],
    10754: [0.55001, 1.05, 0, 0, 1.51112],
    10756: [0.55001, 1.05, 0, 0, 1.11111],
    10758: [0.55001, 1.05, 0, 0, 1.11111]
  },
  "Size3-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.95003, 1.45, 0, 0, 0.73611],
    41: [0.95003, 1.45, 0, 0, 0.73611],
    47: [0.95003, 1.45, 0, 0, 1.04445],
    91: [0.95003, 1.45, 0, 0, 0.52778],
    92: [0.95003, 1.45, 0, 0, 1.04445],
    93: [0.95003, 1.45, 0, 0, 0.52778],
    123: [0.95003, 1.45, 0, 0, 0.75],
    125: [0.95003, 1.45, 0, 0, 0.75],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.75, 0, 0, 1.44445],
    732: [0, 0.75, 0, 0, 1.44445],
    770: [0, 0.75, 0, 0, 1.44445],
    771: [0, 0.75, 0, 0, 1.44445],
    8730: [0.95003, 1.45, 0, 0, 1],
    8968: [0.95003, 1.45, 0, 0, 0.58334],
    8969: [0.95003, 1.45, 0, 0, 0.58334],
    8970: [0.95003, 1.45, 0, 0, 0.58334],
    8971: [0.95003, 1.45, 0, 0, 0.58334],
    10216: [0.95003, 1.45, 0, 0, 0.75],
    10217: [0.95003, 1.45, 0, 0, 0.75]
  },
  "Size4-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [1.25003, 1.75, 0, 0, 0.79167],
    41: [1.25003, 1.75, 0, 0, 0.79167],
    47: [1.25003, 1.75, 0, 0, 1.27778],
    91: [1.25003, 1.75, 0, 0, 0.58334],
    92: [1.25003, 1.75, 0, 0, 1.27778],
    93: [1.25003, 1.75, 0, 0, 0.58334],
    123: [1.25003, 1.75, 0, 0, 0.80556],
    125: [1.25003, 1.75, 0, 0, 0.80556],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.825, 0, 0, 1.8889],
    732: [0, 0.825, 0, 0, 1.8889],
    770: [0, 0.825, 0, 0, 1.8889],
    771: [0, 0.825, 0, 0, 1.8889],
    8730: [1.25003, 1.75, 0, 0, 1],
    8968: [1.25003, 1.75, 0, 0, 0.63889],
    8969: [1.25003, 1.75, 0, 0, 0.63889],
    8970: [1.25003, 1.75, 0, 0, 0.63889],
    8971: [1.25003, 1.75, 0, 0, 0.63889],
    9115: [0.64502, 1.155, 0, 0, 0.875],
    9116: [1e-5, 0.6, 0, 0, 0.875],
    9117: [0.64502, 1.155, 0, 0, 0.875],
    9118: [0.64502, 1.155, 0, 0, 0.875],
    9119: [1e-5, 0.6, 0, 0, 0.875],
    9120: [0.64502, 1.155, 0, 0, 0.875],
    9121: [0.64502, 1.155, 0, 0, 0.66667],
    9122: [-99e-5, 0.601, 0, 0, 0.66667],
    9123: [0.64502, 1.155, 0, 0, 0.66667],
    9124: [0.64502, 1.155, 0, 0, 0.66667],
    9125: [-99e-5, 0.601, 0, 0, 0.66667],
    9126: [0.64502, 1.155, 0, 0, 0.66667],
    9127: [1e-5, 0.9, 0, 0, 0.88889],
    9128: [0.65002, 1.15, 0, 0, 0.88889],
    9129: [0.90001, 0, 0, 0, 0.88889],
    9130: [0, 0.3, 0, 0, 0.88889],
    9131: [1e-5, 0.9, 0, 0, 0.88889],
    9132: [0.65002, 1.15, 0, 0, 0.88889],
    9133: [0.90001, 0, 0, 0, 0.88889],
    9143: [0.88502, 0.915, 0, 0, 1.05556],
    10216: [1.25003, 1.75, 0, 0, 0.80556],
    10217: [1.25003, 1.75, 0, 0, 0.80556],
    57344: [-499e-5, 0.605, 0, 0, 1.05556],
    57345: [-499e-5, 0.605, 0, 0, 1.05556],
    57680: [0, 0.12, 0, 0, 0.45],
    57681: [0, 0.12, 0, 0, 0.45],
    57682: [0, 0.12, 0, 0, 0.45],
    57683: [0, 0.12, 0, 0, 0.45]
  },
  "Typewriter-Regular": {
    32: [0, 0, 0, 0, 0.525],
    33: [0, 0.61111, 0, 0, 0.525],
    34: [0, 0.61111, 0, 0, 0.525],
    35: [0, 0.61111, 0, 0, 0.525],
    36: [0.08333, 0.69444, 0, 0, 0.525],
    37: [0.08333, 0.69444, 0, 0, 0.525],
    38: [0, 0.61111, 0, 0, 0.525],
    39: [0, 0.61111, 0, 0, 0.525],
    40: [0.08333, 0.69444, 0, 0, 0.525],
    41: [0.08333, 0.69444, 0, 0, 0.525],
    42: [0, 0.52083, 0, 0, 0.525],
    43: [-0.08056, 0.53055, 0, 0, 0.525],
    44: [0.13889, 0.125, 0, 0, 0.525],
    45: [-0.08056, 0.53055, 0, 0, 0.525],
    46: [0, 0.125, 0, 0, 0.525],
    47: [0.08333, 0.69444, 0, 0, 0.525],
    48: [0, 0.61111, 0, 0, 0.525],
    49: [0, 0.61111, 0, 0, 0.525],
    50: [0, 0.61111, 0, 0, 0.525],
    51: [0, 0.61111, 0, 0, 0.525],
    52: [0, 0.61111, 0, 0, 0.525],
    53: [0, 0.61111, 0, 0, 0.525],
    54: [0, 0.61111, 0, 0, 0.525],
    55: [0, 0.61111, 0, 0, 0.525],
    56: [0, 0.61111, 0, 0, 0.525],
    57: [0, 0.61111, 0, 0, 0.525],
    58: [0, 0.43056, 0, 0, 0.525],
    59: [0.13889, 0.43056, 0, 0, 0.525],
    60: [-0.05556, 0.55556, 0, 0, 0.525],
    61: [-0.19549, 0.41562, 0, 0, 0.525],
    62: [-0.05556, 0.55556, 0, 0, 0.525],
    63: [0, 0.61111, 0, 0, 0.525],
    64: [0, 0.61111, 0, 0, 0.525],
    65: [0, 0.61111, 0, 0, 0.525],
    66: [0, 0.61111, 0, 0, 0.525],
    67: [0, 0.61111, 0, 0, 0.525],
    68: [0, 0.61111, 0, 0, 0.525],
    69: [0, 0.61111, 0, 0, 0.525],
    70: [0, 0.61111, 0, 0, 0.525],
    71: [0, 0.61111, 0, 0, 0.525],
    72: [0, 0.61111, 0, 0, 0.525],
    73: [0, 0.61111, 0, 0, 0.525],
    74: [0, 0.61111, 0, 0, 0.525],
    75: [0, 0.61111, 0, 0, 0.525],
    76: [0, 0.61111, 0, 0, 0.525],
    77: [0, 0.61111, 0, 0, 0.525],
    78: [0, 0.61111, 0, 0, 0.525],
    79: [0, 0.61111, 0, 0, 0.525],
    80: [0, 0.61111, 0, 0, 0.525],
    81: [0.13889, 0.61111, 0, 0, 0.525],
    82: [0, 0.61111, 0, 0, 0.525],
    83: [0, 0.61111, 0, 0, 0.525],
    84: [0, 0.61111, 0, 0, 0.525],
    85: [0, 0.61111, 0, 0, 0.525],
    86: [0, 0.61111, 0, 0, 0.525],
    87: [0, 0.61111, 0, 0, 0.525],
    88: [0, 0.61111, 0, 0, 0.525],
    89: [0, 0.61111, 0, 0, 0.525],
    90: [0, 0.61111, 0, 0, 0.525],
    91: [0.08333, 0.69444, 0, 0, 0.525],
    92: [0.08333, 0.69444, 0, 0, 0.525],
    93: [0.08333, 0.69444, 0, 0, 0.525],
    94: [0, 0.61111, 0, 0, 0.525],
    95: [0.09514, 0, 0, 0, 0.525],
    96: [0, 0.61111, 0, 0, 0.525],
    97: [0, 0.43056, 0, 0, 0.525],
    98: [0, 0.61111, 0, 0, 0.525],
    99: [0, 0.43056, 0, 0, 0.525],
    100: [0, 0.61111, 0, 0, 0.525],
    101: [0, 0.43056, 0, 0, 0.525],
    102: [0, 0.61111, 0, 0, 0.525],
    103: [0.22222, 0.43056, 0, 0, 0.525],
    104: [0, 0.61111, 0, 0, 0.525],
    105: [0, 0.61111, 0, 0, 0.525],
    106: [0.22222, 0.61111, 0, 0, 0.525],
    107: [0, 0.61111, 0, 0, 0.525],
    108: [0, 0.61111, 0, 0, 0.525],
    109: [0, 0.43056, 0, 0, 0.525],
    110: [0, 0.43056, 0, 0, 0.525],
    111: [0, 0.43056, 0, 0, 0.525],
    112: [0.22222, 0.43056, 0, 0, 0.525],
    113: [0.22222, 0.43056, 0, 0, 0.525],
    114: [0, 0.43056, 0, 0, 0.525],
    115: [0, 0.43056, 0, 0, 0.525],
    116: [0, 0.55358, 0, 0, 0.525],
    117: [0, 0.43056, 0, 0, 0.525],
    118: [0, 0.43056, 0, 0, 0.525],
    119: [0, 0.43056, 0, 0, 0.525],
    120: [0, 0.43056, 0, 0, 0.525],
    121: [0.22222, 0.43056, 0, 0, 0.525],
    122: [0, 0.43056, 0, 0, 0.525],
    123: [0.08333, 0.69444, 0, 0, 0.525],
    124: [0.08333, 0.69444, 0, 0, 0.525],
    125: [0.08333, 0.69444, 0, 0, 0.525],
    126: [0, 0.61111, 0, 0, 0.525],
    127: [0, 0.61111, 0, 0, 0.525],
    160: [0, 0, 0, 0, 0.525],
    176: [0, 0.61111, 0, 0, 0.525],
    184: [0.19445, 0, 0, 0, 0.525],
    305: [0, 0.43056, 0, 0, 0.525],
    567: [0.22222, 0.43056, 0, 0, 0.525],
    711: [0, 0.56597, 0, 0, 0.525],
    713: [0, 0.56555, 0, 0, 0.525],
    714: [0, 0.61111, 0, 0, 0.525],
    715: [0, 0.61111, 0, 0, 0.525],
    728: [0, 0.61111, 0, 0, 0.525],
    730: [0, 0.61111, 0, 0, 0.525],
    770: [0, 0.61111, 0, 0, 0.525],
    771: [0, 0.61111, 0, 0, 0.525],
    776: [0, 0.61111, 0, 0, 0.525],
    915: [0, 0.61111, 0, 0, 0.525],
    916: [0, 0.61111, 0, 0, 0.525],
    920: [0, 0.61111, 0, 0, 0.525],
    923: [0, 0.61111, 0, 0, 0.525],
    926: [0, 0.61111, 0, 0, 0.525],
    928: [0, 0.61111, 0, 0, 0.525],
    931: [0, 0.61111, 0, 0, 0.525],
    933: [0, 0.61111, 0, 0, 0.525],
    934: [0, 0.61111, 0, 0, 0.525],
    936: [0, 0.61111, 0, 0, 0.525],
    937: [0, 0.61111, 0, 0, 0.525],
    8216: [0, 0.61111, 0, 0, 0.525],
    8217: [0, 0.61111, 0, 0, 0.525],
    8242: [0, 0.61111, 0, 0, 0.525],
    9251: [0.11111, 0.21944, 0, 0, 0.525]
  }
}, ge = {
  slant: [0.25, 0.25, 0.25],
  // sigma1
  space: [0, 0, 0],
  // sigma2
  stretch: [0, 0, 0],
  // sigma3
  shrink: [0, 0, 0],
  // sigma4
  xHeight: [0.431, 0.431, 0.431],
  // sigma5
  quad: [1, 1.171, 1.472],
  // sigma6
  extraSpace: [0, 0, 0],
  // sigma7
  num1: [0.677, 0.732, 0.925],
  // sigma8
  num2: [0.394, 0.384, 0.387],
  // sigma9
  num3: [0.444, 0.471, 0.504],
  // sigma10
  denom1: [0.686, 0.752, 1.025],
  // sigma11
  denom2: [0.345, 0.344, 0.532],
  // sigma12
  sup1: [0.413, 0.503, 0.504],
  // sigma13
  sup2: [0.363, 0.431, 0.404],
  // sigma14
  sup3: [0.289, 0.286, 0.294],
  // sigma15
  sub1: [0.15, 0.143, 0.2],
  // sigma16
  sub2: [0.247, 0.286, 0.4],
  // sigma17
  supDrop: [0.386, 0.353, 0.494],
  // sigma18
  subDrop: [0.05, 0.071, 0.1],
  // sigma19
  delim1: [2.39, 1.7, 1.98],
  // sigma20
  delim2: [1.01, 1.157, 1.42],
  // sigma21
  axisHeight: [0.25, 0.25, 0.25],
  // sigma22
  // These font metrics are extracted from TeX by using tftopl on cmex10.tfm;
  // they correspond to the font parameters of the extension fonts (family 3).
  // See the TeXbook, page 441. In AMSTeX, the extension fonts scale; to
  // match cmex7, we'd use cmex7.tfm values for script and scriptscript
  // values.
  defaultRuleThickness: [0.04, 0.049, 0.049],
  // xi8; cmex7: 0.049
  bigOpSpacing1: [0.111, 0.111, 0.111],
  // xi9
  bigOpSpacing2: [0.166, 0.166, 0.166],
  // xi10
  bigOpSpacing3: [0.2, 0.2, 0.2],
  // xi11
  bigOpSpacing4: [0.6, 0.611, 0.611],
  // xi12; cmex7: 0.611
  bigOpSpacing5: [0.1, 0.143, 0.143],
  // xi13; cmex7: 0.143
  // The \sqrt rule width is taken from the height of the surd character.
  // Since we use the same font at all sizes, this thickness doesn't scale.
  sqrtRuleThickness: [0.04, 0.04, 0.04],
  // This value determines how large a pt is, for metrics which are defined
  // in terms of pts.
  // This value is also used in katex.less; if you change it make sure the
  // values match.
  ptPerEm: [10, 10, 10],
  // The space between adjacent `|` columns in an array definition. From
  // `\showthe\doublerulesep` in LaTeX. Equals 2.0 / ptPerEm.
  doubleRuleSep: [0.2, 0.2, 0.2],
  // The width of separator lines in {array} environments. From
  // `\showthe\arrayrulewidth` in LaTeX. Equals 0.4 / ptPerEm.
  arrayRuleWidth: [0.04, 0.04, 0.04],
  // Two values from LaTeX source2e:
  fboxsep: [0.3, 0.3, 0.3],
  //        3 pt / ptPerEm
  fboxrule: [0.04, 0.04, 0.04]
  // 0.4 pt / ptPerEm
}, Ot = {
  // Latin-1
  Å: "A",
  Ð: "D",
  Þ: "o",
  å: "a",
  ð: "d",
  þ: "o",
  // Cyrillic
  А: "A",
  Б: "B",
  В: "B",
  Г: "F",
  Д: "A",
  Е: "E",
  Ж: "K",
  З: "3",
  И: "N",
  Й: "N",
  К: "K",
  Л: "N",
  М: "M",
  Н: "H",
  О: "O",
  П: "N",
  Р: "P",
  С: "C",
  Т: "T",
  У: "y",
  Ф: "O",
  Х: "X",
  Ц: "U",
  Ч: "h",
  Ш: "W",
  Щ: "W",
  Ъ: "B",
  Ы: "X",
  Ь: "B",
  Э: "3",
  Ю: "X",
  Я: "R",
  а: "a",
  б: "b",
  в: "a",
  г: "r",
  д: "y",
  е: "e",
  ж: "m",
  з: "e",
  и: "n",
  й: "n",
  к: "n",
  л: "n",
  м: "m",
  н: "n",
  о: "o",
  п: "n",
  р: "p",
  с: "c",
  т: "o",
  у: "y",
  ф: "b",
  х: "x",
  ц: "n",
  ч: "n",
  ш: "w",
  щ: "w",
  ъ: "a",
  ы: "m",
  ь: "a",
  э: "e",
  ю: "m",
  я: "r"
};
function Ga(r, e) {
  y0[r] = e;
}
function ft(r, e, t) {
  if (!y0[e])
    throw new Error("Font metrics not found for font: " + e + ".");
  var a = r.charCodeAt(0), n = y0[e][a];
  if (!n && r[0] in Ot && (a = Ot[r[0]].charCodeAt(0), n = y0[e][a]), !n && t === "text" && vr(a) && (n = y0[e][77]), n)
    return {
      depth: n[0],
      height: n[1],
      italic: n[2],
      skew: n[3],
      width: n[4]
    };
}
var Ue = {};
function Va(r) {
  var e;
  if (r >= 5 ? e = 0 : r >= 3 ? e = 1 : e = 2, !Ue[e]) {
    var t = Ue[e] = {
      cssEmPerMu: ge.quad[e] / 18
    };
    for (var a in ge)
      ge.hasOwnProperty(a) && (t[a] = ge[a][e]);
  }
  return Ue[e];
}
var Ua = [
  // Each element contains [textsize, scriptsize, scriptscriptsize].
  // The size mappings are taken from TeX with \normalsize=10pt.
  [1, 1, 1],
  // size1: [5, 5, 5]              \tiny
  [2, 1, 1],
  // size2: [6, 5, 5]
  [3, 1, 1],
  // size3: [7, 5, 5]              \scriptsize
  [4, 2, 1],
  // size4: [8, 6, 5]              \footnotesize
  [5, 2, 1],
  // size5: [9, 6, 5]              \small
  [6, 3, 1],
  // size6: [10, 7, 5]             \normalsize
  [7, 4, 2],
  // size7: [12, 8, 6]             \large
  [8, 6, 3],
  // size8: [14.4, 10, 7]          \Large
  [9, 7, 6],
  // size9: [17.28, 12, 10]        \LARGE
  [10, 8, 7],
  // size10: [20.74, 14.4, 12]     \huge
  [11, 10, 9]
  // size11: [24.88, 20.74, 17.28] \HUGE
], Ht = [
  // fontMetrics.js:getGlobalMetrics also uses size indexes, so if
  // you change size indexes, change that function.
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
  1,
  1.2,
  1.44,
  1.728,
  2.074,
  2.488
], Ft = function(e, t) {
  return t.size < 2 ? e : Ua[e - 1][t.size - 1];
};
class A0 {
  // A font family applies to a group of fonts (i.e. SansSerif), while a font
  // represents a specific font (i.e. SansSerif Bold).
  // See: https://tex.stackexchange.com/questions/22350/difference-between-textrm-and-mathrm
  /**
   * The base size index.
   */
  constructor(e) {
    this.style = void 0, this.color = void 0, this.size = void 0, this.textSize = void 0, this.phantom = void 0, this.font = void 0, this.fontFamily = void 0, this.fontWeight = void 0, this.fontShape = void 0, this.sizeMultiplier = void 0, this.maxSize = void 0, this.minRuleThickness = void 0, this._fontMetrics = void 0, this.style = e.style, this.color = e.color, this.size = e.size || A0.BASESIZE, this.textSize = e.textSize || this.size, this.phantom = !!e.phantom, this.font = e.font || "", this.fontFamily = e.fontFamily || "", this.fontWeight = e.fontWeight || "", this.fontShape = e.fontShape || "", this.sizeMultiplier = Ht[this.size - 1], this.maxSize = e.maxSize, this.minRuleThickness = e.minRuleThickness, this._fontMetrics = void 0;
  }
  /**
   * Returns a new options object with the same properties as "this".  Properties
   * from "extension" will be copied to the new options object.
   */
  extend(e) {
    var t = {
      style: this.style,
      size: this.size,
      textSize: this.textSize,
      color: this.color,
      phantom: this.phantom,
      font: this.font,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      fontShape: this.fontShape,
      maxSize: this.maxSize,
      minRuleThickness: this.minRuleThickness
    };
    for (var a in e)
      e.hasOwnProperty(a) && (t[a] = e[a]);
    return new A0(t);
  }
  /**
   * Return an options object with the given style. If `this.style === style`,
   * returns `this`.
   */
  havingStyle(e) {
    return this.style === e ? this : this.extend({
      style: e,
      size: Ft(this.textSize, e)
    });
  }
  /**
   * Return an options object with a cramped version of the current style. If
   * the current style is cramped, returns `this`.
   */
  havingCrampedStyle() {
    return this.havingStyle(this.style.cramp());
  }
  /**
   * Return an options object with the given size and in at least `\textstyle`.
   * Returns `this` if appropriate.
   */
  havingSize(e) {
    return this.size === e && this.textSize === e ? this : this.extend({
      style: this.style.text(),
      size: e,
      textSize: e,
      sizeMultiplier: Ht[e - 1]
    });
  }
  /**
   * Like `this.havingSize(BASESIZE).havingStyle(style)`. If `style` is omitted,
   * changes to at least `\textstyle`.
   */
  havingBaseStyle(e) {
    e = e || this.style.text();
    var t = Ft(A0.BASESIZE, e);
    return this.size === t && this.textSize === A0.BASESIZE && this.style === e ? this : this.extend({
      style: e,
      size: t
    });
  }
  /**
   * Remove the effect of sizing changes such as \Huge.
   * Keep the effect of the current style, such as \scriptstyle.
   */
  havingBaseSizing() {
    var e;
    switch (this.style.id) {
      case 4:
      case 5:
        e = 3;
        break;
      case 6:
      case 7:
        e = 1;
        break;
      default:
        e = 6;
    }
    return this.extend({
      style: this.style.text(),
      size: e
    });
  }
  /**
   * Create a new options object with the given color.
   */
  withColor(e) {
    return this.extend({
      color: e
    });
  }
  /**
   * Create a new options object with "phantom" set to true.
   */
  withPhantom() {
    return this.extend({
      phantom: !0
    });
  }
  /**
   * Creates a new options object with the given math font or old text font.
   * @type {[type]}
   */
  withFont(e) {
    return this.extend({
      font: e
    });
  }
  /**
   * Create a new options objects with the given fontFamily.
   */
  withTextFontFamily(e) {
    return this.extend({
      fontFamily: e,
      font: ""
    });
  }
  /**
   * Creates a new options object with the given font weight
   */
  withTextFontWeight(e) {
    return this.extend({
      fontWeight: e,
      font: ""
    });
  }
  /**
   * Creates a new options object with the given font weight
   */
  withTextFontShape(e) {
    return this.extend({
      fontShape: e,
      font: ""
    });
  }
  /**
   * Return the CSS sizing classes required to switch from enclosing options
   * `oldOptions` to `this`. Returns an array of classes.
   */
  sizingClasses(e) {
    return e.size !== this.size ? ["sizing", "reset-size" + e.size, "size" + this.size] : [];
  }
  /**
   * Return the CSS sizing classes required to switch to the base size. Like
   * `this.havingSize(BASESIZE).sizingClasses(this)`.
   */
  baseSizingClasses() {
    return this.size !== A0.BASESIZE ? ["sizing", "reset-size" + this.size, "size" + A0.BASESIZE] : [];
  }
  /**
   * Return the font metrics for this size.
   */
  fontMetrics() {
    return this._fontMetrics || (this._fontMetrics = Va(this.size)), this._fontMetrics;
  }
  /**
   * Gets the CSS color of the current options object
   */
  getColor() {
    return this.phantom ? "transparent" : this.color;
  }
}
A0.BASESIZE = 6;
var nt = {
  // https://en.wikibooks.org/wiki/LaTeX/Lengths and
  // https://tex.stackexchange.com/a/8263
  pt: 1,
  // TeX point
  mm: 7227 / 2540,
  // millimeter
  cm: 7227 / 254,
  // centimeter
  in: 72.27,
  // inch
  bp: 803 / 800,
  // big (PostScript) points
  pc: 12,
  // pica
  dd: 1238 / 1157,
  // didot
  cc: 14856 / 1157,
  // cicero (12 didot)
  nd: 685 / 642,
  // new didot
  nc: 1370 / 107,
  // new cicero (12 new didot)
  sp: 1 / 65536,
  // scaled point (TeX's internal smallest unit)
  // https://tex.stackexchange.com/a/41371
  px: 803 / 800
  // \pdfpxdimen defaults to 1 bp in pdfTeX and LuaTeX
}, Ya = {
  ex: !0,
  em: !0,
  mu: !0
}, gr = function(e) {
  return typeof e != "string" && (e = e.unit), e in nt || e in Ya || e === "ex";
}, K = function(e, t) {
  var a;
  if (e.unit in nt)
    a = nt[e.unit] / t.fontMetrics().ptPerEm / t.sizeMultiplier;
  else if (e.unit === "mu")
    a = t.fontMetrics().cssEmPerMu;
  else {
    var n;
    if (t.style.isTight() ? n = t.havingStyle(t.style.text()) : n = t, e.unit === "ex")
      a = n.fontMetrics().xHeight;
    else if (e.unit === "em")
      a = n.fontMetrics().quad;
    else
      throw new M("Invalid unit: '" + e.unit + "'");
    n !== t && (a *= n.sizeMultiplier / t.sizeMultiplier);
  }
  return Math.min(e.number * a, t.maxSize);
}, A = function(e) {
  return +e.toFixed(4) + "em";
}, L0 = function(e) {
  return e.filter((t) => t).join(" ");
}, br = function(e, t, a) {
  if (this.classes = e || [], this.attributes = {}, this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = a || {}, t) {
    t.style.isTight() && this.classes.push("mtight");
    var n = t.getColor();
    n && (this.style.color = n);
  }
}, yr = function(e) {
  var t = document.createElement(e);
  t.className = L0(this.classes);
  for (var a in this.style)
    this.style.hasOwnProperty(a) && (t.style[a] = this.style[a]);
  for (var n in this.attributes)
    this.attributes.hasOwnProperty(n) && t.setAttribute(n, this.attributes[n]);
  for (var s = 0; s < this.children.length; s++)
    t.appendChild(this.children[s].toNode());
  return t;
}, xr = function(e) {
  var t = "<" + e;
  this.classes.length && (t += ' class="' + I.escape(L0(this.classes)) + '"');
  var a = "";
  for (var n in this.style)
    this.style.hasOwnProperty(n) && (a += I.hyphenate(n) + ":" + this.style[n] + ";");
  a && (t += ' style="' + I.escape(a) + '"');
  for (var s in this.attributes)
    this.attributes.hasOwnProperty(s) && (t += " " + s + '="' + I.escape(this.attributes[s]) + '"');
  t += ">";
  for (var o = 0; o < this.children.length; o++)
    t += this.children[o].toMarkup();
  return t += "</" + e + ">", t;
};
class me {
  constructor(e, t, a, n) {
    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.width = void 0, this.maxFontSize = void 0, this.style = void 0, br.call(this, e, a, n), this.children = t || [];
  }
  /**
   * Sets an arbitrary attribute on the span. Warning: use this wisely. Not
   * all browsers support attributes the same, and having too many custom
   * attributes is probably bad.
   */
  setAttribute(e, t) {
    this.attributes[e] = t;
  }
  hasClass(e) {
    return I.contains(this.classes, e);
  }
  toNode() {
    return yr.call(this, "span");
  }
  toMarkup() {
    return xr.call(this, "span");
  }
}
class pt {
  constructor(e, t, a, n) {
    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, br.call(this, t, n), this.children = a || [], this.setAttribute("href", e);
  }
  setAttribute(e, t) {
    this.attributes[e] = t;
  }
  hasClass(e) {
    return I.contains(this.classes, e);
  }
  toNode() {
    return yr.call(this, "a");
  }
  toMarkup() {
    return xr.call(this, "a");
  }
}
class Xa {
  constructor(e, t, a) {
    this.src = void 0, this.alt = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.alt = t, this.src = e, this.classes = ["mord"], this.style = a;
  }
  hasClass(e) {
    return I.contains(this.classes, e);
  }
  toNode() {
    var e = document.createElement("img");
    e.src = this.src, e.alt = this.alt, e.className = "mord";
    for (var t in this.style)
      this.style.hasOwnProperty(t) && (e.style[t] = this.style[t]);
    return e;
  }
  toMarkup() {
    var e = "<img  src='" + this.src + " 'alt='" + this.alt + "' ", t = "";
    for (var a in this.style)
      this.style.hasOwnProperty(a) && (t += I.hyphenate(a) + ":" + this.style[a] + ";");
    return t && (e += ' style="' + I.escape(t) + '"'), e += "'/>", e;
  }
}
var $a = {
  î: "ı̂",
  ï: "ı̈",
  í: "ı́",
  // 'ī': '\u0131\u0304', // enable when we add Extended Latin
  ì: "ı̀"
};
class f0 {
  constructor(e, t, a, n, s, o, h, c) {
    this.text = void 0, this.height = void 0, this.depth = void 0, this.italic = void 0, this.skew = void 0, this.width = void 0, this.maxFontSize = void 0, this.classes = void 0, this.style = void 0, this.text = e, this.height = t || 0, this.depth = a || 0, this.italic = n || 0, this.skew = s || 0, this.width = o || 0, this.classes = h || [], this.style = c || {}, this.maxFontSize = 0;
    var p = Ca(this.text.charCodeAt(0));
    p && this.classes.push(p + "_fallback"), /[îïíì]/.test(this.text) && (this.text = $a[this.text]);
  }
  hasClass(e) {
    return I.contains(this.classes, e);
  }
  /**
   * Creates a text node or span from a symbol node. Note that a span is only
   * created if it is needed.
   */
  toNode() {
    var e = document.createTextNode(this.text), t = null;
    this.italic > 0 && (t = document.createElement("span"), t.style.marginRight = A(this.italic)), this.classes.length > 0 && (t = t || document.createElement("span"), t.className = L0(this.classes));
    for (var a in this.style)
      this.style.hasOwnProperty(a) && (t = t || document.createElement("span"), t.style[a] = this.style[a]);
    return t ? (t.appendChild(e), t) : e;
  }
  /**
   * Creates markup for a symbol node.
   */
  toMarkup() {
    var e = !1, t = "<span";
    this.classes.length && (e = !0, t += ' class="', t += I.escape(L0(this.classes)), t += '"');
    var a = "";
    this.italic > 0 && (a += "margin-right:" + this.italic + "em;");
    for (var n in this.style)
      this.style.hasOwnProperty(n) && (a += I.hyphenate(n) + ":" + this.style[n] + ";");
    a && (e = !0, t += ' style="' + I.escape(a) + '"');
    var s = I.escape(this.text);
    return e ? (t += ">", t += s, t += "</span>", t) : s;
  }
}
class D0 {
  constructor(e, t) {
    this.children = void 0, this.attributes = void 0, this.children = e || [], this.attributes = t || {};
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", t = document.createElementNS(e, "svg");
    for (var a in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, a) && t.setAttribute(a, this.attributes[a]);
    for (var n = 0; n < this.children.length; n++)
      t.appendChild(this.children[n].toNode());
    return t;
  }
  toMarkup() {
    var e = '<svg xmlns="http://www.w3.org/2000/svg"';
    for (var t in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
    e += ">";
    for (var a = 0; a < this.children.length; a++)
      e += this.children[a].toMarkup();
    return e += "</svg>", e;
  }
}
class P0 {
  constructor(e, t) {
    this.pathName = void 0, this.alternate = void 0, this.pathName = e, this.alternate = t;
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", t = document.createElementNS(e, "path");
    return this.alternate ? t.setAttribute("d", this.alternate) : t.setAttribute("d", It[this.pathName]), t;
  }
  toMarkup() {
    return this.alternate ? "<path d='" + this.alternate + "'/>" : "<path d='" + It[this.pathName] + "'/>";
  }
}
class it {
  constructor(e) {
    this.attributes = void 0, this.attributes = e || {};
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", t = document.createElementNS(e, "line");
    for (var a in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, a) && t.setAttribute(a, this.attributes[a]);
    return t;
  }
  toMarkup() {
    var e = "<line";
    for (var t in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
    return e += "/>", e;
  }
}
function Lt(r) {
  if (r instanceof f0)
    return r;
  throw new Error("Expected symbolNode but got " + String(r) + ".");
}
function Wa(r) {
  if (r instanceof me)
    return r;
  throw new Error("Expected span<HtmlDomNode> but got " + String(r) + ".");
}
var ja = {
  bin: 1,
  close: 1,
  inner: 1,
  open: 1,
  punct: 1,
  rel: 1
}, Za = {
  "accent-token": 1,
  mathord: 1,
  "op-token": 1,
  spacing: 1,
  textord: 1
}, $ = {
  math: {},
  text: {}
};
function i(r, e, t, a, n, s) {
  $[r][n] = {
    font: e,
    group: t,
    replace: a
  }, s && a && ($[r][a] = $[r][n]);
}
var l = "math", k = "text", u = "main", d = "ams", W = "accent-token", D = "bin", i0 = "close", te = "inner", q = "mathord", _ = "op-token", h0 = "open", Re = "punct", f = "rel", q0 = "spacing", v = "textord";
i(l, u, f, "≡", "\\equiv", !0);
i(l, u, f, "≺", "\\prec", !0);
i(l, u, f, "≻", "\\succ", !0);
i(l, u, f, "∼", "\\sim", !0);
i(l, u, f, "⊥", "\\perp");
i(l, u, f, "⪯", "\\preceq", !0);
i(l, u, f, "⪰", "\\succeq", !0);
i(l, u, f, "≃", "\\simeq", !0);
i(l, u, f, "∣", "\\mid", !0);
i(l, u, f, "≪", "\\ll", !0);
i(l, u, f, "≫", "\\gg", !0);
i(l, u, f, "≍", "\\asymp", !0);
i(l, u, f, "∥", "\\parallel");
i(l, u, f, "⋈", "\\bowtie", !0);
i(l, u, f, "⌣", "\\smile", !0);
i(l, u, f, "⊑", "\\sqsubseteq", !0);
i(l, u, f, "⊒", "\\sqsupseteq", !0);
i(l, u, f, "≐", "\\doteq", !0);
i(l, u, f, "⌢", "\\frown", !0);
i(l, u, f, "∋", "\\ni", !0);
i(l, u, f, "∝", "\\propto", !0);
i(l, u, f, "⊢", "\\vdash", !0);
i(l, u, f, "⊣", "\\dashv", !0);
i(l, u, f, "∋", "\\owns");
i(l, u, Re, ".", "\\ldotp");
i(l, u, Re, "⋅", "\\cdotp");
i(l, u, v, "#", "\\#");
i(k, u, v, "#", "\\#");
i(l, u, v, "&", "\\&");
i(k, u, v, "&", "\\&");
i(l, u, v, "ℵ", "\\aleph", !0);
i(l, u, v, "∀", "\\forall", !0);
i(l, u, v, "ℏ", "\\hbar", !0);
i(l, u, v, "∃", "\\exists", !0);
i(l, u, v, "∇", "\\nabla", !0);
i(l, u, v, "♭", "\\flat", !0);
i(l, u, v, "ℓ", "\\ell", !0);
i(l, u, v, "♮", "\\natural", !0);
i(l, u, v, "♣", "\\clubsuit", !0);
i(l, u, v, "℘", "\\wp", !0);
i(l, u, v, "♯", "\\sharp", !0);
i(l, u, v, "♢", "\\diamondsuit", !0);
i(l, u, v, "ℜ", "\\Re", !0);
i(l, u, v, "♡", "\\heartsuit", !0);
i(l, u, v, "ℑ", "\\Im", !0);
i(l, u, v, "♠", "\\spadesuit", !0);
i(l, u, v, "§", "\\S", !0);
i(k, u, v, "§", "\\S");
i(l, u, v, "¶", "\\P", !0);
i(k, u, v, "¶", "\\P");
i(l, u, v, "†", "\\dag");
i(k, u, v, "†", "\\dag");
i(k, u, v, "†", "\\textdagger");
i(l, u, v, "‡", "\\ddag");
i(k, u, v, "‡", "\\ddag");
i(k, u, v, "‡", "\\textdaggerdbl");
i(l, u, i0, "⎱", "\\rmoustache", !0);
i(l, u, h0, "⎰", "\\lmoustache", !0);
i(l, u, i0, "⟯", "\\rgroup", !0);
i(l, u, h0, "⟮", "\\lgroup", !0);
i(l, u, D, "∓", "\\mp", !0);
i(l, u, D, "⊖", "\\ominus", !0);
i(l, u, D, "⊎", "\\uplus", !0);
i(l, u, D, "⊓", "\\sqcap", !0);
i(l, u, D, "∗", "\\ast");
i(l, u, D, "⊔", "\\sqcup", !0);
i(l, u, D, "◯", "\\bigcirc", !0);
i(l, u, D, "∙", "\\bullet", !0);
i(l, u, D, "‡", "\\ddagger");
i(l, u, D, "≀", "\\wr", !0);
i(l, u, D, "⨿", "\\amalg");
i(l, u, D, "&", "\\And");
i(l, u, f, "⟵", "\\longleftarrow", !0);
i(l, u, f, "⇐", "\\Leftarrow", !0);
i(l, u, f, "⟸", "\\Longleftarrow", !0);
i(l, u, f, "⟶", "\\longrightarrow", !0);
i(l, u, f, "⇒", "\\Rightarrow", !0);
i(l, u, f, "⟹", "\\Longrightarrow", !0);
i(l, u, f, "↔", "\\leftrightarrow", !0);
i(l, u, f, "⟷", "\\longleftrightarrow", !0);
i(l, u, f, "⇔", "\\Leftrightarrow", !0);
i(l, u, f, "⟺", "\\Longleftrightarrow", !0);
i(l, u, f, "↦", "\\mapsto", !0);
i(l, u, f, "⟼", "\\longmapsto", !0);
i(l, u, f, "↗", "\\nearrow", !0);
i(l, u, f, "↩", "\\hookleftarrow", !0);
i(l, u, f, "↪", "\\hookrightarrow", !0);
i(l, u, f, "↘", "\\searrow", !0);
i(l, u, f, "↼", "\\leftharpoonup", !0);
i(l, u, f, "⇀", "\\rightharpoonup", !0);
i(l, u, f, "↙", "\\swarrow", !0);
i(l, u, f, "↽", "\\leftharpoondown", !0);
i(l, u, f, "⇁", "\\rightharpoondown", !0);
i(l, u, f, "↖", "\\nwarrow", !0);
i(l, u, f, "⇌", "\\rightleftharpoons", !0);
i(l, d, f, "≮", "\\nless", !0);
i(l, d, f, "", "\\@nleqslant");
i(l, d, f, "", "\\@nleqq");
i(l, d, f, "⪇", "\\lneq", !0);
i(l, d, f, "≨", "\\lneqq", !0);
i(l, d, f, "", "\\@lvertneqq");
i(l, d, f, "⋦", "\\lnsim", !0);
i(l, d, f, "⪉", "\\lnapprox", !0);
i(l, d, f, "⊀", "\\nprec", !0);
i(l, d, f, "⋠", "\\npreceq", !0);
i(l, d, f, "⋨", "\\precnsim", !0);
i(l, d, f, "⪹", "\\precnapprox", !0);
i(l, d, f, "≁", "\\nsim", !0);
i(l, d, f, "", "\\@nshortmid");
i(l, d, f, "∤", "\\nmid", !0);
i(l, d, f, "⊬", "\\nvdash", !0);
i(l, d, f, "⊭", "\\nvDash", !0);
i(l, d, f, "⋪", "\\ntriangleleft");
i(l, d, f, "⋬", "\\ntrianglelefteq", !0);
i(l, d, f, "⊊", "\\subsetneq", !0);
i(l, d, f, "", "\\@varsubsetneq");
i(l, d, f, "⫋", "\\subsetneqq", !0);
i(l, d, f, "", "\\@varsubsetneqq");
i(l, d, f, "≯", "\\ngtr", !0);
i(l, d, f, "", "\\@ngeqslant");
i(l, d, f, "", "\\@ngeqq");
i(l, d, f, "⪈", "\\gneq", !0);
i(l, d, f, "≩", "\\gneqq", !0);
i(l, d, f, "", "\\@gvertneqq");
i(l, d, f, "⋧", "\\gnsim", !0);
i(l, d, f, "⪊", "\\gnapprox", !0);
i(l, d, f, "⊁", "\\nsucc", !0);
i(l, d, f, "⋡", "\\nsucceq", !0);
i(l, d, f, "⋩", "\\succnsim", !0);
i(l, d, f, "⪺", "\\succnapprox", !0);
i(l, d, f, "≆", "\\ncong", !0);
i(l, d, f, "", "\\@nshortparallel");
i(l, d, f, "∦", "\\nparallel", !0);
i(l, d, f, "⊯", "\\nVDash", !0);
i(l, d, f, "⋫", "\\ntriangleright");
i(l, d, f, "⋭", "\\ntrianglerighteq", !0);
i(l, d, f, "", "\\@nsupseteqq");
i(l, d, f, "⊋", "\\supsetneq", !0);
i(l, d, f, "", "\\@varsupsetneq");
i(l, d, f, "⫌", "\\supsetneqq", !0);
i(l, d, f, "", "\\@varsupsetneqq");
i(l, d, f, "⊮", "\\nVdash", !0);
i(l, d, f, "⪵", "\\precneqq", !0);
i(l, d, f, "⪶", "\\succneqq", !0);
i(l, d, f, "", "\\@nsubseteqq");
i(l, d, D, "⊴", "\\unlhd");
i(l, d, D, "⊵", "\\unrhd");
i(l, d, f, "↚", "\\nleftarrow", !0);
i(l, d, f, "↛", "\\nrightarrow", !0);
i(l, d, f, "⇍", "\\nLeftarrow", !0);
i(l, d, f, "⇏", "\\nRightarrow", !0);
i(l, d, f, "↮", "\\nleftrightarrow", !0);
i(l, d, f, "⇎", "\\nLeftrightarrow", !0);
i(l, d, f, "△", "\\vartriangle");
i(l, d, v, "ℏ", "\\hslash");
i(l, d, v, "▽", "\\triangledown");
i(l, d, v, "◊", "\\lozenge");
i(l, d, v, "Ⓢ", "\\circledS");
i(l, d, v, "®", "\\circledR");
i(k, d, v, "®", "\\circledR");
i(l, d, v, "∡", "\\measuredangle", !0);
i(l, d, v, "∄", "\\nexists");
i(l, d, v, "℧", "\\mho");
i(l, d, v, "Ⅎ", "\\Finv", !0);
i(l, d, v, "⅁", "\\Game", !0);
i(l, d, v, "‵", "\\backprime");
i(l, d, v, "▲", "\\blacktriangle");
i(l, d, v, "▼", "\\blacktriangledown");
i(l, d, v, "■", "\\blacksquare");
i(l, d, v, "⧫", "\\blacklozenge");
i(l, d, v, "★", "\\bigstar");
i(l, d, v, "∢", "\\sphericalangle", !0);
i(l, d, v, "∁", "\\complement", !0);
i(l, d, v, "ð", "\\eth", !0);
i(k, u, v, "ð", "ð");
i(l, d, v, "╱", "\\diagup");
i(l, d, v, "╲", "\\diagdown");
i(l, d, v, "□", "\\square");
i(l, d, v, "□", "\\Box");
i(l, d, v, "◊", "\\Diamond");
i(l, d, v, "¥", "\\yen", !0);
i(k, d, v, "¥", "\\yen", !0);
i(l, d, v, "✓", "\\checkmark", !0);
i(k, d, v, "✓", "\\checkmark");
i(l, d, v, "ℶ", "\\beth", !0);
i(l, d, v, "ℸ", "\\daleth", !0);
i(l, d, v, "ℷ", "\\gimel", !0);
i(l, d, v, "ϝ", "\\digamma", !0);
i(l, d, v, "ϰ", "\\varkappa");
i(l, d, h0, "┌", "\\@ulcorner", !0);
i(l, d, i0, "┐", "\\@urcorner", !0);
i(l, d, h0, "└", "\\@llcorner", !0);
i(l, d, i0, "┘", "\\@lrcorner", !0);
i(l, d, f, "≦", "\\leqq", !0);
i(l, d, f, "⩽", "\\leqslant", !0);
i(l, d, f, "⪕", "\\eqslantless", !0);
i(l, d, f, "≲", "\\lesssim", !0);
i(l, d, f, "⪅", "\\lessapprox", !0);
i(l, d, f, "≊", "\\approxeq", !0);
i(l, d, D, "⋖", "\\lessdot");
i(l, d, f, "⋘", "\\lll", !0);
i(l, d, f, "≶", "\\lessgtr", !0);
i(l, d, f, "⋚", "\\lesseqgtr", !0);
i(l, d, f, "⪋", "\\lesseqqgtr", !0);
i(l, d, f, "≑", "\\doteqdot");
i(l, d, f, "≓", "\\risingdotseq", !0);
i(l, d, f, "≒", "\\fallingdotseq", !0);
i(l, d, f, "∽", "\\backsim", !0);
i(l, d, f, "⋍", "\\backsimeq", !0);
i(l, d, f, "⫅", "\\subseteqq", !0);
i(l, d, f, "⋐", "\\Subset", !0);
i(l, d, f, "⊏", "\\sqsubset", !0);
i(l, d, f, "≼", "\\preccurlyeq", !0);
i(l, d, f, "⋞", "\\curlyeqprec", !0);
i(l, d, f, "≾", "\\precsim", !0);
i(l, d, f, "⪷", "\\precapprox", !0);
i(l, d, f, "⊲", "\\vartriangleleft");
i(l, d, f, "⊴", "\\trianglelefteq");
i(l, d, f, "⊨", "\\vDash", !0);
i(l, d, f, "⊪", "\\Vvdash", !0);
i(l, d, f, "⌣", "\\smallsmile");
i(l, d, f, "⌢", "\\smallfrown");
i(l, d, f, "≏", "\\bumpeq", !0);
i(l, d, f, "≎", "\\Bumpeq", !0);
i(l, d, f, "≧", "\\geqq", !0);
i(l, d, f, "⩾", "\\geqslant", !0);
i(l, d, f, "⪖", "\\eqslantgtr", !0);
i(l, d, f, "≳", "\\gtrsim", !0);
i(l, d, f, "⪆", "\\gtrapprox", !0);
i(l, d, D, "⋗", "\\gtrdot");
i(l, d, f, "⋙", "\\ggg", !0);
i(l, d, f, "≷", "\\gtrless", !0);
i(l, d, f, "⋛", "\\gtreqless", !0);
i(l, d, f, "⪌", "\\gtreqqless", !0);
i(l, d, f, "≖", "\\eqcirc", !0);
i(l, d, f, "≗", "\\circeq", !0);
i(l, d, f, "≜", "\\triangleq", !0);
i(l, d, f, "∼", "\\thicksim");
i(l, d, f, "≈", "\\thickapprox");
i(l, d, f, "⫆", "\\supseteqq", !0);
i(l, d, f, "⋑", "\\Supset", !0);
i(l, d, f, "⊐", "\\sqsupset", !0);
i(l, d, f, "≽", "\\succcurlyeq", !0);
i(l, d, f, "⋟", "\\curlyeqsucc", !0);
i(l, d, f, "≿", "\\succsim", !0);
i(l, d, f, "⪸", "\\succapprox", !0);
i(l, d, f, "⊳", "\\vartriangleright");
i(l, d, f, "⊵", "\\trianglerighteq");
i(l, d, f, "⊩", "\\Vdash", !0);
i(l, d, f, "∣", "\\shortmid");
i(l, d, f, "∥", "\\shortparallel");
i(l, d, f, "≬", "\\between", !0);
i(l, d, f, "⋔", "\\pitchfork", !0);
i(l, d, f, "∝", "\\varpropto");
i(l, d, f, "◀", "\\blacktriangleleft");
i(l, d, f, "∴", "\\therefore", !0);
i(l, d, f, "∍", "\\backepsilon");
i(l, d, f, "▶", "\\blacktriangleright");
i(l, d, f, "∵", "\\because", !0);
i(l, d, f, "⋘", "\\llless");
i(l, d, f, "⋙", "\\gggtr");
i(l, d, D, "⊲", "\\lhd");
i(l, d, D, "⊳", "\\rhd");
i(l, d, f, "≂", "\\eqsim", !0);
i(l, u, f, "⋈", "\\Join");
i(l, d, f, "≑", "\\Doteq", !0);
i(l, d, D, "∔", "\\dotplus", !0);
i(l, d, D, "∖", "\\smallsetminus");
i(l, d, D, "⋒", "\\Cap", !0);
i(l, d, D, "⋓", "\\Cup", !0);
i(l, d, D, "⩞", "\\doublebarwedge", !0);
i(l, d, D, "⊟", "\\boxminus", !0);
i(l, d, D, "⊞", "\\boxplus", !0);
i(l, d, D, "⋇", "\\divideontimes", !0);
i(l, d, D, "⋉", "\\ltimes", !0);
i(l, d, D, "⋊", "\\rtimes", !0);
i(l, d, D, "⋋", "\\leftthreetimes", !0);
i(l, d, D, "⋌", "\\rightthreetimes", !0);
i(l, d, D, "⋏", "\\curlywedge", !0);
i(l, d, D, "⋎", "\\curlyvee", !0);
i(l, d, D, "⊝", "\\circleddash", !0);
i(l, d, D, "⊛", "\\circledast", !0);
i(l, d, D, "⋅", "\\centerdot");
i(l, d, D, "⊺", "\\intercal", !0);
i(l, d, D, "⋒", "\\doublecap");
i(l, d, D, "⋓", "\\doublecup");
i(l, d, D, "⊠", "\\boxtimes", !0);
i(l, d, f, "⇢", "\\dashrightarrow", !0);
i(l, d, f, "⇠", "\\dashleftarrow", !0);
i(l, d, f, "⇇", "\\leftleftarrows", !0);
i(l, d, f, "⇆", "\\leftrightarrows", !0);
i(l, d, f, "⇚", "\\Lleftarrow", !0);
i(l, d, f, "↞", "\\twoheadleftarrow", !0);
i(l, d, f, "↢", "\\leftarrowtail", !0);
i(l, d, f, "↫", "\\looparrowleft", !0);
i(l, d, f, "⇋", "\\leftrightharpoons", !0);
i(l, d, f, "↶", "\\curvearrowleft", !0);
i(l, d, f, "↺", "\\circlearrowleft", !0);
i(l, d, f, "↰", "\\Lsh", !0);
i(l, d, f, "⇈", "\\upuparrows", !0);
i(l, d, f, "↿", "\\upharpoonleft", !0);
i(l, d, f, "⇃", "\\downharpoonleft", !0);
i(l, u, f, "⊶", "\\origof", !0);
i(l, u, f, "⊷", "\\imageof", !0);
i(l, d, f, "⊸", "\\multimap", !0);
i(l, d, f, "↭", "\\leftrightsquigarrow", !0);
i(l, d, f, "⇉", "\\rightrightarrows", !0);
i(l, d, f, "⇄", "\\rightleftarrows", !0);
i(l, d, f, "↠", "\\twoheadrightarrow", !0);
i(l, d, f, "↣", "\\rightarrowtail", !0);
i(l, d, f, "↬", "\\looparrowright", !0);
i(l, d, f, "↷", "\\curvearrowright", !0);
i(l, d, f, "↻", "\\circlearrowright", !0);
i(l, d, f, "↱", "\\Rsh", !0);
i(l, d, f, "⇊", "\\downdownarrows", !0);
i(l, d, f, "↾", "\\upharpoonright", !0);
i(l, d, f, "⇂", "\\downharpoonright", !0);
i(l, d, f, "⇝", "\\rightsquigarrow", !0);
i(l, d, f, "⇝", "\\leadsto");
i(l, d, f, "⇛", "\\Rrightarrow", !0);
i(l, d, f, "↾", "\\restriction");
i(l, u, v, "‘", "`");
i(l, u, v, "$", "\\$");
i(k, u, v, "$", "\\$");
i(k, u, v, "$", "\\textdollar");
i(l, u, v, "%", "\\%");
i(k, u, v, "%", "\\%");
i(l, u, v, "_", "\\_");
i(k, u, v, "_", "\\_");
i(k, u, v, "_", "\\textunderscore");
i(l, u, v, "∠", "\\angle", !0);
i(l, u, v, "∞", "\\infty", !0);
i(l, u, v, "′", "\\prime");
i(l, u, v, "△", "\\triangle");
i(l, u, v, "Γ", "\\Gamma", !0);
i(l, u, v, "Δ", "\\Delta", !0);
i(l, u, v, "Θ", "\\Theta", !0);
i(l, u, v, "Λ", "\\Lambda", !0);
i(l, u, v, "Ξ", "\\Xi", !0);
i(l, u, v, "Π", "\\Pi", !0);
i(l, u, v, "Σ", "\\Sigma", !0);
i(l, u, v, "Υ", "\\Upsilon", !0);
i(l, u, v, "Φ", "\\Phi", !0);
i(l, u, v, "Ψ", "\\Psi", !0);
i(l, u, v, "Ω", "\\Omega", !0);
i(l, u, v, "A", "Α");
i(l, u, v, "B", "Β");
i(l, u, v, "E", "Ε");
i(l, u, v, "Z", "Ζ");
i(l, u, v, "H", "Η");
i(l, u, v, "I", "Ι");
i(l, u, v, "K", "Κ");
i(l, u, v, "M", "Μ");
i(l, u, v, "N", "Ν");
i(l, u, v, "O", "Ο");
i(l, u, v, "P", "Ρ");
i(l, u, v, "T", "Τ");
i(l, u, v, "X", "Χ");
i(l, u, v, "¬", "\\neg", !0);
i(l, u, v, "¬", "\\lnot");
i(l, u, v, "⊤", "\\top");
i(l, u, v, "⊥", "\\bot");
i(l, u, v, "∅", "\\emptyset");
i(l, d, v, "∅", "\\varnothing");
i(l, u, q, "α", "\\alpha", !0);
i(l, u, q, "β", "\\beta", !0);
i(l, u, q, "γ", "\\gamma", !0);
i(l, u, q, "δ", "\\delta", !0);
i(l, u, q, "ϵ", "\\epsilon", !0);
i(l, u, q, "ζ", "\\zeta", !0);
i(l, u, q, "η", "\\eta", !0);
i(l, u, q, "θ", "\\theta", !0);
i(l, u, q, "ι", "\\iota", !0);
i(l, u, q, "κ", "\\kappa", !0);
i(l, u, q, "λ", "\\lambda", !0);
i(l, u, q, "μ", "\\mu", !0);
i(l, u, q, "ν", "\\nu", !0);
i(l, u, q, "ξ", "\\xi", !0);
i(l, u, q, "ο", "\\omicron", !0);
i(l, u, q, "π", "\\pi", !0);
i(l, u, q, "ρ", "\\rho", !0);
i(l, u, q, "σ", "\\sigma", !0);
i(l, u, q, "τ", "\\tau", !0);
i(l, u, q, "υ", "\\upsilon", !0);
i(l, u, q, "ϕ", "\\phi", !0);
i(l, u, q, "χ", "\\chi", !0);
i(l, u, q, "ψ", "\\psi", !0);
i(l, u, q, "ω", "\\omega", !0);
i(l, u, q, "ε", "\\varepsilon", !0);
i(l, u, q, "ϑ", "\\vartheta", !0);
i(l, u, q, "ϖ", "\\varpi", !0);
i(l, u, q, "ϱ", "\\varrho", !0);
i(l, u, q, "ς", "\\varsigma", !0);
i(l, u, q, "φ", "\\varphi", !0);
i(l, u, D, "∗", "*", !0);
i(l, u, D, "+", "+");
i(l, u, D, "−", "-", !0);
i(l, u, D, "⋅", "\\cdot", !0);
i(l, u, D, "∘", "\\circ", !0);
i(l, u, D, "÷", "\\div", !0);
i(l, u, D, "±", "\\pm", !0);
i(l, u, D, "×", "\\times", !0);
i(l, u, D, "∩", "\\cap", !0);
i(l, u, D, "∪", "\\cup", !0);
i(l, u, D, "∖", "\\setminus", !0);
i(l, u, D, "∧", "\\land");
i(l, u, D, "∨", "\\lor");
i(l, u, D, "∧", "\\wedge", !0);
i(l, u, D, "∨", "\\vee", !0);
i(l, u, v, "√", "\\surd");
i(l, u, h0, "⟨", "\\langle", !0);
i(l, u, h0, "∣", "\\lvert");
i(l, u, h0, "∥", "\\lVert");
i(l, u, i0, "?", "?");
i(l, u, i0, "!", "!");
i(l, u, i0, "⟩", "\\rangle", !0);
i(l, u, i0, "∣", "\\rvert");
i(l, u, i0, "∥", "\\rVert");
i(l, u, f, "=", "=");
i(l, u, f, ":", ":");
i(l, u, f, "≈", "\\approx", !0);
i(l, u, f, "≅", "\\cong", !0);
i(l, u, f, "≥", "\\ge");
i(l, u, f, "≥", "\\geq", !0);
i(l, u, f, "←", "\\gets");
i(l, u, f, ">", "\\gt", !0);
i(l, u, f, "∈", "\\in", !0);
i(l, u, f, "", "\\@not");
i(l, u, f, "⊂", "\\subset", !0);
i(l, u, f, "⊃", "\\supset", !0);
i(l, u, f, "⊆", "\\subseteq", !0);
i(l, u, f, "⊇", "\\supseteq", !0);
i(l, d, f, "⊈", "\\nsubseteq", !0);
i(l, d, f, "⊉", "\\nsupseteq", !0);
i(l, u, f, "⊨", "\\models");
i(l, u, f, "←", "\\leftarrow", !0);
i(l, u, f, "≤", "\\le");
i(l, u, f, "≤", "\\leq", !0);
i(l, u, f, "<", "\\lt", !0);
i(l, u, f, "→", "\\rightarrow", !0);
i(l, u, f, "→", "\\to");
i(l, d, f, "≱", "\\ngeq", !0);
i(l, d, f, "≰", "\\nleq", !0);
i(l, u, q0, " ", "\\ ");
i(l, u, q0, " ", "\\space");
i(l, u, q0, " ", "\\nobreakspace");
i(k, u, q0, " ", "\\ ");
i(k, u, q0, " ", " ");
i(k, u, q0, " ", "\\space");
i(k, u, q0, " ", "\\nobreakspace");
i(l, u, q0, null, "\\nobreak");
i(l, u, q0, null, "\\allowbreak");
i(l, u, Re, ",", ",");
i(l, u, Re, ";", ";");
i(l, d, D, "⊼", "\\barwedge", !0);
i(l, d, D, "⊻", "\\veebar", !0);
i(l, u, D, "⊙", "\\odot", !0);
i(l, u, D, "⊕", "\\oplus", !0);
i(l, u, D, "⊗", "\\otimes", !0);
i(l, u, v, "∂", "\\partial", !0);
i(l, u, D, "⊘", "\\oslash", !0);
i(l, d, D, "⊚", "\\circledcirc", !0);
i(l, d, D, "⊡", "\\boxdot", !0);
i(l, u, D, "△", "\\bigtriangleup");
i(l, u, D, "▽", "\\bigtriangledown");
i(l, u, D, "†", "\\dagger");
i(l, u, D, "⋄", "\\diamond");
i(l, u, D, "⋆", "\\star");
i(l, u, D, "◃", "\\triangleleft");
i(l, u, D, "▹", "\\triangleright");
i(l, u, h0, "{", "\\{");
i(k, u, v, "{", "\\{");
i(k, u, v, "{", "\\textbraceleft");
i(l, u, i0, "}", "\\}");
i(k, u, v, "}", "\\}");
i(k, u, v, "}", "\\textbraceright");
i(l, u, h0, "{", "\\lbrace");
i(l, u, i0, "}", "\\rbrace");
i(l, u, h0, "[", "\\lbrack", !0);
i(k, u, v, "[", "\\lbrack", !0);
i(l, u, i0, "]", "\\rbrack", !0);
i(k, u, v, "]", "\\rbrack", !0);
i(l, u, h0, "(", "\\lparen", !0);
i(l, u, i0, ")", "\\rparen", !0);
i(k, u, v, "<", "\\textless", !0);
i(k, u, v, ">", "\\textgreater", !0);
i(l, u, h0, "⌊", "\\lfloor", !0);
i(l, u, i0, "⌋", "\\rfloor", !0);
i(l, u, h0, "⌈", "\\lceil", !0);
i(l, u, i0, "⌉", "\\rceil", !0);
i(l, u, v, "\\", "\\backslash");
i(l, u, v, "∣", "|");
i(l, u, v, "∣", "\\vert");
i(k, u, v, "|", "\\textbar", !0);
i(l, u, v, "∥", "\\|");
i(l, u, v, "∥", "\\Vert");
i(k, u, v, "∥", "\\textbardbl");
i(k, u, v, "~", "\\textasciitilde");
i(k, u, v, "\\", "\\textbackslash");
i(k, u, v, "^", "\\textasciicircum");
i(l, u, f, "↑", "\\uparrow", !0);
i(l, u, f, "⇑", "\\Uparrow", !0);
i(l, u, f, "↓", "\\downarrow", !0);
i(l, u, f, "⇓", "\\Downarrow", !0);
i(l, u, f, "↕", "\\updownarrow", !0);
i(l, u, f, "⇕", "\\Updownarrow", !0);
i(l, u, _, "∐", "\\coprod");
i(l, u, _, "⋁", "\\bigvee");
i(l, u, _, "⋀", "\\bigwedge");
i(l, u, _, "⨄", "\\biguplus");
i(l, u, _, "⋂", "\\bigcap");
i(l, u, _, "⋃", "\\bigcup");
i(l, u, _, "∫", "\\int");
i(l, u, _, "∫", "\\intop");
i(l, u, _, "∬", "\\iint");
i(l, u, _, "∭", "\\iiint");
i(l, u, _, "∏", "\\prod");
i(l, u, _, "∑", "\\sum");
i(l, u, _, "⨂", "\\bigotimes");
i(l, u, _, "⨁", "\\bigoplus");
i(l, u, _, "⨀", "\\bigodot");
i(l, u, _, "∮", "\\oint");
i(l, u, _, "∯", "\\oiint");
i(l, u, _, "∰", "\\oiiint");
i(l, u, _, "⨆", "\\bigsqcup");
i(l, u, _, "∫", "\\smallint");
i(k, u, te, "…", "\\textellipsis");
i(l, u, te, "…", "\\mathellipsis");
i(k, u, te, "…", "\\ldots", !0);
i(l, u, te, "…", "\\ldots", !0);
i(l, u, te, "⋯", "\\@cdots", !0);
i(l, u, te, "⋱", "\\ddots", !0);
i(l, u, v, "⋮", "\\varvdots");
i(l, u, W, "ˊ", "\\acute");
i(l, u, W, "ˋ", "\\grave");
i(l, u, W, "¨", "\\ddot");
i(l, u, W, "~", "\\tilde");
i(l, u, W, "ˉ", "\\bar");
i(l, u, W, "˘", "\\breve");
i(l, u, W, "ˇ", "\\check");
i(l, u, W, "^", "\\hat");
i(l, u, W, "⃗", "\\vec");
i(l, u, W, "˙", "\\dot");
i(l, u, W, "˚", "\\mathring");
i(l, u, q, "", "\\@imath");
i(l, u, q, "", "\\@jmath");
i(l, u, v, "ı", "ı");
i(l, u, v, "ȷ", "ȷ");
i(k, u, v, "ı", "\\i", !0);
i(k, u, v, "ȷ", "\\j", !0);
i(k, u, v, "ß", "\\ss", !0);
i(k, u, v, "æ", "\\ae", !0);
i(k, u, v, "œ", "\\oe", !0);
i(k, u, v, "ø", "\\o", !0);
i(k, u, v, "Æ", "\\AE", !0);
i(k, u, v, "Œ", "\\OE", !0);
i(k, u, v, "Ø", "\\O", !0);
i(k, u, W, "ˊ", "\\'");
i(k, u, W, "ˋ", "\\`");
i(k, u, W, "ˆ", "\\^");
i(k, u, W, "˜", "\\~");
i(k, u, W, "ˉ", "\\=");
i(k, u, W, "˘", "\\u");
i(k, u, W, "˙", "\\.");
i(k, u, W, "¸", "\\c");
i(k, u, W, "˚", "\\r");
i(k, u, W, "ˇ", "\\v");
i(k, u, W, "¨", '\\"');
i(k, u, W, "˝", "\\H");
i(k, u, W, "◯", "\\textcircled");
var wr = {
  "--": !0,
  "---": !0,
  "``": !0,
  "''": !0
};
i(k, u, v, "–", "--", !0);
i(k, u, v, "–", "\\textendash");
i(k, u, v, "—", "---", !0);
i(k, u, v, "—", "\\textemdash");
i(k, u, v, "‘", "`", !0);
i(k, u, v, "‘", "\\textquoteleft");
i(k, u, v, "’", "'", !0);
i(k, u, v, "’", "\\textquoteright");
i(k, u, v, "“", "``", !0);
i(k, u, v, "“", "\\textquotedblleft");
i(k, u, v, "”", "''", !0);
i(k, u, v, "”", "\\textquotedblright");
i(l, u, v, "°", "\\degree", !0);
i(k, u, v, "°", "\\degree");
i(k, u, v, "°", "\\textdegree", !0);
i(l, u, v, "£", "\\pounds");
i(l, u, v, "£", "\\mathsterling", !0);
i(k, u, v, "£", "\\pounds");
i(k, u, v, "£", "\\textsterling", !0);
i(l, d, v, "✠", "\\maltese");
i(k, d, v, "✠", "\\maltese");
var Pt = '0123456789/@."';
for (var Ye = 0; Ye < Pt.length; Ye++) {
  var Gt = Pt.charAt(Ye);
  i(l, u, v, Gt, Gt);
}
var Vt = '0123456789!@*()-=+";:?/.,';
for (var Xe = 0; Xe < Vt.length; Xe++) {
  var Ut = Vt.charAt(Xe);
  i(k, u, v, Ut, Ut);
}
var De = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (var $e = 0; $e < De.length; $e++) {
  var be = De.charAt($e);
  i(l, u, q, be, be), i(k, u, v, be, be);
}
i(l, d, v, "C", "ℂ");
i(k, d, v, "C", "ℂ");
i(l, d, v, "H", "ℍ");
i(k, d, v, "H", "ℍ");
i(l, d, v, "N", "ℕ");
i(k, d, v, "N", "ℕ");
i(l, d, v, "P", "ℙ");
i(k, d, v, "P", "ℙ");
i(l, d, v, "Q", "ℚ");
i(k, d, v, "Q", "ℚ");
i(l, d, v, "R", "ℝ");
i(k, d, v, "R", "ℝ");
i(l, d, v, "Z", "ℤ");
i(k, d, v, "Z", "ℤ");
i(l, u, q, "h", "ℎ");
i(k, u, q, "h", "ℎ");
var E = "";
for (var a0 = 0; a0 < De.length; a0++) {
  var J = De.charAt(a0);
  E = String.fromCharCode(55349, 56320 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56372 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56424 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56580 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56684 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56736 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56788 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56840 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56944 + a0), i(l, u, q, J, E), i(k, u, v, J, E), a0 < 26 && (E = String.fromCharCode(55349, 56632 + a0), i(l, u, q, J, E), i(k, u, v, J, E), E = String.fromCharCode(55349, 56476 + a0), i(l, u, q, J, E), i(k, u, v, J, E));
}
E = String.fromCharCode(55349, 56668);
i(l, u, q, "k", E);
i(k, u, v, "k", E);
for (var Y0 = 0; Y0 < 10; Y0++) {
  var H0 = Y0.toString();
  E = String.fromCharCode(55349, 57294 + Y0), i(l, u, q, H0, E), i(k, u, v, H0, E), E = String.fromCharCode(55349, 57314 + Y0), i(l, u, q, H0, E), i(k, u, v, H0, E), E = String.fromCharCode(55349, 57324 + Y0), i(l, u, q, H0, E), i(k, u, v, H0, E), E = String.fromCharCode(55349, 57334 + Y0), i(l, u, q, H0, E), i(k, u, v, H0, E);
}
var st = "ÐÞþ";
for (var We = 0; We < st.length; We++) {
  var ye = st.charAt(We);
  i(l, u, q, ye, ye), i(k, u, v, ye, ye);
}
var xe = [
  ["mathbf", "textbf", "Main-Bold"],
  // A-Z bold upright
  ["mathbf", "textbf", "Main-Bold"],
  // a-z bold upright
  ["mathnormal", "textit", "Math-Italic"],
  // A-Z italic
  ["mathnormal", "textit", "Math-Italic"],
  // a-z italic
  ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
  // A-Z bold italic
  ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
  // a-z bold italic
  // Map fancy A-Z letters to script, not calligraphic.
  // This aligns with unicode-math and math fonts (except Cambria Math).
  ["mathscr", "textscr", "Script-Regular"],
  // A-Z script
  ["", "", ""],
  // a-z script.  No font
  ["", "", ""],
  // A-Z bold script. No font
  ["", "", ""],
  // a-z bold script. No font
  ["mathfrak", "textfrak", "Fraktur-Regular"],
  // A-Z Fraktur
  ["mathfrak", "textfrak", "Fraktur-Regular"],
  // a-z Fraktur
  ["mathbb", "textbb", "AMS-Regular"],
  // A-Z double-struck
  ["mathbb", "textbb", "AMS-Regular"],
  // k double-struck
  // Note that we are using a bold font, but font metrics for regular Fraktur.
  ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
  // A-Z bold Fraktur
  ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
  // a-z bold Fraktur
  ["mathsf", "textsf", "SansSerif-Regular"],
  // A-Z sans-serif
  ["mathsf", "textsf", "SansSerif-Regular"],
  // a-z sans-serif
  ["mathboldsf", "textboldsf", "SansSerif-Bold"],
  // A-Z bold sans-serif
  ["mathboldsf", "textboldsf", "SansSerif-Bold"],
  // a-z bold sans-serif
  ["mathitsf", "textitsf", "SansSerif-Italic"],
  // A-Z italic sans-serif
  ["mathitsf", "textitsf", "SansSerif-Italic"],
  // a-z italic sans-serif
  ["", "", ""],
  // A-Z bold italic sans. No font
  ["", "", ""],
  // a-z bold italic sans. No font
  ["mathtt", "texttt", "Typewriter-Regular"],
  // A-Z monospace
  ["mathtt", "texttt", "Typewriter-Regular"]
  // a-z monospace
], Yt = [
  ["mathbf", "textbf", "Main-Bold"],
  // 0-9 bold
  ["", "", ""],
  // 0-9 double-struck. No KaTeX font.
  ["mathsf", "textsf", "SansSerif-Regular"],
  // 0-9 sans-serif
  ["mathboldsf", "textboldsf", "SansSerif-Bold"],
  // 0-9 bold sans-serif
  ["mathtt", "texttt", "Typewriter-Regular"]
  // 0-9 monospace
], Ka = function(e, t) {
  var a = e.charCodeAt(0), n = e.charCodeAt(1), s = (a - 55296) * 1024 + (n - 56320) + 65536, o = t === "math" ? 0 : 1;
  if (119808 <= s && s < 120484) {
    var h = Math.floor((s - 119808) / 26);
    return [xe[h][2], xe[h][o]];
  } else if (120782 <= s && s <= 120831) {
    var c = Math.floor((s - 120782) / 10);
    return [Yt[c][2], Yt[c][o]];
  } else {
    if (s === 120485 || s === 120486)
      return [xe[0][2], xe[0][o]];
    if (120486 < s && s < 120782)
      return ["", ""];
    throw new M("Unsupported character: " + e);
  }
}, Ee = function(e, t, a) {
  return $[a][e] && $[a][e].replace && (e = $[a][e].replace), {
    value: e,
    metrics: ft(e, t, a)
  };
}, g0 = function(e, t, a, n, s) {
  var o = Ee(e, t, a), h = o.metrics;
  e = o.value;
  var c;
  if (h) {
    var p = h.italic;
    (a === "text" || n && n.font === "mathit") && (p = 0), c = new f0(e, h.height, h.depth, p, h.skew, h.width, s);
  } else
    typeof console < "u" && console.warn("No character metrics " + ("for '" + e + "' in style '" + t + "' and mode '" + a + "'")), c = new f0(e, 0, 0, 0, 0, 0, s);
  if (n) {
    c.maxFontSize = n.sizeMultiplier, n.style.isTight() && c.classes.push("mtight");
    var g = n.getColor();
    g && (c.style.color = g);
  }
  return c;
}, Ja = function(e, t, a, n) {
  return n === void 0 && (n = []), a.font === "boldsymbol" && Ee(e, "Main-Bold", t).metrics ? g0(e, "Main-Bold", t, a, n.concat(["mathbf"])) : e === "\\" || $[t][e].font === "main" ? g0(e, "Main-Regular", t, a, n) : g0(e, "AMS-Regular", t, a, n.concat(["amsrm"]));
}, Qa = function(e, t, a, n, s) {
  return s !== "textord" && Ee(e, "Math-BoldItalic", t).metrics ? {
    fontName: "Math-BoldItalic",
    fontClass: "boldsymbol"
  } : {
    fontName: "Main-Bold",
    fontClass: "mathbf"
  };
}, _a = function(e, t, a) {
  var n = e.mode, s = e.text, o = ["mord"], h = n === "math" || n === "text" && t.font, c = h ? t.font : t.fontFamily, p = "", g = "";
  if (s.charCodeAt(0) === 55349 && ([p, g] = Ka(s, n)), p.length > 0)
    return g0(s, p, n, t, o.concat(g));
  if (c) {
    var y, w;
    if (c === "boldsymbol") {
      var x = Qa(s, n, t, o, a);
      y = x.fontName, w = [x.fontClass];
    } else
      h ? (y = Mr[c].fontName, w = [c]) : (y = we(c, t.fontWeight, t.fontShape), w = [c, t.fontWeight, t.fontShape]);
    if (Ee(s, y, n).metrics)
      return g0(s, y, n, t, o.concat(w));
    if (wr.hasOwnProperty(s) && y.slice(0, 10) === "Typewriter") {
      for (var z = [], T = 0; T < s.length; T++)
        z.push(g0(s[T], y, n, t, o.concat(w)));
      return Sr(z);
    }
  }
  if (a === "mathord")
    return g0(s, "Math-Italic", n, t, o.concat(["mathnormal"]));
  if (a === "textord") {
    var C = $[n][s] && $[n][s].font;
    if (C === "ams") {
      var N = we("amsrm", t.fontWeight, t.fontShape);
      return g0(s, N, n, t, o.concat("amsrm", t.fontWeight, t.fontShape));
    } else if (C === "main" || !C) {
      var O = we("textrm", t.fontWeight, t.fontShape);
      return g0(s, O, n, t, o.concat(t.fontWeight, t.fontShape));
    } else {
      var H = we(C, t.fontWeight, t.fontShape);
      return g0(s, H, n, t, o.concat(H, t.fontWeight, t.fontShape));
    }
  } else
    throw new Error("unexpected type: " + a + " in makeOrd");
}, e1 = (r, e) => {
  if (L0(r.classes) !== L0(e.classes) || r.skew !== e.skew || r.maxFontSize !== e.maxFontSize)
    return !1;
  if (r.classes.length === 1) {
    var t = r.classes[0];
    if (t === "mbin" || t === "mord")
      return !1;
  }
  for (var a in r.style)
    if (r.style.hasOwnProperty(a) && r.style[a] !== e.style[a])
      return !1;
  for (var n in e.style)
    if (e.style.hasOwnProperty(n) && r.style[n] !== e.style[n])
      return !1;
  return !0;
}, t1 = (r) => {
  for (var e = 0; e < r.length - 1; e++) {
    var t = r[e], a = r[e + 1];
    t instanceof f0 && a instanceof f0 && e1(t, a) && (t.text += a.text, t.height = Math.max(t.height, a.height), t.depth = Math.max(t.depth, a.depth), t.italic = a.italic, r.splice(e + 1, 1), e--);
  }
  return r;
}, vt = function(e) {
  for (var t = 0, a = 0, n = 0, s = 0; s < e.children.length; s++) {
    var o = e.children[s];
    o.height > t && (t = o.height), o.depth > a && (a = o.depth), o.maxFontSize > n && (n = o.maxFontSize);
  }
  e.height = t, e.depth = a, e.maxFontSize = n;
}, l0 = function(e, t, a, n) {
  var s = new me(e, t, a, n);
  return vt(s), s;
}, kr = (r, e, t, a) => new me(r, e, t, a), r1 = function(e, t, a) {
  var n = l0([e], [], t);
  return n.height = Math.max(a || t.fontMetrics().defaultRuleThickness, t.minRuleThickness), n.style.borderBottomWidth = A(n.height), n.maxFontSize = 1, n;
}, a1 = function(e, t, a, n) {
  var s = new pt(e, t, a, n);
  return vt(s), s;
}, Sr = function(e) {
  var t = new he(e);
  return vt(t), t;
}, n1 = function(e, t) {
  return e instanceof he ? l0([], [e], t) : e;
}, i1 = function(e) {
  if (e.positionType === "individualShift") {
    for (var t = e.children, a = [t[0]], n = -t[0].shift - t[0].elem.depth, s = n, o = 1; o < t.length; o++) {
      var h = -t[o].shift - s - t[o].elem.depth, c = h - (t[o - 1].elem.height + t[o - 1].elem.depth);
      s = s + h, a.push({
        type: "kern",
        size: c
      }), a.push(t[o]);
    }
    return {
      children: a,
      depth: n
    };
  }
  var p;
  if (e.positionType === "top") {
    for (var g = e.positionData, y = 0; y < e.children.length; y++) {
      var w = e.children[y];
      g -= w.type === "kern" ? w.size : w.elem.height + w.elem.depth;
    }
    p = g;
  } else if (e.positionType === "bottom")
    p = -e.positionData;
  else {
    var x = e.children[0];
    if (x.type !== "elem")
      throw new Error('First child must have type "elem".');
    if (e.positionType === "shift")
      p = -x.elem.depth - e.positionData;
    else if (e.positionType === "firstBaseline")
      p = -x.elem.depth;
    else
      throw new Error("Invalid positionType " + e.positionType + ".");
  }
  return {
    children: e.children,
    depth: p
  };
}, s1 = function(e, t) {
  for (var {
    children: a,
    depth: n
  } = i1(e), s = 0, o = 0; o < a.length; o++) {
    var h = a[o];
    if (h.type === "elem") {
      var c = h.elem;
      s = Math.max(s, c.maxFontSize, c.height);
    }
  }
  s += 2;
  var p = l0(["pstrut"], []);
  p.style.height = A(s);
  for (var g = [], y = n, w = n, x = n, z = 0; z < a.length; z++) {
    var T = a[z];
    if (T.type === "kern")
      x += T.size;
    else {
      var C = T.elem, N = T.wrapperClasses || [], O = T.wrapperStyle || {}, H = l0(N, [p, C], void 0, O);
      H.style.top = A(-s - x - C.depth), T.marginLeft && (H.style.marginLeft = T.marginLeft), T.marginRight && (H.style.marginRight = T.marginRight), g.push(H), x += C.height + C.depth;
    }
    y = Math.min(y, x), w = Math.max(w, x);
  }
  var V = l0(["vlist"], g);
  V.style.height = A(w);
  var L;
  if (y < 0) {
    var U = l0([], []), G = l0(["vlist"], [U]);
    G.style.height = A(-y);
    var j = l0(["vlist-s"], [new f0("​")]);
    L = [l0(["vlist-r"], [V, j]), l0(["vlist-r"], [G])];
  } else
    L = [l0(["vlist-r"], [V])];
  var Y = l0(["vlist-t"], L);
  return L.length === 2 && Y.classes.push("vlist-t2"), Y.height = w, Y.depth = -y, Y;
}, l1 = (r, e) => {
  var t = l0(["mspace"], [], e), a = K(r, e);
  return t.style.marginRight = A(a), t;
}, we = function(e, t, a) {
  var n = "";
  switch (e) {
    case "amsrm":
      n = "AMS";
      break;
    case "textrm":
      n = "Main";
      break;
    case "textsf":
      n = "SansSerif";
      break;
    case "texttt":
      n = "Typewriter";
      break;
    default:
      n = e;
  }
  var s;
  return t === "textbf" && a === "textit" ? s = "BoldItalic" : t === "textbf" ? s = "Bold" : t === "textit" ? s = "Italic" : s = "Regular", n + "-" + s;
}, Mr = {
  // styles
  mathbf: {
    variant: "bold",
    fontName: "Main-Bold"
  },
  mathrm: {
    variant: "normal",
    fontName: "Main-Regular"
  },
  textit: {
    variant: "italic",
    fontName: "Main-Italic"
  },
  mathit: {
    variant: "italic",
    fontName: "Main-Italic"
  },
  mathnormal: {
    variant: "italic",
    fontName: "Math-Italic"
  },
  // "boldsymbol" is missing because they require the use of multiple fonts:
  // Math-BoldItalic and Main-Bold.  This is handled by a special case in
  // makeOrd which ends up calling boldsymbol.
  // families
  mathbb: {
    variant: "double-struck",
    fontName: "AMS-Regular"
  },
  mathcal: {
    variant: "script",
    fontName: "Caligraphic-Regular"
  },
  mathfrak: {
    variant: "fraktur",
    fontName: "Fraktur-Regular"
  },
  mathscr: {
    variant: "script",
    fontName: "Script-Regular"
  },
  mathsf: {
    variant: "sans-serif",
    fontName: "SansSerif-Regular"
  },
  mathtt: {
    variant: "monospace",
    fontName: "Typewriter-Regular"
  }
}, zr = {
  //   path, width, height
  vec: ["vec", 0.471, 0.714],
  // values from the font glyph
  oiintSize1: ["oiintSize1", 0.957, 0.499],
  // oval to overlay the integrand
  oiintSize2: ["oiintSize2", 1.472, 0.659],
  oiiintSize1: ["oiiintSize1", 1.304, 0.499],
  oiiintSize2: ["oiiintSize2", 1.98, 0.659]
}, o1 = function(e, t) {
  var [a, n, s] = zr[e], o = new P0(a), h = new D0([o], {
    width: A(n),
    height: A(s),
    // Override CSS rule `.katex svg { width: 100% }`
    style: "width:" + A(n),
    viewBox: "0 0 " + 1e3 * n + " " + 1e3 * s,
    preserveAspectRatio: "xMinYMin"
  }), c = kr(["overlay"], [h], t);
  return c.height = s, c.style.height = A(s), c.style.width = A(n), c;
}, b = {
  fontMap: Mr,
  makeSymbol: g0,
  mathsym: Ja,
  makeSpan: l0,
  makeSvgSpan: kr,
  makeLineSpan: r1,
  makeAnchor: a1,
  makeFragment: Sr,
  wrapFragment: n1,
  makeVList: s1,
  makeOrd: _a,
  makeGlue: l1,
  staticSvg: o1,
  svgData: zr,
  tryCombineChars: t1
}, Z = {
  number: 3,
  unit: "mu"
}, X0 = {
  number: 4,
  unit: "mu"
}, z0 = {
  number: 5,
  unit: "mu"
}, u1 = {
  mord: {
    mop: Z,
    mbin: X0,
    mrel: z0,
    minner: Z
  },
  mop: {
    mord: Z,
    mop: Z,
    mrel: z0,
    minner: Z
  },
  mbin: {
    mord: X0,
    mop: X0,
    mopen: X0,
    minner: X0
  },
  mrel: {
    mord: z0,
    mop: z0,
    mopen: z0,
    minner: z0
  },
  mopen: {},
  mclose: {
    mop: Z,
    mbin: X0,
    mrel: z0,
    minner: Z
  },
  mpunct: {
    mord: Z,
    mop: Z,
    mrel: z0,
    mopen: Z,
    mclose: Z,
    mpunct: Z,
    minner: Z
  },
  minner: {
    mord: Z,
    mop: Z,
    mbin: X0,
    mrel: z0,
    mopen: Z,
    mpunct: Z,
    minner: Z
  }
}, h1 = {
  mord: {
    mop: Z
  },
  mop: {
    mord: Z,
    mop: Z
  },
  mbin: {},
  mrel: {},
  mopen: {},
  mclose: {
    mop: Z
  },
  mpunct: {},
  minner: {
    mop: Z
  }
}, Ar = {}, Ce = {}, Ne = {};
function B(r) {
  for (var {
    type: e,
    names: t,
    props: a,
    handler: n,
    htmlBuilder: s,
    mathmlBuilder: o
  } = r, h = {
    type: e,
    numArgs: a.numArgs,
    argTypes: a.argTypes,
    allowedInArgument: !!a.allowedInArgument,
    allowedInText: !!a.allowedInText,
    allowedInMath: a.allowedInMath === void 0 ? !0 : a.allowedInMath,
    numOptionalArgs: a.numOptionalArgs || 0,
    infix: !!a.infix,
    primitive: !!a.primitive,
    handler: n
  }, c = 0; c < t.length; ++c)
    Ar[t[c]] = h;
  e && (s && (Ce[e] = s), o && (Ne[e] = o));
}
function $0(r) {
  var {
    type: e,
    htmlBuilder: t,
    mathmlBuilder: a
  } = r;
  B({
    type: e,
    names: [],
    props: {
      numArgs: 0
    },
    handler() {
      throw new Error("Should never be called.");
    },
    htmlBuilder: t,
    mathmlBuilder: a
  });
}
var qe = function(e) {
  return e.type === "ordgroup" && e.body.length === 1 ? e.body[0] : e;
}, Q = function(e) {
  return e.type === "ordgroup" ? e.body : [e];
}, C0 = b.makeSpan, m1 = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"], c1 = ["rightmost", "mrel", "mclose", "mpunct"], d1 = {
  display: R.DISPLAY,
  text: R.TEXT,
  script: R.SCRIPT,
  scriptscript: R.SCRIPTSCRIPT
}, f1 = {
  mord: "mord",
  mop: "mop",
  mbin: "mbin",
  mrel: "mrel",
  mopen: "mopen",
  mclose: "mclose",
  mpunct: "mpunct",
  minner: "minner"
}, t0 = function(e, t, a, n) {
  n === void 0 && (n = [null, null]);
  for (var s = [], o = 0; o < e.length; o++) {
    var h = P(e[o], t);
    if (h instanceof he) {
      var c = h.children;
      s.push(...c);
    } else
      s.push(h);
  }
  if (b.tryCombineChars(s), !a)
    return s;
  var p = t;
  if (e.length === 1) {
    var g = e[0];
    g.type === "sizing" ? p = t.havingSize(g.size) : g.type === "styling" && (p = t.havingStyle(d1[g.style]));
  }
  var y = C0([n[0] || "leftmost"], [], t), w = C0([n[1] || "rightmost"], [], t), x = a === "root";
  return Xt(s, (z, T) => {
    var C = T.classes[0], N = z.classes[0];
    C === "mbin" && I.contains(c1, N) ? T.classes[0] = "mord" : N === "mbin" && I.contains(m1, C) && (z.classes[0] = "mord");
  }, {
    node: y
  }, w, x), Xt(s, (z, T) => {
    var C = lt(T), N = lt(z), O = C && N ? z.hasClass("mtight") ? h1[C][N] : u1[C][N] : null;
    if (O)
      return b.makeGlue(O, p);
  }, {
    node: y
  }, w, x), s;
}, Xt = function r(e, t, a, n, s) {
  n && e.push(n);
  for (var o = 0; o < e.length; o++) {
    var h = e[o], c = Tr(h);
    if (c) {
      r(c.children, t, a, null, s);
      continue;
    }
    var p = !h.hasClass("mspace");
    if (p) {
      var g = t(h, a.node);
      g && (a.insertAfter ? a.insertAfter(g) : (e.unshift(g), o++));
    }
    p ? a.node = h : s && h.hasClass("newline") && (a.node = C0(["leftmost"])), a.insertAfter = ((y) => (w) => {
      e.splice(y + 1, 0, w), o++;
    })(o);
  }
  n && e.pop();
}, Tr = function(e) {
  return e instanceof he || e instanceof pt || e instanceof me && e.hasClass("enclosing") ? e : null;
}, p1 = function r(e, t) {
  var a = Tr(e);
  if (a) {
    var n = a.children;
    if (n.length) {
      if (t === "right")
        return r(n[n.length - 1], "right");
      if (t === "left")
        return r(n[0], "left");
    }
  }
  return e;
}, lt = function(e, t) {
  return e ? (t && (e = p1(e, t)), f1[e.classes[0]] || null) : null;
}, oe = function(e, t) {
  var a = ["nulldelimiter"].concat(e.baseSizingClasses());
  return C0(t.concat(a));
}, P = function(e, t, a) {
  if (!e)
    return C0();
  if (Ce[e.type]) {
    var n = Ce[e.type](e, t);
    if (a && t.size !== a.size) {
      n = C0(t.sizingClasses(a), [n], t);
      var s = t.sizeMultiplier / a.sizeMultiplier;
      n.height *= s, n.depth *= s;
    }
    return n;
  } else
    throw new M("Got group of unknown type: '" + e.type + "'");
};
function ke(r, e) {
  var t = C0(["base"], r, e), a = C0(["strut"]);
  return a.style.height = A(t.height + t.depth), t.depth && (a.style.verticalAlign = A(-t.depth)), t.children.unshift(a), t;
}
function ot(r, e) {
  var t = null;
  r.length === 1 && r[0].type === "tag" && (t = r[0].tag, r = r[0].body);
  var a = t0(r, e, "root"), n;
  a.length === 2 && a[1].hasClass("tag") && (n = a.pop());
  for (var s = [], o = [], h = 0; h < a.length; h++)
    if (o.push(a[h]), a[h].hasClass("mbin") || a[h].hasClass("mrel") || a[h].hasClass("allowbreak")) {
      for (var c = !1; h < a.length - 1 && a[h + 1].hasClass("mspace") && !a[h + 1].hasClass("newline"); )
        h++, o.push(a[h]), a[h].hasClass("nobreak") && (c = !0);
      c || (s.push(ke(o, e)), o = []);
    } else
      a[h].hasClass("newline") && (o.pop(), o.length > 0 && (s.push(ke(o, e)), o = []), s.push(a[h]));
  o.length > 0 && s.push(ke(o, e));
  var p;
  t ? (p = ke(t0(t, e, !0)), p.classes = ["tag"], s.push(p)) : n && s.push(n);
  var g = C0(["katex-html"], s);
  if (g.setAttribute("aria-hidden", "true"), p) {
    var y = p.children[0];
    y.style.height = A(g.height + g.depth), g.depth && (y.style.verticalAlign = A(-g.depth));
  }
  return g;
}
function Br(r) {
  return new he(r);
}
class c0 {
  constructor(e, t, a) {
    this.type = void 0, this.attributes = void 0, this.children = void 0, this.classes = void 0, this.type = e, this.attributes = {}, this.children = t || [], this.classes = a || [];
  }
  /**
   * Sets an attribute on a MathML node. MathML depends on attributes to convey a
   * semantic content, so this is used heavily.
   */
  setAttribute(e, t) {
    this.attributes[e] = t;
  }
  /**
   * Gets an attribute on a MathML node.
   */
  getAttribute(e) {
    return this.attributes[e];
  }
  /**
   * Converts the math node into a MathML-namespaced DOM element.
   */
  toNode() {
    var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
    for (var t in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
    this.classes.length > 0 && (e.className = L0(this.classes));
    for (var a = 0; a < this.children.length; a++)
      e.appendChild(this.children[a].toNode());
    return e;
  }
  /**
   * Converts the math node into an HTML markup string.
   */
  toMarkup() {
    var e = "<" + this.type;
    for (var t in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + '="', e += I.escape(this.attributes[t]), e += '"');
    this.classes.length > 0 && (e += ' class ="' + I.escape(L0(this.classes)) + '"'), e += ">";
    for (var a = 0; a < this.children.length; a++)
      e += this.children[a].toMarkup();
    return e += "</" + this.type + ">", e;
  }
  /**
   * Converts the math node into a string, similar to innerText, but escaped.
   */
  toText() {
    return this.children.map((e) => e.toText()).join("");
  }
}
class ie {
  constructor(e) {
    this.text = void 0, this.text = e;
  }
  /**
   * Converts the text node into a DOM text node.
   */
  toNode() {
    return document.createTextNode(this.text);
  }
  /**
   * Converts the text node into escaped HTML markup
   * (representing the text itself).
   */
  toMarkup() {
    return I.escape(this.toText());
  }
  /**
   * Converts the text node into a string
   * (representing the text itself).
   */
  toText() {
    return this.text;
  }
}
class v1 {
  /**
   * Create a Space node with width given in CSS ems.
   */
  constructor(e) {
    this.width = void 0, this.character = void 0, this.width = e, e >= 0.05555 && e <= 0.05556 ? this.character = " " : e >= 0.1666 && e <= 0.1667 ? this.character = " " : e >= 0.2222 && e <= 0.2223 ? this.character = " " : e >= 0.2777 && e <= 0.2778 ? this.character = "  " : e >= -0.05556 && e <= -0.05555 ? this.character = " ⁣" : e >= -0.1667 && e <= -0.1666 ? this.character = " ⁣" : e >= -0.2223 && e <= -0.2222 ? this.character = " ⁣" : e >= -0.2778 && e <= -0.2777 ? this.character = " ⁣" : this.character = null;
  }
  /**
   * Converts the math node into a MathML-namespaced DOM element.
   */
  toNode() {
    if (this.character)
      return document.createTextNode(this.character);
    var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
    return e.setAttribute("width", A(this.width)), e;
  }
  /**
   * Converts the math node into an HTML markup string.
   */
  toMarkup() {
    return this.character ? "<mtext>" + this.character + "</mtext>" : '<mspace width="' + A(this.width) + '"/>';
  }
  /**
   * Converts the math node into a string, similar to innerText.
   */
  toText() {
    return this.character ? this.character : " ";
  }
}
var S = {
  MathNode: c0,
  TextNode: ie,
  SpaceNode: v1,
  newDocumentFragment: Br
}, p0 = function(e, t, a) {
  return $[t][e] && $[t][e].replace && e.charCodeAt(0) !== 55349 && !(wr.hasOwnProperty(e) && a && (a.fontFamily && a.fontFamily.slice(4, 6) === "tt" || a.font && a.font.slice(4, 6) === "tt")) && (e = $[t][e].replace), new S.TextNode(e);
}, gt = function(e) {
  return e.length === 1 ? e[0] : new S.MathNode("mrow", e);
}, bt = function(e, t) {
  if (t.fontFamily === "texttt")
    return "monospace";
  if (t.fontFamily === "textsf")
    return t.fontShape === "textit" && t.fontWeight === "textbf" ? "sans-serif-bold-italic" : t.fontShape === "textit" ? "sans-serif-italic" : t.fontWeight === "textbf" ? "bold-sans-serif" : "sans-serif";
  if (t.fontShape === "textit" && t.fontWeight === "textbf")
    return "bold-italic";
  if (t.fontShape === "textit")
    return "italic";
  if (t.fontWeight === "textbf")
    return "bold";
  var a = t.font;
  if (!a || a === "mathnormal")
    return null;
  var n = e.mode;
  if (a === "mathit")
    return "italic";
  if (a === "boldsymbol")
    return e.type === "textord" ? "bold" : "bold-italic";
  if (a === "mathbf")
    return "bold";
  if (a === "mathbb")
    return "double-struck";
  if (a === "mathfrak")
    return "fraktur";
  if (a === "mathscr" || a === "mathcal")
    return "script";
  if (a === "mathsf")
    return "sans-serif";
  if (a === "mathtt")
    return "monospace";
  var s = e.text;
  if (I.contains(["\\imath", "\\jmath"], s))
    return null;
  $[n][s] && $[n][s].replace && (s = $[n][s].replace);
  var o = b.fontMap[a].fontName;
  return ft(s, o, n) ? b.fontMap[a].variant : null;
}, o0 = function(e, t, a) {
  if (e.length === 1) {
    var n = X(e[0], t);
    return a && n instanceof c0 && n.type === "mo" && (n.setAttribute("lspace", "0em"), n.setAttribute("rspace", "0em")), [n];
  }
  for (var s = [], o, h = 0; h < e.length; h++) {
    var c = X(e[h], t);
    if (c instanceof c0 && o instanceof c0) {
      if (c.type === "mtext" && o.type === "mtext" && c.getAttribute("mathvariant") === o.getAttribute("mathvariant")) {
        o.children.push(...c.children);
        continue;
      } else if (c.type === "mn" && o.type === "mn") {
        o.children.push(...c.children);
        continue;
      } else if (c.type === "mi" && c.children.length === 1 && o.type === "mn") {
        var p = c.children[0];
        if (p instanceof ie && p.text === ".") {
          o.children.push(...c.children);
          continue;
        }
      } else if (o.type === "mi" && o.children.length === 1) {
        var g = o.children[0];
        if (g instanceof ie && g.text === "̸" && (c.type === "mo" || c.type === "mi" || c.type === "mn")) {
          var y = c.children[0];
          y instanceof ie && y.text.length > 0 && (y.text = y.text.slice(0, 1) + "̸" + y.text.slice(1), s.pop());
        }
      }
    }
    s.push(c), o = c;
  }
  return s;
}, G0 = function(e, t, a) {
  return gt(o0(e, t, a));
}, X = function(e, t) {
  if (!e)
    return new S.MathNode("mrow");
  if (Ne[e.type]) {
    var a = Ne[e.type](e, t);
    return a;
  } else
    throw new M("Got group of unknown type: '" + e.type + "'");
};
function $t(r, e, t, a, n) {
  var s = o0(r, t), o;
  s.length === 1 && s[0] instanceof c0 && I.contains(["mrow", "mtable"], s[0].type) ? o = s[0] : o = new S.MathNode("mrow", s);
  var h = new S.MathNode("annotation", [new S.TextNode(e)]);
  h.setAttribute("encoding", "application/x-tex");
  var c = new S.MathNode("semantics", [o, h]), p = new S.MathNode("math", [c]);
  p.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML"), a && p.setAttribute("display", "block");
  var g = n ? "katex" : "katex-mathml";
  return b.makeSpan([g], [p]);
}
var Dr = function(e) {
  return new A0({
    style: e.displayMode ? R.DISPLAY : R.TEXT,
    maxSize: e.maxSize,
    minRuleThickness: e.minRuleThickness
  });
}, Cr = function(e, t) {
  if (t.displayMode) {
    var a = ["katex-display"];
    t.leqno && a.push("leqno"), t.fleqn && a.push("fleqn"), e = b.makeSpan(a, [e]);
  }
  return e;
}, g1 = function(e, t, a) {
  var n = Dr(a), s;
  if (a.output === "mathml")
    return $t(e, t, n, a.displayMode, !0);
  if (a.output === "html") {
    var o = ot(e, n);
    s = b.makeSpan(["katex"], [o]);
  } else {
    var h = $t(e, t, n, a.displayMode, !1), c = ot(e, n);
    s = b.makeSpan(["katex"], [h, c]);
  }
  return Cr(s, a);
}, b1 = function(e, t, a) {
  var n = Dr(a), s = ot(e, n), o = b.makeSpan(["katex"], [s]);
  return Cr(o, a);
}, y1 = {
  widehat: "^",
  widecheck: "ˇ",
  widetilde: "~",
  utilde: "~",
  overleftarrow: "←",
  underleftarrow: "←",
  xleftarrow: "←",
  overrightarrow: "→",
  underrightarrow: "→",
  xrightarrow: "→",
  underbrace: "⏟",
  overbrace: "⏞",
  overgroup: "⏠",
  undergroup: "⏡",
  overleftrightarrow: "↔",
  underleftrightarrow: "↔",
  xleftrightarrow: "↔",
  Overrightarrow: "⇒",
  xRightarrow: "⇒",
  overleftharpoon: "↼",
  xleftharpoonup: "↼",
  overrightharpoon: "⇀",
  xrightharpoonup: "⇀",
  xLeftarrow: "⇐",
  xLeftrightarrow: "⇔",
  xhookleftarrow: "↩",
  xhookrightarrow: "↪",
  xmapsto: "↦",
  xrightharpoondown: "⇁",
  xleftharpoondown: "↽",
  xrightleftharpoons: "⇌",
  xleftrightharpoons: "⇋",
  xtwoheadleftarrow: "↞",
  xtwoheadrightarrow: "↠",
  xlongequal: "=",
  xtofrom: "⇄",
  xrightleftarrows: "⇄",
  xrightequilibrium: "⇌",
  // Not a perfect match.
  xleftequilibrium: "⇋",
  // None better available.
  "\\cdrightarrow": "→",
  "\\cdleftarrow": "←",
  "\\cdlongequal": "="
}, x1 = function(e) {
  var t = new S.MathNode("mo", [new S.TextNode(y1[e.replace(/^\\/, "")])]);
  return t.setAttribute("stretchy", "true"), t;
}, w1 = {
  //   path(s), minWidth, height, align
  overrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
  overleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
  underrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
  underleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
  xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
  "\\cdrightarrow": [["rightarrow"], 3, 522, "xMaxYMin"],
  // CD minwwidth2.5pc
  xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
  "\\cdleftarrow": [["leftarrow"], 3, 522, "xMinYMin"],
  Overrightarrow: [["doublerightarrow"], 0.888, 560, "xMaxYMin"],
  xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
  xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
  overleftharpoon: [["leftharpoon"], 0.888, 522, "xMinYMin"],
  xleftharpoonup: [["leftharpoon"], 0.888, 522, "xMinYMin"],
  xleftharpoondown: [["leftharpoondown"], 0.888, 522, "xMinYMin"],
  overrightharpoon: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
  xrightharpoonup: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
  xrightharpoondown: [["rightharpoondown"], 0.888, 522, "xMaxYMin"],
  xlongequal: [["longequal"], 0.888, 334, "xMinYMin"],
  "\\cdlongequal": [["longequal"], 3, 334, "xMinYMin"],
  xtwoheadleftarrow: [["twoheadleftarrow"], 0.888, 334, "xMinYMin"],
  xtwoheadrightarrow: [["twoheadrightarrow"], 0.888, 334, "xMaxYMin"],
  overleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
  overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
  underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548],
  underleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
  xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
  xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
  xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716],
  xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716],
  xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
  xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
  overlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
  underlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
  overgroup: [["leftgroup", "rightgroup"], 0.888, 342],
  undergroup: [["leftgroupunder", "rightgroupunder"], 0.888, 342],
  xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
  xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
  // The next three arrows are from the mhchem package.
  // In mhchem.sty, min-length is 2.0em. But these arrows might appear in the
  // document as \xrightarrow or \xrightleftharpoons. Those have
  // min-length = 1.75em, so we set min-length on these next three to match.
  xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
  xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716],
  xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716]
}, k1 = function(e) {
  return e.type === "ordgroup" ? e.body.length : 1;
}, S1 = function(e, t) {
  function a() {
    var h = 4e5, c = e.label.slice(1);
    if (I.contains(["widehat", "widecheck", "widetilde", "utilde"], c)) {
      var p = e, g = k1(p.base), y, w, x;
      if (g > 5)
        c === "widehat" || c === "widecheck" ? (y = 420, h = 2364, x = 0.42, w = c + "4") : (y = 312, h = 2340, x = 0.34, w = "tilde4");
      else {
        var z = [1, 1, 2, 2, 3, 3][g];
        c === "widehat" || c === "widecheck" ? (h = [0, 1062, 2364, 2364, 2364][z], y = [0, 239, 300, 360, 420][z], x = [0, 0.24, 0.3, 0.3, 0.36, 0.42][z], w = c + z) : (h = [0, 600, 1033, 2339, 2340][z], y = [0, 260, 286, 306, 312][z], x = [0, 0.26, 0.286, 0.3, 0.306, 0.34][z], w = "tilde" + z);
      }
      var T = new P0(w), C = new D0([T], {
        width: "100%",
        height: A(x),
        viewBox: "0 0 " + h + " " + y,
        preserveAspectRatio: "none"
      });
      return {
        span: b.makeSvgSpan([], [C], t),
        minWidth: 0,
        height: x
      };
    } else {
      var N = [], O = w1[c], [H, V, L] = O, U = L / 1e3, G = H.length, j, Y;
      if (G === 1) {
        var M0 = O[3];
        j = ["hide-tail"], Y = [M0];
      } else if (G === 2)
        j = ["halfarrow-left", "halfarrow-right"], Y = ["xMinYMin", "xMaxYMin"];
      else if (G === 3)
        j = ["brace-left", "brace-center", "brace-right"], Y = ["xMinYMin", "xMidYMin", "xMaxYMin"];
      else
        throw new Error(`Correct katexImagesData or update code here to support
                    ` + G + " children.");
      for (var r0 = 0; r0 < G; r0++) {
        var e0 = new P0(H[r0]), U0 = new D0([e0], {
          width: "400em",
          height: A(U),
          viewBox: "0 0 " + h + " " + L,
          preserveAspectRatio: Y[r0] + " slice"
        }), s0 = b.makeSvgSpan([j[r0]], [U0], t);
        if (G === 1)
          return {
            span: s0,
            minWidth: V,
            height: U
          };
        s0.style.height = A(U), N.push(s0);
      }
      return {
        span: b.makeSpan(["stretchy"], N, t),
        minWidth: V,
        height: U
      };
    }
  }
  var {
    span: n,
    minWidth: s,
    height: o
  } = a();
  return n.height = o, n.style.height = A(o), s > 0 && (n.style.minWidth = A(s)), n;
}, M1 = function(e, t, a, n, s) {
  var o, h = e.height + e.depth + a + n;
  if (/fbox|color|angl/.test(t)) {
    if (o = b.makeSpan(["stretchy", t], [], s), t === "fbox") {
      var c = s.color && s.getColor();
      c && (o.style.borderColor = c);
    }
  } else {
    var p = [];
    /^[bx]cancel$/.test(t) && p.push(new it({
      x1: "0",
      y1: "0",
      x2: "100%",
      y2: "100%",
      "stroke-width": "0.046em"
    })), /^x?cancel$/.test(t) && p.push(new it({
      x1: "0",
      y1: "100%",
      x2: "100%",
      y2: "0",
      "stroke-width": "0.046em"
    }));
    var g = new D0(p, {
      width: "100%",
      height: A(h)
    });
    o = b.makeSvgSpan([], [g], s);
  }
  return o.height = h, o.style.height = A(h), o;
}, N0 = {
  encloseSpan: M1,
  mathMLnode: x1,
  svgSpan: S1
};
function F(r, e) {
  if (!r || r.type !== e)
    throw new Error("Expected node of type " + e + ", but got " + (r ? "node of type " + r.type : String(r)));
  return r;
}
function yt(r) {
  var e = Ie(r);
  if (!e)
    throw new Error("Expected node of symbol group type, but got " + (r ? "node of type " + r.type : String(r)));
  return e;
}
function Ie(r) {
  return r && (r.type === "atom" || Za.hasOwnProperty(r.type)) ? r : null;
}
var xt = (r, e) => {
  var t, a, n;
  r && r.type === "supsub" ? (a = F(r.base, "accent"), t = a.base, r.base = t, n = Wa(P(r, e)), r.base = a) : (a = F(r, "accent"), t = a.base);
  var s = P(t, e.havingCrampedStyle()), o = a.isShifty && I.isCharacterBox(t), h = 0;
  if (o) {
    var c = I.getBaseElem(t), p = P(c, e.havingCrampedStyle());
    h = Lt(p).skew;
  }
  var g = a.label === "\\c", y = g ? s.height + s.depth : Math.min(s.height, e.fontMetrics().xHeight), w;
  if (a.isStretchy)
    w = N0.svgSpan(a, e), w = b.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: s
      }, {
        type: "elem",
        elem: w,
        wrapperClasses: ["svg-align"],
        wrapperStyle: h > 0 ? {
          width: "calc(100% - " + A(2 * h) + ")",
          marginLeft: A(2 * h)
        } : void 0
      }]
    }, e);
  else {
    var x, z;
    a.label === "\\vec" ? (x = b.staticSvg("vec", e), z = b.svgData.vec[1]) : (x = b.makeOrd({
      mode: a.mode,
      text: a.label
    }, e, "textord"), x = Lt(x), x.italic = 0, z = x.width, g && (y += x.depth)), w = b.makeSpan(["accent-body"], [x]);
    var T = a.label === "\\textcircled";
    T && (w.classes.push("accent-full"), y = s.height);
    var C = h;
    T || (C -= z / 2), w.style.left = A(C), a.label === "\\textcircled" && (w.style.top = ".2em"), w = b.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: s
      }, {
        type: "kern",
        size: -y
      }, {
        type: "elem",
        elem: w
      }]
    }, e);
  }
  var N = b.makeSpan(["mord", "accent"], [w], e);
  return n ? (n.children[0] = N, n.height = Math.max(N.height, n.height), n.classes[0] = "mord", n) : N;
}, Nr = (r, e) => {
  var t = r.isStretchy ? N0.mathMLnode(r.label) : new S.MathNode("mo", [p0(r.label, r.mode)]), a = new S.MathNode("mover", [X(r.base, e), t]);
  return a.setAttribute("accent", "true"), a;
}, z1 = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map((r) => "\\" + r).join("|"));
B({
  type: "accent",
  names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
  props: {
    numArgs: 1
  },
  handler: (r, e) => {
    var t = qe(e[0]), a = !z1.test(r.funcName), n = !a || r.funcName === "\\widehat" || r.funcName === "\\widetilde" || r.funcName === "\\widecheck";
    return {
      type: "accent",
      mode: r.parser.mode,
      label: r.funcName,
      isStretchy: a,
      isShifty: n,
      base: t
    };
  },
  htmlBuilder: xt,
  mathmlBuilder: Nr
});
B({
  type: "accent",
  names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\c", "\\r", "\\H", "\\v", "\\textcircled"],
  props: {
    numArgs: 1,
    allowedInText: !0,
    allowedInMath: !0,
    // unless in strict mode
    argTypes: ["primitive"]
  },
  handler: (r, e) => {
    var t = e[0], a = r.parser.mode;
    return a === "math" && (r.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + r.funcName + " works only in text mode"), a = "text"), {
      type: "accent",
      mode: a,
      label: r.funcName,
      isStretchy: !1,
      isShifty: !0,
      base: t
    };
  },
  htmlBuilder: xt,
  mathmlBuilder: Nr
});
B({
  type: "accentUnder",
  names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
  props: {
    numArgs: 1
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0];
    return {
      type: "accentUnder",
      mode: t.mode,
      label: a,
      base: n
    };
  },
  htmlBuilder: (r, e) => {
    var t = P(r.base, e), a = N0.svgSpan(r, e), n = r.label === "\\utilde" ? 0.12 : 0, s = b.makeVList({
      positionType: "top",
      positionData: t.height,
      children: [{
        type: "elem",
        elem: a,
        wrapperClasses: ["svg-align"]
      }, {
        type: "kern",
        size: n
      }, {
        type: "elem",
        elem: t
      }]
    }, e);
    return b.makeSpan(["mord", "accentunder"], [s], e);
  },
  mathmlBuilder: (r, e) => {
    var t = N0.mathMLnode(r.label), a = new S.MathNode("munder", [X(r.base, e), t]);
    return a.setAttribute("accentunder", "true"), a;
  }
});
var Se = (r) => {
  var e = new S.MathNode("mpadded", r ? [r] : []);
  return e.setAttribute("width", "+0.6em"), e.setAttribute("lspace", "0.3em"), e;
};
B({
  type: "xArrow",
  names: [
    "\\xleftarrow",
    "\\xrightarrow",
    "\\xLeftarrow",
    "\\xRightarrow",
    "\\xleftrightarrow",
    "\\xLeftrightarrow",
    "\\xhookleftarrow",
    "\\xhookrightarrow",
    "\\xmapsto",
    "\\xrightharpoondown",
    "\\xrightharpoonup",
    "\\xleftharpoondown",
    "\\xleftharpoonup",
    "\\xrightleftharpoons",
    "\\xleftrightharpoons",
    "\\xlongequal",
    "\\xtwoheadrightarrow",
    "\\xtwoheadleftarrow",
    "\\xtofrom",
    // The next 3 functions are here to support the mhchem extension.
    // Direct use of these functions is discouraged and may break someday.
    "\\xrightleftarrows",
    "\\xrightequilibrium",
    "\\xleftequilibrium",
    // The next 3 functions are here only to support the {CD} environment.
    "\\\\cdrightarrow",
    "\\\\cdleftarrow",
    "\\\\cdlongequal"
  ],
  props: {
    numArgs: 1,
    numOptionalArgs: 1
  },
  handler(r, e, t) {
    var {
      parser: a,
      funcName: n
    } = r;
    return {
      type: "xArrow",
      mode: a.mode,
      label: n,
      body: e[0],
      below: t[0]
    };
  },
  // Flow is unable to correctly infer the type of `group`, even though it's
  // unambiguously determined from the passed-in `type` above.
  htmlBuilder(r, e) {
    var t = e.style, a = e.havingStyle(t.sup()), n = b.wrapFragment(P(r.body, a, e), e), s = r.label.slice(0, 2) === "\\x" ? "x" : "cd";
    n.classes.push(s + "-arrow-pad");
    var o;
    r.below && (a = e.havingStyle(t.sub()), o = b.wrapFragment(P(r.below, a, e), e), o.classes.push(s + "-arrow-pad"));
    var h = N0.svgSpan(r, e), c = -e.fontMetrics().axisHeight + 0.5 * h.height, p = -e.fontMetrics().axisHeight - 0.5 * h.height - 0.111;
    (n.depth > 0.25 || r.label === "\\xleftequilibrium") && (p -= n.depth);
    var g;
    if (o) {
      var y = -e.fontMetrics().axisHeight + o.height + 0.5 * h.height + 0.111;
      g = b.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: n,
          shift: p
        }, {
          type: "elem",
          elem: h,
          shift: c
        }, {
          type: "elem",
          elem: o,
          shift: y
        }]
      }, e);
    } else
      g = b.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: n,
          shift: p
        }, {
          type: "elem",
          elem: h,
          shift: c
        }]
      }, e);
    return g.children[0].children[0].children[1].classes.push("svg-align"), b.makeSpan(["mrel", "x-arrow"], [g], e);
  },
  mathmlBuilder(r, e) {
    var t = N0.mathMLnode(r.label);
    t.setAttribute("minsize", r.label.charAt(0) === "x" ? "1.75em" : "3.0em");
    var a;
    if (r.body) {
      var n = Se(X(r.body, e));
      if (r.below) {
        var s = Se(X(r.below, e));
        a = new S.MathNode("munderover", [t, s, n]);
      } else
        a = new S.MathNode("mover", [t, n]);
    } else if (r.below) {
      var o = Se(X(r.below, e));
      a = new S.MathNode("munder", [t, o]);
    } else
      a = Se(), a = new S.MathNode("mover", [t, a]);
    return a;
  }
});
var A1 = b.makeSpan;
function qr(r, e) {
  var t = t0(r.body, e, !0);
  return A1([r.mclass], t, e);
}
function Rr(r, e) {
  var t, a = o0(r.body, e);
  return r.mclass === "minner" ? t = new S.MathNode("mpadded", a) : r.mclass === "mord" ? r.isCharacterBox ? (t = a[0], t.type = "mi") : t = new S.MathNode("mi", a) : (r.isCharacterBox ? (t = a[0], t.type = "mo") : t = new S.MathNode("mo", a), r.mclass === "mbin" ? (t.attributes.lspace = "0.22em", t.attributes.rspace = "0.22em") : r.mclass === "mpunct" ? (t.attributes.lspace = "0em", t.attributes.rspace = "0.17em") : r.mclass === "mopen" || r.mclass === "mclose" ? (t.attributes.lspace = "0em", t.attributes.rspace = "0em") : r.mclass === "minner" && (t.attributes.lspace = "0.0556em", t.attributes.width = "+0.1111em")), t;
}
B({
  type: "mclass",
  names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0];
    return {
      type: "mclass",
      mode: t.mode,
      mclass: "m" + a.slice(5),
      // TODO(kevinb): don't prefix with 'm'
      body: Q(n),
      isCharacterBox: I.isCharacterBox(n)
    };
  },
  htmlBuilder: qr,
  mathmlBuilder: Rr
});
var Oe = (r) => {
  var e = r.type === "ordgroup" && r.body.length ? r.body[0] : r;
  return e.type === "atom" && (e.family === "bin" || e.family === "rel") ? "m" + e.family : "mord";
};
B({
  type: "mclass",
  names: ["\\@binrel"],
  props: {
    numArgs: 2
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "mclass",
      mode: t.mode,
      mclass: Oe(e[0]),
      body: Q(e[1]),
      isCharacterBox: I.isCharacterBox(e[1])
    };
  }
});
B({
  type: "mclass",
  names: ["\\stackrel", "\\overset", "\\underset"],
  props: {
    numArgs: 2
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r, n = e[1], s = e[0], o;
    a !== "\\stackrel" ? o = Oe(n) : o = "mrel";
    var h = {
      type: "op",
      mode: n.mode,
      limits: !0,
      alwaysHandleSupSub: !0,
      parentIsSupSub: !1,
      symbol: !1,
      suppressBaseShift: a !== "\\stackrel",
      body: Q(n)
    }, c = {
      type: "supsub",
      mode: s.mode,
      base: h,
      sup: a === "\\underset" ? null : s,
      sub: a === "\\underset" ? s : null
    };
    return {
      type: "mclass",
      mode: t.mode,
      mclass: o,
      body: [c],
      isCharacterBox: I.isCharacterBox(c)
    };
  },
  htmlBuilder: qr,
  mathmlBuilder: Rr
});
B({
  type: "pmb",
  names: ["\\pmb"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "pmb",
      mode: t.mode,
      mclass: Oe(e[0]),
      body: Q(e[0])
    };
  },
  htmlBuilder(r, e) {
    var t = t0(r.body, e, !0), a = b.makeSpan([r.mclass], t, e);
    return a.style.textShadow = "0.02em 0.01em 0.04px", a;
  },
  mathmlBuilder(r, e) {
    var t = o0(r.body, e), a = new S.MathNode("mstyle", t);
    return a.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px"), a;
  }
});
var T1 = {
  ">": "\\\\cdrightarrow",
  "<": "\\\\cdleftarrow",
  "=": "\\\\cdlongequal",
  A: "\\uparrow",
  V: "\\downarrow",
  "|": "\\Vert",
  ".": "no arrow"
}, Wt = () => ({
  type: "styling",
  body: [],
  mode: "math",
  style: "display"
}), jt = (r) => r.type === "textord" && r.text === "@", B1 = (r, e) => (r.type === "mathord" || r.type === "atom") && r.text === e;
function D1(r, e, t) {
  var a = T1[r];
  switch (a) {
    case "\\\\cdrightarrow":
    case "\\\\cdleftarrow":
      return t.callFunction(a, [e[0]], [e[1]]);
    case "\\uparrow":
    case "\\downarrow": {
      var n = t.callFunction("\\\\cdleft", [e[0]], []), s = {
        type: "atom",
        text: a,
        mode: "math",
        family: "rel"
      }, o = t.callFunction("\\Big", [s], []), h = t.callFunction("\\\\cdright", [e[1]], []), c = {
        type: "ordgroup",
        mode: "math",
        body: [n, o, h]
      };
      return t.callFunction("\\\\cdparent", [c], []);
    }
    case "\\\\cdlongequal":
      return t.callFunction("\\\\cdlongequal", [], []);
    case "\\Vert": {
      var p = {
        type: "textord",
        text: "\\Vert",
        mode: "math"
      };
      return t.callFunction("\\Big", [p], []);
    }
    default:
      return {
        type: "textord",
        text: " ",
        mode: "math"
      };
  }
}
function C1(r) {
  var e = [];
  for (r.gullet.beginGroup(), r.gullet.macros.set("\\cr", "\\\\\\relax"), r.gullet.beginGroup(); ; ) {
    e.push(r.parseExpression(!1, "\\\\")), r.gullet.endGroup(), r.gullet.beginGroup();
    var t = r.fetch().text;
    if (t === "&" || t === "\\\\")
      r.consume();
    else if (t === "\\end") {
      e[e.length - 1].length === 0 && e.pop();
      break;
    } else
      throw new M("Expected \\\\ or \\cr or \\end", r.nextToken);
  }
  for (var a = [], n = [a], s = 0; s < e.length; s++) {
    for (var o = e[s], h = Wt(), c = 0; c < o.length; c++)
      if (!jt(o[c]))
        h.body.push(o[c]);
      else {
        a.push(h), c += 1;
        var p = yt(o[c]).text, g = new Array(2);
        if (g[0] = {
          type: "ordgroup",
          mode: "math",
          body: []
        }, g[1] = {
          type: "ordgroup",
          mode: "math",
          body: []
        }, !("=|.".indexOf(p) > -1))
          if ("<>AV".indexOf(p) > -1)
            for (var y = 0; y < 2; y++) {
              for (var w = !0, x = c + 1; x < o.length; x++) {
                if (B1(o[x], p)) {
                  w = !1, c = x;
                  break;
                }
                if (jt(o[x]))
                  throw new M("Missing a " + p + " character to complete a CD arrow.", o[x]);
                g[y].body.push(o[x]);
              }
              if (w)
                throw new M("Missing a " + p + " character to complete a CD arrow.", o[c]);
            }
          else
            throw new M('Expected one of "<>AV=|." after @', o[c]);
        var z = D1(p, g, r), T = {
          type: "styling",
          body: [z],
          mode: "math",
          style: "display"
          // CD is always displaystyle.
        };
        a.push(T), h = Wt();
      }
    s % 2 === 0 ? a.push(h) : a.shift(), a = [], n.push(a);
  }
  r.gullet.endGroup(), r.gullet.endGroup();
  var C = new Array(n[0].length).fill({
    type: "align",
    align: "c",
    pregap: 0.25,
    // CD package sets \enskip between columns.
    postgap: 0.25
    // So pre and post each get half an \enskip, i.e. 0.25em.
  });
  return {
    type: "array",
    mode: "math",
    body: n,
    arraystretch: 1,
    addJot: !0,
    rowGaps: [null],
    cols: C,
    colSeparationType: "CD",
    hLinesBeforeRow: new Array(n.length + 1).fill([])
  };
}
B({
  type: "cdlabel",
  names: ["\\\\cdleft", "\\\\cdright"],
  props: {
    numArgs: 1
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r;
    return {
      type: "cdlabel",
      mode: t.mode,
      side: a.slice(4),
      label: e[0]
    };
  },
  htmlBuilder(r, e) {
    var t = e.havingStyle(e.style.sup()), a = b.wrapFragment(P(r.label, t, e), e);
    return a.classes.push("cd-label-" + r.side), a.style.bottom = A(0.8 - a.depth), a.height = 0, a.depth = 0, a;
  },
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mrow", [X(r.label, e)]);
    return t = new S.MathNode("mpadded", [t]), t.setAttribute("width", "0"), r.side === "left" && t.setAttribute("lspace", "-1width"), t.setAttribute("voffset", "0.7em"), t = new S.MathNode("mstyle", [t]), t.setAttribute("displaystyle", "false"), t.setAttribute("scriptlevel", "1"), t;
  }
});
B({
  type: "cdlabelparent",
  names: ["\\\\cdparent"],
  props: {
    numArgs: 1
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "cdlabelparent",
      mode: t.mode,
      fragment: e[0]
    };
  },
  htmlBuilder(r, e) {
    var t = b.wrapFragment(P(r.fragment, e), e);
    return t.classes.push("cd-vert-arrow"), t;
  },
  mathmlBuilder(r, e) {
    return new S.MathNode("mrow", [X(r.fragment, e)]);
  }
});
B({
  type: "textord",
  names: ["\\@char"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(r, e) {
    for (var {
      parser: t
    } = r, a = F(e[0], "ordgroup"), n = a.body, s = "", o = 0; o < n.length; o++) {
      var h = F(n[o], "textord");
      s += h.text;
    }
    var c = parseInt(s), p;
    if (isNaN(c))
      throw new M("\\@char has non-numeric argument " + s);
    if (c < 0 || c >= 1114111)
      throw new M("\\@char with invalid code point " + s);
    return c <= 65535 ? p = String.fromCharCode(c) : (c -= 65536, p = String.fromCharCode((c >> 10) + 55296, (c & 1023) + 56320)), {
      type: "textord",
      mode: t.mode,
      text: p
    };
  }
});
var Er = (r, e) => {
  var t = t0(r.body, e.withColor(r.color), !1);
  return b.makeFragment(t);
}, Ir = (r, e) => {
  var t = o0(r.body, e.withColor(r.color)), a = new S.MathNode("mstyle", t);
  return a.setAttribute("mathcolor", r.color), a;
};
B({
  type: "color",
  names: ["\\textcolor"],
  props: {
    numArgs: 2,
    allowedInText: !0,
    argTypes: ["color", "original"]
  },
  handler(r, e) {
    var {
      parser: t
    } = r, a = F(e[0], "color-token").color, n = e[1];
    return {
      type: "color",
      mode: t.mode,
      color: a,
      body: Q(n)
    };
  },
  htmlBuilder: Er,
  mathmlBuilder: Ir
});
B({
  type: "color",
  names: ["\\color"],
  props: {
    numArgs: 1,
    allowedInText: !0,
    argTypes: ["color"]
  },
  handler(r, e) {
    var {
      parser: t,
      breakOnTokenText: a
    } = r, n = F(e[0], "color-token").color;
    t.gullet.macros.set("\\current@color", n);
    var s = t.parseExpression(!0, a);
    return {
      type: "color",
      mode: t.mode,
      color: n,
      body: s
    };
  },
  htmlBuilder: Er,
  mathmlBuilder: Ir
});
B({
  type: "cr",
  names: ["\\\\"],
  props: {
    numArgs: 0,
    numOptionalArgs: 0,
    allowedInText: !0
  },
  handler(r, e, t) {
    var {
      parser: a
    } = r, n = a.gullet.future().text === "[" ? a.parseSizeGroup(!0) : null, s = !a.settings.displayMode || !a.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
    return {
      type: "cr",
      mode: a.mode,
      newLine: s,
      size: n && F(n, "size").value
    };
  },
  // The following builders are called only at the top level,
  // not within tabular/array environments.
  htmlBuilder(r, e) {
    var t = b.makeSpan(["mspace"], [], e);
    return r.newLine && (t.classes.push("newline"), r.size && (t.style.marginTop = A(K(r.size, e)))), t;
  },
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mspace");
    return r.newLine && (t.setAttribute("linebreak", "newline"), r.size && t.setAttribute("height", A(K(r.size, e)))), t;
  }
});
var ut = {
  "\\global": "\\global",
  "\\long": "\\\\globallong",
  "\\\\globallong": "\\\\globallong",
  "\\def": "\\gdef",
  "\\gdef": "\\gdef",
  "\\edef": "\\xdef",
  "\\xdef": "\\xdef",
  "\\let": "\\\\globallet",
  "\\futurelet": "\\\\globalfuture"
}, Or = (r) => {
  var e = r.text;
  if (/^(?:[\\{}$&#^_]|EOF)$/.test(e))
    throw new M("Expected a control sequence", r);
  return e;
}, N1 = (r) => {
  var e = r.gullet.popToken();
  return e.text === "=" && (e = r.gullet.popToken(), e.text === " " && (e = r.gullet.popToken())), e;
}, Hr = (r, e, t, a) => {
  var n = r.gullet.macros.get(t.text);
  n == null && (t.noexpand = !0, n = {
    tokens: [t],
    numArgs: 0,
    // reproduce the same behavior in expansion
    unexpandable: !r.gullet.isExpandable(t.text)
  }), r.gullet.macros.set(e, n, a);
};
B({
  type: "internal",
  names: [
    "\\global",
    "\\long",
    "\\\\globallong"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t
    } = r;
    e.consumeSpaces();
    var a = e.fetch();
    if (ut[a.text])
      return (t === "\\global" || t === "\\\\globallong") && (a.text = ut[a.text]), F(e.parseFunction(), "internal");
    throw new M("Invalid token after macro prefix", a);
  }
});
B({
  type: "internal",
  names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t
    } = r, a = e.gullet.popToken(), n = a.text;
    if (/^(?:[\\{}$&#^_]|EOF)$/.test(n))
      throw new M("Expected a control sequence", a);
    for (var s = 0, o, h = [[]]; e.gullet.future().text !== "{"; )
      if (a = e.gullet.popToken(), a.text === "#") {
        if (e.gullet.future().text === "{") {
          o = e.gullet.future(), h[s].push("{");
          break;
        }
        if (a = e.gullet.popToken(), !/^[1-9]$/.test(a.text))
          throw new M('Invalid argument number "' + a.text + '"');
        if (parseInt(a.text) !== s + 1)
          throw new M('Argument number "' + a.text + '" out of order');
        s++, h.push([]);
      } else {
        if (a.text === "EOF")
          throw new M("Expected a macro definition");
        h[s].push(a.text);
      }
    var {
      tokens: c
    } = e.gullet.consumeArg();
    return o && c.unshift(o), (t === "\\edef" || t === "\\xdef") && (c = e.gullet.expandTokens(c), c.reverse()), e.gullet.macros.set(n, {
      tokens: c,
      numArgs: s,
      delimiters: h
    }, t === ut[t]), {
      type: "internal",
      mode: e.mode
    };
  }
});
B({
  type: "internal",
  names: [
    "\\let",
    "\\\\globallet"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t
    } = r, a = Or(e.gullet.popToken());
    e.gullet.consumeSpaces();
    var n = N1(e);
    return Hr(e, a, n, t === "\\\\globallet"), {
      type: "internal",
      mode: e.mode
    };
  }
});
B({
  type: "internal",
  names: [
    "\\futurelet",
    "\\\\globalfuture"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t
    } = r, a = Or(e.gullet.popToken()), n = e.gullet.popToken(), s = e.gullet.popToken();
    return Hr(e, a, s, t === "\\\\globalfuture"), e.gullet.pushToken(s), e.gullet.pushToken(n), {
      type: "internal",
      mode: e.mode
    };
  }
});
var ne = function(e, t, a) {
  var n = $.math[e] && $.math[e].replace, s = ft(n || e, t, a);
  if (!s)
    throw new Error("Unsupported symbol " + e + " and font size " + t + ".");
  return s;
}, wt = function(e, t, a, n) {
  var s = a.havingBaseStyle(t), o = b.makeSpan(n.concat(s.sizingClasses(a)), [e], a), h = s.sizeMultiplier / a.sizeMultiplier;
  return o.height *= h, o.depth *= h, o.maxFontSize = s.sizeMultiplier, o;
}, Fr = function(e, t, a) {
  var n = t.havingBaseStyle(a), s = (1 - t.sizeMultiplier / n.sizeMultiplier) * t.fontMetrics().axisHeight;
  e.classes.push("delimcenter"), e.style.top = A(s), e.height -= s, e.depth += s;
}, q1 = function(e, t, a, n, s, o) {
  var h = b.makeSymbol(e, "Main-Regular", s, n), c = wt(h, t, n, o);
  return a && Fr(c, n, t), c;
}, R1 = function(e, t, a, n) {
  return b.makeSymbol(e, "Size" + t + "-Regular", a, n);
}, Lr = function(e, t, a, n, s, o) {
  var h = R1(e, t, s, n), c = wt(b.makeSpan(["delimsizing", "size" + t], [h], n), R.TEXT, n, o);
  return a && Fr(c, n, R.TEXT), c;
}, je = function(e, t, a) {
  var n;
  t === "Size1-Regular" ? n = "delim-size1" : n = "delim-size4";
  var s = b.makeSpan(["delimsizinginner", n], [b.makeSpan([], [b.makeSymbol(e, t, a)])]);
  return {
    type: "elem",
    elem: s
  };
}, Ze = function(e, t, a) {
  var n = y0["Size4-Regular"][e.charCodeAt(0)] ? y0["Size4-Regular"][e.charCodeAt(0)][4] : y0["Size1-Regular"][e.charCodeAt(0)][4], s = new P0("inner", La(e, Math.round(1e3 * t))), o = new D0([s], {
    width: A(n),
    height: A(t),
    // Override CSS rule `.katex svg { width: 100% }`
    style: "width:" + A(n),
    viewBox: "0 0 " + 1e3 * n + " " + Math.round(1e3 * t),
    preserveAspectRatio: "xMinYMin"
  }), h = b.makeSvgSpan([], [o], a);
  return h.height = t, h.style.height = A(t), h.style.width = A(n), {
    type: "elem",
    elem: h
  };
}, ht = 8e-3, Me = {
  type: "kern",
  size: -1 * ht
}, E1 = ["|", "\\lvert", "\\rvert", "\\vert"], I1 = ["\\|", "\\lVert", "\\rVert", "\\Vert"], Pr = function(e, t, a, n, s, o) {
  var h, c, p, g, y = "", w = 0;
  h = p = g = e, c = null;
  var x = "Size1-Regular";
  e === "\\uparrow" ? p = g = "⏐" : e === "\\Uparrow" ? p = g = "‖" : e === "\\downarrow" ? h = p = "⏐" : e === "\\Downarrow" ? h = p = "‖" : e === "\\updownarrow" ? (h = "\\uparrow", p = "⏐", g = "\\downarrow") : e === "\\Updownarrow" ? (h = "\\Uparrow", p = "‖", g = "\\Downarrow") : I.contains(E1, e) ? (p = "∣", y = "vert", w = 333) : I.contains(I1, e) ? (p = "∥", y = "doublevert", w = 556) : e === "[" || e === "\\lbrack" ? (h = "⎡", p = "⎢", g = "⎣", x = "Size4-Regular", y = "lbrack", w = 667) : e === "]" || e === "\\rbrack" ? (h = "⎤", p = "⎥", g = "⎦", x = "Size4-Regular", y = "rbrack", w = 667) : e === "\\lfloor" || e === "⌊" ? (p = h = "⎢", g = "⎣", x = "Size4-Regular", y = "lfloor", w = 667) : e === "\\lceil" || e === "⌈" ? (h = "⎡", p = g = "⎢", x = "Size4-Regular", y = "lceil", w = 667) : e === "\\rfloor" || e === "⌋" ? (p = h = "⎥", g = "⎦", x = "Size4-Regular", y = "rfloor", w = 667) : e === "\\rceil" || e === "⌉" ? (h = "⎤", p = g = "⎥", x = "Size4-Regular", y = "rceil", w = 667) : e === "(" || e === "\\lparen" ? (h = "⎛", p = "⎜", g = "⎝", x = "Size4-Regular", y = "lparen", w = 875) : e === ")" || e === "\\rparen" ? (h = "⎞", p = "⎟", g = "⎠", x = "Size4-Regular", y = "rparen", w = 875) : e === "\\{" || e === "\\lbrace" ? (h = "⎧", c = "⎨", g = "⎩", p = "⎪", x = "Size4-Regular") : e === "\\}" || e === "\\rbrace" ? (h = "⎫", c = "⎬", g = "⎭", p = "⎪", x = "Size4-Regular") : e === "\\lgroup" || e === "⟮" ? (h = "⎧", g = "⎩", p = "⎪", x = "Size4-Regular") : e === "\\rgroup" || e === "⟯" ? (h = "⎫", g = "⎭", p = "⎪", x = "Size4-Regular") : e === "\\lmoustache" || e === "⎰" ? (h = "⎧", g = "⎭", p = "⎪", x = "Size4-Regular") : (e === "\\rmoustache" || e === "⎱") && (h = "⎫", g = "⎩", p = "⎪", x = "Size4-Regular");
  var z = ne(h, x, s), T = z.height + z.depth, C = ne(p, x, s), N = C.height + C.depth, O = ne(g, x, s), H = O.height + O.depth, V = 0, L = 1;
  if (c !== null) {
    var U = ne(c, x, s);
    V = U.height + U.depth, L = 2;
  }
  var G = T + H + V, j = Math.max(0, Math.ceil((t - G) / (L * N))), Y = G + j * L * N, M0 = n.fontMetrics().axisHeight;
  a && (M0 *= n.sizeMultiplier);
  var r0 = Y / 2 - M0, e0 = [];
  if (y.length > 0) {
    var U0 = Y - T - H, s0 = Math.round(Y * 1e3), v0 = Pa(y, Math.round(U0 * 1e3)), R0 = new P0(y, v0), W0 = (w / 1e3).toFixed(3) + "em", j0 = (s0 / 1e3).toFixed(3) + "em", Le = new D0([R0], {
      width: W0,
      height: j0,
      viewBox: "0 0 " + w + " " + s0
    }), E0 = b.makeSvgSpan([], [Le], n);
    E0.height = s0 / 1e3, E0.style.width = W0, E0.style.height = j0, e0.push({
      type: "elem",
      elem: E0
    });
  } else {
    if (e0.push(je(g, x, s)), e0.push(Me), c === null) {
      var I0 = Y - T - H + 2 * ht;
      e0.push(Ze(p, I0, n));
    } else {
      var m0 = (Y - T - H - V) / 2 + 2 * ht;
      e0.push(Ze(p, m0, n)), e0.push(Me), e0.push(je(c, x, s)), e0.push(Me), e0.push(Ze(p, m0, n));
    }
    e0.push(Me), e0.push(je(h, x, s));
  }
  var ae = n.havingBaseStyle(R.TEXT), Pe = b.makeVList({
    positionType: "bottom",
    positionData: r0,
    children: e0
  }, ae);
  return wt(b.makeSpan(["delimsizing", "mult"], [Pe], ae), R.TEXT, n, o);
}, Ke = 80, Je = 0.08, Qe = function(e, t, a, n, s) {
  var o = Fa(e, n, a), h = new P0(e, o), c = new D0([h], {
    // Note: 1000:1 ratio of viewBox to document em width.
    width: "400em",
    height: A(t),
    viewBox: "0 0 400000 " + a,
    preserveAspectRatio: "xMinYMin slice"
  });
  return b.makeSvgSpan(["hide-tail"], [c], s);
}, O1 = function(e, t) {
  var a = t.havingBaseSizing(), n = Yr("\\surd", e * a.sizeMultiplier, Ur, a), s = a.sizeMultiplier, o = Math.max(0, t.minRuleThickness - t.fontMetrics().sqrtRuleThickness), h, c = 0, p = 0, g = 0, y;
  return n.type === "small" ? (g = 1e3 + 1e3 * o + Ke, e < 1 ? s = 1 : e < 1.4 && (s = 0.7), c = (1 + o + Je) / s, p = (1 + o) / s, h = Qe("sqrtMain", c, g, o, t), h.style.minWidth = "0.853em", y = 0.833 / s) : n.type === "large" ? (g = (1e3 + Ke) * se[n.size], p = (se[n.size] + o) / s, c = (se[n.size] + o + Je) / s, h = Qe("sqrtSize" + n.size, c, g, o, t), h.style.minWidth = "1.02em", y = 1 / s) : (c = e + o + Je, p = e + o, g = Math.floor(1e3 * e + o) + Ke, h = Qe("sqrtTall", c, g, o, t), h.style.minWidth = "0.742em", y = 1.056), h.height = p, h.style.height = A(c), {
    span: h,
    advanceWidth: y,
    // Calculate the actual line width.
    // This actually should depend on the chosen font -- e.g. \boldmath
    // should use the thicker surd symbols from e.g. KaTeX_Main-Bold, and
    // have thicker rules.
    ruleWidth: (t.fontMetrics().sqrtRuleThickness + o) * s
  };
}, Gr = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "\\surd"], H1 = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱"], Vr = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"], se = [0, 1.2, 1.8, 2.4, 3], F1 = function(e, t, a, n, s) {
  if (e === "<" || e === "\\lt" || e === "⟨" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle"), I.contains(Gr, e) || I.contains(Vr, e))
    return Lr(e, t, !1, a, n, s);
  if (I.contains(H1, e))
    return Pr(e, se[t], !1, a, n, s);
  throw new M("Illegal delimiter: '" + e + "'");
}, L1 = [{
  type: "small",
  style: R.SCRIPTSCRIPT
}, {
  type: "small",
  style: R.SCRIPT
}, {
  type: "small",
  style: R.TEXT
}, {
  type: "large",
  size: 1
}, {
  type: "large",
  size: 2
}, {
  type: "large",
  size: 3
}, {
  type: "large",
  size: 4
}], P1 = [{
  type: "small",
  style: R.SCRIPTSCRIPT
}, {
  type: "small",
  style: R.SCRIPT
}, {
  type: "small",
  style: R.TEXT
}, {
  type: "stack"
}], Ur = [{
  type: "small",
  style: R.SCRIPTSCRIPT
}, {
  type: "small",
  style: R.SCRIPT
}, {
  type: "small",
  style: R.TEXT
}, {
  type: "large",
  size: 1
}, {
  type: "large",
  size: 2
}, {
  type: "large",
  size: 3
}, {
  type: "large",
  size: 4
}, {
  type: "stack"
}], G1 = function(e) {
  if (e.type === "small")
    return "Main-Regular";
  if (e.type === "large")
    return "Size" + e.size + "-Regular";
  if (e.type === "stack")
    return "Size4-Regular";
  throw new Error("Add support for delim type '" + e.type + "' here.");
}, Yr = function(e, t, a, n) {
  for (var s = Math.min(2, 3 - n.style.size), o = s; o < a.length && a[o].type !== "stack"; o++) {
    var h = ne(e, G1(a[o]), "math"), c = h.height + h.depth;
    if (a[o].type === "small") {
      var p = n.havingBaseStyle(a[o].style);
      c *= p.sizeMultiplier;
    }
    if (c > t)
      return a[o];
  }
  return a[a.length - 1];
}, Xr = function(e, t, a, n, s, o) {
  e === "<" || e === "\\lt" || e === "⟨" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle");
  var h;
  I.contains(Vr, e) ? h = L1 : I.contains(Gr, e) ? h = Ur : h = P1;
  var c = Yr(e, t, h, n);
  return c.type === "small" ? q1(e, c.style, a, n, s, o) : c.type === "large" ? Lr(e, c.size, a, n, s, o) : Pr(e, t, a, n, s, o);
}, V1 = function(e, t, a, n, s, o) {
  var h = n.fontMetrics().axisHeight * n.sizeMultiplier, c = 901, p = 5 / n.fontMetrics().ptPerEm, g = Math.max(t - h, a + h), y = Math.max(
    // In real TeX, calculations are done using integral values which are
    // 65536 per pt, or 655360 per em. So, the division here truncates in
    // TeX but doesn't here, producing different results. If we wanted to
    // exactly match TeX's calculation, we could do
    //   Math.floor(655360 * maxDistFromAxis / 500) *
    //    delimiterFactor / 655360
    // (To see the difference, compare
    //    x^{x^{\left(\rule{0.1em}{0.68em}\right)}}
    // in TeX and KaTeX)
    g / 500 * c,
    2 * g - p
  );
  return Xr(e, y, !0, n, s, o);
}, B0 = {
  sqrtImage: O1,
  sizedDelim: F1,
  sizeToMaxHeight: se,
  customSizedDelim: Xr,
  leftRightDelim: V1
}, Zt = {
  "\\bigl": {
    mclass: "mopen",
    size: 1
  },
  "\\Bigl": {
    mclass: "mopen",
    size: 2
  },
  "\\biggl": {
    mclass: "mopen",
    size: 3
  },
  "\\Biggl": {
    mclass: "mopen",
    size: 4
  },
  "\\bigr": {
    mclass: "mclose",
    size: 1
  },
  "\\Bigr": {
    mclass: "mclose",
    size: 2
  },
  "\\biggr": {
    mclass: "mclose",
    size: 3
  },
  "\\Biggr": {
    mclass: "mclose",
    size: 4
  },
  "\\bigm": {
    mclass: "mrel",
    size: 1
  },
  "\\Bigm": {
    mclass: "mrel",
    size: 2
  },
  "\\biggm": {
    mclass: "mrel",
    size: 3
  },
  "\\Biggm": {
    mclass: "mrel",
    size: 4
  },
  "\\big": {
    mclass: "mord",
    size: 1
  },
  "\\Big": {
    mclass: "mord",
    size: 2
  },
  "\\bigg": {
    mclass: "mord",
    size: 3
  },
  "\\Bigg": {
    mclass: "mord",
    size: 4
  }
}, U1 = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "<", ">", "\\langle", "⟨", "\\rangle", "⟩", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];
function He(r, e) {
  var t = Ie(r);
  if (t && I.contains(U1, t.text))
    return t;
  throw t ? new M("Invalid delimiter '" + t.text + "' after '" + e.funcName + "'", r) : new M("Invalid delimiter type '" + r.type + "'", r);
}
B({
  type: "delimsizing",
  names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
  props: {
    numArgs: 1,
    argTypes: ["primitive"]
  },
  handler: (r, e) => {
    var t = He(e[0], r);
    return {
      type: "delimsizing",
      mode: r.parser.mode,
      size: Zt[r.funcName].size,
      mclass: Zt[r.funcName].mclass,
      delim: t.text
    };
  },
  htmlBuilder: (r, e) => r.delim === "." ? b.makeSpan([r.mclass]) : B0.sizedDelim(r.delim, r.size, e, r.mode, [r.mclass]),
  mathmlBuilder: (r) => {
    var e = [];
    r.delim !== "." && e.push(p0(r.delim, r.mode));
    var t = new S.MathNode("mo", e);
    r.mclass === "mopen" || r.mclass === "mclose" ? t.setAttribute("fence", "true") : t.setAttribute("fence", "false"), t.setAttribute("stretchy", "true");
    var a = A(B0.sizeToMaxHeight[r.size]);
    return t.setAttribute("minsize", a), t.setAttribute("maxsize", a), t;
  }
});
function Kt(r) {
  if (!r.body)
    throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
}
B({
  type: "leftright-right",
  names: ["\\right"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (r, e) => {
    var t = r.parser.gullet.macros.get("\\current@color");
    if (t && typeof t != "string")
      throw new M("\\current@color set to non-string in \\right");
    return {
      type: "leftright-right",
      mode: r.parser.mode,
      delim: He(e[0], r).text,
      color: t
      // undefined if not set via \color
    };
  }
});
B({
  type: "leftright",
  names: ["\\left"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (r, e) => {
    var t = He(e[0], r), a = r.parser;
    ++a.leftrightDepth;
    var n = a.parseExpression(!1);
    --a.leftrightDepth, a.expect("\\right", !1);
    var s = F(a.parseFunction(), "leftright-right");
    return {
      type: "leftright",
      mode: a.mode,
      body: n,
      left: t.text,
      right: s.delim,
      rightColor: s.color
    };
  },
  htmlBuilder: (r, e) => {
    Kt(r);
    for (var t = t0(r.body, e, !0, ["mopen", "mclose"]), a = 0, n = 0, s = !1, o = 0; o < t.length; o++)
      t[o].isMiddle ? s = !0 : (a = Math.max(t[o].height, a), n = Math.max(t[o].depth, n));
    a *= e.sizeMultiplier, n *= e.sizeMultiplier;
    var h;
    if (r.left === "." ? h = oe(e, ["mopen"]) : h = B0.leftRightDelim(r.left, a, n, e, r.mode, ["mopen"]), t.unshift(h), s)
      for (var c = 1; c < t.length; c++) {
        var p = t[c], g = p.isMiddle;
        g && (t[c] = B0.leftRightDelim(g.delim, a, n, g.options, r.mode, []));
      }
    var y;
    if (r.right === ".")
      y = oe(e, ["mclose"]);
    else {
      var w = r.rightColor ? e.withColor(r.rightColor) : e;
      y = B0.leftRightDelim(r.right, a, n, w, r.mode, ["mclose"]);
    }
    return t.push(y), b.makeSpan(["minner"], t, e);
  },
  mathmlBuilder: (r, e) => {
    Kt(r);
    var t = o0(r.body, e);
    if (r.left !== ".") {
      var a = new S.MathNode("mo", [p0(r.left, r.mode)]);
      a.setAttribute("fence", "true"), t.unshift(a);
    }
    if (r.right !== ".") {
      var n = new S.MathNode("mo", [p0(r.right, r.mode)]);
      n.setAttribute("fence", "true"), r.rightColor && n.setAttribute("mathcolor", r.rightColor), t.push(n);
    }
    return gt(t);
  }
});
B({
  type: "middle",
  names: ["\\middle"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (r, e) => {
    var t = He(e[0], r);
    if (!r.parser.leftrightDepth)
      throw new M("\\middle without preceding \\left", t);
    return {
      type: "middle",
      mode: r.parser.mode,
      delim: t.text
    };
  },
  htmlBuilder: (r, e) => {
    var t;
    if (r.delim === ".")
      t = oe(e, []);
    else {
      t = B0.sizedDelim(r.delim, 1, e, r.mode, []);
      var a = {
        delim: r.delim,
        options: e
      };
      t.isMiddle = a;
    }
    return t;
  },
  mathmlBuilder: (r, e) => {
    var t = r.delim === "\\vert" || r.delim === "|" ? p0("|", "text") : p0(r.delim, r.mode), a = new S.MathNode("mo", [t]);
    return a.setAttribute("fence", "true"), a.setAttribute("lspace", "0.05em"), a.setAttribute("rspace", "0.05em"), a;
  }
});
var kt = (r, e) => {
  var t = b.wrapFragment(P(r.body, e), e), a = r.label.slice(1), n = e.sizeMultiplier, s, o = 0, h = I.isCharacterBox(r.body);
  if (a === "sout")
    s = b.makeSpan(["stretchy", "sout"]), s.height = e.fontMetrics().defaultRuleThickness / n, o = -0.5 * e.fontMetrics().xHeight;
  else if (a === "phase") {
    var c = K({
      number: 0.6,
      unit: "pt"
    }, e), p = K({
      number: 0.35,
      unit: "ex"
    }, e), g = e.havingBaseSizing();
    n = n / g.sizeMultiplier;
    var y = t.height + t.depth + c + p;
    t.style.paddingLeft = A(y / 2 + c);
    var w = Math.floor(1e3 * y * n), x = Oa(w), z = new D0([new P0("phase", x)], {
      width: "400em",
      height: A(w / 1e3),
      viewBox: "0 0 400000 " + w,
      preserveAspectRatio: "xMinYMin slice"
    });
    s = b.makeSvgSpan(["hide-tail"], [z], e), s.style.height = A(y), o = t.depth + c + p;
  } else {
    /cancel/.test(a) ? h || t.classes.push("cancel-pad") : a === "angl" ? t.classes.push("anglpad") : t.classes.push("boxpad");
    var T = 0, C = 0, N = 0;
    /box/.test(a) ? (N = Math.max(
      e.fontMetrics().fboxrule,
      // default
      e.minRuleThickness
      // User override.
    ), T = e.fontMetrics().fboxsep + (a === "colorbox" ? 0 : N), C = T) : a === "angl" ? (N = Math.max(e.fontMetrics().defaultRuleThickness, e.minRuleThickness), T = 4 * N, C = Math.max(0, 0.25 - t.depth)) : (T = h ? 0.2 : 0, C = T), s = N0.encloseSpan(t, a, T, C, e), /fbox|boxed|fcolorbox/.test(a) ? (s.style.borderStyle = "solid", s.style.borderWidth = A(N)) : a === "angl" && N !== 0.049 && (s.style.borderTopWidth = A(N), s.style.borderRightWidth = A(N)), o = t.depth + C, r.backgroundColor && (s.style.backgroundColor = r.backgroundColor, r.borderColor && (s.style.borderColor = r.borderColor));
  }
  var O;
  if (r.backgroundColor)
    O = b.makeVList({
      positionType: "individualShift",
      children: [
        // Put the color background behind inner;
        {
          type: "elem",
          elem: s,
          shift: o
        },
        {
          type: "elem",
          elem: t,
          shift: 0
        }
      ]
    }, e);
  else {
    var H = /cancel|phase/.test(a) ? ["svg-align"] : [];
    O = b.makeVList({
      positionType: "individualShift",
      children: [
        // Write the \cancel stroke on top of inner.
        {
          type: "elem",
          elem: t,
          shift: 0
        },
        {
          type: "elem",
          elem: s,
          shift: o,
          wrapperClasses: H
        }
      ]
    }, e);
  }
  return /cancel/.test(a) && (O.height = t.height, O.depth = t.depth), /cancel/.test(a) && !h ? b.makeSpan(["mord", "cancel-lap"], [O], e) : b.makeSpan(["mord"], [O], e);
}, St = (r, e) => {
  var t = 0, a = new S.MathNode(r.label.indexOf("colorbox") > -1 ? "mpadded" : "menclose", [X(r.body, e)]);
  switch (r.label) {
    case "\\cancel":
      a.setAttribute("notation", "updiagonalstrike");
      break;
    case "\\bcancel":
      a.setAttribute("notation", "downdiagonalstrike");
      break;
    case "\\phase":
      a.setAttribute("notation", "phasorangle");
      break;
    case "\\sout":
      a.setAttribute("notation", "horizontalstrike");
      break;
    case "\\fbox":
      a.setAttribute("notation", "box");
      break;
    case "\\angl":
      a.setAttribute("notation", "actuarial");
      break;
    case "\\fcolorbox":
    case "\\colorbox":
      if (t = e.fontMetrics().fboxsep * e.fontMetrics().ptPerEm, a.setAttribute("width", "+" + 2 * t + "pt"), a.setAttribute("height", "+" + 2 * t + "pt"), a.setAttribute("lspace", t + "pt"), a.setAttribute("voffset", t + "pt"), r.label === "\\fcolorbox") {
        var n = Math.max(
          e.fontMetrics().fboxrule,
          // default
          e.minRuleThickness
          // user override
        );
        a.setAttribute("style", "border: " + n + "em solid " + String(r.borderColor));
      }
      break;
    case "\\xcancel":
      a.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
      break;
  }
  return r.backgroundColor && a.setAttribute("mathbackground", r.backgroundColor), a;
};
B({
  type: "enclose",
  names: ["\\colorbox"],
  props: {
    numArgs: 2,
    allowedInText: !0,
    argTypes: ["color", "text"]
  },
  handler(r, e, t) {
    var {
      parser: a,
      funcName: n
    } = r, s = F(e[0], "color-token").color, o = e[1];
    return {
      type: "enclose",
      mode: a.mode,
      label: n,
      backgroundColor: s,
      body: o
    };
  },
  htmlBuilder: kt,
  mathmlBuilder: St
});
B({
  type: "enclose",
  names: ["\\fcolorbox"],
  props: {
    numArgs: 3,
    allowedInText: !0,
    argTypes: ["color", "color", "text"]
  },
  handler(r, e, t) {
    var {
      parser: a,
      funcName: n
    } = r, s = F(e[0], "color-token").color, o = F(e[1], "color-token").color, h = e[2];
    return {
      type: "enclose",
      mode: a.mode,
      label: n,
      backgroundColor: o,
      borderColor: s,
      body: h
    };
  },
  htmlBuilder: kt,
  mathmlBuilder: St
});
B({
  type: "enclose",
  names: ["\\fbox"],
  props: {
    numArgs: 1,
    argTypes: ["hbox"],
    allowedInText: !0
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "enclose",
      mode: t.mode,
      label: "\\fbox",
      body: e[0]
    };
  }
});
B({
  type: "enclose",
  names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\phase"],
  props: {
    numArgs: 1
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0];
    return {
      type: "enclose",
      mode: t.mode,
      label: a,
      body: n
    };
  },
  htmlBuilder: kt,
  mathmlBuilder: St
});
B({
  type: "enclose",
  names: ["\\angl"],
  props: {
    numArgs: 1,
    argTypes: ["hbox"],
    allowedInText: !1
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "enclose",
      mode: t.mode,
      label: "\\angl",
      body: e[0]
    };
  }
});
var $r = {};
function w0(r) {
  for (var {
    type: e,
    names: t,
    props: a,
    handler: n,
    htmlBuilder: s,
    mathmlBuilder: o
  } = r, h = {
    type: e,
    numArgs: a.numArgs || 0,
    allowedInText: !1,
    numOptionalArgs: 0,
    handler: n
  }, c = 0; c < t.length; ++c)
    $r[t[c]] = h;
  s && (Ce[e] = s), o && (Ne[e] = o);
}
var Wr = {};
function m(r, e) {
  Wr[r] = e;
}
function Jt(r) {
  var e = [];
  r.consumeSpaces();
  var t = r.fetch().text;
  for (t === "\\relax" && (r.consume(), r.consumeSpaces(), t = r.fetch().text); t === "\\hline" || t === "\\hdashline"; )
    r.consume(), e.push(t === "\\hdashline"), r.consumeSpaces(), t = r.fetch().text;
  return e;
}
var Fe = (r) => {
  var e = r.parser.settings;
  if (!e.displayMode)
    throw new M("{" + r.envName + "} can be used only in display mode.");
};
function Mt(r) {
  if (r.indexOf("ed") === -1)
    return r.indexOf("*") === -1;
}
function V0(r, e, t) {
  var {
    hskipBeforeAndAfter: a,
    addJot: n,
    cols: s,
    arraystretch: o,
    colSeparationType: h,
    autoTag: c,
    singleRow: p,
    emptySingleRow: g,
    maxNumCols: y,
    leqno: w
  } = e;
  if (r.gullet.beginGroup(), p || r.gullet.macros.set("\\cr", "\\\\\\relax"), !o) {
    var x = r.gullet.expandMacroAsText("\\arraystretch");
    if (x == null)
      o = 1;
    else if (o = parseFloat(x), !o || o < 0)
      throw new M("Invalid \\arraystretch: " + x);
  }
  r.gullet.beginGroup();
  var z = [], T = [z], C = [], N = [], O = c != null ? [] : void 0;
  function H() {
    c && r.gullet.macros.set("\\@eqnsw", "1", !0);
  }
  function V() {
    O && (r.gullet.macros.get("\\df@tag") ? (O.push(r.subparse([new x0("\\df@tag")])), r.gullet.macros.set("\\df@tag", void 0, !0)) : O.push(!!c && r.gullet.macros.get("\\@eqnsw") === "1"));
  }
  for (H(), N.push(Jt(r)); ; ) {
    var L = r.parseExpression(!1, p ? "\\end" : "\\\\");
    r.gullet.endGroup(), r.gullet.beginGroup(), L = {
      type: "ordgroup",
      mode: r.mode,
      body: L
    }, t && (L = {
      type: "styling",
      mode: r.mode,
      style: t,
      body: [L]
    }), z.push(L);
    var U = r.fetch().text;
    if (U === "&") {
      if (y && z.length === y) {
        if (p || h)
          throw new M("Too many tab characters: &", r.nextToken);
        r.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
      }
      r.consume();
    } else if (U === "\\end") {
      V(), z.length === 1 && L.type === "styling" && L.body[0].body.length === 0 && (T.length > 1 || !g) && T.pop(), N.length < T.length + 1 && N.push([]);
      break;
    } else if (U === "\\\\") {
      r.consume();
      var G = void 0;
      r.gullet.future().text !== " " && (G = r.parseSizeGroup(!0)), C.push(G ? G.value : null), V(), N.push(Jt(r)), z = [], T.push(z), H();
    } else
      throw new M("Expected & or \\\\ or \\cr or \\end", r.nextToken);
  }
  return r.gullet.endGroup(), r.gullet.endGroup(), {
    type: "array",
    mode: r.mode,
    addJot: n,
    arraystretch: o,
    body: T,
    cols: s,
    rowGaps: C,
    hskipBeforeAndAfter: a,
    hLinesBeforeRow: N,
    colSeparationType: h,
    tags: O,
    leqno: w
  };
}
function zt(r) {
  return r.slice(0, 1) === "d" ? "display" : "text";
}
var k0 = function(e, t) {
  var a, n, s = e.body.length, o = e.hLinesBeforeRow, h = 0, c = new Array(s), p = [], g = Math.max(
    // From LaTeX \showthe\arrayrulewidth. Equals 0.04 em.
    t.fontMetrics().arrayRuleWidth,
    t.minRuleThickness
    // User override.
  ), y = 1 / t.fontMetrics().ptPerEm, w = 5 * y;
  if (e.colSeparationType && e.colSeparationType === "small") {
    var x = t.havingStyle(R.SCRIPT).sizeMultiplier;
    w = 0.2778 * (x / t.sizeMultiplier);
  }
  var z = e.colSeparationType === "CD" ? K({
    number: 3,
    unit: "ex"
  }, t) : 12 * y, T = 3 * y, C = e.arraystretch * z, N = 0.7 * C, O = 0.3 * C, H = 0;
  function V(pe) {
    for (var ve = 0; ve < pe.length; ++ve)
      ve > 0 && (H += 0.25), p.push({
        pos: H,
        isDashed: pe[ve]
      });
  }
  for (V(o[0]), a = 0; a < e.body.length; ++a) {
    var L = e.body[a], U = N, G = O;
    h < L.length && (h = L.length);
    var j = new Array(L.length);
    for (n = 0; n < L.length; ++n) {
      var Y = P(L[n], t);
      G < Y.depth && (G = Y.depth), U < Y.height && (U = Y.height), j[n] = Y;
    }
    var M0 = e.rowGaps[a], r0 = 0;
    M0 && (r0 = K(M0, t), r0 > 0 && (r0 += O, G < r0 && (G = r0), r0 = 0)), e.addJot && (G += T), j.height = U, j.depth = G, H += U, j.pos = H, H += G + r0, c[a] = j, V(o[a + 1]);
  }
  var e0 = H / 2 + t.fontMetrics().axisHeight, U0 = e.cols || [], s0 = [], v0, R0, W0 = [];
  if (e.tags && e.tags.some((pe) => pe))
    for (a = 0; a < s; ++a) {
      var j0 = c[a], Le = j0.pos - e0, E0 = e.tags[a], I0 = void 0;
      E0 === !0 ? I0 = b.makeSpan(["eqn-num"], [], t) : E0 === !1 ? I0 = b.makeSpan([], [], t) : I0 = b.makeSpan([], t0(E0, t, !0), t), I0.depth = j0.depth, I0.height = j0.height, W0.push({
        type: "elem",
        elem: I0,
        shift: Le
      });
    }
  for (
    n = 0, R0 = 0;
    // Continue while either there are more columns or more column
    // descriptions, so trailing separators don't get lost.
    n < h || R0 < U0.length;
    ++n, ++R0
  ) {
    for (var m0 = U0[R0] || {}, ae = !0; m0.type === "separator"; ) {
      if (ae || (v0 = b.makeSpan(["arraycolsep"], []), v0.style.width = A(t.fontMetrics().doubleRuleSep), s0.push(v0)), m0.separator === "|" || m0.separator === ":") {
        var Pe = m0.separator === "|" ? "solid" : "dashed", Z0 = b.makeSpan(["vertical-separator"], [], t);
        Z0.style.height = A(H), Z0.style.borderRightWidth = A(g), Z0.style.borderRightStyle = Pe, Z0.style.margin = "0 " + A(-g / 2);
        var qt = H - e0;
        qt && (Z0.style.verticalAlign = A(-qt)), s0.push(Z0);
      } else
        throw new M("Invalid separator type: " + m0.separator);
      R0++, m0 = U0[R0] || {}, ae = !1;
    }
    if (!(n >= h)) {
      var K0 = void 0;
      (n > 0 || e.hskipBeforeAndAfter) && (K0 = I.deflt(m0.pregap, w), K0 !== 0 && (v0 = b.makeSpan(["arraycolsep"], []), v0.style.width = A(K0), s0.push(v0)));
      var J0 = [];
      for (a = 0; a < s; ++a) {
        var de = c[a], fe = de[n];
        if (fe) {
          var ha = de.pos - e0;
          fe.depth = de.depth, fe.height = de.height, J0.push({
            type: "elem",
            elem: fe,
            shift: ha
          });
        }
      }
      J0 = b.makeVList({
        positionType: "individualShift",
        children: J0
      }, t), J0 = b.makeSpan(["col-align-" + (m0.align || "c")], [J0]), s0.push(J0), (n < h - 1 || e.hskipBeforeAndAfter) && (K0 = I.deflt(m0.postgap, w), K0 !== 0 && (v0 = b.makeSpan(["arraycolsep"], []), v0.style.width = A(K0), s0.push(v0)));
    }
  }
  if (c = b.makeSpan(["mtable"], s0), p.length > 0) {
    for (var ma = b.makeLineSpan("hline", t, g), ca = b.makeLineSpan("hdashline", t, g), Ge = [{
      type: "elem",
      elem: c,
      shift: 0
    }]; p.length > 0; ) {
      var Rt = p.pop(), Et = Rt.pos - e0;
      Rt.isDashed ? Ge.push({
        type: "elem",
        elem: ca,
        shift: Et
      }) : Ge.push({
        type: "elem",
        elem: ma,
        shift: Et
      });
    }
    c = b.makeVList({
      positionType: "individualShift",
      children: Ge
    }, t);
  }
  if (W0.length === 0)
    return b.makeSpan(["mord"], [c], t);
  var Ve = b.makeVList({
    positionType: "individualShift",
    children: W0
  }, t);
  return Ve = b.makeSpan(["tag"], [Ve], t), b.makeFragment([c, Ve]);
}, Y1 = {
  c: "center ",
  l: "left ",
  r: "right "
}, S0 = function(e, t) {
  for (var a = [], n = new S.MathNode("mtd", [], ["mtr-glue"]), s = new S.MathNode("mtd", [], ["mml-eqn-num"]), o = 0; o < e.body.length; o++) {
    for (var h = e.body[o], c = [], p = 0; p < h.length; p++)
      c.push(new S.MathNode("mtd", [X(h[p], t)]));
    e.tags && e.tags[o] && (c.unshift(n), c.push(n), e.leqno ? c.unshift(s) : c.push(s)), a.push(new S.MathNode("mtr", c));
  }
  var g = new S.MathNode("mtable", a), y = e.arraystretch === 0.5 ? 0.1 : 0.16 + e.arraystretch - 1 + (e.addJot ? 0.09 : 0);
  g.setAttribute("rowspacing", A(y));
  var w = "", x = "";
  if (e.cols && e.cols.length > 0) {
    var z = e.cols, T = "", C = !1, N = 0, O = z.length;
    z[0].type === "separator" && (w += "top ", N = 1), z[z.length - 1].type === "separator" && (w += "bottom ", O -= 1);
    for (var H = N; H < O; H++)
      z[H].type === "align" ? (x += Y1[z[H].align], C && (T += "none "), C = !0) : z[H].type === "separator" && C && (T += z[H].separator === "|" ? "solid " : "dashed ", C = !1);
    g.setAttribute("columnalign", x.trim()), /[sd]/.test(T) && g.setAttribute("columnlines", T.trim());
  }
  if (e.colSeparationType === "align") {
    for (var V = e.cols || [], L = "", U = 1; U < V.length; U++)
      L += U % 2 ? "0em " : "1em ";
    g.setAttribute("columnspacing", L.trim());
  } else
    e.colSeparationType === "alignat" || e.colSeparationType === "gather" ? g.setAttribute("columnspacing", "0em") : e.colSeparationType === "small" ? g.setAttribute("columnspacing", "0.2778em") : e.colSeparationType === "CD" ? g.setAttribute("columnspacing", "0.5em") : g.setAttribute("columnspacing", "1em");
  var G = "", j = e.hLinesBeforeRow;
  w += j[0].length > 0 ? "left " : "", w += j[j.length - 1].length > 0 ? "right " : "";
  for (var Y = 1; Y < j.length - 1; Y++)
    G += j[Y].length === 0 ? "none " : j[Y][0] ? "dashed " : "solid ";
  return /[sd]/.test(G) && g.setAttribute("rowlines", G.trim()), w !== "" && (g = new S.MathNode("menclose", [g]), g.setAttribute("notation", w.trim())), e.arraystretch && e.arraystretch < 1 && (g = new S.MathNode("mstyle", [g]), g.setAttribute("scriptlevel", "1")), g;
}, jr = function(e, t) {
  e.envName.indexOf("ed") === -1 && Fe(e);
  var a = [], n = e.envName.indexOf("at") > -1 ? "alignat" : "align", s = e.envName === "split", o = V0(e.parser, {
    cols: a,
    addJot: !0,
    autoTag: s ? void 0 : Mt(e.envName),
    emptySingleRow: !0,
    colSeparationType: n,
    maxNumCols: s ? 2 : void 0,
    leqno: e.parser.settings.leqno
  }, "display"), h, c = 0, p = {
    type: "ordgroup",
    mode: e.mode,
    body: []
  };
  if (t[0] && t[0].type === "ordgroup") {
    for (var g = "", y = 0; y < t[0].body.length; y++) {
      var w = F(t[0].body[y], "textord");
      g += w.text;
    }
    h = Number(g), c = h * 2;
  }
  var x = !c;
  o.body.forEach(function(N) {
    for (var O = 1; O < N.length; O += 2) {
      var H = F(N[O], "styling"), V = F(H.body[0], "ordgroup");
      V.body.unshift(p);
    }
    if (x)
      c < N.length && (c = N.length);
    else {
      var L = N.length / 2;
      if (h < L)
        throw new M("Too many math in a row: " + ("expected " + h + ", but got " + L), N[0]);
    }
  });
  for (var z = 0; z < c; ++z) {
    var T = "r", C = 0;
    z % 2 === 1 ? T = "l" : z > 0 && x && (C = 1), a[z] = {
      type: "align",
      align: T,
      pregap: C,
      postgap: 0
    };
  }
  return o.colSeparationType = x ? "align" : "alignat", o;
};
w0({
  type: "array",
  names: ["array", "darray"],
  props: {
    numArgs: 1
  },
  handler(r, e) {
    var t = Ie(e[0]), a = t ? [e[0]] : F(e[0], "ordgroup").body, n = a.map(function(o) {
      var h = yt(o), c = h.text;
      if ("lcr".indexOf(c) !== -1)
        return {
          type: "align",
          align: c
        };
      if (c === "|")
        return {
          type: "separator",
          separator: "|"
        };
      if (c === ":")
        return {
          type: "separator",
          separator: ":"
        };
      throw new M("Unknown column alignment: " + c, o);
    }), s = {
      cols: n,
      hskipBeforeAndAfter: !0,
      // \@preamble in lttab.dtx
      maxNumCols: n.length
    };
    return V0(r.parser, s, zt(r.envName));
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "matrix*", "pmatrix*", "bmatrix*", "Bmatrix*", "vmatrix*", "Vmatrix*"],
  props: {
    numArgs: 0
  },
  handler(r) {
    var e = {
      matrix: null,
      pmatrix: ["(", ")"],
      bmatrix: ["[", "]"],
      Bmatrix: ["\\{", "\\}"],
      vmatrix: ["|", "|"],
      Vmatrix: ["\\Vert", "\\Vert"]
    }[r.envName.replace("*", "")], t = "c", a = {
      hskipBeforeAndAfter: !1,
      cols: [{
        type: "align",
        align: t
      }]
    };
    if (r.envName.charAt(r.envName.length - 1) === "*") {
      var n = r.parser;
      if (n.consumeSpaces(), n.fetch().text === "[") {
        if (n.consume(), n.consumeSpaces(), t = n.fetch().text, "lcr".indexOf(t) === -1)
          throw new M("Expected l or c or r", n.nextToken);
        n.consume(), n.consumeSpaces(), n.expect("]"), n.consume(), a.cols = [{
          type: "align",
          align: t
        }];
      }
    }
    var s = V0(r.parser, a, zt(r.envName)), o = Math.max(0, ...s.body.map((h) => h.length));
    return s.cols = new Array(o).fill({
      type: "align",
      align: t
    }), e ? {
      type: "leftright",
      mode: r.mode,
      body: [s],
      left: e[0],
      right: e[1],
      rightColor: void 0
      // \right uninfluenced by \color in array
    } : s;
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["smallmatrix"],
  props: {
    numArgs: 0
  },
  handler(r) {
    var e = {
      arraystretch: 0.5
    }, t = V0(r.parser, e, "script");
    return t.colSeparationType = "small", t;
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["subarray"],
  props: {
    numArgs: 1
  },
  handler(r, e) {
    var t = Ie(e[0]), a = t ? [e[0]] : F(e[0], "ordgroup").body, n = a.map(function(o) {
      var h = yt(o), c = h.text;
      if ("lc".indexOf(c) !== -1)
        return {
          type: "align",
          align: c
        };
      throw new M("Unknown column alignment: " + c, o);
    });
    if (n.length > 1)
      throw new M("{subarray} can contain only one column");
    var s = {
      cols: n,
      hskipBeforeAndAfter: !1,
      arraystretch: 0.5
    };
    if (s = V0(r.parser, s, "script"), s.body.length > 0 && s.body[0].length > 1)
      throw new M("{subarray} can contain only one column");
    return s;
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["cases", "dcases", "rcases", "drcases"],
  props: {
    numArgs: 0
  },
  handler(r) {
    var e = {
      arraystretch: 1.2,
      cols: [{
        type: "align",
        align: "l",
        pregap: 0,
        // TODO(kevinb) get the current style.
        // For now we use the metrics for TEXT style which is what we were
        // doing before.  Before attempting to get the current style we
        // should look at TeX's behavior especially for \over and matrices.
        postgap: 1
        /* 1em quad */
      }, {
        type: "align",
        align: "l",
        pregap: 0,
        postgap: 0
      }]
    }, t = V0(r.parser, e, zt(r.envName));
    return {
      type: "leftright",
      mode: r.mode,
      body: [t],
      left: r.envName.indexOf("r") > -1 ? "." : "\\{",
      right: r.envName.indexOf("r") > -1 ? "\\}" : ".",
      rightColor: void 0
    };
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["align", "align*", "aligned", "split"],
  props: {
    numArgs: 0
  },
  handler: jr,
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["gathered", "gather", "gather*"],
  props: {
    numArgs: 0
  },
  handler(r) {
    I.contains(["gather", "gather*"], r.envName) && Fe(r);
    var e = {
      cols: [{
        type: "align",
        align: "c"
      }],
      addJot: !0,
      colSeparationType: "gather",
      autoTag: Mt(r.envName),
      emptySingleRow: !0,
      leqno: r.parser.settings.leqno
    };
    return V0(r.parser, e, "display");
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["alignat", "alignat*", "alignedat"],
  props: {
    numArgs: 1
  },
  handler: jr,
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["equation", "equation*"],
  props: {
    numArgs: 0
  },
  handler(r) {
    Fe(r);
    var e = {
      autoTag: Mt(r.envName),
      emptySingleRow: !0,
      singleRow: !0,
      maxNumCols: 1,
      leqno: r.parser.settings.leqno
    };
    return V0(r.parser, e, "display");
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
w0({
  type: "array",
  names: ["CD"],
  props: {
    numArgs: 0
  },
  handler(r) {
    return Fe(r), C1(r.parser);
  },
  htmlBuilder: k0,
  mathmlBuilder: S0
});
m("\\nonumber", "\\gdef\\@eqnsw{0}");
m("\\notag", "\\nonumber");
B({
  type: "text",
  // Doesn't matter what this is.
  names: ["\\hline", "\\hdashline"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !0
  },
  handler(r, e) {
    throw new M(r.funcName + " valid only within array environment");
  }
});
var Qt = $r;
B({
  type: "environment",
  names: ["\\begin", "\\end"],
  props: {
    numArgs: 1,
    argTypes: ["text"]
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0];
    if (n.type !== "ordgroup")
      throw new M("Invalid environment name", n);
    for (var s = "", o = 0; o < n.body.length; ++o)
      s += F(n.body[o], "textord").text;
    if (a === "\\begin") {
      if (!Qt.hasOwnProperty(s))
        throw new M("No such environment: " + s, n);
      var h = Qt[s], {
        args: c,
        optArgs: p
      } = t.parseArguments("\\begin{" + s + "}", h), g = {
        mode: t.mode,
        envName: s,
        parser: t
      }, y = h.handler(g, c, p);
      t.expect("\\end", !1);
      var w = t.nextToken, x = F(t.parseFunction(), "environment");
      if (x.name !== s)
        throw new M("Mismatch: \\begin{" + s + "} matched by \\end{" + x.name + "}", w);
      return y;
    }
    return {
      type: "environment",
      mode: t.mode,
      name: s,
      nameGroup: n
    };
  }
});
var Zr = (r, e) => {
  var t = r.font, a = e.withFont(t);
  return P(r.body, a);
}, Kr = (r, e) => {
  var t = r.font, a = e.withFont(t);
  return X(r.body, a);
}, _t = {
  "\\Bbb": "\\mathbb",
  "\\bold": "\\mathbf",
  "\\frak": "\\mathfrak",
  "\\bm": "\\boldsymbol"
};
B({
  type: "font",
  names: [
    // styles, except \boldsymbol defined below
    "\\mathrm",
    "\\mathit",
    "\\mathbf",
    "\\mathnormal",
    // families
    "\\mathbb",
    "\\mathcal",
    "\\mathfrak",
    "\\mathscr",
    "\\mathsf",
    "\\mathtt",
    // aliases, except \bm defined below
    "\\Bbb",
    "\\bold",
    "\\frak"
  ],
  props: {
    numArgs: 1,
    allowedInArgument: !0
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = qe(e[0]), s = a;
    return s in _t && (s = _t[s]), {
      type: "font",
      mode: t.mode,
      font: s.slice(1),
      body: n
    };
  },
  htmlBuilder: Zr,
  mathmlBuilder: Kr
});
B({
  type: "mclass",
  names: ["\\boldsymbol", "\\bm"],
  props: {
    numArgs: 1
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r, a = e[0], n = I.isCharacterBox(a);
    return {
      type: "mclass",
      mode: t.mode,
      mclass: Oe(a),
      body: [{
        type: "font",
        mode: t.mode,
        font: "boldsymbol",
        body: a
      }],
      isCharacterBox: n
    };
  }
});
B({
  type: "font",
  names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a,
      breakOnTokenText: n
    } = r, {
      mode: s
    } = t, o = t.parseExpression(!0, n), h = "math" + a.slice(1);
    return {
      type: "font",
      mode: s,
      font: h,
      body: {
        type: "ordgroup",
        mode: t.mode,
        body: o
      }
    };
  },
  htmlBuilder: Zr,
  mathmlBuilder: Kr
});
var Jr = (r, e) => {
  var t = e;
  return r === "display" ? t = t.id >= R.SCRIPT.id ? t.text() : R.DISPLAY : r === "text" && t.size === R.DISPLAY.size ? t = R.TEXT : r === "script" ? t = R.SCRIPT : r === "scriptscript" && (t = R.SCRIPTSCRIPT), t;
}, At = (r, e) => {
  var t = Jr(r.size, e.style), a = t.fracNum(), n = t.fracDen(), s;
  s = e.havingStyle(a);
  var o = P(r.numer, s, e);
  if (r.continued) {
    var h = 8.5 / e.fontMetrics().ptPerEm, c = 3.5 / e.fontMetrics().ptPerEm;
    o.height = o.height < h ? h : o.height, o.depth = o.depth < c ? c : o.depth;
  }
  s = e.havingStyle(n);
  var p = P(r.denom, s, e), g, y, w;
  r.hasBarLine ? (r.barSize ? (y = K(r.barSize, e), g = b.makeLineSpan("frac-line", e, y)) : g = b.makeLineSpan("frac-line", e), y = g.height, w = g.height) : (g = null, y = 0, w = e.fontMetrics().defaultRuleThickness);
  var x, z, T;
  t.size === R.DISPLAY.size || r.size === "display" ? (x = e.fontMetrics().num1, y > 0 ? z = 3 * w : z = 7 * w, T = e.fontMetrics().denom1) : (y > 0 ? (x = e.fontMetrics().num2, z = w) : (x = e.fontMetrics().num3, z = 3 * w), T = e.fontMetrics().denom2);
  var C;
  if (g) {
    var O = e.fontMetrics().axisHeight;
    x - o.depth - (O + 0.5 * y) < z && (x += z - (x - o.depth - (O + 0.5 * y))), O - 0.5 * y - (p.height - T) < z && (T += z - (O - 0.5 * y - (p.height - T)));
    var H = -(O - 0.5 * y);
    C = b.makeVList({
      positionType: "individualShift",
      children: [{
        type: "elem",
        elem: p,
        shift: T
      }, {
        type: "elem",
        elem: g,
        shift: H
      }, {
        type: "elem",
        elem: o,
        shift: -x
      }]
    }, e);
  } else {
    var N = x - o.depth - (p.height - T);
    N < z && (x += 0.5 * (z - N), T += 0.5 * (z - N)), C = b.makeVList({
      positionType: "individualShift",
      children: [{
        type: "elem",
        elem: p,
        shift: T
      }, {
        type: "elem",
        elem: o,
        shift: -x
      }]
    }, e);
  }
  s = e.havingStyle(t), C.height *= s.sizeMultiplier / e.sizeMultiplier, C.depth *= s.sizeMultiplier / e.sizeMultiplier;
  var V;
  t.size === R.DISPLAY.size ? V = e.fontMetrics().delim1 : t.size === R.SCRIPTSCRIPT.size ? V = e.havingStyle(R.SCRIPT).fontMetrics().delim2 : V = e.fontMetrics().delim2;
  var L, U;
  return r.leftDelim == null ? L = oe(e, ["mopen"]) : L = B0.customSizedDelim(r.leftDelim, V, !0, e.havingStyle(t), r.mode, ["mopen"]), r.continued ? U = b.makeSpan([]) : r.rightDelim == null ? U = oe(e, ["mclose"]) : U = B0.customSizedDelim(r.rightDelim, V, !0, e.havingStyle(t), r.mode, ["mclose"]), b.makeSpan(["mord"].concat(s.sizingClasses(e)), [L, b.makeSpan(["mfrac"], [C]), U], e);
}, Tt = (r, e) => {
  var t = new S.MathNode("mfrac", [X(r.numer, e), X(r.denom, e)]);
  if (!r.hasBarLine)
    t.setAttribute("linethickness", "0px");
  else if (r.barSize) {
    var a = K(r.barSize, e);
    t.setAttribute("linethickness", A(a));
  }
  var n = Jr(r.size, e.style);
  if (n.size !== e.style.size) {
    t = new S.MathNode("mstyle", [t]);
    var s = n.size === R.DISPLAY.size ? "true" : "false";
    t.setAttribute("displaystyle", s), t.setAttribute("scriptlevel", "0");
  }
  if (r.leftDelim != null || r.rightDelim != null) {
    var o = [];
    if (r.leftDelim != null) {
      var h = new S.MathNode("mo", [new S.TextNode(r.leftDelim.replace("\\", ""))]);
      h.setAttribute("fence", "true"), o.push(h);
    }
    if (o.push(t), r.rightDelim != null) {
      var c = new S.MathNode("mo", [new S.TextNode(r.rightDelim.replace("\\", ""))]);
      c.setAttribute("fence", "true"), o.push(c);
    }
    return gt(o);
  }
  return t;
};
B({
  type: "genfrac",
  names: [
    "\\dfrac",
    "\\frac",
    "\\tfrac",
    "\\dbinom",
    "\\binom",
    "\\tbinom",
    "\\\\atopfrac",
    // can’t be entered directly
    "\\\\bracefrac",
    "\\\\brackfrac"
    // ditto
  ],
  props: {
    numArgs: 2,
    allowedInArgument: !0
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0], s = e[1], o, h = null, c = null, p = "auto";
    switch (a) {
      case "\\dfrac":
      case "\\frac":
      case "\\tfrac":
        o = !0;
        break;
      case "\\\\atopfrac":
        o = !1;
        break;
      case "\\dbinom":
      case "\\binom":
      case "\\tbinom":
        o = !1, h = "(", c = ")";
        break;
      case "\\\\bracefrac":
        o = !1, h = "\\{", c = "\\}";
        break;
      case "\\\\brackfrac":
        o = !1, h = "[", c = "]";
        break;
      default:
        throw new Error("Unrecognized genfrac command");
    }
    switch (a) {
      case "\\dfrac":
      case "\\dbinom":
        p = "display";
        break;
      case "\\tfrac":
      case "\\tbinom":
        p = "text";
        break;
    }
    return {
      type: "genfrac",
      mode: t.mode,
      continued: !1,
      numer: n,
      denom: s,
      hasBarLine: o,
      leftDelim: h,
      rightDelim: c,
      size: p,
      barSize: null
    };
  },
  htmlBuilder: At,
  mathmlBuilder: Tt
});
B({
  type: "genfrac",
  names: ["\\cfrac"],
  props: {
    numArgs: 2
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0], s = e[1];
    return {
      type: "genfrac",
      mode: t.mode,
      continued: !0,
      numer: n,
      denom: s,
      hasBarLine: !0,
      leftDelim: null,
      rightDelim: null,
      size: "display",
      barSize: null
    };
  }
});
B({
  type: "infix",
  names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
  props: {
    numArgs: 0,
    infix: !0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t,
      token: a
    } = r, n;
    switch (t) {
      case "\\over":
        n = "\\frac";
        break;
      case "\\choose":
        n = "\\binom";
        break;
      case "\\atop":
        n = "\\\\atopfrac";
        break;
      case "\\brace":
        n = "\\\\bracefrac";
        break;
      case "\\brack":
        n = "\\\\brackfrac";
        break;
      default:
        throw new Error("Unrecognized infix genfrac command");
    }
    return {
      type: "infix",
      mode: e.mode,
      replaceWith: n,
      token: a
    };
  }
});
var er = ["display", "text", "script", "scriptscript"], tr = function(e) {
  var t = null;
  return e.length > 0 && (t = e, t = t === "." ? null : t), t;
};
B({
  type: "genfrac",
  names: ["\\genfrac"],
  props: {
    numArgs: 6,
    allowedInArgument: !0,
    argTypes: ["math", "math", "size", "text", "math", "math"]
  },
  handler(r, e) {
    var {
      parser: t
    } = r, a = e[4], n = e[5], s = qe(e[0]), o = s.type === "atom" && s.family === "open" ? tr(s.text) : null, h = qe(e[1]), c = h.type === "atom" && h.family === "close" ? tr(h.text) : null, p = F(e[2], "size"), g, y = null;
    p.isBlank ? g = !0 : (y = p.value, g = y.number > 0);
    var w = "auto", x = e[3];
    if (x.type === "ordgroup") {
      if (x.body.length > 0) {
        var z = F(x.body[0], "textord");
        w = er[Number(z.text)];
      }
    } else
      x = F(x, "textord"), w = er[Number(x.text)];
    return {
      type: "genfrac",
      mode: t.mode,
      numer: a,
      denom: n,
      continued: !1,
      hasBarLine: g,
      barSize: y,
      leftDelim: o,
      rightDelim: c,
      size: w
    };
  },
  htmlBuilder: At,
  mathmlBuilder: Tt
});
B({
  type: "infix",
  names: ["\\above"],
  props: {
    numArgs: 1,
    argTypes: ["size"],
    infix: !0
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a,
      token: n
    } = r;
    return {
      type: "infix",
      mode: t.mode,
      replaceWith: "\\\\abovefrac",
      size: F(e[0], "size").value,
      token: n
    };
  }
});
B({
  type: "genfrac",
  names: ["\\\\abovefrac"],
  props: {
    numArgs: 3,
    argTypes: ["math", "size", "math"]
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0], s = wa(F(e[1], "infix").size), o = e[2], h = s.number > 0;
    return {
      type: "genfrac",
      mode: t.mode,
      numer: n,
      denom: o,
      continued: !1,
      hasBarLine: h,
      barSize: s,
      leftDelim: null,
      rightDelim: null,
      size: "auto"
    };
  },
  htmlBuilder: At,
  mathmlBuilder: Tt
});
var Qr = (r, e) => {
  var t = e.style, a, n;
  r.type === "supsub" ? (a = r.sup ? P(r.sup, e.havingStyle(t.sup()), e) : P(r.sub, e.havingStyle(t.sub()), e), n = F(r.base, "horizBrace")) : n = F(r, "horizBrace");
  var s = P(n.base, e.havingBaseStyle(R.DISPLAY)), o = N0.svgSpan(n, e), h;
  if (n.isOver ? (h = b.makeVList({
    positionType: "firstBaseline",
    children: [{
      type: "elem",
      elem: s
    }, {
      type: "kern",
      size: 0.1
    }, {
      type: "elem",
      elem: o
    }]
  }, e), h.children[0].children[0].children[1].classes.push("svg-align")) : (h = b.makeVList({
    positionType: "bottom",
    positionData: s.depth + 0.1 + o.height,
    children: [{
      type: "elem",
      elem: o
    }, {
      type: "kern",
      size: 0.1
    }, {
      type: "elem",
      elem: s
    }]
  }, e), h.children[0].children[0].children[0].classes.push("svg-align")), a) {
    var c = b.makeSpan(["mord", n.isOver ? "mover" : "munder"], [h], e);
    n.isOver ? h = b.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: c
      }, {
        type: "kern",
        size: 0.2
      }, {
        type: "elem",
        elem: a
      }]
    }, e) : h = b.makeVList({
      positionType: "bottom",
      positionData: c.depth + 0.2 + a.height + a.depth,
      children: [{
        type: "elem",
        elem: a
      }, {
        type: "kern",
        size: 0.2
      }, {
        type: "elem",
        elem: c
      }]
    }, e);
  }
  return b.makeSpan(["mord", n.isOver ? "mover" : "munder"], [h], e);
}, X1 = (r, e) => {
  var t = N0.mathMLnode(r.label);
  return new S.MathNode(r.isOver ? "mover" : "munder", [X(r.base, e), t]);
};
B({
  type: "horizBrace",
  names: ["\\overbrace", "\\underbrace"],
  props: {
    numArgs: 1
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r;
    return {
      type: "horizBrace",
      mode: t.mode,
      label: a,
      isOver: /^\\over/.test(a),
      base: e[0]
    };
  },
  htmlBuilder: Qr,
  mathmlBuilder: X1
});
B({
  type: "href",
  names: ["\\href"],
  props: {
    numArgs: 2,
    argTypes: ["url", "original"],
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r, a = e[1], n = F(e[0], "url").url;
    return t.settings.isTrusted({
      command: "\\href",
      url: n
    }) ? {
      type: "href",
      mode: t.mode,
      href: n,
      body: Q(a)
    } : t.formatUnsupportedCmd("\\href");
  },
  htmlBuilder: (r, e) => {
    var t = t0(r.body, e, !1);
    return b.makeAnchor(r.href, [], t, e);
  },
  mathmlBuilder: (r, e) => {
    var t = G0(r.body, e);
    return t instanceof c0 || (t = new c0("mrow", [t])), t.setAttribute("href", r.href), t;
  }
});
B({
  type: "href",
  names: ["\\url"],
  props: {
    numArgs: 1,
    argTypes: ["url"],
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r, a = F(e[0], "url").url;
    if (!t.settings.isTrusted({
      command: "\\url",
      url: a
    }))
      return t.formatUnsupportedCmd("\\url");
    for (var n = [], s = 0; s < a.length; s++) {
      var o = a[s];
      o === "~" && (o = "\\textasciitilde"), n.push({
        type: "textord",
        mode: "text",
        text: o
      });
    }
    var h = {
      type: "text",
      mode: t.mode,
      font: "\\texttt",
      body: n
    };
    return {
      type: "href",
      mode: t.mode,
      href: a,
      body: Q(h)
    };
  }
});
B({
  type: "hbox",
  names: ["\\hbox"],
  props: {
    numArgs: 1,
    argTypes: ["text"],
    allowedInText: !0,
    primitive: !0
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "hbox",
      mode: t.mode,
      body: Q(e[0])
    };
  },
  htmlBuilder(r, e) {
    var t = t0(r.body, e, !1);
    return b.makeFragment(t);
  },
  mathmlBuilder(r, e) {
    return new S.MathNode("mrow", o0(r.body, e));
  }
});
B({
  type: "html",
  names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
  props: {
    numArgs: 2,
    argTypes: ["raw", "original"],
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a,
      token: n
    } = r, s = F(e[0], "raw").string, o = e[1];
    t.settings.strict && t.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
    var h, c = {};
    switch (a) {
      case "\\htmlClass":
        c.class = s, h = {
          command: "\\htmlClass",
          class: s
        };
        break;
      case "\\htmlId":
        c.id = s, h = {
          command: "\\htmlId",
          id: s
        };
        break;
      case "\\htmlStyle":
        c.style = s, h = {
          command: "\\htmlStyle",
          style: s
        };
        break;
      case "\\htmlData": {
        for (var p = s.split(","), g = 0; g < p.length; g++) {
          var y = p[g].split("=");
          if (y.length !== 2)
            throw new M("Error parsing key-value for \\htmlData");
          c["data-" + y[0].trim()] = y[1].trim();
        }
        h = {
          command: "\\htmlData",
          attributes: c
        };
        break;
      }
      default:
        throw new Error("Unrecognized html command");
    }
    return t.settings.isTrusted(h) ? {
      type: "html",
      mode: t.mode,
      attributes: c,
      body: Q(o)
    } : t.formatUnsupportedCmd(a);
  },
  htmlBuilder: (r, e) => {
    var t = t0(r.body, e, !1), a = ["enclosing"];
    r.attributes.class && a.push(...r.attributes.class.trim().split(/\s+/));
    var n = b.makeSpan(a, t, e);
    for (var s in r.attributes)
      s !== "class" && r.attributes.hasOwnProperty(s) && n.setAttribute(s, r.attributes[s]);
    return n;
  },
  mathmlBuilder: (r, e) => G0(r.body, e)
});
B({
  type: "htmlmathml",
  names: ["\\html@mathml"],
  props: {
    numArgs: 2,
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r;
    return {
      type: "htmlmathml",
      mode: t.mode,
      html: Q(e[0]),
      mathml: Q(e[1])
    };
  },
  htmlBuilder: (r, e) => {
    var t = t0(r.html, e, !1);
    return b.makeFragment(t);
  },
  mathmlBuilder: (r, e) => G0(r.mathml, e)
});
var _e = function(e) {
  if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e))
    return {
      number: +e,
      unit: "bp"
    };
  var t = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);
  if (!t)
    throw new M("Invalid size: '" + e + "' in \\includegraphics");
  var a = {
    number: +(t[1] + t[2]),
    // sign + magnitude, cast to number
    unit: t[3]
  };
  if (!gr(a))
    throw new M("Invalid unit: '" + a.unit + "' in \\includegraphics.");
  return a;
};
B({
  type: "includegraphics",
  names: ["\\includegraphics"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1,
    argTypes: ["raw", "url"],
    allowedInText: !1
  },
  handler: (r, e, t) => {
    var {
      parser: a
    } = r, n = {
      number: 0,
      unit: "em"
    }, s = {
      number: 0.9,
      unit: "em"
    }, o = {
      number: 0,
      unit: "em"
    }, h = "";
    if (t[0])
      for (var c = F(t[0], "raw").string, p = c.split(","), g = 0; g < p.length; g++) {
        var y = p[g].split("=");
        if (y.length === 2) {
          var w = y[1].trim();
          switch (y[0].trim()) {
            case "alt":
              h = w;
              break;
            case "width":
              n = _e(w);
              break;
            case "height":
              s = _e(w);
              break;
            case "totalheight":
              o = _e(w);
              break;
            default:
              throw new M("Invalid key: '" + y[0] + "' in \\includegraphics.");
          }
        }
      }
    var x = F(e[0], "url").url;
    return h === "" && (h = x, h = h.replace(/^.*[\\/]/, ""), h = h.substring(0, h.lastIndexOf("."))), a.settings.isTrusted({
      command: "\\includegraphics",
      url: x
    }) ? {
      type: "includegraphics",
      mode: a.mode,
      alt: h,
      width: n,
      height: s,
      totalheight: o,
      src: x
    } : a.formatUnsupportedCmd("\\includegraphics");
  },
  htmlBuilder: (r, e) => {
    var t = K(r.height, e), a = 0;
    r.totalheight.number > 0 && (a = K(r.totalheight, e) - t);
    var n = 0;
    r.width.number > 0 && (n = K(r.width, e));
    var s = {
      height: A(t + a)
    };
    n > 0 && (s.width = A(n)), a > 0 && (s.verticalAlign = A(-a));
    var o = new Xa(r.src, r.alt, s);
    return o.height = t, o.depth = a, o;
  },
  mathmlBuilder: (r, e) => {
    var t = new S.MathNode("mglyph", []);
    t.setAttribute("alt", r.alt);
    var a = K(r.height, e), n = 0;
    if (r.totalheight.number > 0 && (n = K(r.totalheight, e) - a, t.setAttribute("valign", A(-n))), t.setAttribute("height", A(a + n)), r.width.number > 0) {
      var s = K(r.width, e);
      t.setAttribute("width", A(s));
    }
    return t.setAttribute("src", r.src), t;
  }
});
B({
  type: "kern",
  names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
  props: {
    numArgs: 1,
    argTypes: ["size"],
    primitive: !0,
    allowedInText: !0
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r, n = F(e[0], "size");
    if (t.settings.strict) {
      var s = a[1] === "m", o = n.value.unit === "mu";
      s ? (o || t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + a + " supports only mu units, " + ("not " + n.value.unit + " units")), t.mode !== "math" && t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + a + " works only in math mode")) : o && t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + a + " doesn't support mu units");
    }
    return {
      type: "kern",
      mode: t.mode,
      dimension: n.value
    };
  },
  htmlBuilder(r, e) {
    return b.makeGlue(r.dimension, e);
  },
  mathmlBuilder(r, e) {
    var t = K(r.dimension, e);
    return new S.SpaceNode(t);
  }
});
B({
  type: "lap",
  names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0];
    return {
      type: "lap",
      mode: t.mode,
      alignment: a.slice(5),
      body: n
    };
  },
  htmlBuilder: (r, e) => {
    var t;
    r.alignment === "clap" ? (t = b.makeSpan([], [P(r.body, e)]), t = b.makeSpan(["inner"], [t], e)) : t = b.makeSpan(["inner"], [P(r.body, e)]);
    var a = b.makeSpan(["fix"], []), n = b.makeSpan([r.alignment], [t, a], e), s = b.makeSpan(["strut"]);
    return s.style.height = A(n.height + n.depth), n.depth && (s.style.verticalAlign = A(-n.depth)), n.children.unshift(s), n = b.makeSpan(["thinbox"], [n], e), b.makeSpan(["mord", "vbox"], [n], e);
  },
  mathmlBuilder: (r, e) => {
    var t = new S.MathNode("mpadded", [X(r.body, e)]);
    if (r.alignment !== "rlap") {
      var a = r.alignment === "llap" ? "-1" : "-0.5";
      t.setAttribute("lspace", a + "width");
    }
    return t.setAttribute("width", "0px"), t;
  }
});
B({
  type: "styling",
  names: ["\\(", "$"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !1
  },
  handler(r, e) {
    var {
      funcName: t,
      parser: a
    } = r, n = a.mode;
    a.switchMode("math");
    var s = t === "\\(" ? "\\)" : "$", o = a.parseExpression(!1, s);
    return a.expect(s), a.switchMode(n), {
      type: "styling",
      mode: a.mode,
      style: "text",
      body: o
    };
  }
});
B({
  type: "text",
  // Doesn't matter what this is.
  names: ["\\)", "\\]"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !1
  },
  handler(r, e) {
    throw new M("Mismatched " + r.funcName);
  }
});
var rr = (r, e) => {
  switch (e.style.size) {
    case R.DISPLAY.size:
      return r.display;
    case R.TEXT.size:
      return r.text;
    case R.SCRIPT.size:
      return r.script;
    case R.SCRIPTSCRIPT.size:
      return r.scriptscript;
    default:
      return r.text;
  }
};
B({
  type: "mathchoice",
  names: ["\\mathchoice"],
  props: {
    numArgs: 4,
    primitive: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r;
    return {
      type: "mathchoice",
      mode: t.mode,
      display: Q(e[0]),
      text: Q(e[1]),
      script: Q(e[2]),
      scriptscript: Q(e[3])
    };
  },
  htmlBuilder: (r, e) => {
    var t = rr(r, e), a = t0(t, e, !1);
    return b.makeFragment(a);
  },
  mathmlBuilder: (r, e) => {
    var t = rr(r, e);
    return G0(t, e);
  }
});
var _r = (r, e, t, a, n, s, o) => {
  r = b.makeSpan([], [r]);
  var h = t && I.isCharacterBox(t), c, p;
  if (e) {
    var g = P(e, a.havingStyle(n.sup()), a);
    p = {
      elem: g,
      kern: Math.max(a.fontMetrics().bigOpSpacing1, a.fontMetrics().bigOpSpacing3 - g.depth)
    };
  }
  if (t) {
    var y = P(t, a.havingStyle(n.sub()), a);
    c = {
      elem: y,
      kern: Math.max(a.fontMetrics().bigOpSpacing2, a.fontMetrics().bigOpSpacing4 - y.height)
    };
  }
  var w;
  if (p && c) {
    var x = a.fontMetrics().bigOpSpacing5 + c.elem.height + c.elem.depth + c.kern + r.depth + o;
    w = b.makeVList({
      positionType: "bottom",
      positionData: x,
      children: [{
        type: "kern",
        size: a.fontMetrics().bigOpSpacing5
      }, {
        type: "elem",
        elem: c.elem,
        marginLeft: A(-s)
      }, {
        type: "kern",
        size: c.kern
      }, {
        type: "elem",
        elem: r
      }, {
        type: "kern",
        size: p.kern
      }, {
        type: "elem",
        elem: p.elem,
        marginLeft: A(s)
      }, {
        type: "kern",
        size: a.fontMetrics().bigOpSpacing5
      }]
    }, a);
  } else if (c) {
    var z = r.height - o;
    w = b.makeVList({
      positionType: "top",
      positionData: z,
      children: [{
        type: "kern",
        size: a.fontMetrics().bigOpSpacing5
      }, {
        type: "elem",
        elem: c.elem,
        marginLeft: A(-s)
      }, {
        type: "kern",
        size: c.kern
      }, {
        type: "elem",
        elem: r
      }]
    }, a);
  } else if (p) {
    var T = r.depth + o;
    w = b.makeVList({
      positionType: "bottom",
      positionData: T,
      children: [{
        type: "elem",
        elem: r
      }, {
        type: "kern",
        size: p.kern
      }, {
        type: "elem",
        elem: p.elem,
        marginLeft: A(s)
      }, {
        type: "kern",
        size: a.fontMetrics().bigOpSpacing5
      }]
    }, a);
  } else
    return r;
  var C = [w];
  if (c && s !== 0 && !h) {
    var N = b.makeSpan(["mspace"], [], a);
    N.style.marginRight = A(s), C.unshift(N);
  }
  return b.makeSpan(["mop", "op-limits"], C, a);
}, ea = ["\\smallint"], re = (r, e) => {
  var t, a, n = !1, s;
  r.type === "supsub" ? (t = r.sup, a = r.sub, s = F(r.base, "op"), n = !0) : s = F(r, "op");
  var o = e.style, h = !1;
  o.size === R.DISPLAY.size && s.symbol && !I.contains(ea, s.name) && (h = !0);
  var c;
  if (s.symbol) {
    var p = h ? "Size2-Regular" : "Size1-Regular", g = "";
    if ((s.name === "\\oiint" || s.name === "\\oiiint") && (g = s.name.slice(1), s.name = g === "oiint" ? "\\iint" : "\\iiint"), c = b.makeSymbol(s.name, p, "math", e, ["mop", "op-symbol", h ? "large-op" : "small-op"]), g.length > 0) {
      var y = c.italic, w = b.staticSvg(g + "Size" + (h ? "2" : "1"), e);
      c = b.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: c,
          shift: 0
        }, {
          type: "elem",
          elem: w,
          shift: h ? 0.08 : 0
        }]
      }, e), s.name = "\\" + g, c.classes.unshift("mop"), c.italic = y;
    }
  } else if (s.body) {
    var x = t0(s.body, e, !0);
    x.length === 1 && x[0] instanceof f0 ? (c = x[0], c.classes[0] = "mop") : c = b.makeSpan(["mop"], x, e);
  } else {
    for (var z = [], T = 1; T < s.name.length; T++)
      z.push(b.mathsym(s.name[T], s.mode, e));
    c = b.makeSpan(["mop"], z, e);
  }
  var C = 0, N = 0;
  return (c instanceof f0 || s.name === "\\oiint" || s.name === "\\oiiint") && !s.suppressBaseShift && (C = (c.height - c.depth) / 2 - e.fontMetrics().axisHeight, N = c.italic), n ? _r(c, t, a, e, o, N, C) : (C && (c.style.position = "relative", c.style.top = A(C)), c);
}, ce = (r, e) => {
  var t;
  if (r.symbol)
    t = new c0("mo", [p0(r.name, r.mode)]), I.contains(ea, r.name) && t.setAttribute("largeop", "false");
  else if (r.body)
    t = new c0("mo", o0(r.body, e));
  else {
    t = new c0("mi", [new ie(r.name.slice(1))]);
    var a = new c0("mo", [p0("⁡", "text")]);
    r.parentIsSupSub ? t = new c0("mrow", [t, a]) : t = Br([t, a]);
  }
  return t;
}, $1 = {
  "∏": "\\prod",
  "∐": "\\coprod",
  "∑": "\\sum",
  "⋀": "\\bigwedge",
  "⋁": "\\bigvee",
  "⋂": "\\bigcap",
  "⋃": "\\bigcup",
  "⨀": "\\bigodot",
  "⨁": "\\bigoplus",
  "⨂": "\\bigotimes",
  "⨄": "\\biguplus",
  "⨆": "\\bigsqcup"
};
B({
  type: "op",
  names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "∏", "∐", "∑", "⋀", "⋁", "⋂", "⋃", "⨀", "⨁", "⨂", "⨄", "⨆"],
  props: {
    numArgs: 0
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = a;
    return n.length === 1 && (n = $1[n]), {
      type: "op",
      mode: t.mode,
      limits: !0,
      parentIsSupSub: !1,
      symbol: !0,
      name: n
    };
  },
  htmlBuilder: re,
  mathmlBuilder: ce
});
B({
  type: "op",
  names: ["\\mathop"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r, a = e[0];
    return {
      type: "op",
      mode: t.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      body: Q(a)
    };
  },
  htmlBuilder: re,
  mathmlBuilder: ce
});
var W1 = {
  "∫": "\\int",
  "∬": "\\iint",
  "∭": "\\iiint",
  "∮": "\\oint",
  "∯": "\\oiint",
  "∰": "\\oiiint"
};
B({
  type: "op",
  names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
  props: {
    numArgs: 0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t
    } = r;
    return {
      type: "op",
      mode: e.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      name: t
    };
  },
  htmlBuilder: re,
  mathmlBuilder: ce
});
B({
  type: "op",
  names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
  props: {
    numArgs: 0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t
    } = r;
    return {
      type: "op",
      mode: e.mode,
      limits: !0,
      parentIsSupSub: !1,
      symbol: !1,
      name: t
    };
  },
  htmlBuilder: re,
  mathmlBuilder: ce
});
B({
  type: "op",
  names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "∫", "∬", "∭", "∮", "∯", "∰"],
  props: {
    numArgs: 0
  },
  handler(r) {
    var {
      parser: e,
      funcName: t
    } = r, a = t;
    return a.length === 1 && (a = W1[a]), {
      type: "op",
      mode: e.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !0,
      name: a
    };
  },
  htmlBuilder: re,
  mathmlBuilder: ce
});
var ta = (r, e) => {
  var t, a, n = !1, s;
  r.type === "supsub" ? (t = r.sup, a = r.sub, s = F(r.base, "operatorname"), n = !0) : s = F(r, "operatorname");
  var o;
  if (s.body.length > 0) {
    for (var h = s.body.map((y) => {
      var w = y.text;
      return typeof w == "string" ? {
        type: "textord",
        mode: y.mode,
        text: w
      } : y;
    }), c = t0(h, e.withFont("mathrm"), !0), p = 0; p < c.length; p++) {
      var g = c[p];
      g instanceof f0 && (g.text = g.text.replace(/\u2212/, "-").replace(/\u2217/, "*"));
    }
    o = b.makeSpan(["mop"], c, e);
  } else
    o = b.makeSpan(["mop"], [], e);
  return n ? _r(o, t, a, e, e.style, 0, 0) : o;
}, j1 = (r, e) => {
  for (var t = o0(r.body, e.withFont("mathrm")), a = !0, n = 0; n < t.length; n++) {
    var s = t[n];
    if (!(s instanceof S.SpaceNode))
      if (s instanceof S.MathNode)
        switch (s.type) {
          case "mi":
          case "mn":
          case "ms":
          case "mspace":
          case "mtext":
            break;
          case "mo": {
            var o = s.children[0];
            s.children.length === 1 && o instanceof S.TextNode ? o.text = o.text.replace(/\u2212/, "-").replace(/\u2217/, "*") : a = !1;
            break;
          }
          default:
            a = !1;
        }
      else
        a = !1;
  }
  if (a) {
    var h = t.map((g) => g.toText()).join("");
    t = [new S.TextNode(h)];
  }
  var c = new S.MathNode("mi", t);
  c.setAttribute("mathvariant", "normal");
  var p = new S.MathNode("mo", [p0("⁡", "text")]);
  return r.parentIsSupSub ? new S.MathNode("mrow", [c, p]) : S.newDocumentFragment([c, p]);
};
B({
  type: "operatorname",
  names: ["\\operatorname@", "\\operatornamewithlimits"],
  props: {
    numArgs: 1
  },
  handler: (r, e) => {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0];
    return {
      type: "operatorname",
      mode: t.mode,
      body: Q(n),
      alwaysHandleSupSub: a === "\\operatornamewithlimits",
      limits: !1,
      parentIsSupSub: !1
    };
  },
  htmlBuilder: ta,
  mathmlBuilder: j1
});
m("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
$0({
  type: "ordgroup",
  htmlBuilder(r, e) {
    return r.semisimple ? b.makeFragment(t0(r.body, e, !1)) : b.makeSpan(["mord"], t0(r.body, e, !0), e);
  },
  mathmlBuilder(r, e) {
    return G0(r.body, e, !0);
  }
});
B({
  type: "overline",
  names: ["\\overline"],
  props: {
    numArgs: 1
  },
  handler(r, e) {
    var {
      parser: t
    } = r, a = e[0];
    return {
      type: "overline",
      mode: t.mode,
      body: a
    };
  },
  htmlBuilder(r, e) {
    var t = P(r.body, e.havingCrampedStyle()), a = b.makeLineSpan("overline-line", e), n = e.fontMetrics().defaultRuleThickness, s = b.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: t
      }, {
        type: "kern",
        size: 3 * n
      }, {
        type: "elem",
        elem: a
      }, {
        type: "kern",
        size: n
      }]
    }, e);
    return b.makeSpan(["mord", "overline"], [s], e);
  },
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mo", [new S.TextNode("‾")]);
    t.setAttribute("stretchy", "true");
    var a = new S.MathNode("mover", [X(r.body, e), t]);
    return a.setAttribute("accent", "true"), a;
  }
});
B({
  type: "phantom",
  names: ["\\phantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r, a = e[0];
    return {
      type: "phantom",
      mode: t.mode,
      body: Q(a)
    };
  },
  htmlBuilder: (r, e) => {
    var t = t0(r.body, e.withPhantom(), !1);
    return b.makeFragment(t);
  },
  mathmlBuilder: (r, e) => {
    var t = o0(r.body, e);
    return new S.MathNode("mphantom", t);
  }
});
B({
  type: "hphantom",
  names: ["\\hphantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r, a = e[0];
    return {
      type: "hphantom",
      mode: t.mode,
      body: a
    };
  },
  htmlBuilder: (r, e) => {
    var t = b.makeSpan([], [P(r.body, e.withPhantom())]);
    if (t.height = 0, t.depth = 0, t.children)
      for (var a = 0; a < t.children.length; a++)
        t.children[a].height = 0, t.children[a].depth = 0;
    return t = b.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: t
      }]
    }, e), b.makeSpan(["mord"], [t], e);
  },
  mathmlBuilder: (r, e) => {
    var t = o0(Q(r.body), e), a = new S.MathNode("mphantom", t), n = new S.MathNode("mpadded", [a]);
    return n.setAttribute("height", "0px"), n.setAttribute("depth", "0px"), n;
  }
});
B({
  type: "vphantom",
  names: ["\\vphantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      parser: t
    } = r, a = e[0];
    return {
      type: "vphantom",
      mode: t.mode,
      body: a
    };
  },
  htmlBuilder: (r, e) => {
    var t = b.makeSpan(["inner"], [P(r.body, e.withPhantom())]), a = b.makeSpan(["fix"], []);
    return b.makeSpan(["mord", "rlap"], [t, a], e);
  },
  mathmlBuilder: (r, e) => {
    var t = o0(Q(r.body), e), a = new S.MathNode("mphantom", t), n = new S.MathNode("mpadded", [a]);
    return n.setAttribute("width", "0px"), n;
  }
});
B({
  type: "raisebox",
  names: ["\\raisebox"],
  props: {
    numArgs: 2,
    argTypes: ["size", "hbox"],
    allowedInText: !0
  },
  handler(r, e) {
    var {
      parser: t
    } = r, a = F(e[0], "size").value, n = e[1];
    return {
      type: "raisebox",
      mode: t.mode,
      dy: a,
      body: n
    };
  },
  htmlBuilder(r, e) {
    var t = P(r.body, e), a = K(r.dy, e);
    return b.makeVList({
      positionType: "shift",
      positionData: -a,
      children: [{
        type: "elem",
        elem: t
      }]
    }, e);
  },
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mpadded", [X(r.body, e)]), a = r.dy.number + r.dy.unit;
    return t.setAttribute("voffset", a), t;
  }
});
B({
  type: "internal",
  names: ["\\relax"],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler(r) {
    var {
      parser: e
    } = r;
    return {
      type: "internal",
      mode: e.mode
    };
  }
});
B({
  type: "rule",
  names: ["\\rule"],
  props: {
    numArgs: 2,
    numOptionalArgs: 1,
    argTypes: ["size", "size", "size"]
  },
  handler(r, e, t) {
    var {
      parser: a
    } = r, n = t[0], s = F(e[0], "size"), o = F(e[1], "size");
    return {
      type: "rule",
      mode: a.mode,
      shift: n && F(n, "size").value,
      width: s.value,
      height: o.value
    };
  },
  htmlBuilder(r, e) {
    var t = b.makeSpan(["mord", "rule"], [], e), a = K(r.width, e), n = K(r.height, e), s = r.shift ? K(r.shift, e) : 0;
    return t.style.borderRightWidth = A(a), t.style.borderTopWidth = A(n), t.style.bottom = A(s), t.width = a, t.height = n + s, t.depth = -s, t.maxFontSize = n * 1.125 * e.sizeMultiplier, t;
  },
  mathmlBuilder(r, e) {
    var t = K(r.width, e), a = K(r.height, e), n = r.shift ? K(r.shift, e) : 0, s = e.color && e.getColor() || "black", o = new S.MathNode("mspace");
    o.setAttribute("mathbackground", s), o.setAttribute("width", A(t)), o.setAttribute("height", A(a));
    var h = new S.MathNode("mpadded", [o]);
    return n >= 0 ? h.setAttribute("height", A(n)) : (h.setAttribute("height", A(n)), h.setAttribute("depth", A(-n))), h.setAttribute("voffset", A(n)), h;
  }
});
function ra(r, e, t) {
  for (var a = t0(r, e, !1), n = e.sizeMultiplier / t.sizeMultiplier, s = 0; s < a.length; s++) {
    var o = a[s].classes.indexOf("sizing");
    o < 0 ? Array.prototype.push.apply(a[s].classes, e.sizingClasses(t)) : a[s].classes[o + 1] === "reset-size" + e.size && (a[s].classes[o + 1] = "reset-size" + t.size), a[s].height *= n, a[s].depth *= n;
  }
  return b.makeFragment(a);
}
var ar = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"], Z1 = (r, e) => {
  var t = e.havingSize(r.size);
  return ra(r.body, t, e);
};
B({
  type: "sizing",
  names: ar,
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler: (r, e) => {
    var {
      breakOnTokenText: t,
      funcName: a,
      parser: n
    } = r, s = n.parseExpression(!1, t);
    return {
      type: "sizing",
      mode: n.mode,
      // Figure out what size to use based on the list of functions above
      size: ar.indexOf(a) + 1,
      body: s
    };
  },
  htmlBuilder: Z1,
  mathmlBuilder: (r, e) => {
    var t = e.havingSize(r.size), a = o0(r.body, t), n = new S.MathNode("mstyle", a);
    return n.setAttribute("mathsize", A(t.sizeMultiplier)), n;
  }
});
B({
  type: "smash",
  names: ["\\smash"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1,
    allowedInText: !0
  },
  handler: (r, e, t) => {
    var {
      parser: a
    } = r, n = !1, s = !1, o = t[0] && F(t[0], "ordgroup");
    if (o)
      for (var h = "", c = 0; c < o.body.length; ++c) {
        var p = o.body[c];
        if (h = p.text, h === "t")
          n = !0;
        else if (h === "b")
          s = !0;
        else {
          n = !1, s = !1;
          break;
        }
      }
    else
      n = !0, s = !0;
    var g = e[0];
    return {
      type: "smash",
      mode: a.mode,
      body: g,
      smashHeight: n,
      smashDepth: s
    };
  },
  htmlBuilder: (r, e) => {
    var t = b.makeSpan([], [P(r.body, e)]);
    if (!r.smashHeight && !r.smashDepth)
      return t;
    if (r.smashHeight && (t.height = 0, t.children))
      for (var a = 0; a < t.children.length; a++)
        t.children[a].height = 0;
    if (r.smashDepth && (t.depth = 0, t.children))
      for (var n = 0; n < t.children.length; n++)
        t.children[n].depth = 0;
    var s = b.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: t
      }]
    }, e);
    return b.makeSpan(["mord"], [s], e);
  },
  mathmlBuilder: (r, e) => {
    var t = new S.MathNode("mpadded", [X(r.body, e)]);
    return r.smashHeight && t.setAttribute("height", "0px"), r.smashDepth && t.setAttribute("depth", "0px"), t;
  }
});
B({
  type: "sqrt",
  names: ["\\sqrt"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1
  },
  handler(r, e, t) {
    var {
      parser: a
    } = r, n = t[0], s = e[0];
    return {
      type: "sqrt",
      mode: a.mode,
      body: s,
      index: n
    };
  },
  htmlBuilder(r, e) {
    var t = P(r.body, e.havingCrampedStyle());
    t.height === 0 && (t.height = e.fontMetrics().xHeight), t = b.wrapFragment(t, e);
    var a = e.fontMetrics(), n = a.defaultRuleThickness, s = n;
    e.style.id < R.TEXT.id && (s = e.fontMetrics().xHeight);
    var o = n + s / 4, h = t.height + t.depth + o + n, {
      span: c,
      ruleWidth: p,
      advanceWidth: g
    } = B0.sqrtImage(h, e), y = c.height - p;
    y > t.height + t.depth + o && (o = (o + y - t.height - t.depth) / 2);
    var w = c.height - t.height - o - p;
    t.style.paddingLeft = A(g);
    var x = b.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: t,
        wrapperClasses: ["svg-align"]
      }, {
        type: "kern",
        size: -(t.height + w)
      }, {
        type: "elem",
        elem: c
      }, {
        type: "kern",
        size: p
      }]
    }, e);
    if (r.index) {
      var z = e.havingStyle(R.SCRIPTSCRIPT), T = P(r.index, z, e), C = 0.6 * (x.height - x.depth), N = b.makeVList({
        positionType: "shift",
        positionData: -C,
        children: [{
          type: "elem",
          elem: T
        }]
      }, e), O = b.makeSpan(["root"], [N]);
      return b.makeSpan(["mord", "sqrt"], [O, x], e);
    } else
      return b.makeSpan(["mord", "sqrt"], [x], e);
  },
  mathmlBuilder(r, e) {
    var {
      body: t,
      index: a
    } = r;
    return a ? new S.MathNode("mroot", [X(t, e), X(a, e)]) : new S.MathNode("msqrt", [X(t, e)]);
  }
});
var nr = {
  display: R.DISPLAY,
  text: R.TEXT,
  script: R.SCRIPT,
  scriptscript: R.SCRIPTSCRIPT
};
B({
  type: "styling",
  names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(r, e) {
    var {
      breakOnTokenText: t,
      funcName: a,
      parser: n
    } = r, s = n.parseExpression(!0, t), o = a.slice(1, a.length - 5);
    return {
      type: "styling",
      mode: n.mode,
      // Figure out what style to use by pulling out the style from
      // the function name
      style: o,
      body: s
    };
  },
  htmlBuilder(r, e) {
    var t = nr[r.style], a = e.havingStyle(t).withFont("");
    return ra(r.body, a, e);
  },
  mathmlBuilder(r, e) {
    var t = nr[r.style], a = e.havingStyle(t), n = o0(r.body, a), s = new S.MathNode("mstyle", n), o = {
      display: ["0", "true"],
      text: ["0", "false"],
      script: ["1", "false"],
      scriptscript: ["2", "false"]
    }, h = o[r.style];
    return s.setAttribute("scriptlevel", h[0]), s.setAttribute("displaystyle", h[1]), s;
  }
});
var K1 = function(e, t) {
  var a = e.base;
  if (a)
    if (a.type === "op") {
      var n = a.limits && (t.style.size === R.DISPLAY.size || a.alwaysHandleSupSub);
      return n ? re : null;
    } else if (a.type === "operatorname") {
      var s = a.alwaysHandleSupSub && (t.style.size === R.DISPLAY.size || a.limits);
      return s ? ta : null;
    } else {
      if (a.type === "accent")
        return I.isCharacterBox(a.base) ? xt : null;
      if (a.type === "horizBrace") {
        var o = !e.sub;
        return o === a.isOver ? Qr : null;
      } else
        return null;
    }
  else
    return null;
};
$0({
  type: "supsub",
  htmlBuilder(r, e) {
    var t = K1(r, e);
    if (t)
      return t(r, e);
    var {
      base: a,
      sup: n,
      sub: s
    } = r, o = P(a, e), h, c, p = e.fontMetrics(), g = 0, y = 0, w = a && I.isCharacterBox(a);
    if (n) {
      var x = e.havingStyle(e.style.sup());
      h = P(n, x, e), w || (g = o.height - x.fontMetrics().supDrop * x.sizeMultiplier / e.sizeMultiplier);
    }
    if (s) {
      var z = e.havingStyle(e.style.sub());
      c = P(s, z, e), w || (y = o.depth + z.fontMetrics().subDrop * z.sizeMultiplier / e.sizeMultiplier);
    }
    var T;
    e.style === R.DISPLAY ? T = p.sup1 : e.style.cramped ? T = p.sup3 : T = p.sup2;
    var C = e.sizeMultiplier, N = A(0.5 / p.ptPerEm / C), O = null;
    if (c) {
      var H = r.base && r.base.type === "op" && r.base.name && (r.base.name === "\\oiint" || r.base.name === "\\oiiint");
      (o instanceof f0 || H) && (O = A(-o.italic));
    }
    var V;
    if (h && c) {
      g = Math.max(g, T, h.depth + 0.25 * p.xHeight), y = Math.max(y, p.sub2);
      var L = p.defaultRuleThickness, U = 4 * L;
      if (g - h.depth - (c.height - y) < U) {
        y = U - (g - h.depth) + c.height;
        var G = 0.8 * p.xHeight - (g - h.depth);
        G > 0 && (g += G, y -= G);
      }
      var j = [{
        type: "elem",
        elem: c,
        shift: y,
        marginRight: N,
        marginLeft: O
      }, {
        type: "elem",
        elem: h,
        shift: -g,
        marginRight: N
      }];
      V = b.makeVList({
        positionType: "individualShift",
        children: j
      }, e);
    } else if (c) {
      y = Math.max(y, p.sub1, c.height - 0.8 * p.xHeight);
      var Y = [{
        type: "elem",
        elem: c,
        marginLeft: O,
        marginRight: N
      }];
      V = b.makeVList({
        positionType: "shift",
        positionData: y,
        children: Y
      }, e);
    } else if (h)
      g = Math.max(g, T, h.depth + 0.25 * p.xHeight), V = b.makeVList({
        positionType: "shift",
        positionData: -g,
        children: [{
          type: "elem",
          elem: h,
          marginRight: N
        }]
      }, e);
    else
      throw new Error("supsub must have either sup or sub.");
    var M0 = lt(o, "right") || "mord";
    return b.makeSpan([M0], [o, b.makeSpan(["msupsub"], [V])], e);
  },
  mathmlBuilder(r, e) {
    var t = !1, a, n;
    r.base && r.base.type === "horizBrace" && (n = !!r.sup, n === r.base.isOver && (t = !0, a = r.base.isOver)), r.base && (r.base.type === "op" || r.base.type === "operatorname") && (r.base.parentIsSupSub = !0);
    var s = [X(r.base, e)];
    r.sub && s.push(X(r.sub, e)), r.sup && s.push(X(r.sup, e));
    var o;
    if (t)
      o = a ? "mover" : "munder";
    else if (r.sub)
      if (r.sup) {
        var p = r.base;
        p && p.type === "op" && p.limits && e.style === R.DISPLAY || p && p.type === "operatorname" && p.alwaysHandleSupSub && (e.style === R.DISPLAY || p.limits) ? o = "munderover" : o = "msubsup";
      } else {
        var c = r.base;
        c && c.type === "op" && c.limits && (e.style === R.DISPLAY || c.alwaysHandleSupSub) || c && c.type === "operatorname" && c.alwaysHandleSupSub && (c.limits || e.style === R.DISPLAY) ? o = "munder" : o = "msub";
      }
    else {
      var h = r.base;
      h && h.type === "op" && h.limits && (e.style === R.DISPLAY || h.alwaysHandleSupSub) || h && h.type === "operatorname" && h.alwaysHandleSupSub && (h.limits || e.style === R.DISPLAY) ? o = "mover" : o = "msup";
    }
    return new S.MathNode(o, s);
  }
});
$0({
  type: "atom",
  htmlBuilder(r, e) {
    return b.mathsym(r.text, r.mode, e, ["m" + r.family]);
  },
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mo", [p0(r.text, r.mode)]);
    if (r.family === "bin") {
      var a = bt(r, e);
      a === "bold-italic" && t.setAttribute("mathvariant", a);
    } else
      r.family === "punct" ? t.setAttribute("separator", "true") : (r.family === "open" || r.family === "close") && t.setAttribute("stretchy", "false");
    return t;
  }
});
var aa = {
  mi: "italic",
  mn: "normal",
  mtext: "normal"
};
$0({
  type: "mathord",
  htmlBuilder(r, e) {
    return b.makeOrd(r, e, "mathord");
  },
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mi", [p0(r.text, r.mode, e)]), a = bt(r, e) || "italic";
    return a !== aa[t.type] && t.setAttribute("mathvariant", a), t;
  }
});
$0({
  type: "textord",
  htmlBuilder(r, e) {
    return b.makeOrd(r, e, "textord");
  },
  mathmlBuilder(r, e) {
    var t = p0(r.text, r.mode, e), a = bt(r, e) || "normal", n;
    return r.mode === "text" ? n = new S.MathNode("mtext", [t]) : /[0-9]/.test(r.text) ? n = new S.MathNode("mn", [t]) : r.text === "\\prime" ? n = new S.MathNode("mo", [t]) : n = new S.MathNode("mi", [t]), a !== aa[n.type] && n.setAttribute("mathvariant", a), n;
  }
});
var et = {
  "\\nobreak": "nobreak",
  "\\allowbreak": "allowbreak"
}, tt = {
  " ": {},
  "\\ ": {},
  "~": {
    className: "nobreak"
  },
  "\\space": {},
  "\\nobreakspace": {
    className: "nobreak"
  }
};
$0({
  type: "spacing",
  htmlBuilder(r, e) {
    if (tt.hasOwnProperty(r.text)) {
      var t = tt[r.text].className || "";
      if (r.mode === "text") {
        var a = b.makeOrd(r, e, "textord");
        return a.classes.push(t), a;
      } else
        return b.makeSpan(["mspace", t], [b.mathsym(r.text, r.mode, e)], e);
    } else {
      if (et.hasOwnProperty(r.text))
        return b.makeSpan(["mspace", et[r.text]], [], e);
      throw new M('Unknown type of space "' + r.text + '"');
    }
  },
  mathmlBuilder(r, e) {
    var t;
    if (tt.hasOwnProperty(r.text))
      t = new S.MathNode("mtext", [new S.TextNode(" ")]);
    else {
      if (et.hasOwnProperty(r.text))
        return new S.MathNode("mspace");
      throw new M('Unknown type of space "' + r.text + '"');
    }
    return t;
  }
});
var ir = () => {
  var r = new S.MathNode("mtd", []);
  return r.setAttribute("width", "50%"), r;
};
$0({
  type: "tag",
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mtable", [new S.MathNode("mtr", [ir(), new S.MathNode("mtd", [G0(r.body, e)]), ir(), new S.MathNode("mtd", [G0(r.tag, e)])])]);
    return t.setAttribute("width", "100%"), t;
  }
});
var sr = {
  "\\text": void 0,
  "\\textrm": "textrm",
  "\\textsf": "textsf",
  "\\texttt": "texttt",
  "\\textnormal": "textrm"
}, lr = {
  "\\textbf": "textbf",
  "\\textmd": "textmd"
}, J1 = {
  "\\textit": "textit",
  "\\textup": "textup"
}, or = (r, e) => {
  var t = r.font;
  return t ? sr[t] ? e.withTextFontFamily(sr[t]) : lr[t] ? e.withTextFontWeight(lr[t]) : e.withTextFontShape(J1[t]) : e;
};
B({
  type: "text",
  names: [
    // Font families
    "\\text",
    "\\textrm",
    "\\textsf",
    "\\texttt",
    "\\textnormal",
    // Font weights
    "\\textbf",
    "\\textmd",
    // Font Shapes
    "\\textit",
    "\\textup"
  ],
  props: {
    numArgs: 1,
    argTypes: ["text"],
    allowedInArgument: !0,
    allowedInText: !0
  },
  handler(r, e) {
    var {
      parser: t,
      funcName: a
    } = r, n = e[0];
    return {
      type: "text",
      mode: t.mode,
      body: Q(n),
      font: a
    };
  },
  htmlBuilder(r, e) {
    var t = or(r, e), a = t0(r.body, t, !0);
    return b.makeSpan(["mord", "text"], a, t);
  },
  mathmlBuilder(r, e) {
    var t = or(r, e);
    return G0(r.body, t);
  }
});
B({
  type: "underline",
  names: ["\\underline"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "underline",
      mode: t.mode,
      body: e[0]
    };
  },
  htmlBuilder(r, e) {
    var t = P(r.body, e), a = b.makeLineSpan("underline-line", e), n = e.fontMetrics().defaultRuleThickness, s = b.makeVList({
      positionType: "top",
      positionData: t.height,
      children: [{
        type: "kern",
        size: n
      }, {
        type: "elem",
        elem: a
      }, {
        type: "kern",
        size: 3 * n
      }, {
        type: "elem",
        elem: t
      }]
    }, e);
    return b.makeSpan(["mord", "underline"], [s], e);
  },
  mathmlBuilder(r, e) {
    var t = new S.MathNode("mo", [new S.TextNode("‾")]);
    t.setAttribute("stretchy", "true");
    var a = new S.MathNode("munder", [X(r.body, e), t]);
    return a.setAttribute("accentunder", "true"), a;
  }
});
B({
  type: "vcenter",
  names: ["\\vcenter"],
  props: {
    numArgs: 1,
    argTypes: ["original"],
    // In LaTeX, \vcenter can act only on a box.
    allowedInText: !1
  },
  handler(r, e) {
    var {
      parser: t
    } = r;
    return {
      type: "vcenter",
      mode: t.mode,
      body: e[0]
    };
  },
  htmlBuilder(r, e) {
    var t = P(r.body, e), a = e.fontMetrics().axisHeight, n = 0.5 * (t.height - a - (t.depth + a));
    return b.makeVList({
      positionType: "shift",
      positionData: n,
      children: [{
        type: "elem",
        elem: t
      }]
    }, e);
  },
  mathmlBuilder(r, e) {
    return new S.MathNode("mpadded", [X(r.body, e)], ["vcenter"]);
  }
});
B({
  type: "verb",
  names: ["\\verb"],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler(r, e, t) {
    throw new M("\\verb ended by end of line instead of matching delimiter");
  },
  htmlBuilder(r, e) {
    for (var t = ur(r), a = [], n = e.havingStyle(e.style.text()), s = 0; s < t.length; s++) {
      var o = t[s];
      o === "~" && (o = "\\textasciitilde"), a.push(b.makeSymbol(o, "Typewriter-Regular", r.mode, n, ["mord", "texttt"]));
    }
    return b.makeSpan(["mord", "text"].concat(n.sizingClasses(e)), b.tryCombineChars(a), n);
  },
  mathmlBuilder(r, e) {
    var t = new S.TextNode(ur(r)), a = new S.MathNode("mtext", [t]);
    return a.setAttribute("mathvariant", "monospace"), a;
  }
});
var ur = (r) => r.body.replace(/ /g, r.star ? "␣" : " "), F0 = Ar, na = `[ \r
	]`, Q1 = "\\\\[a-zA-Z@]+", _1 = "\\\\[^\uD800-\uDFFF]", e4 = "(" + Q1 + ")" + na + "*", t4 = `\\\\(
|[ \r	]+
?)[ \r	]*`, mt = "[̀-ͯ]", r4 = new RegExp(mt + "+$"), a4 = "(" + na + "+)|" + // whitespace
(t4 + "|") + // \whitespace
"([!-\\[\\]-‧‪-퟿豈-￿]" + // single codepoint
(mt + "*") + // ...plus accents
"|[\uD800-\uDBFF][\uDC00-\uDFFF]" + // surrogate pair
(mt + "*") + // ...plus accents
"|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + // \verb unstarred
("|" + e4) + // \macroName + spaces
("|" + _1 + ")");
class hr {
  // Category codes. The lexer only supports comment characters (14) for now.
  // MacroExpander additionally distinguishes active (13).
  constructor(e, t) {
    this.input = void 0, this.settings = void 0, this.tokenRegex = void 0, this.catcodes = void 0, this.input = e, this.settings = t, this.tokenRegex = new RegExp(a4, "g"), this.catcodes = {
      "%": 14,
      // comment character
      "~": 13
      // active character
    };
  }
  setCatcode(e, t) {
    this.catcodes[e] = t;
  }
  /**
   * This function lexes a single token.
   */
  lex() {
    var e = this.input, t = this.tokenRegex.lastIndex;
    if (t === e.length)
      return new x0("EOF", new u0(this, t, t));
    var a = this.tokenRegex.exec(e);
    if (a === null || a.index !== t)
      throw new M("Unexpected character: '" + e[t] + "'", new x0(e[t], new u0(this, t, t + 1)));
    var n = a[6] || a[3] || (a[2] ? "\\ " : " ");
    if (this.catcodes[n] === 14) {
      var s = e.indexOf(`
`, this.tokenRegex.lastIndex);
      return s === -1 ? (this.tokenRegex.lastIndex = e.length, this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")) : this.tokenRegex.lastIndex = s + 1, this.lex();
    }
    return new x0(n, new u0(this, t, this.tokenRegex.lastIndex));
  }
}
class n4 {
  /**
   * Both arguments are optional.  The first argument is an object of
   * built-in mappings which never change.  The second argument is an object
   * of initial (global-level) mappings, which will constantly change
   * according to any global/top-level `set`s done.
   */
  constructor(e, t) {
    e === void 0 && (e = {}), t === void 0 && (t = {}), this.current = void 0, this.builtins = void 0, this.undefStack = void 0, this.current = t, this.builtins = e, this.undefStack = [];
  }
  /**
   * Start a new nested group, affecting future local `set`s.
   */
  beginGroup() {
    this.undefStack.push({});
  }
  /**
   * End current nested group, restoring values before the group began.
   */
  endGroup() {
    if (this.undefStack.length === 0)
      throw new M("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
    var e = this.undefStack.pop();
    for (var t in e)
      e.hasOwnProperty(t) && (e[t] == null ? delete this.current[t] : this.current[t] = e[t]);
  }
  /**
   * Ends all currently nested groups (if any), restoring values before the
   * groups began.  Useful in case of an error in the middle of parsing.
   */
  endGroups() {
    for (; this.undefStack.length > 0; )
      this.endGroup();
  }
  /**
   * Detect whether `name` has a definition.  Equivalent to
   * `get(name) != null`.
   */
  has(e) {
    return this.current.hasOwnProperty(e) || this.builtins.hasOwnProperty(e);
  }
  /**
   * Get the current value of a name, or `undefined` if there is no value.
   *
   * Note: Do not use `if (namespace.get(...))` to detect whether a macro
   * is defined, as the definition may be the empty string which evaluates
   * to `false` in JavaScript.  Use `if (namespace.get(...) != null)` or
   * `if (namespace.has(...))`.
   */
  get(e) {
    return this.current.hasOwnProperty(e) ? this.current[e] : this.builtins[e];
  }
  /**
   * Set the current value of a name, and optionally set it globally too.
   * Local set() sets the current value and (when appropriate) adds an undo
   * operation to the undo stack.  Global set() may change the undo
   * operation at every level, so takes time linear in their number.
   * A value of undefined means to delete existing definitions.
   */
  set(e, t, a) {
    if (a === void 0 && (a = !1), a) {
      for (var n = 0; n < this.undefStack.length; n++)
        delete this.undefStack[n][e];
      this.undefStack.length > 0 && (this.undefStack[this.undefStack.length - 1][e] = t);
    } else {
      var s = this.undefStack[this.undefStack.length - 1];
      s && !s.hasOwnProperty(e) && (s[e] = this.current[e]);
    }
    t == null ? delete this.current[e] : this.current[e] = t;
  }
}
var i4 = Wr;
m("\\noexpand", function(r) {
  var e = r.popToken();
  return r.isExpandable(e.text) && (e.noexpand = !0, e.treatAsRelax = !0), {
    tokens: [e],
    numArgs: 0
  };
});
m("\\expandafter", function(r) {
  var e = r.popToken();
  return r.expandOnce(!0), {
    tokens: [e],
    numArgs: 0
  };
});
m("\\@firstoftwo", function(r) {
  var e = r.consumeArgs(2);
  return {
    tokens: e[0],
    numArgs: 0
  };
});
m("\\@secondoftwo", function(r) {
  var e = r.consumeArgs(2);
  return {
    tokens: e[1],
    numArgs: 0
  };
});
m("\\@ifnextchar", function(r) {
  var e = r.consumeArgs(3);
  r.consumeSpaces();
  var t = r.future();
  return e[0].length === 1 && e[0][0].text === t.text ? {
    tokens: e[1],
    numArgs: 0
  } : {
    tokens: e[2],
    numArgs: 0
  };
});
m("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
m("\\TextOrMath", function(r) {
  var e = r.consumeArgs(2);
  return r.mode === "text" ? {
    tokens: e[0],
    numArgs: 0
  } : {
    tokens: e[1],
    numArgs: 0
  };
});
var mr = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};
m("\\char", function(r) {
  var e = r.popToken(), t, a = "";
  if (e.text === "'")
    t = 8, e = r.popToken();
  else if (e.text === '"')
    t = 16, e = r.popToken();
  else if (e.text === "`")
    if (e = r.popToken(), e.text[0] === "\\")
      a = e.text.charCodeAt(1);
    else {
      if (e.text === "EOF")
        throw new M("\\char` missing argument");
      a = e.text.charCodeAt(0);
    }
  else
    t = 10;
  if (t) {
    if (a = mr[e.text], a == null || a >= t)
      throw new M("Invalid base-" + t + " digit " + e.text);
    for (var n; (n = mr[r.future().text]) != null && n < t; )
      a *= t, a += n, r.popToken();
  }
  return "\\@char{" + a + "}";
});
var Bt = (r, e, t) => {
  var a = r.consumeArg().tokens;
  if (a.length !== 1)
    throw new M("\\newcommand's first argument must be a macro name");
  var n = a[0].text, s = r.isDefined(n);
  if (s && !e)
    throw new M("\\newcommand{" + n + "} attempting to redefine " + (n + "; use \\renewcommand"));
  if (!s && !t)
    throw new M("\\renewcommand{" + n + "} when command " + n + " does not yet exist; use \\newcommand");
  var o = 0;
  if (a = r.consumeArg().tokens, a.length === 1 && a[0].text === "[") {
    for (var h = "", c = r.expandNextToken(); c.text !== "]" && c.text !== "EOF"; )
      h += c.text, c = r.expandNextToken();
    if (!h.match(/^\s*[0-9]+\s*$/))
      throw new M("Invalid number of arguments: " + h);
    o = parseInt(h), a = r.consumeArg().tokens;
  }
  return r.macros.set(n, {
    tokens: a,
    numArgs: o
  }), "";
};
m("\\newcommand", (r) => Bt(r, !1, !0));
m("\\renewcommand", (r) => Bt(r, !0, !1));
m("\\providecommand", (r) => Bt(r, !0, !0));
m("\\message", (r) => {
  var e = r.consumeArgs(1)[0];
  return console.log(e.reverse().map((t) => t.text).join("")), "";
});
m("\\errmessage", (r) => {
  var e = r.consumeArgs(1)[0];
  return console.error(e.reverse().map((t) => t.text).join("")), "";
});
m("\\show", (r) => {
  var e = r.popToken(), t = e.text;
  return console.log(e, r.macros.get(t), F0[t], $.math[t], $.text[t]), "";
});
m("\\bgroup", "{");
m("\\egroup", "}");
m("~", "\\nobreakspace");
m("\\lq", "`");
m("\\rq", "'");
m("\\aa", "\\r a");
m("\\AA", "\\r A");
m("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`©}");
m("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
m("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}");
m("ℬ", "\\mathscr{B}");
m("ℰ", "\\mathscr{E}");
m("ℱ", "\\mathscr{F}");
m("ℋ", "\\mathscr{H}");
m("ℐ", "\\mathscr{I}");
m("ℒ", "\\mathscr{L}");
m("ℳ", "\\mathscr{M}");
m("ℛ", "\\mathscr{R}");
m("ℭ", "\\mathfrak{C}");
m("ℌ", "\\mathfrak{H}");
m("ℨ", "\\mathfrak{Z}");
m("\\Bbbk", "\\Bbb{k}");
m("·", "\\cdotp");
m("\\llap", "\\mathllap{\\textrm{#1}}");
m("\\rlap", "\\mathrlap{\\textrm{#1}}");
m("\\clap", "\\mathclap{\\textrm{#1}}");
m("\\mathstrut", "\\vphantom{(}");
m("\\underbar", "\\underline{\\text{#1}}");
m("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}}{\\char"338}');
m("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");
m("\\ne", "\\neq");
m("≠", "\\neq");
m("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}");
m("∉", "\\notin");
m("≘", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}");
m("≙", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");
m("≚", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");
m("≛", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");
m("≝", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}");
m("≞", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");
m("≟", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");
m("⟂", "\\perp");
m("‼", "\\mathclose{!\\mkern-0.8mu!}");
m("∌", "\\notni");
m("⌜", "\\ulcorner");
m("⌝", "\\urcorner");
m("⌞", "\\llcorner");
m("⌟", "\\lrcorner");
m("©", "\\copyright");
m("®", "\\textregistered");
m("️", "\\textregistered");
m("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');
m("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');
m("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');
m("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');
m("\\vdots", "\\mathord{\\varvdots\\rule{0pt}{15pt}}");
m("⋮", "\\vdots");
m("\\varGamma", "\\mathit{\\Gamma}");
m("\\varDelta", "\\mathit{\\Delta}");
m("\\varTheta", "\\mathit{\\Theta}");
m("\\varLambda", "\\mathit{\\Lambda}");
m("\\varXi", "\\mathit{\\Xi}");
m("\\varPi", "\\mathit{\\Pi}");
m("\\varSigma", "\\mathit{\\Sigma}");
m("\\varUpsilon", "\\mathit{\\Upsilon}");
m("\\varPhi", "\\mathit{\\Phi}");
m("\\varPsi", "\\mathit{\\Psi}");
m("\\varOmega", "\\mathit{\\Omega}");
m("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
m("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");
m("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
m("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
m("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
m("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
var cr = {
  ",": "\\dotsc",
  "\\not": "\\dotsb",
  // \keybin@ checks for the following:
  "+": "\\dotsb",
  "=": "\\dotsb",
  "<": "\\dotsb",
  ">": "\\dotsb",
  "-": "\\dotsb",
  "*": "\\dotsb",
  ":": "\\dotsb",
  // Symbols whose definition starts with \DOTSB:
  "\\DOTSB": "\\dotsb",
  "\\coprod": "\\dotsb",
  "\\bigvee": "\\dotsb",
  "\\bigwedge": "\\dotsb",
  "\\biguplus": "\\dotsb",
  "\\bigcap": "\\dotsb",
  "\\bigcup": "\\dotsb",
  "\\prod": "\\dotsb",
  "\\sum": "\\dotsb",
  "\\bigotimes": "\\dotsb",
  "\\bigoplus": "\\dotsb",
  "\\bigodot": "\\dotsb",
  "\\bigsqcup": "\\dotsb",
  "\\And": "\\dotsb",
  "\\longrightarrow": "\\dotsb",
  "\\Longrightarrow": "\\dotsb",
  "\\longleftarrow": "\\dotsb",
  "\\Longleftarrow": "\\dotsb",
  "\\longleftrightarrow": "\\dotsb",
  "\\Longleftrightarrow": "\\dotsb",
  "\\mapsto": "\\dotsb",
  "\\longmapsto": "\\dotsb",
  "\\hookrightarrow": "\\dotsb",
  "\\doteq": "\\dotsb",
  // Symbols whose definition starts with \mathbin:
  "\\mathbin": "\\dotsb",
  // Symbols whose definition starts with \mathrel:
  "\\mathrel": "\\dotsb",
  "\\relbar": "\\dotsb",
  "\\Relbar": "\\dotsb",
  "\\xrightarrow": "\\dotsb",
  "\\xleftarrow": "\\dotsb",
  // Symbols whose definition starts with \DOTSI:
  "\\DOTSI": "\\dotsi",
  "\\int": "\\dotsi",
  "\\oint": "\\dotsi",
  "\\iint": "\\dotsi",
  "\\iiint": "\\dotsi",
  "\\iiiint": "\\dotsi",
  "\\idotsint": "\\dotsi",
  // Symbols whose definition starts with \DOTSX:
  "\\DOTSX": "\\dotsx"
};
m("\\dots", function(r) {
  var e = "\\dotso", t = r.expandAfterFuture().text;
  return t in cr ? e = cr[t] : (t.slice(0, 4) === "\\not" || t in $.math && I.contains(["bin", "rel"], $.math[t].group)) && (e = "\\dotsb"), e;
});
var Dt = {
  // \rightdelim@ checks for the following:
  ")": !0,
  "]": !0,
  "\\rbrack": !0,
  "\\}": !0,
  "\\rbrace": !0,
  "\\rangle": !0,
  "\\rceil": !0,
  "\\rfloor": !0,
  "\\rgroup": !0,
  "\\rmoustache": !0,
  "\\right": !0,
  "\\bigr": !0,
  "\\biggr": !0,
  "\\Bigr": !0,
  "\\Biggr": !0,
  // \extra@ also tests for the following:
  $: !0,
  // \extrap@ checks for the following:
  ";": !0,
  ".": !0,
  ",": !0
};
m("\\dotso", function(r) {
  var e = r.future().text;
  return e in Dt ? "\\ldots\\," : "\\ldots";
});
m("\\dotsc", function(r) {
  var e = r.future().text;
  return e in Dt && e !== "," ? "\\ldots\\," : "\\ldots";
});
m("\\cdots", function(r) {
  var e = r.future().text;
  return e in Dt ? "\\@cdots\\," : "\\@cdots";
});
m("\\dotsb", "\\cdots");
m("\\dotsm", "\\cdots");
m("\\dotsi", "\\!\\cdots");
m("\\dotsx", "\\ldots\\,");
m("\\DOTSI", "\\relax");
m("\\DOTSB", "\\relax");
m("\\DOTSX", "\\relax");
m("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
m("\\,", "\\tmspace+{3mu}{.1667em}");
m("\\thinspace", "\\,");
m("\\>", "\\mskip{4mu}");
m("\\:", "\\tmspace+{4mu}{.2222em}");
m("\\medspace", "\\:");
m("\\;", "\\tmspace+{5mu}{.2777em}");
m("\\thickspace", "\\;");
m("\\!", "\\tmspace-{3mu}{.1667em}");
m("\\negthinspace", "\\!");
m("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
m("\\negthickspace", "\\tmspace-{5mu}{.277em}");
m("\\enspace", "\\kern.5em ");
m("\\enskip", "\\hskip.5em\\relax");
m("\\quad", "\\hskip1em\\relax");
m("\\qquad", "\\hskip2em\\relax");
m("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
m("\\tag@paren", "\\tag@literal{({#1})}");
m("\\tag@literal", (r) => {
  if (r.macros.get("\\df@tag"))
    throw new M("Multiple \\tag");
  return "\\gdef\\df@tag{\\text{#1}}";
});
m("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");
m("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");
m("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
m("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");
m("\\newline", "\\\\\\relax");
m("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
var ia = A(y0["Main-Regular"]["T".charCodeAt(0)][1] - 0.7 * y0["Main-Regular"]["A".charCodeAt(0)][1]);
m("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + ia + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}");
m("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + ia + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}");
m("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
m("\\@hspace", "\\hskip #1\\relax");
m("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
m("\\ordinarycolon", ":");
m("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
m("\\dblcolon", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}');
m("\\coloneqq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}');
m("\\Coloneqq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}');
m("\\coloneq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}');
m("\\Coloneq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}');
m("\\eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}');
m("\\Eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}');
m("\\eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}');
m("\\Eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}');
m("\\colonapprox", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}');
m("\\Colonapprox", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}');
m("\\colonsim", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}');
m("\\Colonsim", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}');
m("∷", "\\dblcolon");
m("∹", "\\eqcolon");
m("≔", "\\coloneqq");
m("≕", "\\eqqcolon");
m("⩴", "\\Coloneqq");
m("\\ratio", "\\vcentcolon");
m("\\coloncolon", "\\dblcolon");
m("\\colonequals", "\\coloneqq");
m("\\coloncolonequals", "\\Coloneqq");
m("\\equalscolon", "\\eqqcolon");
m("\\equalscoloncolon", "\\Eqqcolon");
m("\\colonminus", "\\coloneq");
m("\\coloncolonminus", "\\Coloneq");
m("\\minuscolon", "\\eqcolon");
m("\\minuscoloncolon", "\\Eqcolon");
m("\\coloncolonapprox", "\\Colonapprox");
m("\\coloncolonsim", "\\Colonsim");
m("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
m("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
m("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
m("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");
m("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");
m("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
m("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
m("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
m("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
m("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
m("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
m("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
m("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
m("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{≩}");
m("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{≨}");
m("\\ngeqq", "\\html@mathml{\\@ngeqq}{≱}");
m("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{≱}");
m("\\nleqq", "\\html@mathml{\\@nleqq}{≰}");
m("\\nleqslant", "\\html@mathml{\\@nleqslant}{≰}");
m("\\nshortmid", "\\html@mathml{\\@nshortmid}{∤}");
m("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{∦}");
m("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{⊈}");
m("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{⊉}");
m("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{⊊}");
m("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{⫋}");
m("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{⊋}");
m("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{⫌}");
m("\\imath", "\\html@mathml{\\@imath}{ı}");
m("\\jmath", "\\html@mathml{\\@jmath}{ȷ}");
m("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}");
m("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}");
m("⟦", "\\llbracket");
m("⟧", "\\rrbracket");
m("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}");
m("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}");
m("⦃", "\\lBrace");
m("⦄", "\\rBrace");
m("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}");
m("⦵", "\\minuso");
m("\\darr", "\\downarrow");
m("\\dArr", "\\Downarrow");
m("\\Darr", "\\Downarrow");
m("\\lang", "\\langle");
m("\\rang", "\\rangle");
m("\\uarr", "\\uparrow");
m("\\uArr", "\\Uparrow");
m("\\Uarr", "\\Uparrow");
m("\\N", "\\mathbb{N}");
m("\\R", "\\mathbb{R}");
m("\\Z", "\\mathbb{Z}");
m("\\alef", "\\aleph");
m("\\alefsym", "\\aleph");
m("\\Alpha", "\\mathrm{A}");
m("\\Beta", "\\mathrm{B}");
m("\\bull", "\\bullet");
m("\\Chi", "\\mathrm{X}");
m("\\clubs", "\\clubsuit");
m("\\cnums", "\\mathbb{C}");
m("\\Complex", "\\mathbb{C}");
m("\\Dagger", "\\ddagger");
m("\\diamonds", "\\diamondsuit");
m("\\empty", "\\emptyset");
m("\\Epsilon", "\\mathrm{E}");
m("\\Eta", "\\mathrm{H}");
m("\\exist", "\\exists");
m("\\harr", "\\leftrightarrow");
m("\\hArr", "\\Leftrightarrow");
m("\\Harr", "\\Leftrightarrow");
m("\\hearts", "\\heartsuit");
m("\\image", "\\Im");
m("\\infin", "\\infty");
m("\\Iota", "\\mathrm{I}");
m("\\isin", "\\in");
m("\\Kappa", "\\mathrm{K}");
m("\\larr", "\\leftarrow");
m("\\lArr", "\\Leftarrow");
m("\\Larr", "\\Leftarrow");
m("\\lrarr", "\\leftrightarrow");
m("\\lrArr", "\\Leftrightarrow");
m("\\Lrarr", "\\Leftrightarrow");
m("\\Mu", "\\mathrm{M}");
m("\\natnums", "\\mathbb{N}");
m("\\Nu", "\\mathrm{N}");
m("\\Omicron", "\\mathrm{O}");
m("\\plusmn", "\\pm");
m("\\rarr", "\\rightarrow");
m("\\rArr", "\\Rightarrow");
m("\\Rarr", "\\Rightarrow");
m("\\real", "\\Re");
m("\\reals", "\\mathbb{R}");
m("\\Reals", "\\mathbb{R}");
m("\\Rho", "\\mathrm{P}");
m("\\sdot", "\\cdot");
m("\\sect", "\\S");
m("\\spades", "\\spadesuit");
m("\\sub", "\\subset");
m("\\sube", "\\subseteq");
m("\\supe", "\\supseteq");
m("\\Tau", "\\mathrm{T}");
m("\\thetasym", "\\vartheta");
m("\\weierp", "\\wp");
m("\\Zeta", "\\mathrm{Z}");
m("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
m("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
m("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
m("\\bra", "\\mathinner{\\langle{#1}|}");
m("\\ket", "\\mathinner{|{#1}\\rangle}");
m("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
m("\\Bra", "\\left\\langle#1\\right|");
m("\\Ket", "\\left|#1\\right\\rangle");
var sa = (r) => (e) => {
  var t = e.consumeArg().tokens, a = e.consumeArg().tokens, n = e.consumeArg().tokens, s = e.consumeArg().tokens, o = e.macros.get("|"), h = e.macros.get("\\|");
  e.macros.beginGroup();
  var c = (y) => (w) => {
    r && (w.macros.set("|", o), n.length && w.macros.set("\\|", h));
    var x = y;
    if (!y && n.length) {
      var z = w.future();
      z.text === "|" && (w.popToken(), x = !0);
    }
    return {
      tokens: x ? n : a,
      numArgs: 0
    };
  };
  e.macros.set("|", c(!1)), n.length && e.macros.set("\\|", c(!0));
  var p = e.consumeArg().tokens, g = e.expandTokens([
    ...s,
    ...p,
    ...t
    // reversed
  ]);
  return e.macros.endGroup(), {
    tokens: g.reverse(),
    numArgs: 0
  };
};
m("\\bra@ket", sa(!1));
m("\\bra@set", sa(!0));
m("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");
m("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");
m("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
m("\\angln", "{\\angl n}");
m("\\blue", "\\textcolor{##6495ed}{#1}");
m("\\orange", "\\textcolor{##ffa500}{#1}");
m("\\pink", "\\textcolor{##ff00af}{#1}");
m("\\red", "\\textcolor{##df0030}{#1}");
m("\\green", "\\textcolor{##28ae7b}{#1}");
m("\\gray", "\\textcolor{gray}{#1}");
m("\\purple", "\\textcolor{##9d38bd}{#1}");
m("\\blueA", "\\textcolor{##ccfaff}{#1}");
m("\\blueB", "\\textcolor{##80f6ff}{#1}");
m("\\blueC", "\\textcolor{##63d9ea}{#1}");
m("\\blueD", "\\textcolor{##11accd}{#1}");
m("\\blueE", "\\textcolor{##0c7f99}{#1}");
m("\\tealA", "\\textcolor{##94fff5}{#1}");
m("\\tealB", "\\textcolor{##26edd5}{#1}");
m("\\tealC", "\\textcolor{##01d1c1}{#1}");
m("\\tealD", "\\textcolor{##01a995}{#1}");
m("\\tealE", "\\textcolor{##208170}{#1}");
m("\\greenA", "\\textcolor{##b6ffb0}{#1}");
m("\\greenB", "\\textcolor{##8af281}{#1}");
m("\\greenC", "\\textcolor{##74cf70}{#1}");
m("\\greenD", "\\textcolor{##1fab54}{#1}");
m("\\greenE", "\\textcolor{##0d923f}{#1}");
m("\\goldA", "\\textcolor{##ffd0a9}{#1}");
m("\\goldB", "\\textcolor{##ffbb71}{#1}");
m("\\goldC", "\\textcolor{##ff9c39}{#1}");
m("\\goldD", "\\textcolor{##e07d10}{#1}");
m("\\goldE", "\\textcolor{##a75a05}{#1}");
m("\\redA", "\\textcolor{##fca9a9}{#1}");
m("\\redB", "\\textcolor{##ff8482}{#1}");
m("\\redC", "\\textcolor{##f9685d}{#1}");
m("\\redD", "\\textcolor{##e84d39}{#1}");
m("\\redE", "\\textcolor{##bc2612}{#1}");
m("\\maroonA", "\\textcolor{##ffbde0}{#1}");
m("\\maroonB", "\\textcolor{##ff92c6}{#1}");
m("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
m("\\maroonD", "\\textcolor{##ca337c}{#1}");
m("\\maroonE", "\\textcolor{##9e034e}{#1}");
m("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
m("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
m("\\purpleC", "\\textcolor{##aa87ff}{#1}");
m("\\purpleD", "\\textcolor{##7854ab}{#1}");
m("\\purpleE", "\\textcolor{##543b78}{#1}");
m("\\mintA", "\\textcolor{##f5f9e8}{#1}");
m("\\mintB", "\\textcolor{##edf2df}{#1}");
m("\\mintC", "\\textcolor{##e0e5cc}{#1}");
m("\\grayA", "\\textcolor{##f6f7f7}{#1}");
m("\\grayB", "\\textcolor{##f0f1f2}{#1}");
m("\\grayC", "\\textcolor{##e3e5e6}{#1}");
m("\\grayD", "\\textcolor{##d6d8da}{#1}");
m("\\grayE", "\\textcolor{##babec2}{#1}");
m("\\grayF", "\\textcolor{##888d93}{#1}");
m("\\grayG", "\\textcolor{##626569}{#1}");
m("\\grayH", "\\textcolor{##3b3e40}{#1}");
m("\\grayI", "\\textcolor{##21242c}{#1}");
m("\\kaBlue", "\\textcolor{##314453}{#1}");
m("\\kaGreen", "\\textcolor{##71B307}{#1}");
var la = {
  "^": !0,
  // Parser.js
  _: !0,
  // Parser.js
  "\\limits": !0,
  // Parser.js
  "\\nolimits": !0
  // Parser.js
};
class s4 {
  constructor(e, t, a) {
    this.settings = void 0, this.expansionCount = void 0, this.lexer = void 0, this.macros = void 0, this.stack = void 0, this.mode = void 0, this.settings = t, this.expansionCount = 0, this.feed(e), this.macros = new n4(i4, t.macros), this.mode = a, this.stack = [];
  }
  /**
   * Feed a new input string to the same MacroExpander
   * (with existing macros etc.).
   */
  feed(e) {
    this.lexer = new hr(e, this.settings);
  }
  /**
   * Switches between "text" and "math" modes.
   */
  switchMode(e) {
    this.mode = e;
  }
  /**
   * Start a new group nesting within all namespaces.
   */
  beginGroup() {
    this.macros.beginGroup();
  }
  /**
   * End current group nesting within all namespaces.
   */
  endGroup() {
    this.macros.endGroup();
  }
  /**
   * Ends all currently nested groups (if any), restoring values before the
   * groups began.  Useful in case of an error in the middle of parsing.
   */
  endGroups() {
    this.macros.endGroups();
  }
  /**
   * Returns the topmost token on the stack, without expanding it.
   * Similar in behavior to TeX's `\futurelet`.
   */
  future() {
    return this.stack.length === 0 && this.pushToken(this.lexer.lex()), this.stack[this.stack.length - 1];
  }
  /**
   * Remove and return the next unexpanded token.
   */
  popToken() {
    return this.future(), this.stack.pop();
  }
  /**
   * Add a given token to the token stack.  In particular, this get be used
   * to put back a token returned from one of the other methods.
   */
  pushToken(e) {
    this.stack.push(e);
  }
  /**
   * Append an array of tokens to the token stack.
   */
  pushTokens(e) {
    this.stack.push(...e);
  }
  /**
   * Find an macro argument without expanding tokens and append the array of
   * tokens to the token stack. Uses Token as a container for the result.
   */
  scanArgument(e) {
    var t, a, n;
    if (e) {
      if (this.consumeSpaces(), this.future().text !== "[")
        return null;
      t = this.popToken(), {
        tokens: n,
        end: a
      } = this.consumeArg(["]"]);
    } else
      ({
        tokens: n,
        start: t,
        end: a
      } = this.consumeArg());
    return this.pushToken(new x0("EOF", a.loc)), this.pushTokens(n), t.range(a, "");
  }
  /**
   * Consume all following space tokens, without expansion.
   */
  consumeSpaces() {
    for (; ; ) {
      var e = this.future();
      if (e.text === " ")
        this.stack.pop();
      else
        break;
    }
  }
  /**
   * Consume an argument from the token stream, and return the resulting array
   * of tokens and start/end token.
   */
  consumeArg(e) {
    var t = [], a = e && e.length > 0;
    a || this.consumeSpaces();
    var n = this.future(), s, o = 0, h = 0;
    do {
      if (s = this.popToken(), t.push(s), s.text === "{")
        ++o;
      else if (s.text === "}") {
        if (--o, o === -1)
          throw new M("Extra }", s);
      } else if (s.text === "EOF")
        throw new M("Unexpected end of input in a macro argument, expected '" + (e && a ? e[h] : "}") + "'", s);
      if (e && a)
        if ((o === 0 || o === 1 && e[h] === "{") && s.text === e[h]) {
          if (++h, h === e.length) {
            t.splice(-h, h);
            break;
          }
        } else
          h = 0;
    } while (o !== 0 || a);
    return n.text === "{" && t[t.length - 1].text === "}" && (t.pop(), t.shift()), t.reverse(), {
      tokens: t,
      start: n,
      end: s
    };
  }
  /**
   * Consume the specified number of (delimited) arguments from the token
   * stream and return the resulting array of arguments.
   */
  consumeArgs(e, t) {
    if (t) {
      if (t.length !== e + 1)
        throw new M("The length of delimiters doesn't match the number of args!");
      for (var a = t[0], n = 0; n < a.length; n++) {
        var s = this.popToken();
        if (a[n] !== s.text)
          throw new M("Use of the macro doesn't match its definition", s);
      }
    }
    for (var o = [], h = 0; h < e; h++)
      o.push(this.consumeArg(t && t[h + 1]).tokens);
    return o;
  }
  /**
   * Expand the next token only once if possible.
   *
   * If the token is expanded, the resulting tokens will be pushed onto
   * the stack in reverse order, and the number of such tokens will be
   * returned.  This number might be zero or positive.
   *
   * If not, the return value is `false`, and the next token remains at the
   * top of the stack.
   *
   * In either case, the next token will be on the top of the stack,
   * or the stack will be empty (in case of empty expansion
   * and no other tokens).
   *
   * Used to implement `expandAfterFuture` and `expandNextToken`.
   *
   * If expandableOnly, only expandable tokens are expanded and
   * an undefined control sequence results in an error.
   */
  expandOnce(e) {
    var t = this.popToken(), a = t.text, n = t.noexpand ? null : this._getExpansion(a);
    if (n == null || e && n.unexpandable) {
      if (e && n == null && a[0] === "\\" && !this.isDefined(a))
        throw new M("Undefined control sequence: " + a);
      return this.pushToken(t), !1;
    }
    if (this.expansionCount++, this.expansionCount > this.settings.maxExpand)
      throw new M("Too many expansions: infinite loop or need to increase maxExpand setting");
    var s = n.tokens, o = this.consumeArgs(n.numArgs, n.delimiters);
    if (n.numArgs) {
      s = s.slice();
      for (var h = s.length - 1; h >= 0; --h) {
        var c = s[h];
        if (c.text === "#") {
          if (h === 0)
            throw new M("Incomplete placeholder at end of macro body", c);
          if (c = s[--h], c.text === "#")
            s.splice(h + 1, 1);
          else if (/^[1-9]$/.test(c.text))
            s.splice(h, 2, ...o[+c.text - 1]);
          else
            throw new M("Not a valid argument number", c);
        }
      }
    }
    return this.pushTokens(s), s.length;
  }
  /**
   * Expand the next token only once (if possible), and return the resulting
   * top token on the stack (without removing anything from the stack).
   * Similar in behavior to TeX's `\expandafter\futurelet`.
   * Equivalent to expandOnce() followed by future().
   */
  expandAfterFuture() {
    return this.expandOnce(), this.future();
  }
  /**
   * Recursively expand first token, then return first non-expandable token.
   */
  expandNextToken() {
    for (; ; )
      if (this.expandOnce() === !1) {
        var e = this.stack.pop();
        return e.treatAsRelax && (e.text = "\\relax"), e;
      }
    throw new Error();
  }
  /**
   * Fully expand the given macro name and return the resulting list of
   * tokens, or return `undefined` if no such macro is defined.
   */
  expandMacro(e) {
    return this.macros.has(e) ? this.expandTokens([new x0(e)]) : void 0;
  }
  /**
   * Fully expand the given token stream and return the resulting list of
   * tokens.  Note that the input tokens are in reverse order, but the
   * output tokens are in forward order.
   */
  expandTokens(e) {
    var t = [], a = this.stack.length;
    for (this.pushTokens(e); this.stack.length > a; )
      if (this.expandOnce(!0) === !1) {
        var n = this.stack.pop();
        n.treatAsRelax && (n.noexpand = !1, n.treatAsRelax = !1), t.push(n);
      }
    return t;
  }
  /**
   * Fully expand the given macro name and return the result as a string,
   * or return `undefined` if no such macro is defined.
   */
  expandMacroAsText(e) {
    var t = this.expandMacro(e);
    return t && t.map((a) => a.text).join("");
  }
  /**
   * Returns the expanded macro as a reversed array of tokens and a macro
   * argument count.  Or returns `null` if no such macro.
   */
  _getExpansion(e) {
    var t = this.macros.get(e);
    if (t == null)
      return t;
    if (e.length === 1) {
      var a = this.lexer.catcodes[e];
      if (a != null && a !== 13)
        return;
    }
    var n = typeof t == "function" ? t(this) : t;
    if (typeof n == "string") {
      var s = 0;
      if (n.indexOf("#") !== -1)
        for (var o = n.replace(/##/g, ""); o.indexOf("#" + (s + 1)) !== -1; )
          ++s;
      for (var h = new hr(n, this.settings), c = [], p = h.lex(); p.text !== "EOF"; )
        c.push(p), p = h.lex();
      c.reverse();
      var g = {
        tokens: c,
        numArgs: s
      };
      return g;
    }
    return n;
  }
  /**
   * Determine whether a command is currently "defined" (has some
   * functionality), meaning that it's a macro (in the current group),
   * a function, a symbol, or one of the special commands listed in
   * `implicitCommands`.
   */
  isDefined(e) {
    return this.macros.has(e) || F0.hasOwnProperty(e) || $.math.hasOwnProperty(e) || $.text.hasOwnProperty(e) || la.hasOwnProperty(e);
  }
  /**
   * Determine whether a command is expandable.
   */
  isExpandable(e) {
    var t = this.macros.get(e);
    return t != null ? typeof t == "string" || typeof t == "function" || !t.unexpandable : F0.hasOwnProperty(e) && !F0[e].primitive;
  }
}
var dr = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/, ze = Object.freeze({
  "₊": "+",
  "₋": "-",
  "₌": "=",
  "₍": "(",
  "₎": ")",
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "ₐ": "a",
  "ₑ": "e",
  "ₕ": "h",
  "ᵢ": "i",
  "ⱼ": "j",
  "ₖ": "k",
  "ₗ": "l",
  "ₘ": "m",
  "ₙ": "n",
  "ₒ": "o",
  "ₚ": "p",
  "ᵣ": "r",
  "ₛ": "s",
  "ₜ": "t",
  "ᵤ": "u",
  "ᵥ": "v",
  "ₓ": "x",
  "ᵦ": "β",
  "ᵧ": "γ",
  "ᵨ": "ρ",
  "ᵩ": "ϕ",
  "ᵪ": "χ",
  "⁺": "+",
  "⁻": "-",
  "⁼": "=",
  "⁽": "(",
  "⁾": ")",
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "ᴬ": "A",
  "ᴮ": "B",
  "ᴰ": "D",
  "ᴱ": "E",
  "ᴳ": "G",
  "ᴴ": "H",
  "ᴵ": "I",
  "ᴶ": "J",
  "ᴷ": "K",
  "ᴸ": "L",
  "ᴹ": "M",
  "ᴺ": "N",
  "ᴼ": "O",
  "ᴾ": "P",
  "ᴿ": "R",
  "ᵀ": "T",
  "ᵁ": "U",
  "ⱽ": "V",
  "ᵂ": "W",
  "ᵃ": "a",
  "ᵇ": "b",
  "ᶜ": "c",
  "ᵈ": "d",
  "ᵉ": "e",
  "ᶠ": "f",
  "ᵍ": "g",
  ʰ: "h",
  "ⁱ": "i",
  ʲ: "j",
  "ᵏ": "k",
  ˡ: "l",
  "ᵐ": "m",
  ⁿ: "n",
  "ᵒ": "o",
  "ᵖ": "p",
  ʳ: "r",
  ˢ: "s",
  "ᵗ": "t",
  "ᵘ": "u",
  "ᵛ": "v",
  ʷ: "w",
  ˣ: "x",
  ʸ: "y",
  "ᶻ": "z",
  "ᵝ": "β",
  "ᵞ": "γ",
  "ᵟ": "δ",
  "ᵠ": "ϕ",
  "ᵡ": "χ",
  "ᶿ": "θ"
}), rt = {
  "́": {
    text: "\\'",
    math: "\\acute"
  },
  "̀": {
    text: "\\`",
    math: "\\grave"
  },
  "̈": {
    text: '\\"',
    math: "\\ddot"
  },
  "̃": {
    text: "\\~",
    math: "\\tilde"
  },
  "̄": {
    text: "\\=",
    math: "\\bar"
  },
  "̆": {
    text: "\\u",
    math: "\\breve"
  },
  "̌": {
    text: "\\v",
    math: "\\check"
  },
  "̂": {
    text: "\\^",
    math: "\\hat"
  },
  "̇": {
    text: "\\.",
    math: "\\dot"
  },
  "̊": {
    text: "\\r",
    math: "\\mathring"
  },
  "̋": {
    text: "\\H"
  },
  "̧": {
    text: "\\c"
  }
}, fr = {
  á: "á",
  à: "à",
  ä: "ä",
  ǟ: "ǟ",
  ã: "ã",
  ā: "ā",
  ă: "ă",
  ắ: "ắ",
  ằ: "ằ",
  ẵ: "ẵ",
  ǎ: "ǎ",
  â: "â",
  ấ: "ấ",
  ầ: "ầ",
  ẫ: "ẫ",
  ȧ: "ȧ",
  ǡ: "ǡ",
  å: "å",
  ǻ: "ǻ",
  ḃ: "ḃ",
  ć: "ć",
  ḉ: "ḉ",
  č: "č",
  ĉ: "ĉ",
  ċ: "ċ",
  ç: "ç",
  ď: "ď",
  ḋ: "ḋ",
  ḑ: "ḑ",
  é: "é",
  è: "è",
  ë: "ë",
  ẽ: "ẽ",
  ē: "ē",
  ḗ: "ḗ",
  ḕ: "ḕ",
  ĕ: "ĕ",
  ḝ: "ḝ",
  ě: "ě",
  ê: "ê",
  ế: "ế",
  ề: "ề",
  ễ: "ễ",
  ė: "ė",
  ȩ: "ȩ",
  ḟ: "ḟ",
  ǵ: "ǵ",
  ḡ: "ḡ",
  ğ: "ğ",
  ǧ: "ǧ",
  ĝ: "ĝ",
  ġ: "ġ",
  ģ: "ģ",
  ḧ: "ḧ",
  ȟ: "ȟ",
  ĥ: "ĥ",
  ḣ: "ḣ",
  ḩ: "ḩ",
  í: "í",
  ì: "ì",
  ï: "ï",
  ḯ: "ḯ",
  ĩ: "ĩ",
  ī: "ī",
  ĭ: "ĭ",
  ǐ: "ǐ",
  î: "î",
  ǰ: "ǰ",
  ĵ: "ĵ",
  ḱ: "ḱ",
  ǩ: "ǩ",
  ķ: "ķ",
  ĺ: "ĺ",
  ľ: "ľ",
  ļ: "ļ",
  ḿ: "ḿ",
  ṁ: "ṁ",
  ń: "ń",
  ǹ: "ǹ",
  ñ: "ñ",
  ň: "ň",
  ṅ: "ṅ",
  ņ: "ņ",
  ó: "ó",
  ò: "ò",
  ö: "ö",
  ȫ: "ȫ",
  õ: "õ",
  ṍ: "ṍ",
  ṏ: "ṏ",
  ȭ: "ȭ",
  ō: "ō",
  ṓ: "ṓ",
  ṑ: "ṑ",
  ŏ: "ŏ",
  ǒ: "ǒ",
  ô: "ô",
  ố: "ố",
  ồ: "ồ",
  ỗ: "ỗ",
  ȯ: "ȯ",
  ȱ: "ȱ",
  ő: "ő",
  ṕ: "ṕ",
  ṗ: "ṗ",
  ŕ: "ŕ",
  ř: "ř",
  ṙ: "ṙ",
  ŗ: "ŗ",
  ś: "ś",
  ṥ: "ṥ",
  š: "š",
  ṧ: "ṧ",
  ŝ: "ŝ",
  ṡ: "ṡ",
  ş: "ş",
  ẗ: "ẗ",
  ť: "ť",
  ṫ: "ṫ",
  ţ: "ţ",
  ú: "ú",
  ù: "ù",
  ü: "ü",
  ǘ: "ǘ",
  ǜ: "ǜ",
  ǖ: "ǖ",
  ǚ: "ǚ",
  ũ: "ũ",
  ṹ: "ṹ",
  ū: "ū",
  ṻ: "ṻ",
  ŭ: "ŭ",
  ǔ: "ǔ",
  û: "û",
  ů: "ů",
  ű: "ű",
  ṽ: "ṽ",
  ẃ: "ẃ",
  ẁ: "ẁ",
  ẅ: "ẅ",
  ŵ: "ŵ",
  ẇ: "ẇ",
  ẘ: "ẘ",
  ẍ: "ẍ",
  ẋ: "ẋ",
  ý: "ý",
  ỳ: "ỳ",
  ÿ: "ÿ",
  ỹ: "ỹ",
  ȳ: "ȳ",
  ŷ: "ŷ",
  ẏ: "ẏ",
  ẙ: "ẙ",
  ź: "ź",
  ž: "ž",
  ẑ: "ẑ",
  ż: "ż",
  Á: "Á",
  À: "À",
  Ä: "Ä",
  Ǟ: "Ǟ",
  Ã: "Ã",
  Ā: "Ā",
  Ă: "Ă",
  Ắ: "Ắ",
  Ằ: "Ằ",
  Ẵ: "Ẵ",
  Ǎ: "Ǎ",
  Â: "Â",
  Ấ: "Ấ",
  Ầ: "Ầ",
  Ẫ: "Ẫ",
  Ȧ: "Ȧ",
  Ǡ: "Ǡ",
  Å: "Å",
  Ǻ: "Ǻ",
  Ḃ: "Ḃ",
  Ć: "Ć",
  Ḉ: "Ḉ",
  Č: "Č",
  Ĉ: "Ĉ",
  Ċ: "Ċ",
  Ç: "Ç",
  Ď: "Ď",
  Ḋ: "Ḋ",
  Ḑ: "Ḑ",
  É: "É",
  È: "È",
  Ë: "Ë",
  Ẽ: "Ẽ",
  Ē: "Ē",
  Ḗ: "Ḗ",
  Ḕ: "Ḕ",
  Ĕ: "Ĕ",
  Ḝ: "Ḝ",
  Ě: "Ě",
  Ê: "Ê",
  Ế: "Ế",
  Ề: "Ề",
  Ễ: "Ễ",
  Ė: "Ė",
  Ȩ: "Ȩ",
  Ḟ: "Ḟ",
  Ǵ: "Ǵ",
  Ḡ: "Ḡ",
  Ğ: "Ğ",
  Ǧ: "Ǧ",
  Ĝ: "Ĝ",
  Ġ: "Ġ",
  Ģ: "Ģ",
  Ḧ: "Ḧ",
  Ȟ: "Ȟ",
  Ĥ: "Ĥ",
  Ḣ: "Ḣ",
  Ḩ: "Ḩ",
  Í: "Í",
  Ì: "Ì",
  Ï: "Ï",
  Ḯ: "Ḯ",
  Ĩ: "Ĩ",
  Ī: "Ī",
  Ĭ: "Ĭ",
  Ǐ: "Ǐ",
  Î: "Î",
  İ: "İ",
  Ĵ: "Ĵ",
  Ḱ: "Ḱ",
  Ǩ: "Ǩ",
  Ķ: "Ķ",
  Ĺ: "Ĺ",
  Ľ: "Ľ",
  Ļ: "Ļ",
  Ḿ: "Ḿ",
  Ṁ: "Ṁ",
  Ń: "Ń",
  Ǹ: "Ǹ",
  Ñ: "Ñ",
  Ň: "Ň",
  Ṅ: "Ṅ",
  Ņ: "Ņ",
  Ó: "Ó",
  Ò: "Ò",
  Ö: "Ö",
  Ȫ: "Ȫ",
  Õ: "Õ",
  Ṍ: "Ṍ",
  Ṏ: "Ṏ",
  Ȭ: "Ȭ",
  Ō: "Ō",
  Ṓ: "Ṓ",
  Ṑ: "Ṑ",
  Ŏ: "Ŏ",
  Ǒ: "Ǒ",
  Ô: "Ô",
  Ố: "Ố",
  Ồ: "Ồ",
  Ỗ: "Ỗ",
  Ȯ: "Ȯ",
  Ȱ: "Ȱ",
  Ő: "Ő",
  Ṕ: "Ṕ",
  Ṗ: "Ṗ",
  Ŕ: "Ŕ",
  Ř: "Ř",
  Ṙ: "Ṙ",
  Ŗ: "Ŗ",
  Ś: "Ś",
  Ṥ: "Ṥ",
  Š: "Š",
  Ṧ: "Ṧ",
  Ŝ: "Ŝ",
  Ṡ: "Ṡ",
  Ş: "Ş",
  Ť: "Ť",
  Ṫ: "Ṫ",
  Ţ: "Ţ",
  Ú: "Ú",
  Ù: "Ù",
  Ü: "Ü",
  Ǘ: "Ǘ",
  Ǜ: "Ǜ",
  Ǖ: "Ǖ",
  Ǚ: "Ǚ",
  Ũ: "Ũ",
  Ṹ: "Ṹ",
  Ū: "Ū",
  Ṻ: "Ṻ",
  Ŭ: "Ŭ",
  Ǔ: "Ǔ",
  Û: "Û",
  Ů: "Ů",
  Ű: "Ű",
  Ṽ: "Ṽ",
  Ẃ: "Ẃ",
  Ẁ: "Ẁ",
  Ẅ: "Ẅ",
  Ŵ: "Ŵ",
  Ẇ: "Ẇ",
  Ẍ: "Ẍ",
  Ẋ: "Ẋ",
  Ý: "Ý",
  Ỳ: "Ỳ",
  Ÿ: "Ÿ",
  Ỹ: "Ỹ",
  Ȳ: "Ȳ",
  Ŷ: "Ŷ",
  Ẏ: "Ẏ",
  Ź: "Ź",
  Ž: "Ž",
  Ẑ: "Ẑ",
  Ż: "Ż",
  ά: "ά",
  ὰ: "ὰ",
  ᾱ: "ᾱ",
  ᾰ: "ᾰ",
  έ: "έ",
  ὲ: "ὲ",
  ή: "ή",
  ὴ: "ὴ",
  ί: "ί",
  ὶ: "ὶ",
  ϊ: "ϊ",
  ΐ: "ΐ",
  ῒ: "ῒ",
  ῑ: "ῑ",
  ῐ: "ῐ",
  ό: "ό",
  ὸ: "ὸ",
  ύ: "ύ",
  ὺ: "ὺ",
  ϋ: "ϋ",
  ΰ: "ΰ",
  ῢ: "ῢ",
  ῡ: "ῡ",
  ῠ: "ῠ",
  ώ: "ώ",
  ὼ: "ὼ",
  Ύ: "Ύ",
  Ὺ: "Ὺ",
  Ϋ: "Ϋ",
  Ῡ: "Ῡ",
  Ῠ: "Ῠ",
  Ώ: "Ώ",
  Ὼ: "Ὼ"
};
class ue {
  constructor(e, t) {
    this.mode = void 0, this.gullet = void 0, this.settings = void 0, this.leftrightDepth = void 0, this.nextToken = void 0, this.mode = "math", this.gullet = new s4(e, t, this.mode), this.settings = t, this.leftrightDepth = 0;
  }
  /**
   * Checks a result to make sure it has the right type, and throws an
   * appropriate error otherwise.
   */
  expect(e, t) {
    if (t === void 0 && (t = !0), this.fetch().text !== e)
      throw new M("Expected '" + e + "', got '" + this.fetch().text + "'", this.fetch());
    t && this.consume();
  }
  /**
   * Discards the current lookahead token, considering it consumed.
   */
  consume() {
    this.nextToken = null;
  }
  /**
   * Return the current lookahead token, or if there isn't one (at the
   * beginning, or if the previous lookahead token was consume()d),
   * fetch the next token as the new lookahead token and return it.
   */
  fetch() {
    return this.nextToken == null && (this.nextToken = this.gullet.expandNextToken()), this.nextToken;
  }
  /**
   * Switches between "text" and "math" modes.
   */
  switchMode(e) {
    this.mode = e, this.gullet.switchMode(e);
  }
  /**
   * Main parsing function, which parses an entire input.
   */
  parse() {
    this.settings.globalGroup || this.gullet.beginGroup(), this.settings.colorIsTextColor && this.gullet.macros.set("\\color", "\\textcolor");
    try {
      var e = this.parseExpression(!1);
      return this.expect("EOF"), this.settings.globalGroup || this.gullet.endGroup(), e;
    } finally {
      this.gullet.endGroups();
    }
  }
  /**
   * Fully parse a separate sequence of tokens as a separate job.
   * Tokens should be specified in reverse order, as in a MacroDefinition.
   */
  subparse(e) {
    var t = this.nextToken;
    this.consume(), this.gullet.pushToken(new x0("}")), this.gullet.pushTokens(e);
    var a = this.parseExpression(!1);
    return this.expect("}"), this.nextToken = t, a;
  }
  /**
   * Parses an "expression", which is a list of atoms.
   *
   * `breakOnInfix`: Should the parsing stop when we hit infix nodes? This
   *                 happens when functions have higher precedence han infix
   *                 nodes in implicit parses.
   *
   * `breakOnTokenText`: The text of the token that the expression should end
   *                     with, or `null` if something else should end the
   *                     expression.
   */
  parseExpression(e, t) {
    for (var a = []; ; ) {
      this.mode === "math" && this.consumeSpaces();
      var n = this.fetch();
      if (ue.endOfExpression.indexOf(n.text) !== -1 || t && n.text === t || e && F0[n.text] && F0[n.text].infix)
        break;
      var s = this.parseAtom(t);
      if (s) {
        if (s.type === "internal")
          continue;
      } else
        break;
      a.push(s);
    }
    return this.mode === "text" && this.formLigatures(a), this.handleInfixNodes(a);
  }
  /**
   * Rewrites infix operators such as \over with corresponding commands such
   * as \frac.
   *
   * There can only be one infix operator per group.  If there's more than one
   * then the expression is ambiguous.  This can be resolved by adding {}.
   */
  handleInfixNodes(e) {
    for (var t = -1, a, n = 0; n < e.length; n++)
      if (e[n].type === "infix") {
        if (t !== -1)
          throw new M("only one infix operator per group", e[n].token);
        t = n, a = e[n].replaceWith;
      }
    if (t !== -1 && a) {
      var s, o, h = e.slice(0, t), c = e.slice(t + 1);
      h.length === 1 && h[0].type === "ordgroup" ? s = h[0] : s = {
        type: "ordgroup",
        mode: this.mode,
        body: h
      }, c.length === 1 && c[0].type === "ordgroup" ? o = c[0] : o = {
        type: "ordgroup",
        mode: this.mode,
        body: c
      };
      var p;
      return a === "\\\\abovefrac" ? p = this.callFunction(a, [s, e[t], o], []) : p = this.callFunction(a, [s, o], []), [p];
    } else
      return e;
  }
  /**
   * Handle a subscript or superscript with nice errors.
   */
  handleSupSubscript(e) {
    var t = this.fetch(), a = t.text;
    this.consume(), this.consumeSpaces();
    var n = this.parseGroup(e);
    if (!n)
      throw new M("Expected group after '" + a + "'", t);
    return n;
  }
  /**
   * Converts the textual input of an unsupported command into a text node
   * contained within a color node whose color is determined by errorColor
   */
  formatUnsupportedCmd(e) {
    for (var t = [], a = 0; a < e.length; a++)
      t.push({
        type: "textord",
        mode: "text",
        text: e[a]
      });
    var n = {
      type: "text",
      mode: this.mode,
      body: t
    }, s = {
      type: "color",
      mode: this.mode,
      color: this.settings.errorColor,
      body: [n]
    };
    return s;
  }
  /**
   * Parses a group with optional super/subscripts.
   */
  parseAtom(e) {
    var t = this.parseGroup("atom", e);
    if (this.mode === "text")
      return t;
    for (var a, n; ; ) {
      this.consumeSpaces();
      var s = this.fetch();
      if (s.text === "\\limits" || s.text === "\\nolimits") {
        if (t && t.type === "op") {
          var o = s.text === "\\limits";
          t.limits = o, t.alwaysHandleSupSub = !0;
        } else if (t && t.type === "operatorname")
          t.alwaysHandleSupSub && (t.limits = s.text === "\\limits");
        else
          throw new M("Limit controls must follow a math operator", s);
        this.consume();
      } else if (s.text === "^") {
        if (a)
          throw new M("Double superscript", s);
        a = this.handleSupSubscript("superscript");
      } else if (s.text === "_") {
        if (n)
          throw new M("Double subscript", s);
        n = this.handleSupSubscript("subscript");
      } else if (s.text === "'") {
        if (a)
          throw new M("Double superscript", s);
        var h = {
          type: "textord",
          mode: this.mode,
          text: "\\prime"
        }, c = [h];
        for (this.consume(); this.fetch().text === "'"; )
          c.push(h), this.consume();
        this.fetch().text === "^" && c.push(this.handleSupSubscript("superscript")), a = {
          type: "ordgroup",
          mode: this.mode,
          body: c
        };
      } else if (ze[s.text]) {
        var p = ze[s.text], g = dr.test(s.text);
        for (this.consume(); ; ) {
          var y = this.fetch().text;
          if (!ze[y] || dr.test(y) !== g)
            break;
          this.consume(), p += ze[y];
        }
        var w = new ue(p, this.settings).parse();
        g ? n = {
          type: "ordgroup",
          mode: "math",
          body: w
        } : a = {
          type: "ordgroup",
          mode: "math",
          body: w
        };
      } else
        break;
    }
    return a || n ? {
      type: "supsub",
      mode: this.mode,
      base: t,
      sup: a,
      sub: n
    } : t;
  }
  /**
   * Parses an entire function, including its base and all of its arguments.
   */
  parseFunction(e, t) {
    var a = this.fetch(), n = a.text, s = F0[n];
    if (!s)
      return null;
    if (this.consume(), t && t !== "atom" && !s.allowedInArgument)
      throw new M("Got function '" + n + "' with no arguments" + (t ? " as " + t : ""), a);
    if (this.mode === "text" && !s.allowedInText)
      throw new M("Can't use function '" + n + "' in text mode", a);
    if (this.mode === "math" && s.allowedInMath === !1)
      throw new M("Can't use function '" + n + "' in math mode", a);
    var {
      args: o,
      optArgs: h
    } = this.parseArguments(n, s);
    return this.callFunction(n, o, h, a, e);
  }
  /**
   * Call a function handler with a suitable context and arguments.
   */
  callFunction(e, t, a, n, s) {
    var o = {
      funcName: e,
      parser: this,
      token: n,
      breakOnTokenText: s
    }, h = F0[e];
    if (h && h.handler)
      return h.handler(o, t, a);
    throw new M("No function handler for " + e);
  }
  /**
   * Parses the arguments of a function or environment
   */
  parseArguments(e, t) {
    var a = t.numArgs + t.numOptionalArgs;
    if (a === 0)
      return {
        args: [],
        optArgs: []
      };
    for (var n = [], s = [], o = 0; o < a; o++) {
      var h = t.argTypes && t.argTypes[o], c = o < t.numOptionalArgs;
      (t.primitive && h == null || // \sqrt expands into primitive if optional argument doesn't exist
      t.type === "sqrt" && o === 1 && s[0] == null) && (h = "primitive");
      var p = this.parseGroupOfType("argument to '" + e + "'", h, c);
      if (c)
        s.push(p);
      else if (p != null)
        n.push(p);
      else
        throw new M("Null argument, please report this as a bug");
    }
    return {
      args: n,
      optArgs: s
    };
  }
  /**
   * Parses a group when the mode is changing.
   */
  parseGroupOfType(e, t, a) {
    switch (t) {
      case "color":
        return this.parseColorGroup(a);
      case "size":
        return this.parseSizeGroup(a);
      case "url":
        return this.parseUrlGroup(a);
      case "math":
      case "text":
        return this.parseArgumentGroup(a, t);
      case "hbox": {
        var n = this.parseArgumentGroup(a, "text");
        return n != null ? {
          type: "styling",
          mode: n.mode,
          body: [n],
          style: "text"
          // simulate \textstyle
        } : null;
      }
      case "raw": {
        var s = this.parseStringGroup("raw", a);
        return s != null ? {
          type: "raw",
          mode: "text",
          string: s.text
        } : null;
      }
      case "primitive": {
        if (a)
          throw new M("A primitive argument cannot be optional");
        var o = this.parseGroup(e);
        if (o == null)
          throw new M("Expected group as " + e, this.fetch());
        return o;
      }
      case "original":
      case null:
      case void 0:
        return this.parseArgumentGroup(a);
      default:
        throw new M("Unknown group type as " + e, this.fetch());
    }
  }
  /**
   * Discard any space tokens, fetching the next non-space token.
   */
  consumeSpaces() {
    for (; this.fetch().text === " "; )
      this.consume();
  }
  /**
   * Parses a group, essentially returning the string formed by the
   * brace-enclosed tokens plus some position information.
   */
  parseStringGroup(e, t) {
    var a = this.gullet.scanArgument(t);
    if (a == null)
      return null;
    for (var n = "", s; (s = this.fetch()).text !== "EOF"; )
      n += s.text, this.consume();
    return this.consume(), a.text = n, a;
  }
  /**
   * Parses a regex-delimited group: the largest sequence of tokens
   * whose concatenated strings match `regex`. Returns the string
   * formed by the tokens plus some position information.
   */
  parseRegexGroup(e, t) {
    for (var a = this.fetch(), n = a, s = "", o; (o = this.fetch()).text !== "EOF" && e.test(s + o.text); )
      n = o, s += n.text, this.consume();
    if (s === "")
      throw new M("Invalid " + t + ": '" + a.text + "'", a);
    return a.range(n, s);
  }
  /**
   * Parses a color description.
   */
  parseColorGroup(e) {
    var t = this.parseStringGroup("color", e);
    if (t == null)
      return null;
    var a = /^(#[a-f0-9]{3}|#?[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);
    if (!a)
      throw new M("Invalid color: '" + t.text + "'", t);
    var n = a[0];
    return /^[0-9a-f]{6}$/i.test(n) && (n = "#" + n), {
      type: "color-token",
      mode: this.mode,
      color: n
    };
  }
  /**
   * Parses a size specification, consisting of magnitude and unit.
   */
  parseSizeGroup(e) {
    var t, a = !1;
    if (this.gullet.consumeSpaces(), !e && this.gullet.future().text !== "{" ? t = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size") : t = this.parseStringGroup("size", e), !t)
      return null;
    !e && t.text.length === 0 && (t.text = "0pt", a = !0);
    var n = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);
    if (!n)
      throw new M("Invalid size: '" + t.text + "'", t);
    var s = {
      number: +(n[1] + n[2]),
      // sign + magnitude, cast to number
      unit: n[3]
    };
    if (!gr(s))
      throw new M("Invalid unit: '" + s.unit + "'", t);
    return {
      type: "size",
      mode: this.mode,
      value: s,
      isBlank: a
    };
  }
  /**
   * Parses an URL, checking escaped letters and allowed protocols,
   * and setting the catcode of % as an active character (as in \hyperref).
   */
  parseUrlGroup(e) {
    this.gullet.lexer.setCatcode("%", 13), this.gullet.lexer.setCatcode("~", 12);
    var t = this.parseStringGroup("url", e);
    if (this.gullet.lexer.setCatcode("%", 14), this.gullet.lexer.setCatcode("~", 13), t == null)
      return null;
    var a = t.text.replace(/\\([#$%&~_^{}])/g, "$1");
    return {
      type: "url",
      mode: this.mode,
      url: a
    };
  }
  /**
   * Parses an argument with the mode specified.
   */
  parseArgumentGroup(e, t) {
    var a = this.gullet.scanArgument(e);
    if (a == null)
      return null;
    var n = this.mode;
    t && this.switchMode(t), this.gullet.beginGroup();
    var s = this.parseExpression(!1, "EOF");
    this.expect("EOF"), this.gullet.endGroup();
    var o = {
      type: "ordgroup",
      mode: this.mode,
      loc: a.loc,
      body: s
    };
    return t && this.switchMode(n), o;
  }
  /**
   * Parses an ordinary group, which is either a single nucleus (like "x")
   * or an expression in braces (like "{x+y}") or an implicit group, a group
   * that starts at the current position, and ends right before a higher explicit
   * group ends, or at EOF.
   */
  parseGroup(e, t) {
    var a = this.fetch(), n = a.text, s;
    if (n === "{" || n === "\\begingroup") {
      this.consume();
      var o = n === "{" ? "}" : "\\endgroup";
      this.gullet.beginGroup();
      var h = this.parseExpression(!1, o), c = this.fetch();
      this.expect(o), this.gullet.endGroup(), s = {
        type: "ordgroup",
        mode: this.mode,
        loc: u0.range(a, c),
        body: h,
        // A group formed by \begingroup...\endgroup is a semi-simple group
        // which doesn't affect spacing in math mode, i.e., is transparent.
        // https://tex.stackexchange.com/questions/1930/when-should-one-
        // use-begingroup-instead-of-bgroup
        semisimple: n === "\\begingroup" || void 0
      };
    } else if (s = this.parseFunction(t, e) || this.parseSymbol(), s == null && n[0] === "\\" && !la.hasOwnProperty(n)) {
      if (this.settings.throwOnError)
        throw new M("Undefined control sequence: " + n, a);
      s = this.formatUnsupportedCmd(n), this.consume();
    }
    return s;
  }
  /**
   * Form ligature-like combinations of characters for text mode.
   * This includes inputs like "--", "---", "``" and "''".
   * The result will simply replace multiple textord nodes with a single
   * character in each value by a single textord node having multiple
   * characters in its value.  The representation is still ASCII source.
   * The group will be modified in place.
   */
  formLigatures(e) {
    for (var t = e.length - 1, a = 0; a < t; ++a) {
      var n = e[a], s = n.text;
      s === "-" && e[a + 1].text === "-" && (a + 1 < t && e[a + 2].text === "-" ? (e.splice(a, 3, {
        type: "textord",
        mode: "text",
        loc: u0.range(n, e[a + 2]),
        text: "---"
      }), t -= 2) : (e.splice(a, 2, {
        type: "textord",
        mode: "text",
        loc: u0.range(n, e[a + 1]),
        text: "--"
      }), t -= 1)), (s === "'" || s === "`") && e[a + 1].text === s && (e.splice(a, 2, {
        type: "textord",
        mode: "text",
        loc: u0.range(n, e[a + 1]),
        text: s + s
      }), t -= 1);
    }
  }
  /**
   * Parse a single symbol out of the string. Here, we handle single character
   * symbols and special functions like \verb.
   */
  parseSymbol() {
    var e = this.fetch(), t = e.text;
    if (/^\\verb[^a-zA-Z]/.test(t)) {
      this.consume();
      var a = t.slice(5), n = a.charAt(0) === "*";
      if (n && (a = a.slice(1)), a.length < 2 || a.charAt(0) !== a.slice(-1))
        throw new M(`\\verb assertion failed --
                    please report what input caused this bug`);
      return a = a.slice(1, -1), {
        type: "verb",
        mode: "text",
        body: a,
        star: n
      };
    }
    fr.hasOwnProperty(t[0]) && !$[this.mode][t[0]] && (this.settings.strict && this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + t[0] + '" used in math mode', e), t = fr[t[0]] + t.slice(1));
    var s = r4.exec(t);
    s && (t = t.substring(0, s.index), t === "i" ? t = "ı" : t === "j" && (t = "ȷ"));
    var o;
    if ($[this.mode][t]) {
      this.settings.strict && this.mode === "math" && st.indexOf(t) >= 0 && this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + t[0] + '" used in math mode', e);
      var h = $[this.mode][t].group, c = u0.range(e), p;
      if (ja.hasOwnProperty(h)) {
        var g = h;
        p = {
          type: "atom",
          mode: this.mode,
          family: g,
          loc: c,
          text: t
        };
      } else
        p = {
          type: h,
          mode: this.mode,
          loc: c,
          text: t
        };
      o = p;
    } else if (t.charCodeAt(0) >= 128)
      this.settings.strict && (vr(t.charCodeAt(0)) ? this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + t[0] + '" used in math mode', e) : this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + t[0] + '"' + (" (" + t.charCodeAt(0) + ")"), e)), o = {
        type: "textord",
        mode: "text",
        loc: u0.range(e),
        text: t
      };
    else
      return null;
    if (this.consume(), s)
      for (var y = 0; y < s[0].length; y++) {
        var w = s[0][y];
        if (!rt[w])
          throw new M("Unknown accent ' " + w + "'", e);
        var x = rt[w][this.mode] || rt[w].text;
        if (!x)
          throw new M("Accent " + w + " unsupported in " + this.mode + " mode", e);
        o = {
          type: "accent",
          mode: this.mode,
          loc: u0.range(e),
          label: x,
          isStretchy: !1,
          isShifty: !0,
          // $FlowFixMe
          base: o
        };
      }
    return o;
  }
}
ue.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"];
var Ct = function(e, t) {
  if (!(typeof e == "string" || e instanceof String))
    throw new TypeError("KaTeX can only parse string typed expression");
  var a = new ue(e, t);
  delete a.gullet.macros.current["\\df@tag"];
  var n = a.parse();
  if (delete a.gullet.macros.current["\\current@color"], delete a.gullet.macros.current["\\color"], a.gullet.macros.get("\\df@tag")) {
    if (!t.displayMode)
      throw new M("\\tag works only in display equations");
    n = [{
      type: "tag",
      mode: "text",
      body: n,
      tag: a.subparse([new x0("\\df@tag")])
    }];
  }
  return n;
}, oa = function(e, t, a) {
  t.textContent = "";
  var n = Nt(e, a).toNode();
  t.appendChild(n);
};
typeof document < "u" && document.compatMode !== "CSS1Compat" && (typeof console < "u" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."), oa = function() {
  throw new M("KaTeX doesn't work in quirks mode.");
});
var l4 = function(e, t) {
  var a = Nt(e, t).toMarkup();
  return a;
}, o4 = function(e, t) {
  var a = new ct(t);
  return Ct(e, a);
}, ua = function(e, t, a) {
  if (a.throwOnError || !(e instanceof M))
    throw e;
  var n = b.makeSpan(["katex-error"], [new f0(t)]);
  return n.setAttribute("title", e.toString()), n.setAttribute("style", "color:" + a.errorColor), n;
}, Nt = function(e, t) {
  var a = new ct(t);
  try {
    var n = Ct(e, a);
    return g1(n, e, a);
  } catch (s) {
    return ua(s, e, a);
  }
}, u4 = function(e, t) {
  var a = new ct(t);
  try {
    var n = Ct(e, a);
    return b1(n, e, a);
  } catch (s) {
    return ua(s, e, a);
  }
}, h4 = {
  /**
   * Current KaTeX version
   */
  version: "0.16.9",
  /**
   * Renders the given LaTeX into an HTML+MathML combination, and adds
   * it as a child to the specified DOM node.
   */
  render: oa,
  /**
   * Renders the given LaTeX into an HTML+MathML combination string,
   * for sending to the client.
   */
  renderToString: l4,
  /**
   * KaTeX error, usually during parsing.
   */
  ParseError: M,
  /**
   * The shema of Settings
   */
  SETTINGS_SCHEMA: Ae,
  /**
   * Parses the given LaTeX into KaTeX's internal parse tree structure,
   * without rendering to HTML or MathML.
   *
   * NOTE: This method is not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __parse: o4,
  /**
   * Renders the given LaTeX into an HTML+MathML internal DOM tree
   * representation, without flattening that representation to a string.
   *
   * NOTE: This method is not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __renderToDomTree: Nt,
  /**
   * Renders the given LaTeX into an HTML internal DOM tree representation,
   * without MathML and without flattening that representation to a string.
   *
   * NOTE: This method is not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __renderToHTMLTree: u4,
  /**
   * extends internal font metrics object with a new object
   * each key in the new object represents a font name
  */
  __setFontMetrics: Ga,
  /**
   * adds a new symbol to builtin symbols table
   */
  __defineSymbol: i,
  /**
   * adds a new function to builtin function list,
   * which directly produce parse tree elements
   * and have their own html/mathml builders
   */
  __defineFunction: B,
  /**
   * adds a new macro to builtin macro list
   */
  __defineMacro: m,
  /**
   * Expose the dom tree node types, which can be useful for type checking nodes.
   *
   * NOTE: This method is not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __domTree: {
    Span: me,
    Anchor: pt,
    SymbolNode: f0,
    SvgNode: D0,
    PathNode: P0,
    LineNode: it
  }
};
export {
  h4 as default
};
