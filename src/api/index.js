import useConfig from '../config/useConfig';
const { getConfig } = useConfig();
const Config = getConfig();
// 用户登录相关接口
export const ApiUrl = {
  getAccessToken: Config.pmCore + 'core/oauth/getAccessToken', //--------【 * ok】
  refreshAccessToken: Config.pmCore + 'core/oauth/refreshAccessToken', //--------【ok】
  getImageUri: Config.pmStorage + 'getImageUri',
  getUploadImageToken: Config.pmStorage + 'getUploadImageToken',
  getVoiceUri: Config.pmStorage + 'getVoiceUri', //音频地址
  getUploadVoiceToken: Config.pmStorage + 'getUploadVoiceToken', //音频token
  verifyVoiceTranscoding: Config.pmStorage + 'verifyVoiceTranscoding', //音频转码
  LoginApi: Config.pmCore + 'core/admin/login', //登录接口
  getVideoUri: Config.pmStorage + 'getVideoUri', //视频接口
  verifyVideoTranscoding: Config.pmStorage + 'verifyVideoTranscoding', //视频转码
  getUploadVideoToken: Config.pmStorage + 'getUploadVideoToken', //视频上传七牛
  uploadLocal: Config.pmStorage + 'local_upload', //图片上传到本地服务器
};

export const baseUrl = {};
