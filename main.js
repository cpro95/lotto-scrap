const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const lotto_url =
  'https://dhlottery.co.kr/gameResult.do?method=byWin&drwNo=883';

const getHtml = async () => {
  try {
    return await axios.get(lotto_url);
  } catch (err) {
    console.error(error);
  }
};

// 회차 및 날짜
getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    var noList = [];
    noList.push(
      $('div.win_result')
        .find('h4,strong')
        .text()
        .match(/\d+/)[0]
    );
    // var dateArr = [];

    var data = $('div.win_result')
      .find('p.desc')
      .text();
    data = data.split(' ');
    data.pop();
    var dateArr = [];
    data.map((value, index) => {
      dateArr.push(value.match(/\d+/)[0]);
    });
    noList.push(dateArr.join('.'));
    return noList;
  })
  .then(res => console.log(res))
  .catch(error => console.log(error));

// 당첨번호 array 리턴
getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    var noList = [];
    $('div.win_result')
      .find('span.ball_645')
      .each((i, el) => {
        noList.push(
          $(el)
            .text()
            .replace(/,/g, '')
            .match(/\d+/)[0]
        );
      });
    return noList;
  })
  .then(res => console.log(res))
  .catch(error => console.log(error));

// 각 등수 당첨 인원
getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    var noList = [];
    const data = $('table.tbl_data')
      .find('tbody tr')
      .find('td strong.color_key1')
      .parent()
      .next()
      .each((i, el) => {
        noList.push(
          $(el)
            .text()
            .replace(/,/g, '')
            .match(/\d+/)[0]
        );
      });
    return noList;
  })
  .then(res => console.log(res))
  .catch(error => console.log(error));

// 각 등수별 1인당 당첨금
getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    var noList = [];
    const data = $('table.tbl_data')
      .find('tbody tr')
      .find('td strong.color_key1')
      .parent()
      .next()
      .next()
      .each((i, el) => {
        noList.push(
          $(el)
            .text()
            .replace(/,/g, '')
            .match(/\d+/)[0]
        );
      });
    return noList;
  })
  .then(res => console.log(res))
  .catch(error => console.log(error));
