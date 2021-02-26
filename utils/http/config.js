const config = {
  path: {
    baseURL: 'https://openshopwx.realsun.me/',
    login: 'api/account/login',
    retrieve200: 'api/200/table/Retrieve',
    retrieve: 'api/100/table/Retrieve',
    getWxUserInfo: 'api/wx/loginServive',
    isWxUnionIdExist: 'api/Account/IsWxUnionIdExist',
    register: 'api/Account/Register',
    saveData: "api/100/table/Save",
    startWebSocketService: 'api/LafitSocket/StartWebSocketService',
    save200Data: "api/200/table/Save",
    getPublicData: "api/100/table/Public/Retrieve",
  }
}

export default config