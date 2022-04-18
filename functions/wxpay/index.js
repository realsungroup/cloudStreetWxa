// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { goods_name, orderid, totalFee } = event
  const res = await cloud.cloudPay.unifiedOrder({
    "body": goods_name,
    "outTradeNo": orderid,
    "spbillCreateIp": "127.0.0.1",
    "subMchId": "1510068581",
    "totalFee": totalFee,
    "envId": "cloud1-0giyut3vc851a989",
    "functionName": "receiveWxpaymentNotice"
  })
  return res;
}