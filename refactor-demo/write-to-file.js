'use strict';
const fs = require('fs');
const dualScrape = require('./utilFunctions/ninjaCleanDualPageScrape.js');

dualScrape()
  .then(travelCompanion => {
    let awesomeData = { data: travelCompanion }
    let prepDataForWrite = JSON.stringify(awesomeData)
    fs.writeFile('data/thank-you-codeFellows/page-1.json', prepDataForWrite, (err) => {
      if (err) throw err;
    })
  })