const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const lotto_db = require('./lotto_db.json');
// console.log(lotto_db);

const lotto_db_file = './lotto_db.json';

const lotto_url =
  "https://dhlottery.co.kr/gameResult.do?method=byWin&drwNo=883";

const getHtml = async () => {
  try {
    return await axios.get(lotto_url);
  } catch (err) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);

    // var noList = [];
    var lotto_result = {};

    // 회차 (round)
    lotto_result.round = Number($("div.win_result")
      .find("h4,strong")
      .text()
      .match(/\d+/)[0]);


    // 날짜 (date)
    var dateData = $("div.win_result")
      .find("p.desc")
      .text();
      dateData = dateData.split(" ");
      dateData.pop();
    var dateArr = [];
    dateData.map((value, index) => {
      dateArr.push(value.match(/\d+/)[0]);
    });
    // noList.push(dateArr.join("."));
    lotto_result.date =dateArr.join('.');

    // 당첨번호 (no1, no2, no3, no4, no5, no6, bonus)
    var numberArr = [];
    $("div.win_result")
      .find("span.ball_645")
      .each((i, el) => {
        numberArr.push(
          $(el)
            .text()
            .replace(/,/g, "")
            .match(/\d+/)[0]
        );
      });

      lotto_result.no1 = Number(numberArr[0]);
      lotto_result.no2 = Number(numberArr[1]);
      lotto_result.no3 = Number(numberArr[2]);
      lotto_result.no4 = Number(numberArr[3]);
      lotto_result.no5 = Number(numberArr[4]);
      lotto_result.no6 = Number(numberArr[5]);
      lotto_result.bonus = Number(numberArr[6]);


    // 각 등수 당첨 인원
    var winnerArr = [];
    const winnerData = $("table.tbl_data")
      .find("tbody tr")
      .find("td strong.color_key1")
      .parent()
      .next()
      .each((i, el) => {
        winnerArr.push(
          $(el)
            .text()
            .replace(/,/g, "")
            .match(/\d+/)[0]
        );
      });

      lotto_result.winner1 = Number(winnerArr[0]);
      lotto_result.winner2 = Number(winnerArr[1]);
      lotto_result.winner3 = Number(winnerArr[2]);
      lotto_result.winner4 = Number(winnerArr[3]);
      lotto_result.winner5 = Number(winnerArr[4]);


      // 각 등수별 1인당 당첨금
      var amountArr = [];
      const amountData = $("table.tbl_data")
      .find("tbody tr")
      .find("td strong.color_key1")
      .parent()
      .next()
      .next()
      .each((i, el) => {
        amountArr.push(
          $(el)
            .text()
            .replace(/,/g, "")
            .match(/\d+/)[0]
        );
      });

      lotto_result.amount1 = Number(amountArr[0]);
      lotto_result.amount2 = Number(amountArr[1]);
      lotto_result.amount3 = Number(amountArr[2]);
      lotto_result.amount4 = Number(amountArr[3]);
      lotto_result.amount5 = Number(amountArr[4]);

      return lotto_result;
    // return noList;
  })
  .then(res => {
    console.log(res);
    lotto_db.unshift(res);
    fs.writeFileSync(lotto_db_file, JSON.stringify(lotto_db));
  })
  .catch(error => console.log(error));

// 당첨번호 array 리턴
// getHtml()
//   .then(html => {
//     const $ = cheerio.load(html.data);
//     var noList = [];
//     $("div.win_result")
//       .find("span.ball_645")
//       .each((i, el) => {
//         noList.push(
//           $(el)
//             .text()
//             .replace(/,/g, "")
//             .match(/\d+/)[0]
//         );
//       });
//     return noList;
//   })
//   .then(res => console.log(res))
//   .catch(error => console.log(error));

// 각 등수 당첨 인원
// getHtml()
//   .then(html => {
//     const $ = cheerio.load(html.data);
//     var noList = [];
//     const data = $("table.tbl_data")
//       .find("tbody tr")
//       .find("td strong.color_key1")
//       .parent()
//       .next()
//       .each((i, el) => {
//         noList.push(
//           $(el)
//             .text()
//             .replace(/,/g, "")
//             .match(/\d+/)[0]
//         );
//       });
//     return noList;
//   })
//   .then(res => console.log(res))
//   .catch(error => console.log(error));

// 각 등수별 1인당 당첨금
// getHtml()
//   .then(html => {
//     const $ = cheerio.load(html.data);
//     var noList = [];
//     const data = $("table.tbl_data")
//       .find("tbody tr")
//       .find("td strong.color_key1")
//       .parent()
//       .next()
//       .next()
//       .each((i, el) => {
//         noList.push(
//           $(el)
//             .text()
//             .replace(/,/g, "")
//             .match(/\d+/)[0]
//         );
//       });
//     return noList;
//   })
//   .then(res => console.log(res))
//   .catch(error => console.log(error));

  // let data = JSON.stringify(movies);
  // fs.writeFileSync('movies-data.json', data);
