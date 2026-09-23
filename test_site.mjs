import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "playwright";

const url = process.env.SIGNALBAR_CONCEPT_URL || "http://127.0.0.1:8765/";
const browser = await chromium.launch({ headless: true });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#artImage").evaluate((image) => image.decode());
  await page.screenshot({ path: "/tmp/signalbar-concept-desktop.png", fullPage: true });
  assert.equal(await page.locator("#logicalLeds i").count(), 17);

  await page.locator('[data-preset="performance"]').click();
  await page.waitForTimeout(400);
  assert.equal(await page.locator("#providerBadge").textContent(), "PERFORMANCE");
  await page.locator(".workbench").screenshot({ path: "/tmp/signalbar-concept-performance.png" });
  await page.locator("#gpuLoad").fill("91");
  assert.equal(await page.locator("#gpuLoadValue").textContent(), "91%");

  await page.locator('[data-tab="artwork"]').click();
  await page.locator('[data-game="balatro"]').click();
  await page.locator("#artImage").evaluate((image) => image.decode());
  assert.match(await page.locator("#artTitle").textContent(), /Balatro/);
  await page.locator("#gameDisplay").selectOption("performance");
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "PERFORMANCE");
  await page.locator('[data-game="drg"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "ARTWORK");
  await page.locator('[data-game="balatro"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "PERFORMANCE");
  await page.locator("#gameDisplay").selectOption("artwork");
  await page.locator(".workbench").screenshot({ path: "/tmp/signalbar-concept-artwork.png" });
  await page.locator("#artUpload").setInputFiles(path.resolve("assets/drg-hero.jpg"));
  await page.waitForTimeout(200);
  assert.match(await page.locator("#artTitle").textContent(), /Your image/);

  await page.locator('[data-tab="playtime"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "PLAYTIME");
  assert.equal(await page.locator("#providerBadge").textContent(), "PLAYTIME");
  await page.locator("#timerSpeed").selectOption("1");
  await page.locator("#timerFinal").click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "COUNTDOWN");
  assert.equal(await page.locator("#providerBadge").textContent(), "COUNTDOWN");
  await page.locator(".workbench").screenshot({ path: "/tmp/signalbar-concept-final-countdown.png" });

  await page.locator('[data-tab="controllers"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "CONTROLLERS");
  assert.equal(await page.locator("#providerBadge").textContent(), "CONTROLLERS");
  await page.locator(".workbench").screenshot({ path: "/tmp/signalbar-concept-controllers.png" });
  await page.locator("#controllerScene").selectOption("low");
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "CONTROLLER EVENT");
  assert.equal(await page.locator("#providerBadge").textContent(), "CONTROLLER EVENT");
  for (const scene of ["duo", "gauge", "connect", "low", "charging"]) {
    await page.locator("#controllerScene").selectOption(scene);
    const variants = await page.locator("#controllerVariant option").evaluateAll((options) => options.map((option) => option.value));
    assert.equal(variants.length, 3);
    for (const variant of variants) await page.locator("#controllerVariant").selectOption(variant);
  }

  await page.locator('[data-tab="events"]').click();
  await page.locator('[data-event-kind="achievement"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "LIGHT EVENT");
  assert.equal(await page.locator("#providerBadge").textContent(), "LIGHT EVENT");
  await page.locator("#eventVariant").selectOption("achievement-constellation");
  await page.waitForFunction(() => document.querySelector("#signalName")?.textContent?.includes("Constellation"));
  assert.match(await page.locator("#signalName").textContent(), /Constellation/);
  await page.waitForTimeout(500);
  await page.locator(".workbench").screenshot({ path: "/tmp/signalbar-concept-achievement.png" });
  let eventCount = 0;
  for (const kind of ["notification", "achievement", "screenshot", "recording"]) {
    await page.locator(`[data-event-kind="${kind}"]`).click();
    const variants = await page.locator("#eventVariant option").evaluateAll((options) => options.map((option) => option.value));
    for (const variant of variants) { await page.locator("#eventVariant").selectOption(variant); eventCount++; }
  }
  assert.equal(eventCount, 19);
  await page.locator('[data-tab="priorities"]').click();
  await page.locator("#priorityDemo").click();
  await page.locator("#priorityNotify").click();
  assert.match(await page.locator("#priorityFeedback").textContent(), /held/);
  assert.equal(await page.locator("#providerBadge").textContent(), "PLAYTIME");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(url, { waitUntil: "networkidle" });
  await mobile.screenshot({ path: "/tmp/signalbar-concept-mobile.png", fullPage: true });
  for (const tab of ["artwork", "performance", "playtime", "events", "controllers", "priorities"]) {
    await mobile.locator(`[data-tab="${tab}"]`).click();
    const width = await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(width <= 1, `${tab} horizontal overflow: ${width}px`);
  }
  await mobile.evaluate(() => window.scrollTo({ top: document.querySelector(".settings-shell").offsetTop + 130, behavior: "instant" }));
  await mobile.waitForTimeout(100);
  assert.equal(await mobile.locator("#mobilePreview").evaluate((element) => element.classList.contains("visible")), true);
  await mobile.screenshot({ path: "/tmp/signalbar-concept-mobile-settings.png" });
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 1, `mobile horizontal overflow: ${overflow}px`);
  assert.deepEqual(errors, []);
  console.log("PASS: desktop interactions, all major tabs, uploaded artwork, event renderer and 390px layout");
} finally {
  await browser.close();
}
