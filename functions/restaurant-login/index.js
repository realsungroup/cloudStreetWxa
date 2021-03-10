// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got'); //引用 got

cloud.init()
const baseURL = "https://finisar.realsun.me:9092";

// 云函数入口函数
exports.main = async (event, context) => {
  const { account, password } = event;
  let postResponse = await got(`${baseURL}/api/account/login`, {
    method: 'POST', //post请求
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      'Accept': "application/json",
    },
    body: JSON.stringify({ //把json数据（对象）解析成字符串
      Password: password,
      code: account,
      enterprisecode: "9063",
      loginMethod: "default"
    })
  });
  return JSON.parse(postResponse.body);
}