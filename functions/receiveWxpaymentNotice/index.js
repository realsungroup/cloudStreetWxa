// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const got = require('got'); //引用 got

// 云函数入口函数
exports.main = async (event, context) => {
  const { resultCode, outTradeNo, cashFee, transactionId, userInfo } = event;
  console.log(event);
  if (resultCode === 'SUCCESS') {
    let postResponse = await got('https://openshopwx.realsun.me/api/account/login', {
      method: 'POST', //post请求
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        'Accept': "application/json",
      },
      body: JSON.stringify({ //把json数据（对象）解析成字符串
        Appid: "wxbb36d2901639c824",
        AppSecret: "/CKlDPoXtKfQs8gxI3rh0DBSmkIfII3qbCSKBUpch0o8M46oO5tbcg==",
        loginmethod: "appid"
      })
    })
    const accessToken = JSON.parse(postResponse.body).AccessToken
    const data = {
      resid: '513558998969',
      data: JSON.stringify([{
        C3_513559034344: cashFee / 100, //金额 event.cashFee / 100
        C3_513559033844: transactionId, //微信支付订单编号 event.transaction_id
        C3_571484462375: outTradeNo, //订单编号 event.outTradeNo
        C3_513884649390: userInfo.openId, //微信号 event.userInfo.openId
        _id: 0,
        _state: 'editoradd'
      }])
    }
    try {
      const res = await got('https://openshopwx.realsun.me/api/100/table/Save', {
        method: 'POST',
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json;charset=utf-8",
          'accessToken': accessToken,
        },
        body: JSON.stringify(data)
      });
      console.log(JSON.parse(res.body));
      return {
        errcode: 0, errmsg: ''
      }
    } catch (error) {
      return {}
    }
  } else {
    return {}
  }
}