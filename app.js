/* SignalBar Concept Lab: a browser-only visual simulator, not the plugin runtime. */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const OFF = [0, 0, 0];
const WHITE = [246, 249, 255];
const CYAN = [67, 214, 225];
const ICE = [215, 240, 250];
const BLUE = [55, 132, 205];
const GOLD = [255, 196, 73];
const CHAMPAGNE = [255, 238, 170];
const PINK = [245, 98, 166];
const RED = [229, 54, 70];
const GREEN = [0, 180, 45];
const GAME_DATA = {
  drg: { title: "Deep Rock Galactic", id: "548430" },
  witcher: { title: "The Witcher 3: Wild Hunt", id: "292030" },
  balatro: { title: "Balatro", id: "2379780" },
};
const IMAGE_LABELS = { hero: "Library Hero", header: "Library Header", capsule: "Library Capsule" };
const PALETTES = {
  classic: ["#00b42d", "#f1ca25", "#e83b39"],
  thermal: ["#24c5e7", "#f2a724", "#e52239"],
  icefire: ["#287beb", "#a65be8", "#f98ac1"],
};
const START_COLOURS = { cyan: "#19c3eb", green: "#2dcd69", amber: "#f5a523", violet: "#a555eb", white: "#e1ebf5" };
const EVENT_OPTIONS = {
  notification: [
    ["notification-original", "Original · cyan crossing", "One quick cyan crossing."],
    ["notification-return", "Out and back", "A cyan glint crosses the bar and returns."],
    ["notification-echo", "Centre echo", "A centre call sends two waves towards the edges."],
    ["notification-ample", "Wide echo", "A bright centre call, one broad wave, then a softer echo."],
    ["notification-double", "Double halo", "Two separate centre pulses send halos to the edges."],
    ["notification-beacon", "Return beacon", "The edges answer a centre beacon and return to it."],
  ],
  achievement: [
    ["achievement-original", "Original · gold celebration", "Three centre beats open into a full gold bar."],
    ["achievement-confetti", "Return + confetti", "Gold opens, returns to centre and bursts into colours."],
    ["achievement-rebound", "Chromatic rebound", "Two gold ribbons rebound from the edges and collide in colour."],
    ["achievement-constellation", "Constellation", "Stars light in sequence, connect and radiate."],
    ["achievement-twoway", "Constellation round trip", "A line connects the stars in both directions, flashing at each end."],
    ["achievement-supernova", "Supernova", "Stars gather at centre, explode and leave a shimmering trail."],
  ],
  screenshot: [
    ["screenshot-original", "Original · ice shutter", "Two icy blades close like a camera shutter."],
    ["screenshot-double", "Shutter + two flashes", "A shutter closes; one central flash is followed by a wider flash."],
    ["screenshot-scan", "Scan + negative", "A focus line scans, flashes, then leaves a fading blue imprint."],
    ["screenshot-bloom", "Expanding echoes", "Each flash sends a soft echo outwards."],
    ["screenshot-ripple", "Ricochet echoes", "Narrow echoes reach the edges and bounce back."],
  ],
  recording: [
    ["record-start", "Recording starts", "Red traces meet at the centre, then leave a steady red marker."],
    ["record-stop", "Recording stops", "The centre marker sends red traces outward and goes dark."],
  ],
};
const CONTROLLER_OPTIONS = {
  duo: [["twin", "Twin reveal"], ["focus", "Two signatures"], ["double-welcome", "Mirror greeting"]],
  gauge: [["clean", "Quiet fill"], ["tip", "Bright tip"], ["horizon", "Soft horizon"]],
  connect: [["welcome", "Magnetic welcome"], ["orbit", "Arc return"], ["handshake", "Twin bloom"]],
  low: [["beacon", "Last ember"], ["drain", "Signal flare"], ["heartbeat", "Afterglow"]],
  charging: [["current", "Photon current"], ["breath", "Tidal fill"], ["spark", "Spark lattice"]],
};
const WEATHER_OPTIONS = {
  clear_day: ["Sun glints", "Solar bloom"],
  clear_night: ["Quiet constellation", "Silver hush"],
  rain: ["Bluewater", "Pearl rain"],
  cloud: ["Passing shadow", "Passing shadows"],
  breaks: ["Sun through clouds", "Sun, fading clouds"],
  breaks_night: ["Moon through clouds", "Moon, fading clouds"],
  snow: ["Melting snowfall", "Snow takes hold"],
  storm: ["Pulse and echoes", "Storm break"],
};
const WEATHER_ICONS = { clear_day: "☀", clear_night: "☾", rain: "☂", cloud: "☁", breaks: "⛅", breaks_night: "☾", snow: "❄", storm: "⚡" };

