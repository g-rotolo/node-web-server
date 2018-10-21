const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//set the port for HEROKU ENV or default for local env
const port = process.env.PORT || 3000;

//to make nodemon update also with the changes in hbs files:
// nodemon server.js -e js,hbs

const app = express();

// tells hbs where the partial folder is
hbs.registerPartials(__dirname + '/views/partials');
// registers a function to hbs
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// creating a middleware that can modify the default behaviour of express
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now} : ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', err => {
    if(err) console.log('Unable to append to the log file');
  })
  console.log(log);
  next();
});

app.use((req, res, next) => {
  res.render('maintenance.hbs', {
    pageTitle: 'Maintenance',
    message: 'Sorry, this website is not available at the moment.'
  });
});

// tells express that we want to use hbs as view engine
app.set('view engine', 'hbs');

// tells express to use this static folder
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Grsol.com',
    welcomeMessage: 'Welcome to a solutions source in a world full of problems'
  })
});

app.get('/help', (req, res) => {
  res.render('/public/help');
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  })
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
