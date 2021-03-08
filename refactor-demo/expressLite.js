'use strict';
const dualScrape = require('./utilFunctions/ninjaCleanDualPageScrape.js');
const express = require('express');
const app = express();

app.get('/scrapeIt', handleScrape);

function handleScrape(request, response) {
  dualScrape()
    .then(travelCompanion => {
      response.send(travelCompanion)
    })
    .catch(err => console.error('error', err))
}
app.listen(3000, () => {
  console.log('This PPH is rockin on PORT:3K')
});