function defaultState() {
  return {
    tab: "overview", context: "game", display: "artwork", paused: false,
    game: "drg", artSource: "hero", artMode: "manual", artRow: 59, autoRow: 59,
    gameSettings: {
      drg: { source: "hero", mode: "manual", row: 59, display: "inherit" },
      witcher: { source: "hero", mode: "auto", row: 65, display: "inherit" },
      balatro: { source: "hero", mode: "manual", row: 34, display: "inherit" },
    },
    artCustom: null, artworkColors: Array.from({ length: 17 }, (_, i) => hexToRgb(i < 5 ? "#9ed163" : i < 12 ? "#e9aa22" : "#46a58e")),
    metric: "mixed", direction: "mirrored", cpu: 38, cpuTemp: 58, gpu: 72, gpuTemp: 70,
    palette: "classic", response: "balanced", shownCpu: 38, shownGpu: 72,
    coolColor: "#1eb4e6", middleColor: "#f5b42d", hotColor: "#eb2d37", coolTemp: 45, hotTemp: 78, perfHome: true,
    timerSource: "families", timerDuration: 60, timerRemaining: 2520, timerScale: 0, timerColor: "white", timerSpeed: 60, timerRunning: false, timerElapsed: 0,
    eventKind: "notification", eventVariants: { notification: "notification-beacon", achievement: "achievement-rebound", screenshot: "screenshot-bloom", recording: "record-start" },
    recording: false, recordIsolation: true,
    padCount: 2, padOne: 96, padTwo: 41, padCharging: false, controllerWhere: "home", chargeMode: "continuous-home", alertWhere: "both", lowThreshold: 20, padBrightness: 65,
    controllerScene: "duo", controllerVariants: { duo: "double-welcome", gauge: "tip", connect: "welcome", low: "beacon", charging: "breath" },
    padHealthy: "#00b42d", padMedium: "#e66e00", padLow: "#dc0c18", padCharge: "#0091dc",
    weatherCondition: "clear_day", weatherVariants: { clear_day: 0, clear_night: 0, rain: 0, cloud: 1, breaks: 0, breaks_night: 0, snow: 1, storm: 0 },
    weatherWhere: "off", weatherTopbar: false, weatherUnit: "celsius", weatherBrightness: 70, weatherCutoff: 0, weatherStart: 0,
    extraDark: 2, reversePhysical: true, overlay: null,
  };
}
let state = defaultState();
let eventFrames = {};
let weatherFrames = null;
let clock = 0;
let lastRealTime = performance.now();
let artworkLoadToken = 0;
let customObjectUrl = null;
const ledElements = Array.from({ length: 17 }, () => {
  const led = document.createElement("i");
  $("#logicalLeds").append(led);
  return led;
});
const mobileLedElements = Array.from({ length: 17 }, () => {
  const led = document.createElement("i");
  $("#mobileLeds").append(led);
  return led;
});

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function rgbToHex(rgb) { return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`; }
function hexToRgb(hex) { const value = hex.replace("#", ""); return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16)); }
function blend(a, b, amount) { return a.map((value, index) => Math.round(value * (1 - amount) + b[index] * amount)); }
function scale(color, amount) { return color.map((value) => Math.round(value * amount)); }
function blank() { return Array.from({ length: 17 }, () => [...OFF]); }
function isLit(color) { return color.some((value) => value > 3); }
function formatTime(seconds) { const safe = Math.max(0, Math.ceil(seconds)); return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`; }
function ease(value) { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x); }
function fill(frame, from, to, color) { for (let index = Math.max(0, from); index <= Math.min(16, to); index++) frame[index] = [...color]; }
function put(frame, index, color) { if (index >= 0 && index < 17) frame[index] = [...color]; }
function colourAtTemp(temperature) {
  const palette = state.palette === "custom" ? [state.coolColor, state.middleColor, state.hotColor] : PALETTES[state.palette];
  const colors = palette.map(hexToRgb);
  const fraction = clamp((temperature - state.coolTemp) / Math.max(1, state.hotTemp - state.coolTemp), 0, 1);
  return fraction < .5 ? blend(colors[0], colors[1], fraction * 2) : blend(colors[1], colors[2], (fraction - .5) * 2);
}
function applyExtraDark(counts) {
  const values = [...counts];
  for (let i = 0; i < state.extraDark; i++) {
    const available = values.map((count, index) => count > 1 ? index : -1).filter((index) => index >= 0);
    if (!available.length) break;
    const selected = available.reduce((best, index) => values[index] > values[best] ? index : best, available[0]);
    values[selected]--;
  }
  return values;
}
function performanceFrames() {
  const frame = blank();
  const physical = blank();
  const cpuColor = colourAtTemp(state.cpuTemp), gpuColor = colourAtTemp(state.gpuTemp);
  if (state.metric === "mixed") {
    const cpuCount = Math.round(clamp(state.shownCpu, 0, 100) * 8 / 100);
    const gpuCount = Math.round(clamp(state.shownGpu, 0, 100) * 8 / 100);
    const [physicalCpu, physicalGpu] = applyExtraDark([cpuCount, gpuCount]);
    fill(frame, 0, cpuCount - 1, cpuColor); fill(physical, 0, physicalCpu - 1, cpuColor);
    const fillGpu = (target, count) => {
      if (state.direction === "mirrored") fill(target, 17 - count, 16, gpuColor);
      else fill(target, 9, 8 + count, gpuColor);
    };
    fillGpu(frame, gpuCount); fillGpu(physical, physicalGpu);
    return { logical: frame, physical, name: `CPU + GPU · ${state.direction === "mirrored" ? "mirrored" : "left-to-right"} meter`, readout: `CPU ${Math.round(state.shownCpu)}% · ${state.cpuTemp}°C   GPU ${Math.round(state.shownGpu)}% · ${state.gpuTemp}°C`, explain: "Eight LEDs for each meter; the centre LED stays dark. Length shows load, colour shows temperature.", badge: "PERFORMANCE" };
  }
  const cpu = state.metric === "cpu";
  const load = cpu ? state.shownCpu : state.shownGpu;
  const temp = cpu ? state.cpuTemp : state.gpuTemp;
  const count = Math.round(clamp(load, 0, 100) * 17 / 100);
  const [physicalCount] = applyExtraDark([count]);
  fill(frame, 0, count - 1, cpu ? cpuColor : gpuColor);
  fill(physical, 0, physicalCount - 1, cpu ? cpuColor : gpuColor);
  return { logical: frame, physical, name: `${cpu ? "CPU" : "GPU"} performance`, readout: `${Math.round(load)}% · ${temp}°C`, explain: "The meter grows with load. Its colour moves between Cool, Middle and Hot as temperature changes.", badge: "PERFORMANCE" };
}
function artworkFrame() {
  const colors = state.artworkColors?.length === 17 ? state.artworkColors : blank();
  const title = state.artCustom ? "Your image" : GAME_DATA[state.game].title;
  return { logical: colors, physical: colors, name: "Game artwork", readout: `${title} · row ${getSampleRow()}%`, explain: "The selected horizontal row is sampled into 17 colours. Upload an image to try your own palette.", badge: "ARTWORK" };
}
function countdownFrame() {
  const remaining = state.timerRemaining;
  const scaleDuration = state.timerScale ? state.timerScale * 60 : state.timerDuration * 60;
  const count = remaining <= 0 ? 0 : Math.ceil(17 * clamp(remaining / scaleDuration, 0, 1));
  const physicalCount = count === 17 ? 17 : remaining > 0 ? Math.max(1, count - state.extraDark) : 0;
  const chosen = remaining <= 300 ? [255, 0, 0] : remaining <= 900 ? hexToRgb("#f5a523") : hexToRgb(START_COLOURS[state.timerColor]);
  const make = (lit) => {
    const frame = blank();
    for (let index = 0; index < lit; index++) frame[index] = scale(chosen, .34);
    if (lit) {
      const head = lit - 1 - (Math.floor(state.timerElapsed / .2) % lit);
      frame[head] = chosen;
      put(frame, head + 1, scale(chosen, .72));
      put(frame, head + 2, scale(chosen, .52));
      for (let index = lit; index < 17; index++) frame[index] = [...OFF];
    }
    return frame;
  };
  if (remaining <= 8 && remaining > 0) {
    const phase = (8 - remaining) % 1.8;
    const flash = [0, .3, .6].some((start) => phase >= start && phase < start + .15);
    const frame = flash ? Array.from({ length: 17 }, () => [255, 255, 255]) : blank();
    return { logical: frame, physical: frame, name: "Final eight seconds", readout: formatTime(remaining), explain: "Three short white flashes repeat until the timer reaches zero.", badge: "COUNTDOWN" };
  }
  const source = state.timerSource === "families" ? "Steam Families" : "Personal timer";
  return { logical: make(count), physical: make(physicalCount), name: `${source} countdown`, readout: `${formatTime(remaining)} left · ${count}/17 logical LEDs`, explain: "The bright point travels right to left. Below 15 minutes the bar turns amber; below five minutes it turns red.", badge: "PLAYTIME" };
}
function controllerColour(percent, charging = false) {
  if (charging) return hexToRgb(state.padCharge);
  if (percent <= state.lowThreshold) return hexToRgb(state.padLow);
  if (percent <= Math.max(35, state.lowThreshold + 5)) return hexToRgb(state.padMedium);
  return hexToRgb(state.padHealthy);
}
function controllerGauge(percent, count = 17, fromRight = false, charging = false) {
  const result = Array.from({ length: count }, () => [...OFF]);
  const lit = percent > 0 ? Math.max(1, Math.round(percent * count / 100)) : 0;
  for (let index = 0; index < lit; index++) result[fromRight ? count - 1 - index : index] = controllerColour(percent, charging);
  return result;
}
function controllerBaseFrame(animateCharging = false) {
  let frame;
  const chargingAllowed = state.chargeMode === "continuous-everywhere" || (state.chargeMode === "continuous-home" && state.context === "home");
  const activePercent = state.padCount === 2 ? state.padTwo : state.padOne;
  const charging = state.padCharging && chargingAllowed && activePercent < 100;
  if (state.padCount === 2) {
    const first = controllerGauge(state.padOne, 8);
    const second = controllerGauge(state.padTwo, 8, true, charging);
    frame = [...first, [...OFF], ...second];
    const leftTip = first.findLastIndex(isLit);
    const rightTip = second.findIndex(isLit);
    if (leftTip >= 0) frame[leftTip] = [...WHITE];
    if (rightTip >= 0) frame[9 + rightTip] = [...WHITE];
    if (charging && state.padTwo < 100 && animateCharging) {
      const lit = second.map((color, index) => isLit(color) ? index : -1).filter((index) => index >= 0);
      if (lit.length) {
        const phase = (clock / 1000) % 3.2;
        const point = 16 - Math.min(lit.length - 1, Math.floor(ease(phase / 2.75) * lit.length));
        put(frame, point, WHITE);
      }
    }
  } else {
    frame = controllerGauge(state.padOne, 17, false, charging);
    const tip = frame.findLastIndex(isLit);
    if (tip >= 0 && state.controllerVariants.gauge !== "clean") frame[tip] = [...WHITE];
    if (charging && state.padOne < 100 && animateCharging) {
      const lit = frame.filter(isLit).length;
      const point = Math.min(lit - 1, Math.floor(ease(((clock / 1000) % 3.2) / 2.75) * lit));
      if (point >= 0) put(frame, point, WHITE);
    }
    if (state.controllerVariants.gauge === "horizon") frame = frame.map((color) => scale(color, .58));
  }
  return frame.map((color) => scale(color, state.padBrightness / 100));
}
function controllerFrame() {
  const frame = controllerBaseFrame(true);
  const second = state.padCount === 2 ? ` · P2 ${state.padTwo}%` : "";
  const activePercent = state.padCount === 2 ? state.padTwo : state.padOne;
  const charging = state.padCharging && state.chargeMode !== "off" && activePercent < 100;
  return { logical: frame, physical: frame, name: charging ? "Controller charging" : state.padCount === 2 ? "Two mirrored controllers" : "Controller battery", readout: `P1 ${state.padOne}%${second}${charging ? " · charging" : ""}`, explain: state.padCount === 2 ? "Eight LEDs per player, mirrored towards a dark centre. White tips mark each reported charge level." : "The lit length reflects the reported battery. A white tip can mark its exact end.", badge: "CONTROLLERS" };
}
function weatherFrame() {
  const variant = state.weatherVariants[state.weatherCondition];
  const loop = weatherFrames?.frames?.[state.weatherCondition]?.[variant];
  const elapsed = Math.max(0, clock - state.weatherStart) / 1000;
  const raw = loop?.[Math.floor(elapsed * weatherFrames.fps) % loop.length] || blank();
  const frame = raw.map((pixel) => {
    const scaled = scale(pixel, state.weatherBrightness / 100);
    return Math.max(...scaled) <= state.weatherCutoff ? [...OFF] : scaled;
  });
  return { logical: frame, physical: frame, name: `${state.weatherCondition.replaceAll("_", " ")} · ${WEATHER_OPTIONS[state.weatherCondition][variant]}`, readout: `${state.weatherUnit === "fahrenheit" ? "64°F" : "18°C"} · sample sky`, explain: "An eight-second weather loop repeats on the light bar. The exact temperature is text only, never encoded as LED colours.", badge: "WEATHER" };
}
function controllerPreviewFrame(overlay) {
  const t = (clock - overlay.start) / 1000;
  const variant = overlay.variant;
  const percent = overlay.kind === "low" ? Math.min(state.padOne, state.lowThreshold) : overlay.kind === "charging" && state.padCount === 2 ? state.padTwo : state.padOne;
  const frame = blank();
  if (overlay.kind === "duo") {
    const settled = controllerBaseFrame(false);
    const finishAt = variant === "twin" ? 1.45 : variant === "focus" ? 3.3 : 3.4;
    if (variant === "twin" && t < finishAt) {
      const fraction = ease(t / finishAt);
      for (let i = 0; i < Math.round(fraction * 8); i++) frame[i] = settled[i];
      for (let i = 16; i > 16 - Math.round(fraction * 8); i--) frame[i] = settled[i];
    } else {
      settled.forEach((color, index) => { frame[index] = color; });
      if (t < finishAt) {
        const step = variant === "focus" ? (t < 1.7 ? Math.floor(ease(t / 1.7) * 7) : Math.floor(ease((t - 1.7) / 1.6) * 7)) : t < 1.6 ? Math.floor(ease(t / 1.6) * 7) : Math.floor((1 - ease((t - 1.6) / 1.8)) * 7);
        if (variant !== "focus" || t < 1.7) put(frame, step, WHITE);
        if (variant !== "focus" || t >= 1.7) put(frame, 16 - step, WHITE);
      }
    }
    frame[8] = [...OFF];
  } else if (overlay.kind === "gauge") {
    return controllerFrame();
  } else if (overlay.kind === "connect") {
    if (t < 1.75) {
      if (variant === "welcome") { const point = Math.min(8, Math.floor(ease(t / 1.3) * 8)); put(frame, point, CYAN); put(frame, 16 - point, CYAN); if (t > 1.3) fill(frame, 6, 10, WHITE); }
      if (variant === "orbit") { const point = Math.floor(ease(t < 1.15 ? t / 1.15 : 2 - t / 1.15) * 16); put(frame, point, WHITE); put(frame, point - 1, CYAN); put(frame, point + 1, CYAN); }
      if (variant === "handshake") { const point = Math.floor(ease(t / 1.65) * 8); put(frame, 8 - point, WHITE); put(frame, 8 + point, WHITE); }
    } else return controllerFrame();
  } else if (overlay.kind === "low") {
    const low = Math.max(1, Math.round(percent / 100 * 17));
    const red = hexToRgb(state.padLow);
    if (variant === "beacon" && t < 1.25) fill(frame, 0, Math.max(low, Math.round((1 - ease(t / 1.25)) * 17)) - 1, hexToRgb(state.padMedium));
    else { fill(frame, 0, low - 1, variant === "heartbeat" && t % .92 < .25 ? WHITE : red); if (variant === "drain" && t < 2.4) put(frame, Math.floor((t < 1.2 ? t / 1.2 : 2 - t / 1.2) * 16), WHITE); if (variant === "beacon" && ((t > 1.5 && t < 1.73) || (t > 1.91 && t < 2.15))) put(frame, low - 1, WHITE); }
  } else if (overlay.kind === "charging") {
    const width = state.padCount === 2 ? 8 : 17;
    const lit = Math.max(1, Math.round(percent / 100 * width));
    const chargedIndices = state.padCount === 2 ? Array.from({ length: lit }, (_, index) => 16 - index) : Array.from({ length: lit }, (_, index) => index);
    if (state.padCount === 2) {
      const first = controllerGauge(state.padOne, 8);
      first.forEach((color, index) => { frame[index] = color; });
      const firstTip = first.findLastIndex(isLit);
      if (firstTip >= 0) put(frame, firstTip, WHITE);
    }
    chargedIndices.forEach((index) => put(frame, index, hexToRgb(state.padCharge)));
    if (variant === "current") put(frame, chargedIndices[Math.min(lit - 1, Math.floor(ease(t / 1.95) * lit))], WHITE);
    if (variant === "breath") { const centre = ease(t / 2.75) * (lit + 3) - 2; chargedIndices.forEach((index, position) => { if (Math.abs(position - centre) < 2.8) put(frame, index, Math.abs(position - centre) < 1 ? WHITE : ICE); }); }
    if (variant === "spark") for (let i = 0; i < 3; i++) put(frame, chargedIndices[Math.floor(((t / 2.15 + i / 3) % 1) * lit)], i === 0 ? WHITE : ICE);
    put(frame, chargedIndices[lit - 1], WHITE);
  }
  const scaled = frame.map((color) => scale(color, state.padBrightness / 100));
  return { logical: scaled, physical: scaled, name: `${overlay.kind === "duo" ? "Two controllers" : overlay.kind === "low" ? "Low battery" : overlay.kind === "connect" ? "Controller connected" : "Charging"} · ${CONTROLLER_OPTIONS[overlay.kind]?.find(([id]) => id === variant)?.[1] || "preview"}`, readout: overlay.kind === "duo" ? `P1 ${state.padOne}% · P2 ${state.padTwo}%` : `${percent}% · demo`, explain: "A short controller animation temporarily replaces the everyday display.", badge: "CONTROLLER EVENT" };
}
function eventFrame(overlay) {
  const data = eventFrames[overlay.key];
  const elapsed = Math.max(0, (clock - overlay.start) / 1000);
  const index = data ? Math.min(data.frames.length - 1, Math.floor(elapsed * data.fps)) : 0;
  const frame = data ? data.frames[index] : blank();
  const title = Object.values(EVENT_OPTIONS).flat().find(([key]) => key === overlay.key)?.[1] || overlay.key;
  return { logical: frame, physical: frame, name: title, readout: `${Math.max(0, overlay.duration - elapsed).toFixed(1)} s`, explain: "This short light event takes the bar, then the live display underneath returns.", badge: "LIGHT EVENT" };
}
function activeContext(placement) { return placement === "everywhere" || (placement === "home" && state.context === "home"); }
function getCurrentOutput() {
  if (state.display === "disabled") return { logical: blank(), physical: blank(), name: "SignalBar disabled", readout: "Valve controls the bar", explain: "Disabled stops every SignalBar effect. The site's bar is dark because it cannot simulate Valve's own signal.", badge: "DISABLED" };
  if (state.overlay && (clock - state.overlay.start) / 1000 < state.overlay.duration) {
    return state.overlay.type === "event" ? eventFrame(state.overlay) : controllerPreviewFrame(state.overlay);
  }
  if (state.overlay) state.overlay = null;
  if (state.timerRunning && state.timerRemaining > 0 && (state.timerSource !== "families" || state.context === "game")) return countdownFrame();
  const chargeContext = state.chargeMode === "continuous-everywhere" || (state.chargeMode === "continuous-home" && state.context === "home");
  const persistentContext = activeContext(state.controllerWhere);
  if ((state.padCharging && chargeContext && (state.padCount === 2 ? state.padTwo : state.padOne) < 100) || persistentContext) return controllerFrame();
  if (state.weatherWhere === "everywhere" || state.weatherWhere === state.context) return weatherFrame();
  let output;
  if (state.display === "performance" && (state.context === "game" || state.perfHome)) output = performanceFrames();
  else if (state.display === "artwork" && state.context === "game") output = artworkFrame();
  else output = { logical: blank(), physical: blank(), name: "Steam Home", readout: "No base display here", explain: "Choose Performance on Home or the controller gauge to keep a signal here.", badge: "IDLE" };
  if (state.recording && (output.badge === "PERFORMANCE" || output.badge === "ARTWORK")) {
    output.logical = output.logical.map((color) => [...color]);
    output.physical = output.physical.map((color) => [...color]);
    if (state.recordIsolation) for (const index of [7, 9]) { output.logical[index] = [...OFF]; output.physical[index] = [...OFF]; }
    output.logical[8] = [...RED]; output.physical[8] = [...RED];
    output.name += " · recording";
    output.explain = "The centre LED marks active recording. Its neighbours can be isolated for better contrast.";
  }
  return output;
}

