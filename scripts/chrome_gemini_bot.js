#!/usr/bin/env node

/**
 * Autonomous Gemini Pro Image Generation Bot using Chrome DevTools Protocol & Puppeteer
 * Adapted from Data Centers & Way Head workflow for AgriDrishti Assam (NESFIC-D-11).
 *
 * Usage:
 *   node scripts/chrome_gemini_bot.js
 *   node scripts/chrome_gemini_bot.js --force
 *   node scripts/chrome_gemini_bot.js --port=9222
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..');
const PROMPTS_FILE = path.join(BASE_DIR, 'scripts', 'image_prompts.json');
const ASSETS_DIR = path.join(BASE_DIR, 'docs', 'assets');

const args = process.argv.slice(2);
let port = 9222;
let forceOverwrite = false;

args.forEach((arg) => {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.replace('--port=', '').trim(), 10);
  } else if (arg === '--force') {
    forceOverwrite = true;
  }
});

if (!fs.existsSync(PROMPTS_FILE)) {
  console.error(`Error: Prompts file not found at ${PROMPTS_FILE}`);
  process.exit(1);
}

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const allPrompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
const queue = allPrompts.filter((item) => {
  const targetPath = path.join(ASSETS_DIR, item.filename);
  return forceOverwrite || !fs.existsSync(targetPath);
});

console.log('\n=============================================================');
console.log('CHROME GEMINI PRO AUTOMATION BOT (PUPPETEER CDP)');
console.log('=============================================================');
console.log(`Target Chrome Port      : ${port}`);
console.log(`Target Assets Directory : ${ASSETS_DIR}`);
console.log(`Total Prompts in Queue  : ${queue.length} of ${allPrompts.length}`);
console.log('=============================================================\n');

if (queue.length === 0) {
  console.log('All images already exist in docs/assets/. Use --force to regenerate.\n');
  process.exit(0);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  let browser;
  try {
    browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${port}`,
      defaultViewport: null,
    });
    console.log('Connected successfully to Google Chrome.');
  } catch (err) {
    console.error(`Could not connect to Google Chrome on port ${port}: ${err.message}`);
    process.exit(1);
  }

  const pages = await browser.pages();
  let geminiPage = pages.find((p) => p.url().includes('gemini.google.com'));

  if (!geminiPage) {
    geminiPage = await browser.newPage();
    await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
  } else {
    await geminiPage.bringToFront();
  }

  await geminiPage
    .waitForSelector('rich-textarea, div[contenteditable="true"], textarea', { timeout: 30000 })
    .catch(() => console.log('Notice: Ensure you are signed into kalyanjit@gmail.com on Gemini.'));

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const targetFile = path.join(ASSETS_DIR, item.filename);
    console.log(`\n[${i + 1}/${queue.length}] Generating ${item.filename} (${item.section})...`);

    try {
      await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
      await sleep(2000);
      await geminiPage.waitForSelector('rich-textarea, div[contenteditable="true"], textarea', {
        timeout: 20000,
      });

      const existingImageUrls = await geminiPage.evaluate(() =>
        Array.from(document.querySelectorAll('img')).map((img) => img.src).filter(Boolean)
      );

      const promptFull = `Generate a high-quality 16:9 widescreen infographic image: ${item.prompt}`;

      await geminiPage.evaluate((text) => {
        const input = document.querySelector(
          'rich-textarea p, rich-textarea div[contenteditable="true"], div[contenteditable="true"] p, div[contenteditable="true"], textarea'
        );
        if (input) {
          input.focus();
          input.innerText = text;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, promptFull);

      await sleep(1000);

      const clicked = await geminiPage.evaluate(() => {
        const sendBtn = document
          .querySelector(
            'button[aria-label="Send message"], button.send-button, mat-icon[data-mat-icon-name="send"]'
          )
          ?.closest('button');
        if (sendBtn && !sendBtn.disabled) {
          sendBtn.click();
          return true;
        }
        return false;
      });

      if (!clicked) {
        await geminiPage.keyboard.press('Enter');
      }

      let imageBuffer = null;
      let waitAttempts = 0;

      while (!imageBuffer && waitAttempts < 35) {
        await sleep(3000);
        waitAttempts++;

        const newImageData = await geminiPage.evaluate((existingUrls) => {
          const allImages = Array.from(document.querySelectorAll('img'));
          const candidates = allImages.filter(
            (img) =>
              img.src &&
              !existingUrls.includes(img.src) &&
              (img.src.includes('googleusercontent.com') ||
                img.src.startsWith('blob:') ||
                img.src.startsWith('data:image')) &&
              img.naturalWidth > 350
          );
          if (candidates.length > 0) {
            const latest = candidates[candidates.length - 1];
            return { src: latest.src, width: latest.naturalWidth, height: latest.naturalHeight };
          }
          return null;
        }, existingImageUrls);

        if (newImageData) {
          const base64Data = await geminiPage.evaluate((imgSrc) => {
            const img = Array.from(document.querySelectorAll('img')).find((i) => i.src === imgSrc);
            if (!img || !img.complete || img.naturalWidth === 0) return null;
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              return canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
            } catch {
              return null;
            }
          }, newImageData.src);

          if (base64Data) {
            imageBuffer = Buffer.from(base64Data, 'base64');
          }
        }
      }

      if (imageBuffer) {
        fs.writeFileSync(targetFile, imageBuffer);
        const stats = fs.statSync(targetFile);
        console.log(`Saved ${item.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
        successCount++;
      } else {
        console.error(`Timed out waiting for ${item.filename}`);
        failureCount++;
      }
    } catch (err) {
      console.error(`Error on ${item.filename}: ${err.message}`);
      failureCount++;
    }

    if (i < queue.length - 1) {
      await sleep(5000);
    }
  }

  console.log(`\nRUN COMPLETE: ${successCount} Saved, ${failureCount} Failed`);
  browser.disconnect();
}

main().catch((err) => {
  console.error(`Fatal Error: ${err.message}`);
  process.exit(1);
});
