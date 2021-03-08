'use strict';
const dualScrape = require('./utilFunctions/ninjaCleanDualPageScrape.js');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'))

app.get('/', (request, response) => {
  response.render('index.ejs')
})
app.get('/makeItPretty', handleScrape);

function handleScrape(request, response) {
  dualScrape()
    .then(finalObject => {
      response.render('happyFriday.ejs', { finalObject })
    })
}
app.listen(3000, () => {
  console.log('This PPH is rockin on PORT:3K')
});