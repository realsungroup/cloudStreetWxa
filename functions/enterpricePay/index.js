// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got'); //引用 got

cloud.init()
const baseURL = "https://kingofmall.realsun.me:9092/";
const mallbaseURL = "https://yunmall.realsun.me/";
const baseUrl8802 = "https://yunmall.realsun.me:8802/"; //付款基地址
const payEnterprise = "RealsunPay/PayByEnterprise";

// 云函数入口函数
exports.main = async (event, context) => {
  const { unionid, tradeNo, totalMoney } = event;
  let accessToken = "";
  let postResponse = await got(`${baseURL}api/account/login`, {
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
  const userInfo = JSON.parse(postResponse.body);
  if (userInfo.OpResult == 'Y') {
    const { UserCode, EnterpriseCode } = userInfo;
    accessToken = userInfo.AccessToken;
    const res1 = await got(baseUrl8802 + payEnterprise, {
      method: 'POST', //post请求
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        'Accept': "application/json",
        'accessToken': accessToken,
      },
      body: JSON.stringify({ //把json数据（对象）解析成字符串
        totalMoney,
        tradeNo,
        enterpriseCode: EnterpriseCode,
        user: UserCode,
      })
    });
    const response1 = JSON.parse(res1.body);
    if (response1.error == 0) {
      const res = await got(mallbaseURL + 'api/100/table/Retrieve', {
        method: 'GET',
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json;charset=utf-8",
          'accessToken': accessToken,
        },
        searchParams: `resid=573063828028&cmswhere=C3_573063854053='${tradeNo}'`
      });
      const response = JSON.parse(res.body);
      if (response.error == 0 || response.Error == 0) {
        return {
          error: 0,
          message: '支付成功'
        }
      } else {
        return {
          error: -1,
          message: response.message
        }
      }
    } else {
      return {
        error: -1,
        message: response1.message
      }
    }
  } else {
    return {
      error: -1,
      message: userInfo.message
    }
  }



}