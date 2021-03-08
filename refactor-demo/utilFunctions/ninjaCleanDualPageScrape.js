'use strict';
const puppeteer = require('puppeteer');
const cleanupDateRanges = require('./utilFunctions/cleanupDateRanges.js');
const courseTitles = require('./utilFunctions/courseArray.js');
const dayOrNight = require('./utilFunctions/dayOrNight.js');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36');
  const url = 'https://www.codefellows.org'
  await page.goto(url, { waitUntil: 'networkidle2' });
  let travelCompanion = {};
  let homepageStats = await page.evaluate(() => {
    let statNumbers = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h4'), element => element.textContent);
    let statLabels = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h5 > a'), element => element.textContent);
    return { value: statNumbers, labels: statLabels }
  });
  travelCompanion.stats = homepageStats;
  let url2 = 'https://www.codefellows.org/course-calendar'
  await page.goto(url2, { waitUntil: 'networkidle2' })
  let courseData = await page.evaluate(() => Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > h2 > span'), element => element.textContent));
  let courseNames = await page.evaluate(() => Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > a > h1'), element => element.textContent));
  let dayAndNight = await page.evaluate(() => Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > header > h2:first-child'), element => element.textContent));
  travelCompanion.calendarSchedule = cleanupDateRanges(courseData);
  travelCompanion.courseTitles = courseTitles(travelCompanion.calendarSchedule.length, courseNames);
  travelCompanion.dayOrNight = dayOrNight(travelCompanion.calendarSchedule.length, dayAndNight);
  console.log('just travel', travelCompanion);
  await browser.close();
  return travelCompanion;
})();
