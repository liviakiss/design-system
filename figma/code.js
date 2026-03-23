// ============================================================
// ALIVE Design Studio — Design System Builder
// Run via: Plugins > Development > Import plugin from manifest
// ============================================================

async function buildDesignSystem() {

  // ── Font loading ─────────────────────────────────────────
  await Promise.all([
    figma.loadFontAsync({ family: "Cormorant Garamond", style: "Light" }),
    figma.loadFontAsync({ family: "Cormorant Garamond", style: "Regular" }),
    figma.loadFontAsync({ family: "DM Sans", style: "Regular" }),
    figma.loadFontAsync({ family: "DM Sans", style: "Medium" }),
  ]);

  // ── Colour helpers ───────────────────────────────────────
  function rgb(hex) {
    return {
      r: parseInt(hex.slice(1, 3), 16) / 255,
      g: parseInt(hex.slice(3, 5), 16) / 255,
      b: parseInt(hex.slice(5, 7), 16) / 255,
    };
  }

  function solid(hex, opacity) {
    const paint = { type: "SOLID", color: rgb(hex) };
    if (opacity !== undefined) paint.opacity = opacity;
    return [paint];
  }

  // ── Colour tokens ────────────────────────────────────────
  const C = {
    primary:    "#48252F",
    accent:     "#857861",
    background: "#101211",
    surface:    "#292818",
    surface2:   "#32301F",
    cream:      "#E7D4BB",
    muted:      "#6B6050",
    danger:     "#C0392B",
    warning:    "#C8923A",
    success:    "#6B8C5A",
  };

  // ── Text helper ──────────────────────────────────────────
  function makeText(str, family, style, size, colorHex, opts) {
    opts = opts || {};
    const t = figma.createText();
    t.fontName = { family, style };
    t.fontSize = size;
    t.characters = str;
    t.fills = solid(colorHex);
    if (opts.letterSpacing !== undefined)
      t.letterSpacing = { value: opts.letterSpacing * 100, unit: "PERCENT" };
    if (opts.lineHeight !== undefined)
      t.lineHeight = { value: opts.lineHeight * 100, unit: "PERCENT" };
    if (opts.upper) t.textCase = "UPPER";
    return t;
  }

  // ── Auto-layout helper ───────────────────────────────────
  function al(node, dir, gap, padH, padV) {
    node.layoutMode = dir;
    node.itemSpacing = gap || 0;
    node.paddingLeft   = padH || 0;
    node.paddingRight  = padH || 0;
    node.paddingTop    = padV || 0;
    node.paddingBottom = padV || 0;
    node.primaryAxisSizingMode  = "AUTO";
    node.counterAxisSizingMode  = "AUTO";
  }

  // ── Divider line ─────────────────────────────────────────
  function hairline(width) {
    const r = figma.createRectangle();
    r.resize(width, 1);
    r.fills = solid(C.cream, 0.15);
    return r;
  }

  // ── Section header (for Foundations page) ────────────────
  function makeFoundSection(title, parent) {
    const section = figma.createFrame();
    section.name = title;
    al(section, "VERTICAL", 32, 0, 0);
    section.fills = [];

    const lbl = makeText(title.toUpperCase(), "DM Sans", "Medium", 11, C.muted,
      { letterSpacing: 0.1, upper: true });
    section.appendChild(lbl);
    section.appendChild(hairline(1280));
    parent.appendChild(section);
    return section;
  }

  // ── Section header (for Components page) ─────────────────
  function makeCompSection(title, parent) {
    const section = figma.createFrame();
    section.name = title;
    al(section, "VERTICAL", 32, 0, 0);
    section.fills = [];

    const lbl = makeText(title.toUpperCase(), "DM Sans", "Medium", 11, C.muted,
      { letterSpacing: 0.1, upper: true });
    section.appendChild(lbl);
    section.appendChild(hairline(1280));
    parent.appendChild(section);
    return section;
  }

  // ── Canvas wrapper ───────────────────────────────────────
  function makeCanvas(name, page) {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = "VERTICAL";
    f.itemSpacing = 80;
    f.paddingLeft = f.paddingRight = 80;
    f.paddingTop = f.paddingBottom = 80;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "FIXED";
    f.resize(1440, 100);
    f.fills = solid(C.background);
    page.appendChild(f);
    return f;
  }

  // ════════════════════════════════════════════════════════
  // PAGES
  // ════════════════════════════════════════════════════════
  figma.root.children[0].name = "Foundations";
  const page1 = figma.root.children[0];

  let page2 = figma.root.children[1];
  if (!page2) page2 = figma.createPage();
  page2.name = "Components";

  // ════════════════════════════════════════════════════════
  // PAGE 1 — FOUNDATIONS
  // ════════════════════════════════════════════════════════
  figma.currentPage = page1;
  const found = makeCanvas("Foundations", page1);

  // ── 1. Colour Palette ────────────────────────────────────
  const colSec = makeFoundSection("Colour Tokens", found);
  const swatchRow = figma.createFrame();
  swatchRow.name = "Swatches";
  al(swatchRow, "HORIZONTAL", 16, 0, 0);
  swatchRow.fills = [];

  const palette = [
    { name: "Primary",    hex: C.primary },
    { name: "Accent",     hex: C.accent },
    { name: "Background", hex: C.background },
    { name: "Surface",    hex: C.surface },
    { name: "Surface 2",  hex: C.surface2 },
    { name: "Cream",      hex: C.cream },
    { name: "Muted",      hex: C.muted },
    { name: "Danger",     hex: C.danger },
    { name: "Warning",    hex: C.warning },
    { name: "Success",    hex: C.success },
  ];

  for (const tok of palette) {
    const chip = figma.createFrame();
    chip.name = `Swatch/${tok.name}`;
    al(chip, "VERTICAL", 8, 0, 0);
    chip.paddingBottom = 4;
    chip.fills = [];

    const rect = figma.createRectangle();
    rect.resize(112, 80);
    rect.cornerRadius = 4;
    rect.fills = solid(tok.hex);
    if (tok.hex === C.background) {
      rect.strokes = solid(C.cream, 0.12);
      rect.strokeWeight = 1;
    }
    chip.appendChild(rect);
    chip.appendChild(makeText(tok.name, "DM Sans", "Medium", 12, C.cream));
    chip.appendChild(makeText(tok.hex, "DM Sans", "Regular", 11, C.muted));
    swatchRow.appendChild(chip);
  }
  colSec.appendChild(swatchRow);

  // ── 2. Typography ────────────────────────────────────────
  const typSec = makeFoundSection("Typography Scale", found);
  const typeStack = figma.createFrame();
  typeStack.name = "Type Specimens";
  al(typeStack, "VERTICAL", 28, 0, 0);
  typeStack.fills = [];

  const typeScale = [
    { name: "Display", family: "Cormorant Garamond", style: "Light",   size: 56, lh: 1.05, ls: -0.02 },
    { name: "H1",      family: "Cormorant Garamond", style: "Regular", size: 40, lh: 1.1 },
    { name: "H2",      family: "Cormorant Garamond", style: "Regular", size: 30, lh: 1.2 },
    { name: "H3",      family: "DM Sans",            style: "Medium",  size: 22, lh: 1.3 },
    { name: "H4",      family: "DM Sans",            style: "Medium",  size: 18, lh: 1.4 },
    { name: "Body",    family: "DM Sans",            style: "Regular", size: 16, lh: 1.75 },
    { name: "Small",   family: "DM Sans",            style: "Regular", size: 13, lh: 1.65 },
    { name: "Caption", family: "DM Sans",            style: "Regular", size: 11, lh: 1.5, ls: 0.06 },
    { name: "Label",   family: "DM Sans",            style: "Medium",  size: 11, lh: 1.5, ls: 0.1, upper: true },
  ];

  for (const t of typeScale) {
    const row = figma.createFrame();
    row.name = `Type/${t.name}`;
    al(row, "HORIZONTAL", 24, 0, 0);
    row.fills = [];
    row.counterAxisAlignItems = "CENTER";

    const tag = makeText(t.name, "DM Sans", "Regular", 11, C.muted);
    tag.resize(68, tag.height);
    tag.textAutoResize = "HEIGHT";
    row.appendChild(tag);

    const sample = makeText(
      t.upper ? "THE QUIET ART OF MAKING" : "The quiet art of making",
      t.family, t.style, t.size, C.cream,
      { lineHeight: t.lh, letterSpacing: t.ls }
    );
    if (t.upper) sample.textCase = "UPPER";
    row.appendChild(sample);
    typeStack.appendChild(row);
  }
  typSec.appendChild(typeStack);

  // ── 3. Spacing Scale ─────────────────────────────────────
  const spSec = makeFoundSection("Spacing Scale", found);
  const spRow = figma.createFrame();
  spRow.name = "Spacing Values";
  al(spRow, "HORIZONTAL", 24, 0, 0);
  spRow.fills = [];
  spRow.counterAxisAlignItems = "MAX";

  for (const sp of [4, 8, 12, 20, 32, 48, 64, 80, 120, 160]) {
    const item = figma.createFrame();
    item.name = `Space/${sp}`;
    al(item, "VERTICAL", 8, 0, 0);
    item.fills = [];
    item.counterAxisAlignItems = "CENTER";

    const bar = figma.createRectangle();
    bar.resize(Math.min(sp, 80), 4);
    bar.cornerRadius = 2;
    bar.fills = solid(C.cream, 0.25);
    item.appendChild(bar);
    item.appendChild(makeText(`${sp}`, "DM Sans", "Regular", 10, C.muted));
    spRow.appendChild(item);
  }
  spSec.appendChild(spRow);

  // ── 4. Border Radius ─────────────────────────────────────
  const brSec = makeFoundSection("Border Radius", found);
  const brRow = figma.createFrame();
  brRow.name = "Radius Values";
  al(brRow, "HORIZONTAL", 32, 0, 0);
  brRow.fills = [];

  for (const r of [
    { name: "none", val: 0 },
    { name: "xs",   val: 2 },
    { name: "sm",   val: 4 },
    { name: "md",   val: 6 },
    { name: "lg",   val: 10 },
    { name: "full", val: 999 },
  ]) {
    const item = figma.createFrame();
    item.name = `Radius/${r.name}`;
    al(item, "VERTICAL", 8, 0, 0);
    item.fills = [];
    item.counterAxisAlignItems = "CENTER";

    const sq = figma.createRectangle();
    sq.resize(64, 64);
    sq.fills = solid(C.surface2);
    sq.strokes = solid(C.accent, 0.3);
    sq.strokeWeight = 1;
    sq.cornerRadius = r.val;
    item.appendChild(sq);

    const lbl = makeText(`${r.name}\n${r.val === 999 ? "999px" : r.val + "px"}`,
      "DM Sans", "Regular", 11, C.muted);
    lbl.textAlignHorizontal = "CENTER";
    item.appendChild(lbl);
    brRow.appendChild(item);
  }
  brSec.appendChild(brRow);

  // ════════════════════════════════════════════════════════
  // PAGE 2 — COMPONENTS
  // ════════════════════════════════════════════════════════
  figma.currentPage = page2;
  const comp = makeCanvas("Components", page2);

  // Helper: styled component-set wrapper
  function wrapSet(set, dir) {
    set.layoutMode = dir || "HORIZONTAL";
    set.itemSpacing = 20;
    set.paddingLeft = set.paddingRight = 24;
    set.paddingTop = set.paddingBottom = 24;
    set.fills = solid(C.surface, 0.5);
    set.primaryAxisSizingMode = "AUTO";
    set.counterAxisSizingMode = "AUTO";
  }

  // ── BUTTONS ──────────────────────────────────────────────
  const btnSec = makeCompSection("Button", comp);

  const btnVariants = [
    { variant: "Primary",   bg: C.primary, text: C.cream, border: null },
    { variant: "Secondary", bg: null,       text: C.cream, border: C.cream },
    { variant: "Ghost",     bg: null,       text: C.cream, border: null },
    { variant: "Subtle",    bg: C.accent,   text: C.background, border: null },
  ];
  const btnStates = [
    { state: "Default",  bgMult: 1,    textMult: 1 },
    { state: "Hover",    bgMult: 0.82, textMult: 1 },
    { state: "Active",   bgMult: 0.65, textMult: 1 },
    { state: "Disabled", bgMult: 0.35, textMult: 0.4 },
  ];
  const btnSizes = [
    { size: "sm", height: 32, fontSize: 12, padV: 7 },
    { size: "md", height: 40, fontSize: 14, padV: 11 },
    { size: "lg", height: 48, fontSize: 15, padV: 14 },
  ];

  const allBtns = [];
  for (const sz of btnSizes) {
    for (const bv of btnVariants) {
      for (const st of btnStates) {
        const btn = figma.createComponent();
        btn.name = `Size=${sz.size}, Variant=${bv.variant}, State=${st.state}`;
        btn.layoutMode = "HORIZONTAL";
        btn.primaryAxisSizingMode = "AUTO";
        btn.counterAxisSizingMode = "AUTO";
        btn.paddingLeft = btn.paddingRight = 20;
        btn.paddingTop = btn.paddingBottom = sz.padV;
        btn.primaryAxisAlignItems = "CENTER";
        btn.counterAxisAlignItems = "CENTER";
        btn.cornerRadius = 2;

        if (bv.bg) {
          btn.fills = [{ type: "SOLID", color: rgb(bv.bg), opacity: st.bgMult }];
        } else {
          btn.fills = [];
        }
        if (bv.border) {
          btn.strokes = [{ type: "SOLID", color: rgb(bv.border),
            opacity: st.state === "Disabled" ? 0.35 : 1 }];
          btn.strokeWeight = 1;
        }

        const lbl = figma.createText();
        lbl.fontName = { family: "DM Sans", style: "Medium" };
        lbl.fontSize = sz.fontSize;
        lbl.characters = "Button";
        lbl.fills = [{ type: "SOLID", color: rgb(bv.text), opacity: st.textMult }];
        btn.appendChild(lbl);
        allBtns.push(btn);
      }
    }
  }

  const btnSet = figma.combineAsVariants(allBtns, figma.currentPage);
  btnSet.name = "Button";
  wrapSet(btnSet, "HORIZONTAL");
  btnSet.layoutWrap = "WRAP";
  btnSet.counterAxisSpacing = 16;
  btnSec.appendChild(btnSet);

  // ── INPUT FIELD ──────────────────────────────────────────
  const inputSec = makeCompSection("Input", comp);

  const inputStates = [
    { state: "Default",  border: C.accent, bOpacity: 0.3,  phColor: C.muted,  phText: "Placeholder text" },
    { state: "Focused",  border: C.accent, bOpacity: 1,    phColor: C.cream,  phText: "Focused value" },
    { state: "Error",    border: C.danger, bOpacity: 1,    phColor: C.muted,  phText: "Invalid value" },
    { state: "Disabled", border: C.accent, bOpacity: 0.15, phColor: C.muted,  phText: "Placeholder text" },
  ];
  const allInputs = [];

  for (const is of inputStates) {
    const wrap = figma.createComponent();
    wrap.name = `State=${is.state}`;
    al(wrap, "VERTICAL", 6, 0, 0);
    wrap.fills = [];

    const lbl = makeText("FIELD LABEL", "DM Sans", "Medium", 11, C.muted,
      { letterSpacing: 0.1, upper: true });
    wrap.appendChild(lbl);

    const box = figma.createFrame();
    box.name = "Input Box";
    box.layoutMode = "HORIZONTAL";
    box.paddingLeft = box.paddingRight = 12;
    box.paddingTop = box.paddingBottom = 0;
    box.primaryAxisSizingMode = "FIXED";
    box.counterAxisSizingMode = "FIXED";
    box.resize(240, 40);
    box.fills = solid(C.surface);
    box.strokes = [{ type: "SOLID", color: rgb(is.border), opacity: is.bOpacity }];
    box.strokeWeight = 1;
    box.cornerRadius = 2;
    box.primaryAxisAlignItems = "MIN";
    box.counterAxisAlignItems = "CENTER";
    if (is.state === "Disabled") box.opacity = 0.5;

    box.appendChild(makeText(is.phText, "DM Sans", "Regular", 14, is.phColor));
    wrap.appendChild(box);

    wrap.appendChild(makeText(
      is.state === "Error" ? "This field is required." : "Helper text goes here.",
      "DM Sans", "Regular", 11,
      is.state === "Error" ? C.danger : C.muted
    ));
    allInputs.push(wrap);
  }

  const inputSet = figma.combineAsVariants(allInputs, figma.currentPage);
  inputSet.name = "Input";
  wrapSet(inputSet, "HORIZONTAL");
  inputSec.appendChild(inputSet);

  // ── BADGE / TAG ───────────────────────────────────────────
  const badgeSec = makeCompSection("Badge", comp);

  const badgeVariants = [
    { variant: "Primary", bg: C.primary, text: C.cream },
    { variant: "Accent",  bg: C.accent,  text: C.background },
    { variant: "Success", bg: C.success, text: C.cream },
    { variant: "Warning", bg: C.warning, text: C.background },
    { variant: "Danger",  bg: C.danger,  text: C.cream },
    { variant: "Neutral", bg: C.muted,   text: C.cream },
  ];
  const allBadges = [];

  for (const bv of badgeVariants) {
    const badge = figma.createComponent();
    badge.name = `Variant=${bv.variant}`;
    badge.layoutMode = "HORIZONTAL";
    badge.primaryAxisSizingMode = "AUTO";
    badge.counterAxisSizingMode = "AUTO";
    badge.paddingLeft = badge.paddingRight = 10;
    badge.paddingTop = badge.paddingBottom = 3;
    badge.cornerRadius = 2;
    badge.fills = solid(bv.bg);
    badge.primaryAxisAlignItems = "CENTER";
    badge.counterAxisAlignItems = "CENTER";

    const lbl = makeText(bv.variant.toUpperCase(), "DM Sans", "Medium", 11, bv.text,
      { letterSpacing: 0.1, upper: true });
    badge.appendChild(lbl);
    allBadges.push(badge);
  }

  const badgeSet = figma.combineAsVariants(allBadges, figma.currentPage);
  badgeSet.name = "Badge";
  wrapSet(badgeSet, "HORIZONTAL");
  badgeSec.appendChild(badgeSet);

  // ── AVATAR ───────────────────────────────────────────────
  const avatarSec = makeCompSection("Avatar", comp);
  const avatarSizes = [
    { size: "sm", px: 32, fontSize: 11 },
    { size: "md", px: 40, fontSize: 13 },
    { size: "lg", px: 56, fontSize: 17 },
  ];
  const allAvatars = [];

  for (const av of avatarSizes) {
    // Initials
    const init = figma.createComponent();
    init.name = `Size=${av.size}, Type=Initials`;
    init.layoutMode = "HORIZONTAL";
    init.primaryAxisSizingMode = "FIXED";
    init.counterAxisSizingMode = "FIXED";
    init.resize(av.px, av.px);
    init.cornerRadius = av.px / 2;
    init.fills = solid(C.surface2);
    init.strokes = [{ type: "SOLID", color: rgb(C.accent), opacity: 0.5 }];
    init.strokeWeight = 1;
    init.primaryAxisAlignItems = "CENTER";
    init.counterAxisAlignItems = "CENTER";
    const initLbl = figma.createText();
    initLbl.fontName = { family: "DM Sans", style: "Medium" };
    initLbl.fontSize = av.fontSize;
    initLbl.characters = "AB";
    initLbl.fills = solid(C.cream);
    init.appendChild(initLbl);
    allAvatars.push(init);

    // Photo placeholder
    const photo = figma.createComponent();
    photo.name = `Size=${av.size}, Type=Photo`;
    photo.layoutMode = "HORIZONTAL";
    photo.primaryAxisSizingMode = "FIXED";
    photo.counterAxisSizingMode = "FIXED";
    photo.resize(av.px, av.px);
    photo.cornerRadius = av.px / 2;
    photo.fills = solid(C.muted, 0.5);
    photo.strokes = [{ type: "SOLID", color: rgb(C.accent), opacity: 0.3 }];
    photo.strokeWeight = 1;
    photo.primaryAxisAlignItems = "CENTER";
    photo.counterAxisAlignItems = "CENTER";
    const photoLbl = figma.createText();
    photoLbl.fontName = { family: "DM Sans", style: "Regular" };
    photoLbl.fontSize = av.fontSize - 2;
    photoLbl.characters = "IMG";
    photoLbl.fills = solid(C.cream, 0.6);
    photo.appendChild(photoLbl);
    allAvatars.push(photo);
  }

  const avatarSet = figma.combineAsVariants(allAvatars, figma.currentPage);
  avatarSet.name = "Avatar";
  wrapSet(avatarSet, "HORIZONTAL");
  avatarSet.counterAxisAlignItems = "CENTER";
  avatarSec.appendChild(avatarSet);

  // ── DIVIDER ──────────────────────────────────────────────
  const divSec = makeCompSection("Divider", comp);
  const allDividers = [];

  const hDiv = figma.createComponent();
  hDiv.name = "Type=Horizontal";
  hDiv.layoutMode = "HORIZONTAL";
  hDiv.primaryAxisSizingMode = "FIXED";
  hDiv.counterAxisSizingMode = "FIXED";
  hDiv.resize(320, 1);
  hDiv.fills = solid(C.cream, 0.15);
  allDividers.push(hDiv);

  const dDiv = figma.createComponent();
  dDiv.name = "Type=Decorative";
  dDiv.layoutMode = "HORIZONTAL";
  dDiv.primaryAxisSizingMode = "AUTO";
  dDiv.counterAxisSizingMode = "AUTO";
  dDiv.itemSpacing = 12;
  dDiv.fills = [];
  dDiv.counterAxisAlignItems = "CENTER";

  const ll = figma.createRectangle(); ll.resize(120, 1); ll.fills = solid(C.cream, 0.15);
  dDiv.appendChild(ll);
  dDiv.appendChild(makeText("◆", "DM Sans", "Regular", 10, C.muted));
  const rl = figma.createRectangle(); rl.resize(120, 1); rl.fills = solid(C.cream, 0.15);
  dDiv.appendChild(rl);
  allDividers.push(dDiv);

  const divSet = figma.combineAsVariants(allDividers, figma.currentPage);
  divSet.name = "Divider";
  wrapSet(divSet, "VERTICAL");
  divSec.appendChild(divSet);

  // ── CARD ─────────────────────────────────────────────────
  const cardSec = makeCompSection("Card", comp);
  const allCards = [];

  // Content card
  const contentCard = figma.createComponent();
  contentCard.name = "Type=Content";
  contentCard.layoutMode = "VERTICAL";
  contentCard.primaryAxisSizingMode = "FIXED";
  contentCard.counterAxisSizingMode = "FIXED";
  contentCard.resize(300, 340);
  contentCard.fills = solid(C.surface);
  contentCard.strokes = [{ type: "SOLID", color: rgb(C.accent), opacity: 0.2 }];
  contentCard.strokeWeight = 1;
  contentCard.cornerRadius = 6;
  contentCard.clipsContent = true;
  contentCard.itemSpacing = 0;

  const imgArea = figma.createRectangle();
  imgArea.resize(300, 140);
  imgArea.fills = solid(C.muted, 0.4);
  contentCard.appendChild(imgArea);

  const cBody = figma.createFrame();
  cBody.name = "Body";
  al(cBody, "VERTICAL", 12, 28, 24);
  cBody.fills = [];

  cBody.appendChild(makeText("Card Title", "DM Sans", "Medium", 22, C.cream, { lineHeight: 1.3 }));
  const cDesc = makeText("A short description that sets the tone.", "DM Sans", "Regular", 14, C.muted, { lineHeight: 1.75 });
  cDesc.textAutoResize = "HEIGHT";
  cDesc.resize(244, cDesc.height);
  cBody.appendChild(cDesc);
  cBody.appendChild(makeText("Learn more →", "DM Sans", "Medium", 13, C.accent));
  contentCard.appendChild(cBody);
  allCards.push(contentCard);

  // Feature card
  const featureCard = figma.createComponent();
  featureCard.name = "Type=Feature";
  featureCard.layoutMode = "HORIZONTAL";
  featureCard.primaryAxisSizingMode = "FIXED";
  featureCard.counterAxisSizingMode = "AUTO";
  featureCard.resize(300, 100);
  featureCard.paddingRight = 28;
  featureCard.paddingTop = featureCard.paddingBottom = 28;
  featureCard.itemSpacing = 20;
  featureCard.fills = solid(C.surface);
  featureCard.strokes = [{ type: "SOLID", color: rgb(C.accent), opacity: 0.2 }];
  featureCard.strokeWeight = 1;
  featureCard.cornerRadius = 6;
  featureCard.counterAxisAlignItems = "MIN";

  const accentBar = figma.createRectangle();
  accentBar.resize(3, 24);
  accentBar.layoutGrow = 1;
  accentBar.fills = solid(C.primary);
  featureCard.appendChild(accentBar);

  const fBody = figma.createFrame();
  al(fBody, "VERTICAL", 8, 0, 0);
  fBody.fills = [];
  fBody.appendChild(makeText("Feature Title", "DM Sans", "Medium", 18, C.cream, { lineHeight: 1.4 }));
  const fDesc = makeText("Short description of this feature.", "DM Sans", "Regular", 14, C.muted, { lineHeight: 1.75 });
  fDesc.textAutoResize = "HEIGHT";
  fDesc.resize(220, fDesc.height);
  fBody.appendChild(fDesc);
  featureCard.appendChild(fBody);
  allCards.push(featureCard);

  const cardSet = figma.combineAsVariants(allCards, figma.currentPage);
  cardSet.name = "Card";
  wrapSet(cardSet, "HORIZONTAL");
  cardSet.counterAxisAlignItems = "MIN";
  cardSec.appendChild(cardSet);

  // ── NAVIGATION BAR ───────────────────────────────────────
  const navSec = makeCompSection("Navigation", comp);

  const navBar = figma.createComponent();
  navBar.name = "Navigation/Bar";
  navBar.layoutMode = "HORIZONTAL";
  navBar.primaryAxisSizingMode = "FIXED";
  navBar.counterAxisSizingMode = "FIXED";
  navBar.resize(1280, 68);
  navBar.paddingLeft = navBar.paddingRight = 40;
  navBar.fills = solid(C.background);
  navBar.strokes = [{ type: "SOLID", color: rgb(C.accent), opacity: 0.15 }];
  navBar.strokeWeight = 1;
  navBar.strokeAlign = "INSIDE";
  navBar.primaryAxisAlignItems = "SPACE_BETWEEN";
  navBar.counterAxisAlignItems = "CENTER";
  navBar.itemSpacing = 0;

  const logoText = makeText("STUDIO", "DM Sans", "Medium", 14, C.cream,
    { letterSpacing: 0.15, upper: true });
  navBar.appendChild(logoText);

  const navLinks = figma.createFrame();
  al(navLinks, "HORIZONTAL", 32, 0, 0);
  navLinks.fills = [];
  navLinks.counterAxisAlignItems = "CENTER";
  for (const link of ["Work", "Process", "About", "Journal"]) {
    const navLink = makeText(link.toUpperCase(), "DM Sans", "Regular", 11, C.muted,
      { letterSpacing: 0.1, upper: true });
    navLinks.appendChild(navLink);
  }
  navBar.appendChild(navLinks);

  const navCta = figma.createFrame();
  navCta.layoutMode = "HORIZONTAL";
  navCta.primaryAxisSizingMode = "AUTO";
  navCta.counterAxisSizingMode = "AUTO";
  navCta.paddingLeft = navCta.paddingRight = 20;
  navCta.paddingTop = navCta.paddingBottom = 10;
  navCta.cornerRadius = 2;
  navCta.fills = solid(C.primary);
  navCta.primaryAxisAlignItems = "CENTER";
  navCta.counterAxisAlignItems = "CENTER";
  navCta.appendChild(makeText("Get in touch", "DM Sans", "Medium", 12, C.cream));
  navBar.appendChild(navCta);

  navSec.appendChild(navBar);

  // ── TOAST NOTIFICATION ───────────────────────────────────
  const toastSec = makeCompSection("Toast", comp);
  const toastVariants = [
    { variant: "Success", color: C.success },
    { variant: "Error",   color: C.danger },
    { variant: "Warning", color: C.warning },
    { variant: "Info",    color: C.primary },
  ];
  const allToasts = [];

  for (const tv of toastVariants) {
    const toast = figma.createComponent();
    toast.name = `Variant=${tv.variant}`;
    toast.layoutMode = "HORIZONTAL";
    toast.primaryAxisSizingMode = "FIXED";
    toast.counterAxisSizingMode = "AUTO";
    toast.resize(360, 100);
    toast.paddingRight = 16;
    toast.paddingTop = toast.paddingBottom = 14;
    toast.itemSpacing = 12;
    toast.fills = solid(C.surface);
    toast.cornerRadius = 4;
    toast.counterAxisAlignItems = "CENTER";
    toast.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.4 },
      offset: { x: 0, y: 4 },
      radius: 16,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    }];

    const accent = figma.createRectangle();
    accent.resize(3, 48);
    accent.fills = solid(tv.color);
    toast.appendChild(accent);

    const tContent = figma.createFrame();
    al(tContent, "VERTICAL", 2, 0, 0);
    tContent.fills = [];
    tContent.appendChild(makeText(tv.variant, "DM Sans", "Medium", 13, C.cream));
    tContent.appendChild(makeText("This is a notification message.", "DM Sans", "Regular", 12, C.muted));
    toast.appendChild(tContent);

    // Spacer
    const sp = figma.createFrame();
    sp.name = "Spacer";
    sp.fills = [];
    sp.layoutGrow = 1;
    sp.primaryAxisSizingMode = "FIXED";
    sp.counterAxisSizingMode = "FIXED";
    sp.resize(1, 1);
    toast.appendChild(sp);

    toast.appendChild(makeText("✕", "DM Sans", "Regular", 12, C.muted));
    allToasts.push(toast);
  }

  const toastSet = figma.combineAsVariants(allToasts, figma.currentPage);
  toastSet.name = "Toast";
  wrapSet(toastSet, "VERTICAL");
  toastSec.appendChild(toastSet);

  // ── MODAL / DIALOG ───────────────────────────────────────
  const modalSec = makeCompSection("Modal", comp);

  const modal = figma.createComponent();
  modal.name = "Modal/Dialog";
  modal.layoutMode = "VERTICAL";
  modal.primaryAxisSizingMode = "FIXED";
  modal.counterAxisSizingMode = "AUTO";
  modal.resize(480, 100);
  modal.paddingLeft = modal.paddingRight = 36;
  modal.paddingTop = modal.paddingBottom = 36;
  modal.itemSpacing = 24;
  modal.fills = solid(C.surface);
  modal.cornerRadius = 6;
  modal.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.55 },
    offset: { x: 0, y: 8 },
    radius: 40,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];

  modal.appendChild(makeText("Confirm Action", "DM Sans", "Medium", 22, C.cream, { lineHeight: 1.3 }));

  const mBody = makeText(
    "Are you sure you want to proceed? This action cannot be undone.",
    "DM Sans", "Regular", 14, C.muted, { lineHeight: 1.75 }
  );
  mBody.textAutoResize = "HEIGHT";
  mBody.resize(408, mBody.height);
  modal.appendChild(mBody);

  modal.appendChild(hairline(408));

  const mFooter = figma.createFrame();
  al(mFooter, "HORIZONTAL", 12, 0, 0);
  mFooter.fills = [];
  mFooter.primaryAxisAlignItems = "MAX";

  const cancelBtn = figma.createFrame();
  cancelBtn.name = "Cancel";
  cancelBtn.layoutMode = "HORIZONTAL";
  cancelBtn.primaryAxisSizingMode = "AUTO";
  cancelBtn.counterAxisSizingMode = "AUTO";
  cancelBtn.paddingLeft = cancelBtn.paddingRight = 20;
  cancelBtn.paddingTop = cancelBtn.paddingBottom = 11;
  cancelBtn.cornerRadius = 2;
  cancelBtn.fills = [];
  cancelBtn.primaryAxisAlignItems = "CENTER";
  cancelBtn.counterAxisAlignItems = "CENTER";
  cancelBtn.appendChild(makeText("Cancel", "DM Sans", "Medium", 14, C.cream));
  mFooter.appendChild(cancelBtn);

  const confirmBtn = figma.createFrame();
  confirmBtn.name = "Confirm";
  confirmBtn.layoutMode = "HORIZONTAL";
  confirmBtn.primaryAxisSizingMode = "AUTO";
  confirmBtn.counterAxisSizingMode = "AUTO";
  confirmBtn.paddingLeft = confirmBtn.paddingRight = 20;
  confirmBtn.paddingTop = confirmBtn.paddingBottom = 11;
  confirmBtn.cornerRadius = 2;
  confirmBtn.fills = solid(C.primary);
  confirmBtn.primaryAxisAlignItems = "CENTER";
  confirmBtn.counterAxisAlignItems = "CENTER";
  confirmBtn.appendChild(makeText("Confirm", "DM Sans", "Medium", 14, C.cream));
  mFooter.appendChild(confirmBtn);

  modal.appendChild(mFooter);
  modalSec.appendChild(modal);

  // ── FORM GROUP ───────────────────────────────────────────
  const formSec = makeCompSection("Form Group", comp);

  const formGroup = figma.createComponent();
  formGroup.name = "Form/Group";
  formGroup.layoutMode = "VERTICAL";
  formGroup.primaryAxisSizingMode = "FIXED";
  formGroup.counterAxisSizingMode = "AUTO";
  formGroup.resize(280, 100);
  formGroup.itemSpacing = 6;
  formGroup.fills = [];

  const fgLbl = makeText("EMAIL ADDRESS", "DM Sans", "Medium", 11, C.cream,
    { letterSpacing: 0.1, upper: true });
  formGroup.appendChild(fgLbl);

  const fgBox = figma.createFrame();
  fgBox.name = "Input";
  fgBox.layoutMode = "HORIZONTAL";
  fgBox.primaryAxisSizingMode = "FIXED";
  fgBox.counterAxisSizingMode = "FIXED";
  fgBox.resize(280, 40);
  fgBox.paddingLeft = fgBox.paddingRight = 12;
  fgBox.fills = solid(C.surface);
  fgBox.strokes = [{ type: "SOLID", color: rgb(C.accent), opacity: 0.3 }];
  fgBox.strokeWeight = 1;
  fgBox.cornerRadius = 2;
  fgBox.primaryAxisAlignItems = "MIN";
  fgBox.counterAxisAlignItems = "CENTER";
  fgBox.appendChild(makeText("you@example.com", "DM Sans", "Regular", 14, C.muted));
  formGroup.appendChild(fgBox);

  formGroup.appendChild(makeText("We'll never share your email.", "DM Sans", "Regular", 11, C.muted));
  formSec.appendChild(formGroup);

  // ── Scroll into view ─────────────────────────────────────
  figma.currentPage = page1;
  figma.viewport.scrollAndZoomIntoView([found]);

  figma.closePlugin("✓ Design system built. Check Foundations + Components pages.");
}

buildDesignSystem().catch(err => {
  figma.closePlugin("Error: " + err.message);
});
