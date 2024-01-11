/**
 * @file 应用错误号、错误信息管理
 */

export enum ErrorCode {
  // 成功，无错误
  SUCCESS = 0,

  // 代码异常
  CODE_EXCEPTION = 1,

  // 权限类 1000-1999
  AUTH_NO_USER = 1000, // 用户不存在
  AUTH_PASSWORD_ERROR = 1001, // 密码错误

  // 参数校验 2000-2999
  PARAM_ERROR = 2000,

  // 服务类 3000-3999
  SERVICE_NOT_FOUND_ERROR = 3000,
  SERVICE_FORBIDDEN = 3001,
  SERVICE_CSRF_TOKEN_INVALID = 3002,
  SERVICE_REQUEST_BODY_TOO_LARGE = 3003,
  SERVICE_HPE_INVALID_METHOD = 3004,
  SERVICE_BAD_REQUEST = 3005,
  SERVICE_HPE_HEADER_OVERFLOW = 3006,
  SERVICE_ECONNRESET = 3007,
  SERVICE_EPIPE = 3008,
  SERVICE_RPC_PROXY_MODULE_ERROR = 3100,
  SERVICE_RPC_PROXY_METHOD_NOT_FOUND = 3101,
  APP_CHAT_ERROR = 3102,
  SEND_CHAT_MSG_ERROR = 3103,

  // 朋友类
  FRIEND_DELETE_FAILED = 4000,

  // 消息类
  MESSAGE_SEND_FAILED = 5000,

  // 朋友请求
  FRIEND_REQUEST_FAILED = 6000,
  FRIEND_REQUEST_RECEIVED_FAILED = 6001,
  FRIEND_REQUEST_REJECT_FAILED = 6002,

  // 群聊类
  GROUP_CREATE_FAILED = 7000,
  GROUP_SEND_MESSAGE_FAILED = 7001,
  GROUP_ADD_MEMBERS_FAILED = 7002,
  GROUP_UPDATE_NAME_FAILED = 7003,
  GROUP_DELETE_MEMBERS_FAILED = 7004,
  GROUP_QUIT_FAILED = 7005,
  GROUP_DISBAND_FAILED = 7006,

  // cos 服务
  COS_PUT_OBJECT_FAILED = 8000,

  // // *********************  app类 5000-5999
  // APP_DEFAULT_ERROR = 5000,
  // APP_NOT_EXIST = 5001,
  // APP_DELETE_FAILED = 5002,
  // APP_EXIST = 5003,
  // APP_NO_AUTH = 5004,
  // // *********************  user类 6000-6999
  // USER_NOT_EXIST = 6000,
  // // *********************  page类 7000-7999
  // AUTH_PAGE_NOT_AUTH = 7000,
  // PAGE_UPDATE_FAILED = 7001,
  // PAGE_CREATE_FAILED = 7002,
  // PAGE_NOT_EXIST = 7003,
  // PAGE_NUM_INVALID = 7004,
  // PAGE_RELEASE_DATA_INVALID = 7005,
  // PAGE_IS_PENDING = 7006,
  // PAGE_TITLE_INVALID = 7007,
  // // *********************  cate类 8000-8999
  // CATE_NOT_EXIST = 8000,
  // // *********************  template类 9000-9999
  // TEMPLATE_INVALID_CATEID = 9000,
  // TEMPLATE_INVALID_TEMPLATE_ID = 9001,
  // // *********************  frame类 10000-10999
  // FRAME_NAME_EXIST = 10000,
  // FRAME_NOT_EXIST = 10001,
  // // *********************  application类 11000-11999
  // APPLICATION_CREATE_FAILED = 11000,
  // APPLICATION_PASS_FAILED = 11001,
  // APPLICATION_REJECT_FAILED = 11002,
  // APPLICATION_DELETE_FAILED = 11003,
  // APPLICATION_NO_AUDIT_AUTH = 11004,
  // APPLICATION_LIST_FAILED = 11005,
  // // *********************  assets类 12000-12999
  // ASSETS_NO_TYPE = 12000,
  // ASSETS_FILE_TYPE_NOT_ALLOW = 12001,
  // ASSETS_UPLOAD_SERVER_ERROR = 12002,
  // COMPRESS_FORMAT_TYPE_NOT_SUPPORT = 12003,
  // ASSETS_COMPRESS_SERVER_ERROR = 12004,
  // // *********************  mkt接口类 13000-13999
  // MKT_CREATIVES_FETCH_FAILED = 13000,
}

