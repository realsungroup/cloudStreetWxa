// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { out_refund_no, transaction_id, out_trade_no, refund_fee, totalFee } = event;
  const res = await cloud.cloudPay.refund({
    "subMchId": "1355621402",
    "envId": "openshopwx-anj96",
    "functionName": "refundNotice",
    "refund_fee": refund_fee,
    "totalFee": totalFee,
    "out_refund_no": out_refund_no,
    "out_trade_no": out_trade_no,
    "transaction_id": transaction_id
  });
  return res;
}