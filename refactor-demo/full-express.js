'use strict';

const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.get('/scrapeIt', handleScrape);

function handleScrape(request, response) {


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

    travelCompanion.stats = data;
    console.log('in home page scrape, first in promise\'s')
    await browser.close();
    return travelCompanion;
  })().then((travelCompanion) => {
    return (async () => {

      let browser = await puppeteer.launch();
      let page = await browser.newPage();
      page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36');

      let url = 'https://www.codefellows.org/course-calendar'
      await page.goto(url, { waitUntil: 'networkidle2' })

      let data = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > h2 > span'), element => {
          return element.textContent
        })
      })

      let data2 = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > a > h1'), element => {
          return element.textContent
        })
      })

      //Below was really to handle a short amount of edge cases where the string was not as we planned. I purposely limited the handled edge cases for demo 
      let test = ((data) => {
        let cleanerArray = []
        for (let i = 0; i < 16; i = i + 2) {
          if (/^[a-zA-z]/.test(data[i + 1])) {
            cleanerArray.push(data[i]);
            cleanerArray.push(data[i + 1]);
          } else {
            let safeString = `${data[i]}${data[i + 1]}`;
            cleanerArray.push(safeString)
          }
        }
        return cleanerArray;
      })

      travelCompanion.calendarSchedule = test(data);

      let courseArray = [];

      for (let i = 0; i < travelCompanion.calendarSchedule.length; i++) {
        courseArray.push(data2[i])
      }

      let data3 = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.course-calendar-quarter-list > div > article > header > h2:first-child'), element => {
          return element.textContent
        })
      });

      let timeOfArray = [];

      for (let i = 0; i < travelCompanion.calendarSchedule.length; i++) {
        if (/^[Self]/.test(data3[i])) {
          timeOfArray.push('Self Paced Course');
        }
        else if (/^[Saturday,]/.test(data3[i]) || /^[Sunday,]/.test(data3[i])) {
          timeOfArray.push('One day Course')
        } else if (/^[Monday - Friday]/.test(data3[i])) {
          timeOfArray.push('Day Course')
        } else if (/^[Monday - Thursday]/.test(data3[i])) {
          timeOfArray.push('Night Course')
        }
      }
      travelCompanion.fullyCleanedData = { stats: {}, results: [] };


      for (let i = 0; i < travelCompanion.calendarSchedule.length; i++) {
        travelCompanion.fullyCleanedData.results.push(courseArray[i] = {
          course: courseArray[i],
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
          upcomingCourse: courseArray[i]
        });
      }

      console.log('clean', finalObject, finalObject.stats, finalObject.upComingCourses);

      await browser.close();
      return finalObject;
    })();
  }).then(travelCompanion => {
    response.send(travelCompanion)
  })
}
app.listen(3000, () => {
  console.log('This PPH is rockin on PORT:3K')
});