// 错误信息表
export const errorMessage = {
  default: '发生错误了',
  [ErrorCode.SUCCESS]: '成功',

  // 通用错误
  [ErrorCode.CODE_EXCEPTION]: '未知错误',

  // *********************  权限类 1000-1999
  [ErrorCode.AUTH_NO_USER]: '用户不存在，请确认用户名是否输错',
  [ErrorCode.AUTH_PASSWORD_ERROR]: '密码错误，请重新输入',

  // *********************  参数校验 2000-2999
  [ErrorCode.PARAM_ERROR]: '参数错误',

  // *********************  服务类 3000-3999
  [ErrorCode.SERVICE_NOT_FOUND_ERROR]: '您访问的地址不存在',
  [ErrorCode.SERVICE_CSRF_TOKEN_INVALID]: 'csrf token不正确，访问被拒绝',
  [ErrorCode.SERVICE_FORBIDDEN]: '访问被拒绝',
  [ErrorCode.SERVICE_REQUEST_BODY_TOO_LARGE]: '请求的内容超过限制',
  [ErrorCode.SERVICE_HPE_INVALID_METHOD]: '不支持的方法',
  [ErrorCode.SERVICE_BAD_REQUEST]: '错误的请求内容',
  [ErrorCode.SERVICE_HPE_HEADER_OVERFLOW]: '请求超出限制',
  [ErrorCode.SERVICE_ECONNRESET]: '连接断开',
  [ErrorCode.SERVICE_EPIPE]: '连接未完成',
  [ErrorCode.SERVICE_RPC_PROXY_MODULE_ERROR]: '引入rpc模块发生错误',
  [ErrorCode.SERVICE_RPC_PROXY_METHOD_NOT_FOUND]: '没有找到rpc方法',
  [ErrorCode.APP_CHAT_ERROR]: '群聊创建失败',
  [ErrorCode.SEND_CHAT_MSG_ERROR]: '消息发送失败',

  // 消息类
  [ErrorCode.MESSAGE_SEND_FAILED]: '消息发送失败',

  // 朋友类
  [ErrorCode.FRIEND_DELETE_FAILED]: '删除好友失败',

  // 朋友请求类
  [ErrorCode.FRIEND_REQUEST_FAILED]: '发送好友请求失败',
  [ErrorCode.FRIEND_REQUEST_RECEIVED_FAILED]: '同意好友请求失败',
  [ErrorCode.FRIEND_REQUEST_REJECT_FAILED]: '拒绝好友请求失败',

  // 群聊类
  [ErrorCode.GROUP_CREATE_FAILED]: '新建群聊失败',
  [ErrorCode.GROUP_SEND_MESSAGE_FAILED]: '消息发送失败',
  [ErrorCode.GROUP_ADD_MEMBERS_FAILED]: '添加群成员失败',
  [ErrorCode.GROUP_UPDATE_NAME_FAILED]: '更新群名失败',
  [ErrorCode.GROUP_DELETE_MEMBERS_FAILED]: '移除群成员失败',
  [ErrorCode.GROUP_QUIT_FAILED]: '退出群聊失败',
  [ErrorCode.GROUP_DISBAND_FAILED]: '解散群聊失败',

  // cos 服务类
  [ErrorCode.COS_PUT_OBJECT_FAILED]: '图片上传失败',

  // // *********************  app异常 5000-5999
  // [ErrorCode.APP_DEFAULT_ERROR]: 'APP 请求错误',
  // [ErrorCode.APP_NOT_EXIST]: 'APP 不存在',
  // [ErrorCode.APP_DELETE_FAILED]: 'APP 删除失败',
  // [ErrorCode.APP_EXIST]: 'APP 已存在',
  // [ErrorCode.APP_NO_AUTH]: '无 APP 权限',

  // // *********************  user异常 6000-6999
  // [ErrorCode.USER_NOT_EXIST]: '用户不存在',

  // // *********************  page异常 7000-7999
  // [ErrorCode.AUTH_PAGE_NOT_AUTH]: '无页面操作权限',
  // [ErrorCode.PAGE_UPDATE_FAILED]: '页面更新失败',
  // [ErrorCode.PAGE_CREATE_FAILED]: '页面创建失败',
  // [ErrorCode.PAGE_NOT_EXIST]: '页面不存在',
  // [ErrorCode.PAGE_NUM_INVALID]: 'page_num 不合法',
  // [ErrorCode.PAGE_RELEASE_DATA_INVALID]: 'release_data 不合法',
  // [ErrorCode.PAGE_IS_PENDING]: '页面审核中, 不允许修改',
  // [ErrorCode.PAGE_TITLE_INVALID]: '页面标题不合法',

  // // *********************  cate类 8000-8999
  // [ErrorCode.CATE_NOT_EXIST]: 'cate 不存在',

  // // *********************  template异常 9000-9999
  // [ErrorCode.TEMPLATE_INVALID_CATEID]: 'cate_id 错误',
  // [ErrorCode.TEMPLATE_INVALID_TEMPLATE_ID]: 'template_id 错误',
  // // *********************  frame类 10000-10999
  // [ErrorCode.FRAME_NAME_EXIST]: 'frame_name 已存在',
  // [ErrorCode.FRAME_NOT_EXIST]: 'frame 不存在',
  // // *********************  application类 11000-11999
  // [ErrorCode.APPLICATION_CREATE_FAILED]: '申请创建失败',
  // [ErrorCode.APPLICATION_PASS_FAILED]: '通过审批失败',
  // [ErrorCode.APPLICATION_REJECT_FAILED]: '拒接审批失败',
  // [ErrorCode.APPLICATION_DELETE_FAILED]: '申请记录删除失败',
  // [ErrorCode.APPLICATION_NO_AUDIT_AUTH]: '无审批权限',
  // [ErrorCode.APPLICATION_LIST_FAILED]: '获取列表失败',
  // // *********************  assets类 12000-12999
  // [ErrorCode.ASSETS_NO_TYPE]: 'Type 不存在',
  // [ErrorCode.ASSETS_FILE_TYPE_NOT_ALLOW]: '文件类型不允许上传',
  // [ErrorCode.ASSETS_UPLOAD_SERVER_ERROR]: '上传服务器出错',
  // [ErrorCode.COMPRESS_FORMAT_TYPE_NOT_SUPPORT]: '压缩类型暂不支持',
  // [ErrorCode.ASSETS_COMPRESS_SERVER_ERROR]: '压缩服务器出错',
  // // *********************  mkt接口类 13000-13999
  // [ErrorCode.MKT_CREATIVES_FETCH_FAILED]: '创意获取失败',
};

export interface ErrorReturn {
  errorCode: number;
  errorMessage: string;
}
