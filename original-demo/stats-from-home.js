'use strict';

const puppeteer = require('puppeteer');

(async () => {

  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36');

  let url = 'https://www.codefellows.org'
  await page.goto(url, { waitUntil: 'networkidle2' });

  let data = await page.evaluate(() => {
    let statNumbers = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h4'), element => element.textContent);
    let statLabels = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h5 > a'), element => element.textContent);
    return { stats: statNumbers, labels: statLabels }
  })

  console.log(data)

  await browser.close();
})();