function drawPhysical(frame) {
  const canvas = $("#ledCanvas");
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.round(bounds.width * ratio), height = Math.round(bounds.height * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  // With reversal enabled, the hardware mapping corrects its native right-to-left order.
  // Show the viewer-facing result, not the byte order sent to sysfs.
  const pixels = state.reversePhysical ? frame : [...frame].reverse();
  const cell = width / 17, centreY = height * .48;
  ctx.globalCompositeOperation = "screen";
  pixels.forEach((color, index) => {
    if (!isLit(color)) return;
    const x = (index + .5) * cell;
    const radius = cell * 1.32;
    const glow = ctx.createRadialGradient(x, centreY, 0, x, centreY, radius);
    const rgb = color.join(",");
    glow.addColorStop(0, `rgba(${rgb},.42)`);
    glow.addColorStop(.4, `rgba(${rgb},.17)`);
    glow.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(x - radius, centreY - radius, radius * 2, radius * 2);
  });
  ctx.globalCompositeOperation = "source-over";
  const diffuser = ctx.createLinearGradient(0, 0, width, 0);
  pixels.forEach((color, index) => diffuser.addColorStop((index + .5) / 17, `rgba(${color.join(",")},${isLit(color) ? .91 : 0})`));
  ctx.fillStyle = diffuser;
  ctx.fillRect(0, centreY - height * .045, width, height * .09);
}
function renderStage() {
  const output = getCurrentOutput();
  ledElements.forEach((element, index) => {
    const color = output.logical[index] || OFF;
    element.style.background = isLit(color) ? rgbToHex(color) : "#33454e";
    mobileLedElements[index].style.background = element.style.background;
  });
  $("#logicalLeds").setAttribute("aria-label", `${output.name}: ${output.logical.filter(isLit).length} of 17 logical LEDs lit`);
  drawPhysical(output.physical || output.logical);
  $("#signalName").textContent = output.name;
  $("#signalReadout").textContent = output.readout;
  $("#stageExplain").textContent = output.explain;
  $("#providerBadge").textContent = output.badge;
  $("#mobileSignal").textContent = output.name;
  $("#contextLabel").textContent = state.context === "home" ? "STEAM HOME" : `IN GAME · ${GAME_DATA[state.game].title}`;
  $("#contextSwitch").textContent = state.context === "home" ? "Go in game ↔" : "Go Home ↔";
}
function tick(realNow) {
  const elapsed = clamp(realNow - lastRealTime, 0, 100);
  lastRealTime = realNow;
  if (!state.paused) {
    clock += elapsed;
    const time = elapsed / 1000;
    if (state.timerRunning && state.timerRemaining > 0) {
      state.timerRemaining = Math.max(0, state.timerRemaining - time * state.timerSpeed);
      state.timerElapsed += time;
      if (state.timerRemaining === 0) state.timerRunning = false;
      $("#timerRemainingValue").textContent = formatTime(state.timerRemaining);
      $("#timerRemaining").value = String(Math.round(state.timerRemaining));
    }
    const smoothing = state.response === "responsive" ? .18 : state.response === "smooth" ? 2.5 : .7;
    const alpha = 1 - Math.exp(-time / smoothing);
    state.shownCpu += (state.cpu - state.shownCpu) * alpha;
    state.shownGpu += (state.gpu - state.shownGpu) * alpha;
  }
  renderStage();
  requestAnimationFrame(tick);
}

function getSampleRow() {
  return state.artMode === "center" ? 50 : state.artMode === "lower" ? 76 : state.artMode === "auto" ? state.autoRow : state.artRow;
}
function saveGameArtworkChoice() {
  if (state.artCustom) return;
  const settings = state.gameSettings[state.game];
  settings.source = state.artSource;
  settings.mode = state.artMode;
  settings.row = state.artRow;
}
function updateSampleLine() {
  const image = $("#artImage");
  const frame = $(".art-image-wrap").getBoundingClientRect();
  const rect = image.getBoundingClientRect();
  const line = $("#sampleLine");
  line.style.left = `${rect.left - frame.left}px`;
  line.style.width = `${rect.width}px`;
  line.style.top = `${rect.top - frame.top + rect.height * getSampleRow() / 100}px`;
  $("#artTypeLabel").textContent = `${state.artCustom ? "Your image" : IMAGE_LABELS[state.artSource]} · row ${getSampleRow()}%`;
  $("#artRowValue").textContent = `${getSampleRow()}%`;
}
function updateMobilePreviewVisibility() {
  const settings = $(".settings-shell").getBoundingClientRect();
  const stage = $(".stage-shell").getBoundingClientRect();
  const visible = window.innerWidth <= 850 && stage.bottom < 0 && settings.top < window.innerHeight && settings.bottom > 0;
  $("#mobilePreview").classList.toggle("visible", visible);
}
function sampleArtwork(image) {
  if (!image.naturalWidth || !image.naturalHeight) return;
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(image.naturalWidth, 680);
  canvas.height = Math.min(image.naturalHeight, 360);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const y = clamp(Math.round((canvas.height - 1) * getSampleRow() / 100), 0, canvas.height - 1);
  const data = context.getImageData(0, y, canvas.width, 1).data;
  state.artworkColors = Array.from({ length: 17 }, (_, index) => {
    const start = Math.floor(index * canvas.width / 17), end = Math.max(start + 1, Math.floor((index + 1) * canvas.width / 17));
    const sum = [0, 0, 0];
    for (let x = start; x < end; x++) for (let channel = 0; channel < 3; channel++) sum[channel] += data[x * 4 + channel];
    return sum.map((value) => Math.round(value / (end - start)));
  });
  updateSampleLine();
}
function findAutoRow(image) {
  const canvas = document.createElement("canvas");
  canvas.width = 170; canvas.height = 100;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let best = { row: 59, score: -1 };
  for (let row = 18; row <= 82; row += 4) {
    let saturation = 0, contrast = 0;
    for (let index = 0; index < 17; index++) {
      const x = Math.floor((index + .5) * canvas.width / 17);
      const offset = (row * canvas.width + x) * 4;
      const color = [data[offset], data[offset + 1], data[offset + 2]];
      saturation += Math.max(...color) - Math.min(...color);
      if (index) {
        const previous = (row * canvas.width + Math.floor((index - .5) * canvas.width / 17)) * 4;
        contrast += color.reduce((sum, value, channel) => sum + Math.abs(value - data[previous + channel]), 0);
      }
    }
    const score = saturation + contrast * .55;
    if (score > best.score) best = { row, score };
  }
  state.autoRow = best.row;
}
function loadArtwork() {
  const image = $("#artImage");
  const token = ++artworkLoadToken;
  const source = state.artCustom || `assets/${state.game}-${state.artSource}.jpg`;
  $("#artTitle").textContent = state.artCustom ? "Your image" : GAME_DATA[state.game].title;
  image.onload = () => { if (token === artworkLoadToken) { findAutoRow(image); sampleArtwork(image); requestAnimationFrame(updateSampleLine); } };
  image.onerror = () => { $("#artTypeLabel").textContent = "Artwork unavailable"; };
  if (image.src !== new URL(source, location.href).href) image.src = source;
  else if (image.complete) { findAutoRow(image); sampleArtwork(image); }
}
function setTab(tab, configure = true) {
  state.tab = tab;
  $$(".tab").forEach((button) => { const active = button.dataset.tab === tab; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); });
  $$(".pane").forEach((pane) => pane.classList.toggle("active", pane.dataset.pane === tab));
  if (configure) {
    state.overlay = null;
    if (tab === "artwork") { state.display = state.gameSettings[state.game].display === "performance" ? "performance" : "artwork"; state.context = "game"; state.timerRunning = false; }
    if (tab === "performance") { state.display = "performance"; state.context = "game"; state.timerRunning = false; }
    if (tab === "playtime") { state.display = "performance"; state.context = "game"; state.timerRunning = true; }
    if (tab === "controllers") { state.display = "performance"; state.context = "home"; state.timerRunning = false; state.padCharging = false; state.weatherWhere = "off"; $("#weatherWhere").value = "off"; $("#padCharging").checked = false; }
    if (tab === "weather") { state.display = "performance"; state.context = "home"; state.timerRunning = false; state.padCharging = false; state.controllerWhere = "off"; state.weatherWhere = "home"; state.weatherStart = clock; $("#controllerWhere").value = "off"; $("#weatherWhere").value = "home"; $("#padCharging").checked = false; }
    if (tab === "events") { state.display = "performance"; state.context = "game"; state.timerRunning = false; playEvent(); }
    $("#contextChoice").value = state.context;
    $("#displayChoice").value = state.display;
  }
  requestAnimationFrame(updateSampleLine);
}
function choosePreset(preset) {
  if (preset === "artwork") setTab("artwork");
  if (preset === "performance") setTab("performance");
  if (preset === "playtime") setTab("playtime");
  if (preset === "controllers") setTab("controllers");
  if (preset === "weather") setTab("weather");
  if (preset === "notification" || preset === "achievement") {
    state.eventKind = preset;
    setTab("events", false);
    state.context = "game"; state.display = "performance"; state.timerRunning = false;
    syncEventUI(); playEvent();
  }
}
function syncEventUI() {
  $$("[data-event-kind]").forEach((button) => button.classList.toggle("selected", button.dataset.eventKind === state.eventKind));
  const choices = EVENT_OPTIONS[state.eventKind];
  $("#eventVariant").replaceChildren(...choices.map(([key, label]) => new Option(label, key)));
  $("#eventVariant").value = state.eventVariants[state.eventKind];
  const selected = choices.find(([key]) => key === state.eventVariants[state.eventKind]) || choices[0];
  $("#eventEyebrow").textContent = state.eventKind.toUpperCase();
  $("#eventName").textContent = selected[1];
  $("#eventDescription").textContent = selected[2];
  $("#recordToggle").hidden = state.eventKind !== "recording";
  $("#recordIsolationRow").hidden = state.eventKind !== "recording";
  $("#recordingHelp").hidden = state.eventKind !== "recording";
  $("#recordToggle").textContent = state.recording ? "Stop recording" : "Start recording";
  $("#eventPlay").textContent = state.eventKind === "recording" ? "Replay cue" : "Play this signal";
}
function playEvent(key = state.eventVariants[state.eventKind]) {
  if (state.display === "disabled") state.display = "performance";
  const duration = eventFrames[key]?.duration || 2.5;
  state.overlay = { type: "event", key, start: clock, duration };
}
function syncControllerUI() {
  const choices = CONTROLLER_OPTIONS[state.controllerScene];
  $("#controllerVariant").replaceChildren(...choices.map(([id, label]) => new Option(label, id)));
  $("#controllerVariant").value = state.controllerVariants[state.controllerScene];
  $("#padTwo").disabled = state.padCount !== 2;
  $("#padCharging").parentElement.lastChild.textContent = state.padCount === 2 ? " Controller 2 charging" : " Controller charging";
}
function syncWeatherUI() {
  const choices = WEATHER_OPTIONS[state.weatherCondition];
  $("#weatherVariant").replaceChildren(...choices.map((label, index) => new Option(label, String(index))));
  $("#weatherVariant").value = String(state.weatherVariants[state.weatherCondition]);
  const degrees = state.weatherUnit === "fahrenheit" ? "64°F" : "18°C";
  $("#weatherTopbarSample").textContent = `Top-bar example: ${WEATHER_ICONS[state.weatherCondition]} ${degrees} · ${state.weatherTopbar ? "enabled" : "optional"} beside the clock. The real plugin needs a chosen city; this demo uses sample data only.`;
}
function playController() {
  state.timerRunning = false;
  const kind = state.controllerScene;
  state.overlay = { type: "controller", kind, variant: state.controllerVariants[kind], start: clock, duration: kind === "duo" ? 5.6 : kind === "gauge" ? 3 : 3.2 };
}
function updateOutputs() {
  const outputs = { artRow: `${getSampleRow()}%`, cpuLoad: `${state.cpu}%`, cpuTemp: `${state.cpuTemp}°C`, gpuLoad: `${state.gpu}%`, gpuTemp: `${state.gpuTemp}°C`, coolTemp: `${state.coolTemp}°C`, hotTemp: `${state.hotTemp}°C`, timerRemaining: formatTime(state.timerRemaining), padOne: `${state.padOne}%`, padTwo: `${state.padTwo}%`, lowThreshold: `${state.lowThreshold}%`, padBrightness: `${state.padBrightness}%`, weatherBrightness: `${state.weatherBrightness}%`, weatherCutoff: String(state.weatherCutoff), extraDark: String(state.extraDark) };
  Object.entries(outputs).forEach(([key, value]) => { const element = $(`#${key}Value`); if (element) element.textContent = value; });
}
function bindValue(id, stateKey, transform = (value) => value, callback) {
  const element = $(`#${id}`);
  element.addEventListener(element.tagName === "SELECT" ? "change" : "input", () => {
    state[stateKey] = transform(element.value);
    callback?.();
    updateOutputs();
  });
}
function bindControls() {
  $$(".tab").forEach((button) => button.addEventListener("click", () => setTab(button.dataset.tab)));
  $$("[data-preset]").forEach((button) => button.addEventListener("click", () => choosePreset(button.dataset.preset)));
  $$("[data-game]").forEach((button) => button.addEventListener("click", () => {
    saveGameArtworkChoice();
    state.game = button.dataset.game;
    state.artCustom = null;
    if (customObjectUrl) { URL.revokeObjectURL(customObjectUrl); customObjectUrl = null; }
    const settings = state.gameSettings[state.game];
    state.artSource = settings.source; state.artMode = settings.mode; state.artRow = settings.row;
    state.display = settings.display === "performance" ? "performance" : "artwork";
    $("#artSource").value = state.artSource; $("#artMode").value = state.artMode;
    $("#artRow").value = String(state.artRow); $("#artRow").disabled = state.artMode !== "manual";
    $("#gameDisplay").value = settings.display;
    $("#displayChoice").value = state.display;
    $$("[data-game]").forEach((choice) => choice.classList.toggle("selected", choice === button));
    loadArtwork();
  }));
  bindValue("artSource", "artSource", String, () => { saveGameArtworkChoice(); loadArtwork(); });
  bindValue("artMode", "artMode", String, () => { saveGameArtworkChoice(); sampleArtwork($("#artImage")); $("#artRow").disabled = state.artMode !== "manual"; });
  bindValue("artRow", "artRow", Number, () => { saveGameArtworkChoice(); sampleArtwork($("#artImage")); });
  $("#gameDisplay").addEventListener("change", (event) => {
    state.gameSettings[state.game].display = event.target.value;
    state.display = event.target.value === "performance" ? "performance" : "artwork";
    $("#displayChoice").value = state.display;
  });
  $("#artUpload").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (customObjectUrl) URL.revokeObjectURL(customObjectUrl);
    customObjectUrl = URL.createObjectURL(file);
    state.artCustom = customObjectUrl;
    state.context = "game"; state.display = "artwork";
    loadArtwork();
  });
  for (const [id, key] of [["perfMetric", "metric"], ["perfDirection", "direction"], ["perfPalette", "palette"], ["perfResponse", "response"]]) bindValue(id, key, String, id === "perfPalette" ? () => { $("#customColours").hidden = state.palette !== "custom"; } : undefined);
  for (const [id, key] of [["cpuLoad", "cpu"], ["cpuTemp", "cpuTemp"], ["gpuLoad", "gpu"], ["gpuTemp", "gpuTemp"], ["coolTemp", "coolTemp"], ["hotTemp", "hotTemp"]]) bindValue(id, key, Number);
  for (const [id, key] of [["coolColor", "coolColor"], ["middleColor", "middleColor"], ["hotColor", "hotColor"]]) bindValue(id, key);
  $("#perfHome").addEventListener("change", (event) => { state.perfHome = event.target.checked; });
  $$("[data-timer-source]").forEach((button) => button.addEventListener("click", () => {
    state.timerSource = button.dataset.timerSource;
    $$("[data-timer-source]").forEach((choice) => choice.classList.toggle("selected", choice === button));
    state.context = "game";
  }));
  bindValue("timerDuration", "timerDuration", Number, () => { state.timerRemaining = Math.min(state.timerRemaining, state.timerDuration * 60); $("#timerRemaining").max = String(state.timerDuration * 60); $("#timerRemaining").value = String(Math.round(state.timerRemaining)); });
  bindValue("timerScale", "timerScale", Number);
  bindValue("timerRemaining", "timerRemaining", Number, () => { state.timerElapsed = 0; });
  bindValue("timerColor", "timerColor"); bindValue("timerSpeed", "timerSpeed", Number);
  $("#timerStart").addEventListener("click", () => { state.context = "game"; state.timerRunning = true; state.timerElapsed = 0; state.overlay = null; $("#contextChoice").value = "game"; });
  $("#timerStop").addEventListener("click", () => { state.timerRunning = false; });
  $("#timerFinal").addEventListener("click", () => { state.timerRemaining = 8; state.timerElapsed = 0; state.timerRunning = true; state.context = "game"; state.overlay = null; updateOutputs(); });
  $$("[data-event-kind]").forEach((button) => button.addEventListener("click", () => { state.eventKind = button.dataset.eventKind; syncEventUI(); playEvent(); }));
  $("#eventVariant").addEventListener("change", (event) => { state.eventVariants[state.eventKind] = event.target.value; syncEventUI(); playEvent(); });
  $("#eventPlay").addEventListener("click", () => playEvent());
  $("#recordToggle").addEventListener("click", () => { state.recording = !state.recording; playEvent(state.recording ? "record-start" : "record-stop"); syncEventUI(); });
  $("#recordIsolation").addEventListener("change", (event) => { state.recordIsolation = event.target.checked; });
  for (const [id, key] of [["controllerCount", "padCount"], ["padOne", "padOne"], ["padTwo", "padTwo"], ["lowThreshold", "lowThreshold"], ["padBrightness", "padBrightness"]]) bindValue(id, key, Number, id === "controllerCount" ? syncControllerUI : undefined);
  bindValue("controllerWhere", "controllerWhere", String, () => { if (state.controllerWhere !== "off") { state.weatherWhere = "off"; $("#weatherWhere").value = "off"; } });
  for (const [id, key] of [["chargeMode", "chargeMode"], ["alertWhere", "alertWhere"], ["padHealthy", "padHealthy"], ["padMedium", "padMedium"], ["padLow", "padLow"], ["padCharge", "padCharge"]]) bindValue(id, key);
  $("#controllerScene").addEventListener("change", (event) => { state.controllerScene = event.target.value; syncControllerUI(); playController(); });
  $("#controllerVariant").addEventListener("change", (event) => { state.controllerVariants[state.controllerScene] = event.target.value; playController(); });
  $("#controllerPlay").addEventListener("click", playController);
  $("#padCharging").addEventListener("change", (event) => { state.padCharging = event.target.checked; });
  $("#weatherCondition").addEventListener("change", (event) => { state.weatherCondition = event.target.value; state.weatherStart = clock; syncWeatherUI(); });
  $("#weatherVariant").addEventListener("change", (event) => { state.weatherVariants[state.weatherCondition] = Number(event.target.value); state.weatherStart = clock; });
  $("#weatherWhere").addEventListener("change", (event) => { state.weatherWhere = event.target.value; if (state.weatherWhere !== "off") { state.controllerWhere = "off"; $("#controllerWhere").value = "off"; } });
  $("#weatherTopbar").addEventListener("change", (event) => { state.weatherTopbar = event.target.checked; syncWeatherUI(); });
  $("#weatherUnit").addEventListener("change", (event) => { state.weatherUnit = event.target.value; syncWeatherUI(); });
  bindValue("weatherBrightness", "weatherBrightness", Number);
  bindValue("weatherCutoff", "weatherCutoff", Number);
  $("#weatherReplay").addEventListener("click", () => { state.weatherStart = clock; });
  bindValue("contextChoice", "context"); bindValue("displayChoice", "display"); bindValue("extraDark", "extraDark", Number);
  $("#reversePhysical").addEventListener("change", (event) => { state.reversePhysical = event.target.checked; });
  $("#contextSwitch").addEventListener("click", () => { state.context = state.context === "home" ? "game" : "home"; $("#contextChoice").value = state.context; });
  $("#priorityDemo").addEventListener("click", () => { state.display = "performance"; state.context = "game"; state.timerRemaining = 240; state.timerRunning = true; state.timerElapsed = 0; state.eventKind = "notification"; state.overlay = null; $("#contextChoice").value = "game"; $("#displayChoice").value = "performance"; $("#priorityFeedback").textContent = "Four minutes remain. Now send a notification to test the protected countdown."; });
  $("#priorityNotify").addEventListener("click", () => {
    if (state.timerRunning && state.timerRemaining <= 300) $("#priorityFeedback").textContent = "Notification held: the final five minutes keep the countdown visible.";
    else { playEvent("notification-beacon"); $("#priorityFeedback").textContent = "Notification shown briefly. The previous signal returns when it finishes."; }
  });
  $("#resetDemo").addEventListener("click", resetDemo);
  $("#pauseDemo").addEventListener("click", () => { state.paused = !state.paused; $("#pauseDemo").textContent = state.paused ? "▶" : "Ⅱ"; $("#pauseDemo").setAttribute("aria-label", state.paused ? "Play animation" : "Pause animation"); });
  $("#resetView").addEventListener("click", () => { if (state.overlay) state.overlay.start = clock; else if (state.tab === "events") playEvent(); else if (state.tab === "controllers") playController(); else if (state.tab === "weather") state.weatherStart = clock; else state.timerElapsed = 0; });
  window.addEventListener("resize", () => { updateSampleLine(); updateMobilePreviewVisibility(); });
  window.addEventListener("scroll", updateMobilePreviewVisibility, { passive: true });
}
function resetDemo() {
  state = defaultState();
  clock = 0;
  if (customObjectUrl) { URL.revokeObjectURL(customObjectUrl); customObjectUrl = null; }
  for (const [id, value] of Object.entries({ artSource: state.artSource, artMode: state.artMode, artRow: state.artRow, gameDisplay: "inherit", perfMetric: state.metric, perfDirection: state.direction, cpuLoad: state.cpu, cpuTemp: state.cpuTemp, gpuLoad: state.gpu, gpuTemp: state.gpuTemp, perfPalette: state.palette, perfResponse: state.response, coolColor: state.coolColor, middleColor: state.middleColor, hotColor: state.hotColor, coolTemp: state.coolTemp, hotTemp: state.hotTemp, timerDuration: state.timerDuration, timerScale: state.timerScale, timerRemaining: state.timerRemaining, timerColor: state.timerColor, timerSpeed: state.timerSpeed, controllerCount: state.padCount, padOne: state.padOne, padTwo: state.padTwo, controllerWhere: state.controllerWhere, chargeMode: state.chargeMode, alertWhere: state.alertWhere, lowThreshold: state.lowThreshold, padBrightness: state.padBrightness, padHealthy: state.padHealthy, padMedium: state.padMedium, padLow: state.padLow, padCharge: state.padCharge, weatherCondition: state.weatherCondition, weatherWhere: state.weatherWhere, weatherUnit: state.weatherUnit, weatherBrightness: state.weatherBrightness, weatherCutoff: state.weatherCutoff, extraDark: state.extraDark, contextChoice: state.context, displayChoice: state.display })) { const element = $(`#${id}`); if (element) element.value = String(value); }
  $("#timerRemaining").max = String(state.timerDuration * 60);
  for (const [id, checked] of Object.entries({ perfHome: state.perfHome, recordIsolation: state.recordIsolation, padCharging: state.padCharging, weatherTopbar: state.weatherTopbar, reversePhysical: state.reversePhysical })) $(`#${id}`).checked = checked;
  $$("[data-game]").forEach((button) => button.classList.toggle("selected", button.dataset.game === state.game));
  $$("[data-timer-source]").forEach((button) => button.classList.toggle("selected", button.dataset.timerSource === state.timerSource));
  $("#padCharging").checked = false;
  $("#customColours").hidden = true;
  $("#artRow").disabled = false;
  $("#pauseDemo").textContent = "Ⅱ";
  syncEventUI(); syncControllerUI(); syncWeatherUI(); updateOutputs(); loadArtwork(); setTab("overview", false);
}
async function init() {
  bindControls();
  syncEventUI(); syncControllerUI(); syncWeatherUI(); updateOutputs(); loadArtwork();
  updateMobilePreviewVisibility();
  try { const response = await fetch("event-frames.json"); if (response.ok) eventFrames = await response.json(); }
  catch { /* The base modes still work if event data is unavailable. */ }
  try { const response = await fetch("weather-frames.json"); if (response.ok) weatherFrames = await response.json(); }
  catch { /* Other simulations still work without weather frames. */ }
  requestAnimationFrame(tick);
}
init();
