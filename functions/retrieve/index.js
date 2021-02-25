// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got'); //引用 got

cloud.init()
const baseURL = "https://kingofmall.realsun.me:9092/";

const tokenMap = {

};
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event, context);
  const { unionid, data } = event;
  let accessToken = "";
  if (tokenMap[unionid]) {
    accessToken = tokenMap[unionid];
  } else {
    let postResponse = await got(`${baseURL}/api/account/login`, {
      method: 'POST', //post请求
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        'Accept': "application/json",
      },
      body: JSON.stringify({ //把json数据（对象）解析成字符串
        loginMethod: "unionid",
        unionid,
      })
    })
    accessToken = JSON.parse(postResponse.body).AccessToken;
    tokenMap[unionid] = accessToken;
  }
  const res = await got(baseURL + '/api/100/table/Retrieve', {
    method: 'GET',
    headers: {
      'Accept': "application/json",
      "Content-Type": "application/json;charset=utf-8",
      'accessToken': accessToken,
    },
    searchParams: new URLSearchParams(data)
  });
  return JSON.parse(res.body);
}