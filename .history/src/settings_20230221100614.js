module.exports = {
  title: "Admin",

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: "production",

  // 又拍云配置参数
  upyun: {
    operator: "admin", // 操作员
    secret: "CI1B5KVLT6q3NNCcY33JV", // 操作员密码
    bucket: "erp", // 服务名称
    key: "{filemd5}{random}{.suffix}", // 文件保存路径
    upyunUrl: "/upload/doc", // 服务上传地址API， 因为是跨域，所以使用反向代理，nginx反向代理路径为"/upload/doc" => 'http://v0.api.upyun.com/' + bucket
    getyunUrl: "http://doc.test.upcdn.net/", // 取文件地址目录
  },
};
