import fs from "fs/promises";
import { globby } from "globby";
import path from "path";
import puppeteer from "puppeteer";

export async function getRawSpecIDLs(specs) {
  const browser = await puppeteer.launch();
  const output = await Promise.all(
    specs.map(async (spec) => ({
      input: spec,
      sources: await extractSpecIDLs(browser, spec),
    }))
  );
  await browser.close();
  return output;
}

export async function extractSpecIDLs(browser, spec) {
  const page = await browser.newPage();
  await page.goto(spec.url);

  const sources = await page.evaluate((selector) => {
    return Array.from(document.querySelectorAll(selector)).map((e) => e.textContent);
  }, spec.selector);

  await page.close();

  return sources.map((source) => ({
    path: spec.url,
    text: source,
  }));
}

export async function getRawRepoIDLs(repos) {
  return Promise.all(
    repos.map(async (repo) => ({
      input: repo,
      sources: await extractRepoIDLs(repo),
    }))
  );
}

export async function extractRepoIDLs(repo) {
  const cwd = repo.url.pathname;
  const files = await globby(repo.glob, { cwd, absolute: true });
  return Promise.all(
    files.map(async (file) => ({
      path: path.relative(cwd, file),
      text: await fs.readFile(file, "utf8"),
    }))
  );
}
