'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const PORT = process.env.PORT || 3000;

const config = {
  channelSecret: '38d0f42007c591aa99d7b7a89d2c0232',
  channelAccessToken: 'Ha+AuVrI7lSIFWLtXhQUyIzxK5bnylO7p1sViBtGk//8erhziYzqtqVZw6gR64r2eg35V64X4+zkWlloB2lyBP1XkDwvSHRBQXB/+R4ZIhE/s/LCmCKg821lmHxDBSUtVhtkxvzjiwGejTAI4PhvEwdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let mes = ''
  if(event.message.text === '天気教えて！'){
    mes = 'ちょっとまってね'; //待ってねってメッセージだけ先に処理
    getNodeVer(event.source.userId); //スクレイピング処理が終わったらプッシュメッセージ
  }else{
    mes = event.message.text;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: mes
  });
}

const getNodeVer = async (userId) => {
    const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
    const item = res.data;

    await client.pushMessage(userId, {
        type: 'text',
        text: item.description.text,
    });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);