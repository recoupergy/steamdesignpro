import { expect, test } from "@playwright/test";

const routes = [
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
  for (const [route, heading] of routes) {
    test(`${route} is server-rendered with canonical metadata`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: new RegExp(heading, "i") })).toBeVisible();
      await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", new RegExp(`https://steamdesignpro\\.com${route}`));
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
