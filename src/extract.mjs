export async function extractIDLSources(browser, spec) {
  const page = await browser.newPage();
  await page.goto(spec.url);

  const sources = await page.evaluate((selector) => {
    return Array.from(document.querySelectorAll(selector)).map((e) => e.textContent);
  }, spec.selector);

  await page.close();
  return sources;
}
