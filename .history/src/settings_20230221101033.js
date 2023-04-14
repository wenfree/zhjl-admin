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
    operator: "ouwen000", // 操作员
    secret: "d0ZkZeg8ptFjMzpdBkXgV4ccv4jdMzAi", // 操作员密码
    bucket: "wey-suv", // 服务名称
    key: "hongkong_id", // 文件保存路径
    upyunUrl: "/upload/hongkong_id", // 服务上传地址API， 因为是跨域，所以使用反向代理，nginx反向代理路径为"/upload/doc" => 'http://v0.api.upyun.com/' + bucket
    getyunUrl: "https://img.wenfree.cn/", // 取文件地址目录
  },
};
