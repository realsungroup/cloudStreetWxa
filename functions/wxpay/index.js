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
    "subMchId": "1598432261",
    "totalFee": totalFee,
    "envId": "openshopwx-5gxvh2aj75d30bf6",
    "functionName": "receiveWxpaymentNotice"
  })
  return res;
}