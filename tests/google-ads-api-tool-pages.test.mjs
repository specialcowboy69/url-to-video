import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(path, "utf8");

test("private Google Ads API tool pages exist and stay out of public navigation", () => {
  const toolPage = read("app/google-ads-api-tool/page.tsx");
  const privacyPage = read("app/google-ads-api-tool/privacy-policy/page.tsx");
  const termsPage = read("app/google-ads-api-tool/terms-of-service/page.tsx");
  const layout = read("app/google-ads-api-tool/layout.tsx");
  const middleware = read("middleware.ts");
  const sitemap = read("app/sitemap.ts");
  const seo = read("app/seo.ts");
  const localeLayout = read("app/[locale]/layout.tsx");

  assert.match(toolPage, /Google Ads API Internal Tool/);
  assert.match(privacyPage, /We do not sell Google user data/);
  assert.match(termsPage, /The tool is not offered as a public service/);

  assert.match(layout, /index:\s*false/);
  assert.match(layout, /follow:\s*false/);

  assert.match(middleware, /google-ads-api-tool/);
  assert.match(middleware, /startsWith/);

  assert.doesNotMatch(sitemap, /google-ads-api-tool/);
  assert.doesNotMatch(seo, /google-ads-api-tool/);
  assert.doesNotMatch(localeLayout, /google-ads-api-tool/);
});
