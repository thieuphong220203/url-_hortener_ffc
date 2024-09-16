require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');
const app = express();

app.use(bodyParser.urlencoded({extended: false}))
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urlDatabase = [];
let urlId = 1;

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url
  // Parse the URL to extract the hostname
  const parsedUrl = url.parse(originalUrl);
  const hostname = parsedUrl.hostname;

  if (!hostname) {
    return res.json({ error: 'invalid url' });
  }

  // Check if the hostname is valid using dns.lookup
  dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' })
    }
  })
  
    
  const shortUrl = urlId;
  urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });
  urlId++;
 
  
  
  
  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  })
  
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  const short_url = req.params.shorturl
  const urlEntry = urlDatabase.find(entry => entry.short_url == short_url)
  console.log(urlEntry);
  
  if (urlEntry) {
    res.redirect(urlEntry.original_url)
  } else {
    res.json({ error: 'No short URL found for the given input'})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
