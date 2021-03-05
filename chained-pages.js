'use strict';

const puppeteer = require('puppeteer');

(async () => {

  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36')

  let url = 'https://www.codefellows.org'
  await page.goto(url, { waitUntil: 'networkidle2' })

  let travelCompanion = {};

  let data = await page.evaluate(() => {
    let statNumbers = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h4'), element => element.textContent);
    let statLabels = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h5 > a'), element => element.textContent);
    return { stats: statNumbers, labels: statLabels }
  })

  travelCompanion.codeRocks = data;
  travelCompanion.cleanObj = {
    [travelCompanion.codeRocks.labels[0]]: travelCompanion.codeRocks.stats[0],
    [travelCompanion.codeRocks.labels[1]]: travelCompanion.codeRocks.stats[1],
    [travelCompanion.codeRocks.labels[2]]: travelCompanion.codeRocks.stats[2],
    [travelCompanion.codeRocks.labels[3]]: travelCompanion.codeRocks.stats[3],
  }

  console.log('in home page scrape, first in promise\'s')
  await browser.close();
  return travelCompanion;
})().then((travelCompanion) => {
  return (async () => {

    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36')

    let url = 'https://www.codefellows.org/course-calendar'
    await page.goto(url, { waitUntil: 'networkidle2' })
    let data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > h2 > span'), element => {
        return element.textContent
      })
    })

    //Below was really to handle a short amount of edge cases where the string was not as we planned. I purposely limited the handled edge cases for demo 
    let test = ((data) => {
      let cleanerArray = []
      for (let i = 0; i < 16; i = i + 2) {
        let potentialProblemString = `${data[i]}${data[i + 1]}`;
        let cleanedUpString = potentialProblemString.replace(/(2021Mar)/, '2021 - Mar')
        cleanerArray.push(cleanedUpString)
      }
      return cleanerArray;
    })

    travelCompanion.calendarSchedule = test(data);
    console.log('both on the same return object', 'first obj came from some home page scraping', travelCompanion.cleanObj, 'the second array came from calendar page scrape', travelCompanion.calendarSchedule)
    console.log('in course calendar page scrape, second in promise chain')
    await browser.close();
    return travelCompanion;
  })();
});
