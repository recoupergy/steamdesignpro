import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";

const routes = [
  ["/design", "Plan the enclosure"],
  ["/guide", "Plan the room before"],
  ["/kohler", "Current KOHLER Invigoration"],
  ["/kohler/k-32324-na", "K-32324-NA"],
  ["/steam-generator-sizing", "Size a Kohler Invigoration"],
  ["/steam-shower-checklist", "Steam-shower planning checklist"],
  ["/sources", "Official sources behind"],
  ["/about", "A visual planning aid"],
  ["/privacy", "Privacy policy"],
  ["/terms", "Terms of use"],
] as const;

test.describe("crawlable routes and metadata", () => {
  test("landing page is server-rendered with a direct designer CTA", async ({ page }, testInfo) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: /see your steam shower before the tile goes up/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /design now/i }).first()).toHaveAttribute("href", "/design");
    await expect(page.getByText("$3,225.00", { exact: false }).first()).toBeVisible();
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://steamdesignpro.com");
    await expect(page.locator("meta[property='og:type']")).toHaveAttribute("content", "website");
    await expect(page.locator("meta[property='og:site_name']")).toHaveAttribute("content", "SteamDesignPro");
    await expect(page.locator("meta[property='og:image']").first()).toHaveAttribute("content", "https://steamdesignpro.com/opengraph-image");
    await expect(page.locator("meta[name='twitter:image']").first()).toHaveAttribute("content", "https://steamdesignpro.com/opengraph-image");
    await page.locator(".landing-hero").screenshot({
      path: path.join(process.cwd(), "artifacts", "screenshots", `landing-${testInfo.project.name}.png`),
    });
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(accessibility.violations).toEqual([]);
  });

  test("landing page stays inside a 320px viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "The narrow-width regression runs once with mobile browser behavior.");
    await page.setViewportSize({ width: 320, height: 760 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole("link", { name: "Design now", exact: true }).first()).toBeVisible();
  });

  test("legacy versioned planner links keep their state on /design", async ({ page }) => {
    await page.goto("/?v=1&starter=compact");
    await expect(page).toHaveURL(/\/design\?v=1&starter=compact/);
    await expect(page.getByRole("heading", { name: "Plan the enclosure" })).toBeVisible();
  });

  for (const [route, heading] of routes) {
    test(`${route} is server-rendered with canonical metadata`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: new RegExp(heading, "i") })).toBeVisible();
      await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", new RegExp(`https://steamdesignpro\\.com${route}`));
      if (route === "/design") {
        await expect(page.locator("meta[property='og:type']")).toHaveAttribute("content", "website");
        await expect(page.locator("meta[property='og:site_name']")).toHaveAttribute("content", "SteamDesignPro");
        await expect(page.locator("meta[property='og:image']").first()).toHaveAttribute("content", "https://steamdesignpro.com/opengraph-image");
        await expect(page.locator("meta[name='twitter:image']").first()).toHaveAttribute("content", "https://steamdesignpro.com/opengraph-image");
      }
      const structured = await page.locator("script[type='application/ld+json']").allTextContents();
      expect(structured.length).toBeGreaterThan(0);
      structured.forEach((json) => expect(() => JSON.parse(json)).not.toThrow());
    });
  }

  test("model Product data is truthful and omits commerce/review claims", async ({ page }) => {
    await page.goto("/kohler/k-32335-na");
    const scripts = await page.locator("script[type='application/ld+json']").allTextContents();
    const json = scripts.map((script) => JSON.parse(script)).flat(2);
    const product = json.find((item: Record<string, unknown>) => item?.["@type"] === "Product");
    expect(product).toMatchObject({ model: "K-32335-NA", sku: "K-32335-NA" });
    expect(product).not.toHaveProperty("offers");
    expect(product).not.toHaveProperty("aggregateRating");
    expect(product).not.toHaveProperty("review");
    await expect(page.locator("meta[property='og:url']")).toHaveAttribute("content", "https://steamdesignpro.com/kohler/k-32335-na");
    await expect(page.locator("meta[property='og:title']")).toHaveAttribute("content", /K-32335-NA/);
    await expect(page.getByText("1,000 ft³", { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/2 × 240 V, 90 A/i).first()).toBeVisible();
  });

  test("robots and sitemap expose requested crawlers and stable model URLs", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsText = await robots.text();
    for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot"]) expect(robotsText).toContain(bot);
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const sitemapText = await sitemap.text();
    expect(sitemapText).toContain("https://steamdesignpro.com/kohler/k-32335-na");
    expect(sitemapText).toContain("https://steamdesignpro.com/steam-generator-sizing");
    expect(sitemapText).toContain("https://steamdesignpro.com/design");
  });

  test("unknown routes return the custom 404 with a real 404 status", async ({ page }) => {
    const response = await page.goto("/not-a-real-steam-model");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /planning page is not here/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /open the planner/i })).toBeVisible();
  });

  test("source register contains working official primary-source links", async ({ page, request }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(Boolean(process.env.CI), "Official-link reachability runs in the release smoke pass, not isolated CI.");
    test.skip(testInfo.project.name === "mobile", "External link reachability is viewport-independent and runs once on desktop.");
    await page.goto("/sources");
    const urls = await page.locator("a[href^='https://']").evaluateAll((links) =>
      [...new Set(links.map((link) => (link as HTMLAnchorElement).href))].filter((url) => /kohler\.com/.test(url)),
    );
    expect(urls.length).toBeGreaterThanOrEqual(12);
    for (let index = 0; index < urls.length; index += 4) {
      const batch = urls.slice(index, index + 4);
      const responses = await Promise.all(batch.map((url) => request.get(url, { timeout: 45_000 })));
      responses.forEach((response, responseIndex) => {
        expect(response.status(), batch[responseIndex]).toBeLessThan(400);
      });
    }
  });
});
