'use strict';

const puppeteer = require('puppeteer');

(async () => {
  //Launch a Chrome Browser
  let browser = await puppeteer.launch();

  //Then establish a page in the Browser
  let page = await browser.newPage();

  //Not always required, but it helps you not look like a robot scraper.
  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36');

  //Provide a url to scrape, and call the page.goto Method
  //Note the optional param of waitUntil. This helps insure we don't try to scrape anything until the page fully loads the url in.
  let url = 'https://www.codefellows.org'
  await page.goto(url, { waitUntil: 'networkidle2' });

  //We are Ready to Scrape!!


  //When You are done with all the cool things you needed to do, make sure to turn the temporary Browser off.
  await browser.close();
})();