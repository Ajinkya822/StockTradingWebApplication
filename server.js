const express= require('express');
const fetch= require('node-fetch');
const cors=require("cors");
require('dotenv').config();

const port = process.env.PORT || 3000;




const app = express();

app.use(cors({
  origin:'*'
}));

const path= __dirname + '/dist/hw8project/';
app.use('/', express.static(path));

app.get('/', (req, res) => {
  res.send('HEllo world');
});

app.get("/stockdetails_2", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");
  var _keystock_ = req.query._keystock_;
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

app.get("/stockdetails_1", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");
  var _keystock_ = req.query._keystock_;
  var url = `https://finnhub.io/api/v1/search?q=${_keystock_}&token=c7urenqad3ie4vchpif0`;

  const options = {
    method: "GET", headers: headers,
  };

  await fetch(url, options)
    .then((response) => response.json())
    .then((response)=>{
      //console.log(response);
        
      for (let i = 0; i < response["result"].length; i++) {
          if(!response["result"][i]["type"].includes("Common Stock") || response["result"][i]["symbol"].includes(".")) {
            response["result"].splice(i, 1);
            i = i - 1;
          }
       }
        for (var i = 0; i < response["result"].length; i++) {
          delete response["result"][i]["displaySymbol"];
          delete response["result"][i]["primary"];
          delete response["result"][i]["type"];
        }
      res.json(response["result"]);
    })
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  //The autocomplete response is filtered using the criteria: type= ‘Common Stock’, Symbol doesn’t contain dot
  
  

  // res.json(response["result"]);
});

//price change api call
app.get("/stockdetails_3priceChange", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");

  var _keystock_ = req.query._keystock_;
  const url = `https://finnhub.io/api/v1/quote?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

//company peers api call

app.get("/stockdetails_companypeers", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");

  var _keystock_ = req.query._keystock_;
  const url = `https://finnhub.io/api/v1/stock/peers?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

app.get("/stockdetails_newsData", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");
  var fromDate;
  var toDate;

    var toDate = new Date();
    var dd = String(toDate.getDate()).padStart(2, '0');
    var mm = String(toDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = toDate.getFullYear();
    toDate=yyyy + '-' + mm + '-' + dd;


    var fromDate=new Date();
    fromDate.setDate(fromDate.getDate()-7);
    var dd = String(fromDate.getDate()).padStart(2, '0');
    var mm = String(fromDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = fromDate.getFullYear();
    fromDate=yyyy + '-' + mm + '-' + dd;


  var _keystock_ = req.query._keystock_;
 // const url = `https://finnhub.io/api/v1/company-news?symbol=${_keystock_}&from=2021-09-01&to=2021-09-09&token=c7urenqad3ie4vchpif0`;
  const url = `https://finnhub.io/api/v1/company-news?symbol=${_keystock_}&from=${fromDate}&to=${toDate}&token=c7urenqad3ie4vchpif0`;

  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

app.get("/stockdetails_historicalData", async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");

  var toDate=Date.now();
  toDate=Math.floor(toDate/1000);
  var fromDate=new Date();
  fromDate.setDate(fromDate.getDate()-730);
  fromDate=Math.floor(fromDate/1000);
  //console.log("from and to date", fromDate, toDate);



  var _keystock_ = req.query._keystock_;
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${_keystock_}&resolution=D&from=${fromDate}&to=${toDate}&token=c7urenqad3ie4vchpif0`;
  //const url = `https://finnhub.io/api/v1/stock/candle?symbol=TSLA&resolution=1&from=1631022248&to=1631627048&token=c7urenqad3ie4vchpif0`;
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

app.get("/stockdetails_socialSentimentData", async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "http://localhost:4200");
  let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");

  var _keystock_ = req.query._keystock_;
  //const url = `https://finnhub.io/api/v1/stock/candle?symbol=${_keystock_}&resolution=D&from=1616085255&to=1647596985&token=c7urenqad3ie4vchpif0`;
  const url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${_keystock_}&from=2022-01-01&token=c7urenqad3ie4vchpif0`;
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

app.get("/stockdetails_RTrendsData", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");

  var _keystock_ = req.query._keystock_;
  //const url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${_keystock_}&from=2022-01-01&token=c7urenqad3ie4vchpif0`;
  const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

app.get("/stockdetails_EarningData", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
 let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");

  var _keystock_ = req.query._keystock_;
  //const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
  const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});

//1648238400 25th march 1 pm
//1648216800 7 am

app.get("/stockdetails_HistoricalChartData", async (req, res) => {
//  res.set("Access-Control-Allow-Origin", "http://localhost:4200");
let headers = {'Content-Type': 'application/json'};
  // res.set("Access-Control-Allow-Origin", "https://ajinkyanode303.wl.r.appspot.com:4200");

  var _keystock_ = req.query._keystock_;
  var toTimeURL= req.query.toTime;
  var fromTimeURL= toTimeURL-21600;
  
  //console.log("on server", req.query._keystock_ ,req.query.fromTime);
  //const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
 // const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${_keystock_}&token=c7urenqad3ie4vchpif0`;
  const url= `https://finnhub.io/api/v1/stock/candle?symbol=${_keystock_}&resolution=5&from=${fromTimeURL}&to=${toTimeURL}&token=c7urenqad3ie4vchpif0`;
  //console.log("url is", url);
  const options = {
    method: "GET", headers: headers,
  };

  const response = await fetch(url, options)
    .then((res) => res.json())
    .catch((e) => {
      console.error({
        message: "oh no!",
        error: e,
      });
    });

  res.json(response);
});



app.listen(port, () => console.log("lISTENING GO AHEAD"));
