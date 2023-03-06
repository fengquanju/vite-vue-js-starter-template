import { useConfigStoreHook } from '@/store/modules/config';
const configHook = useConfigStoreHook();
// 用户登录相关接口
export const CoreUrl = {
  getAccessToken: 'core/oauth/getAccessToken', //--------【 * ok】
  refreshAccessToken: 'core/oauth/refreshAccessToken', //--------【ok】
  getImageUri: 'getImageUri',
  getUploadImageToken: 'getUploadImageToken',
  getVoiceUri: 'getVoiceUri', //音频地址
  getUploadVoiceToken: 'getUploadVoiceToken', //音频token
  verifyVoiceTranscoding: 'verifyVoiceTranscoding', //音频转码
  LoginApi: 'core/admin/login', //登录接口
  getVideoUri: 'getVideoUri', //视频接口
  verifyVideoTranscoding: 'verifyVideoTranscoding', //视频转码
  getUploadVideoToken: 'getUploadVideoToken', //视频上传七牛
  uploadLocal: 'local_upload', //图片上传到本地服务器
};

export function useCoreUrlHook(key) {
  let config = configHook.getConfig();
  console.log('config', config);
  return config.pmCore + CoreUrl[key];
}

export const baseUrl = {};
