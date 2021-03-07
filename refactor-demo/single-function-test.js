// 'use strict';
//Tried to get this to work before first demo, the only thing I was missing was the call of the function iself :(
const puppeteer = require('puppeteer');
const cleanupDateRanges = require('./utilFunctions/cleanupDateRanges.js');
const courseTitles = require('./utilFunctions/courseArray.js');

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

    return { stats: statNumbers, labels: statLabels }

  })

  travelCompanion.stats = homepageStats;

  /* I think homepageStats is fine for now. */

  let url2 = 'https://www.codefellows.org/course-calendar'
  await page.goto(url2, { waitUntil: 'networkidle2' })


  //CourseData is range of start and end of course
  let courseData = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > h2 > span'), element => {
      return element.textContent
    })
  })
  //Data2 is course name
  let courseNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > a > h1'), element => {
      return element.textContent
    })
  })

  let dayAndNight = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > header > h2:first-child'), element => {
      return element.textContent
    })
  });

  travelCompanion.calendarSchedule = cleanupDateRanges(courseData);
  travelCompanion.courseTitle = courseTitles(travelCompanion.calendarSchedule.length, courseNames);

  //Data 3 is day/night/single

  let timeOfArray = [];

  for (let i = 0; i < travelCompanion.calendarSchedule.length; i++) {
    if (/^[Self]/.test(dayAndNight[i])) {
      timeOfArray.push('Self Paced Course');
    }
    else if (/^[Saturday,]/.test(dayAndNight[i]) || /^[Sunday,]/.test(dayAndNight[i])) {
      timeOfArray.push('One day Course')
    } else if (/^[Monday - Friday]/.test(dayAndNight[i])) {
      timeOfArray.push('Day Course')
    } else if (/^[Monday - Thursday]/.test(dayAndNight[i])) {
      timeOfArray.push('Night Course')
    }
  }
  travelCompanion.fullyCleanedData = { stats: {}, results: [] };


  for (let i = 0; i < travelCompanion.calendarSchedule.length; i++) {
    travelCompanion.fullyCleanedData.results.push({
      course: travelCompanion.courseTitle[i],
      calendarTime: travelCompanion.calendarSchedule[i],
      typeOfCourse: timeOfArray[i]
    })
  }

  let finalObject = {
    stats: [
      {
        statOne: { stat: travelCompanion.stats.labels[0], value: travelCompanion.stats.stats[0] },
        statTwo: { stat: travelCompanion.stats.labels[1], value: travelCompanion.stats.stats[1] },
        statThree: { stat: travelCompanion.stats.labels[2], value: travelCompanion.stats.stats[2] },
        statFour: { stat: travelCompanion.stats.labels[3], value: travelCompanion.stats.stats[3] }
      }
    ],
  }

  finalObject.upComingCourses = [];

  for (let i = 0; i < travelCompanion.calendarSchedule.length; i++) {
    finalObject.upComingCourses.push({
      upcomingCourse: travelCompanion.fullyCleanedData.results
    });
  }

  console.log('clean', finalObject, finalObject.stats, finalObject.upComingCourses);


  await browser.close();
  return finalObject;

})();
