import config from './config';
import http, { getHeader, getMiniProgramInfoHeader } from './http';

const { path: { getWxUserInfo, login, retrieve200, isWxUnionIdExist, retrieve } } = config
const miniProgramLogin = ({
  data = {},
}) => {
  return http.post(login, data);
}
const getBusinessInfo = () => {
  return http.get(retrieve200, {
    resid: '660917394098',
    subresid: '660914792669',
    showall: false
  }, true);
}
const getBicycles = () => {
  return http.get(retrieve200, {
    resid: '660856859469',
    subresid: '660929208133,656958416948',
    showall: false
  }, true);
}
// 获取商家商品（服务）
const getBusinessGoods = () => {
  return http.get(retrieve200, { resid: '660856859469' }, true);
}
// 根据id获取商家商品（服务）
const getGoodsById = (id) => {
  return http.get(retrieve200, { resid: '660856859469', cmswhere: `putaway_ID = '${id}'` }, true);
}

const getWXUserInfo = ({ code, iv, AppId, AppSecret, encrypteddata }) => {
  return http.get(getWxUserInfo, { code, iv, AppId, AppSecret, encrypteddata });
}
const unionidIsExist = (unionid) => {
  return http.get(isWxUnionIdExist, { unionid })
}
const register = ({ phoneNumber, unionid, wxappid, openid, nickname, dept_id }) => {
  const registerData = {
    Handphone: phoneNumber, // 手机号
    userid: unionid,
    nickname, // 昵称
    validresid: 616852937051,
    unionid,
    openid,
    wxappid,
    newpass: openid.substring(0, 8),
    dept_id,//商家编号
    coderequired: false,
    validcode: ''
  };
  return http.get(config.path.register, registerData)
}
const userLogin = (unionid) => {
  return http.post(login, {
    loginMethod: "unionid",
    unionid,
  })
}
const sendOrderApi = (data) => {
  return http.addRecords(data)
}
const addOrderApi = (data) => {
  return http.addRecords({ resid: '660941167468', data: [data] })
}
const getOrdersApi = () => {
  return http.get(retrieve, { resid: '660941167468' })
}
const getOrderByIdApi = (orderid) => {
  return http.get(retrieve, { resid: '661975141273', cmswhere: `orderid = '${orderid}'` })
}
const modifyOrderApi = (data) => {
  return http.modifyRecords({ resid: '660941167468', data: [data] })
}
// 获取个人信息
const getPersonalinfo = () => {
  return http.get(retrieve, { resid: '661459554353' })
}
// 添加个人信息
const addPersonalinfo = () => {
  return http.addRecords({ resid: '661459554353', data: [{}] })
}
// 修改个人信息
const modifyPersonalinfo = (data) => {
  return http.modifyRecords({ resid: '661459554353', data: [data] })
}
const queryDeviceByTimeId = (id) => {
  return http.get(retrieve200,
    {
      resid: '661543607433',
      subresid: '661964358786,661964402374',
      cmswhere: `liveTimeid = '${id}'`
    })
}
const saveDevice = (data) => {
  return http.modifyRecords({
    resid: '661543607433',
    data: [{ ...data, C3_661604129163: 'Y' }],
    rp: { IsIsolateAutoSend: false }
  })
}
// 暂时离开（锁屏）
const lockDeviceApi = (data) => {
  return http.addRecords({ resid: '655381000293', data: [data] })
}
// 解锁设备（解屏）
const unlockDeviceApi = (data) => {
  return http.addRecords({ resid: '655381000294', data: [data] })
}
const startWebSocketService = (certfile, certpass) => {
  return http.get(config.path.startWebSocketService, {
    port: 443,
    enableSsl: true,
    certfile,
    certpass
  })
}

export {
  miniProgramLogin,
  getBusinessInfo,
  getBusinessGoods,
  getWXUserInfo,
  unionidIsExist,
  register,
  userLogin,
  getBicycles,
  sendOrderApi,
  getPersonalinfo,
  modifyPersonalinfo,
  addOrderApi,
  getOrdersApi,
  queryDeviceByTimeId,
  saveDevice,
  modifyOrderApi,
  getOrderByIdApi,
  getGoodsById,
  addPersonalinfo,
  lockDeviceApi,
  unlockDeviceApi,
  startWebSocketService
}