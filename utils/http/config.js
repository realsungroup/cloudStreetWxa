const config = {
  path: {
    baseURL: 'https://openshopwx.realsun.me/',
    login: 'api/account/login',
    retrieve200: 'api/200/table/Retrieve',
    retrieve: 'api/100/table/Retrieve',
    getWxUserInfo: 'RSAuth/loginService',
    isWxUnionIdExist: 'api/Account/IsWxUnionIdExist',
    register: 'api/Account/Register',
    saveData: "api/100/table/Save",
    startWebSocketService: 'api/LafitSocket/StartWebSocketService'

  }
}

export default config