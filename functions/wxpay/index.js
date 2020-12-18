// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { goods_name, orderid } = event
  const res = await cloud.cloudPay.unifiedOrder({
    "body": goods_name,
    "outTradeNo": orderid,
    "spbillCreateIp": "127.0.0.1",
    "subMchId": "1355621402",
    "totalFee": 1,
    "envId": "openshopwx-anj96",
    "functionName": "receiveWxpaymentNotice"
  })
  return res;
}