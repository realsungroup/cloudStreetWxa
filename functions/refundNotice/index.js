// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const got = require('got'); //引用 got

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    returnCode,
    refundFee,
    refundId,
    refundRecvAccout,
    refundRequestSource,
    refundStatus,
    settlementRefundFee,
    settlementTotalFee,
    successTime,
    totalFee,
    transactionId,
    outRefundNo,
    outTradeNo,
    refundAccount,
  } = event;
  console.log(event)
  if (returnCode === 'SUCCESS') {
    let postResponse = await got('https://openshopwx.realsun.me/api/account/login', {
      method: 'POST', //post请求
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        'Accept': "application/json",
      },
      body: JSON.stringify({ //把json数据（对象）解析成字符串
        Appid: "wx70d3b74160c4e9af",
        AppSecret: "H60ZNuT/a/Kq7bnvSnYIoi3eedgIVyuuwxPcpuByx7HZ7AhppMFuzA==",
        loginmethod: "appid"
      })
    })
    const accessToken = JSON.parse(postResponse.body).AccessToken;
    const data = {
      resid: '645295286771',
      data: JSON.stringify([{
        total_fee: totalFee,
        refund_status: refundStatus,
        refund_fee: refundFee,
        out_refund_no: outRefundNo,
        out_trade_no: outTradeNo,
        transaction_id: transactionId,
        success_time: successTime,
        refund_account: refundAccount,
        refund_request_source: refundRequestSource,
        settlement_refund_fee: settlementRefundFee,
        settlement_total_fee: settlementTotalFee,
        refund_id: refundId,
        refund_recv_accout: refundRecvAccout,
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