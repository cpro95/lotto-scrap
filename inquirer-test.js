const inquirer = require("inquirer");
const axios = require("axios");
const cheerio = require("cheerio");

const lotto_db = require("./lotto_db.json");

var lastRound = lotto_db[0].round;
// console.log(lastRound);

let lotto_url = "https://dhlottery.co.kr/gameResult.do?method=byWin&drwNo=";

const getHtml = async () => {
  try {
    return await axios.get(lotto_url);
  } catch (err) {
    console.error(error);
  }
};

const questions = [
  {
    type: "input",
    name: "inputedRound",
    message: `저장되어있는 마지막 회차는 ${lastRound}입니다. 몇회차 조회를 원하시나요?`
  }
];

inquirer.prompt(questions).then(answers => {
  console.log(answers);
  if (Number(answers.inputedRound) <= lastRound)
    console.log("저장되어 있는 마지막 회차 이후로 입력 바랍니다.");
  else {
    console.log(answers.inputedRound);
    lotto_url = lotto_url + answers.inputedRound;
    console.log(lotto_url);

    getHtml()
      .then(html => {
        // console.log(html);
        const $ = cheerio.load(html.data);
        var round = $("div.win_result")
          .find("h4,strong")
          .text()
          .match(/\d+/);
        if (round === null) {
          console.log("검색결과: 요청하신 회차의 결과 정보는 없습니다.");
        } else {
          console.log(round);
        }
      })
      .catch(error => console.log(error));
  }
});
