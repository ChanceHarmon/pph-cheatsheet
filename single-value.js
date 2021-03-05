'use strict';

const puppeteer = require('puppeteer');

(async () => {

  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36');

  let url = 'https://www.codefellows.org'
  await page.goto(url, { waitUntil: 'networkidle2' });

  let data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.singleProfile > h5'), element => element.textContent)
  })

  console.log(data)

  await browser.close();
})();