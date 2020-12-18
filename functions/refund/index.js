// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { out_refund_no, transaction_id, out_trade_no } = event;
  console.log(out_refund_no, transaction_id, out_trade_no);
  const res = await cloud.cloudPay.refund({
    "subMchId": "1355621402",
    "envId": "openshopwx-anj96",
    "functionName": "refundNotice",
    "refund_fee": 1,
    "totalFee": 1,
    "out_refund_no": out_refund_no,
    "out_trade_no": out_trade_no,
    "transaction_id": transaction_id
  });
  return res;
}