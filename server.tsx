const http = require('http');
import { request, RequestOptions } from 'https';
import * as React from 'React';
import * as Express from 'Express';
import { Request, Response, Router } from 'Express';
import { renderToString } from 'react-dom/server';
import Index from './Index';
import * as url from "url";
import * as xmlparse from 'xml2js';
import * as cookieParser from 'cookie-parser';
const goodreads = require('goodreads');

interface IMap<T> {
  [key: string]: T
}

interface authResults {
  userid: string,
  success: number,
  accessToken: string,
  accessTokenSecret: string

}

const hostname = '127.0.0.1';
const port = 3000;
const key = "KgjldNEdsn4yTAWfYm0ww";
const secret = "n69Pn3asRgeFL88u7IwJ4AYiyo0RNFXU3kLFp3OHQlg";
const app = Express();
const router = Router();
const resultsPerPage = 1;
var fakeSession: IMap<string> = {};

app.use(cookieParser("good@random!reads~"));

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (fakeSession.userId) {
    serveBookResult(fakeSession.userId, res);
  } else {
    res.end(renderToString(<Index />));
  }
});

app.get("/logout", (req, res) => {
  //
});

app.get("/login", (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  var gr = goodreads.client({ key: key, secret: secret });
  gr.requestToken((result: any) => {
    // log token and secret to our fake session
    fakeSession.oauthToken = result.oauthToken
    fakeSession.oauthTokenSecret = result.oauthTokenSecret

    // Redirect to the goodreads url!!
    res.writeHead(302, { 'Location': result.url })
    return res.end()
  });
});

app.get("/callback", (req, res) => {
  // grab token and secret from our fake session
  let { oauthToken } = fakeSession
  let { oauthTokenSecret } = fakeSession
  // parse the querystring
  let params = url.parse(req.url, true)


  var gr = goodreads.client({ 'key': key, 'secret': secret })
  return gr.processCallback(oauthToken, oauthTokenSecret, params.query.authorize, (result: authResults) => {
    fakeSession.accessToken = result.accessToken;
    fakeSession.accessTokenSecret = result.accessTokenSecret;
    var userId = result.userid;
    fakeSession.userId = result.userid;
    res.redirect("/");
  });
});

function serveBookResult(userId: string, res: Response) {
  getShelf(key, userId, 1, (result: any) => {
    var max = result.GoodreadsResponse && result.GoodreadsResponse.reviews && result.GoodreadsResponse.reviews[0] && result.GoodreadsResponse.reviews[0].$ ? result.GoodreadsResponse.reviews[0].$.total : null;
    if (max) {
      var randomBook = Math.floor(Math.random() * max); // random number between 0 and number of books on shelf
      var pageNum = Math.floor(randomBook / resultsPerPage) + 1; // page number is 1 indexed 
      var itemIndex = (randomBook % resultsPerPage); 
      if (pageNum === 1) {
        getBook(res, result, itemIndex)
      } else {
        getShelf(key, userId, pageNum, (response: any) => {
          getBook(res, response, itemIndex);
        })
      }
    } else {
      res.write(JSON.stringify(result));
      res.end();
    }
  });
}

function getBook(res: Response, result: any, itemIndex: number) {
  var review = result.GoodreadsResponse && result.GoodreadsResponse.reviews[0] && result.GoodreadsResponse.reviews[0].review && result.GoodreadsResponse.reviews[0].review.length > itemIndex ? result.GoodreadsResponse.reviews[0].review[itemIndex] : null;
  var book = review && review.book && review.book.length === 1 ? review.book[0] : null;
  res.write(renderToString(<Index book={book} />));
  res.end();
}

function getShelf(key: string, id: string, pageNum: number = 1, callback: Function) {
  var options: RequestOptions = {
    host: "www.goodreads.com",
    path: `/review/list?key=KgjldNEdsn4yTAWfYm0ww&v=2&shelf=to-read&id=${id}&page=${pageNum}&per_page=${resultsPerPage}`,
    method: "GET"
  };

  var reqStart = Date.now();
  console.log(options);
  var parser = new xmlparse.Parser();
  request(options, (result) => {
    const statusCode = result.statusCode;
    result.setEncoding('utf8');
    let rawData = '';
    result.on('data', (chunk) => rawData += chunk);
    result.on('end', () => {
      console.log("request", (Date.now() - reqStart)/1000)
      var start = Date.now();
      xmlparse.parseString(rawData, (err, result) => {
        callback(result);
        console.log((Date.now() - start)/1000);
      })
    });
  }).end();
}


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});