// 'use strict';
//Tried to get this to work before first demo, the only thing I was missing was the call of the function iself :(
const puppeteer = require('puppeteer');
//Util Function Imports
const cleanupDateRanges = require('./utilFunctions/cleanupDateRanges.js');
const courseTitles = require('./utilFunctions/courseArray.js');
const dayOrNight = require('./utilFunctions/dayOrNight.js');

(async () => {

  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36')

  let url = 'https://www.codefellows.org'
  await page.goto(url, { waitUntil: 'networkidle2' })

  let travelCompanion = {};

  //This data is stats from homepage
  let homepageStats = await page.evaluate(() => {

    let statNumbers = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h4'), element => element.textContent);

    let statLabels = Array.from(document.querySelectorAll('.single-stat > .mobile > div > h5 > a'), element => element.textContent);

    return { value: statNumbers, labels: statLabels }

  })
  //Storing stats on my chosen return object
  travelCompanion.stats = homepageStats;

  let url2 = 'https://www.codefellows.org/course-calendar'
  await page.goto(url2, { waitUntil: 'networkidle2' })
  //CourseData is range of start and end of courses
  let courseData = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > h2 > span'), element => {
      return element.textContent
    })
  })
  //Course names sync up with date ranges after cleanup below
  let courseNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > a > h1'), element => {
      return element.textContent
    })
  })
  //Changes the hour ranges to just a few possible strings
  let dayAndNight = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > header > h2:first-child'), element => {
      return element.textContent
    })
  });
  //Utilize the cleanup functions for a nice return/response
  travelCompanion.calendarSchedule = cleanupDateRanges(courseData);

  travelCompanion.courseTitles = courseTitles(travelCompanion.calendarSchedule.length, courseNames);

  travelCompanion.dayOrNight = dayOrNight(travelCompanion.calendarSchedule.length, dayAndNight);
  //Just logging to check before closing browser instance and returning travelCompanion object
  console.log('just travel', travelCompanion);
  await browser.close();
  return travelCompanion;

})();//:) :) :)
