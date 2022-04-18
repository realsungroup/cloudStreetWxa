// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const got = require('got'); //引用 got


// 云函数入口函数
exports.main = async (event, context) => {

  let postResponse = await got('http://kingofdinner.realsun.me:7201/api/account/login', {
    method: 'POST', //post请求
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ //把json数据（对象）解析成字符串
      Appid:"wxbfc5d7fa9ae0bb2d",
      AppSecret:"Z0+wGnwlSrWSb7LdE24xq4vI+lv4i9FHvhzp35IQoMPK5zYHNCHG6w==",
      loginmethod:"appid"
    })
  })
  return postResponse.body //返回数据
}