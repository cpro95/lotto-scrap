const axios = require("axios");
const fs = require("fs");

const myUrl =
  "https://raw.githubusercontent.com/cpro95/search-my-movie/master/src/movies-data.json";

let myArr = [];
const getjSON = async () => {
  try {
    return await axios.get(myUrl);
  } catch (err) {
    console.error(error);
  }
};

getjSON()
  .then(res => {
    console.dir(res);
    console.log(typeof res);
    fs.writeFileSync("result.json",JSON.stringify(res.data));

    // myArr.push(res);
    // console.log(myArr);
  })
  .catch(err => console.error(err));

// let obj = {};
// let ar = [{ id: 1 }];
// Object.assign(obj, ar);

// console.log(obj);