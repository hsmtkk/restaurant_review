const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');

const API_KEY='XXXXXXXXXXXXX';
const SEARCH_URL='https://maps.googleapis.com/maps/api/place/textsearch/json';
const PLACE_URL='https://maps.googleapis.com/maps/api/place/details/json';
const SENTIMENT_URL='https://language.googleapis.com/v1/documents:analyzeSentiment';
const LANG='ja';
const REGION='jp';
const TYPE='restaurant';
const PORT=3000;

const FLAG_DUMMY = process.argv.slice(2).some((arg) => {
  return arg === '-d' || arg == '--dummy';
});
if (FLAG_DUMMY) {
  console.log('-- use dummy data --');
}

const server = express();

server.use(bodyParser.json({limit: '50mb'}));
server.use(express.static(path.join(__dirname, 'public')));

server.get('/shops', (req, res) => {
  if (!FLAG_DUMMY) {
    const options = {
      url: SEARCH_URL,
      qs: {
        query: req.query.text,
        language: LANG,
        region: REGION,
        type: TYPE,
        key: API_KEY
      }
    };
    request.get(options, (error, response, body) => {
      console.log(body);
      if (response && response.statusCode === 200) {
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(body);
        fs.writeFileSync('data/shopsdata.json', body);
      } else {
        res.status(response.statusCode);
        res.send(error);
      }
    });
  } else {
    const body = fs.readFileSync('data/shopsdata.json', 'utf8');
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(body);
  }
});

server.get('/shop', (req, res) => {
  if (!FLAG_DUMMY) {
    const place_id = req.query.place_id;
    const options = {
      url: PLACE_URL,
      qs: {
        place_id: place_id,
        fields: 'name,rating,review',
        language: LANG,
        region: REGION,
        key: API_KEY
      }
    };
    request.get(options, (error, response, body) => {
      if (response && response.statusCode === 200) {
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(body);
        fs.writeFileSync('data/shopdata.json', body);
      } else {
        res.status(response.statusCode);
        res.send(error);
      }
    });
  } else {
    const body = fs.readFileSync('data/shopdata.json', 'utf8');
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(body);
  }
});

server.post('/sentiment', (req, res) => {
  if (!FLAG_DUMMY) {
    const options = {
      url: SENTIMENT_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      json: {
        encodingType: 'UTF8',
        document: {
          type: 'PLAIN_TEXT',
          content: req.body.text
        }
      },
      qs: {
        key: API_KEY
      }
    };
    request.post(options, (error, response, body) => {
      if (response && response.statusCode === 200) {
        const sentiment = body.documentSentiment;
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(sentiment);
        fs.writeFileSync('data/sentimentdata.json', JSON.stringify(sentiment));
      } else {
        console.log(error);
        res.status(response.statusCode);
        res.send(error);
      }
    });
  } else {
    const body = fs.readFileSync('data/sentimentdata.json', 'utf8');
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(body);
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
