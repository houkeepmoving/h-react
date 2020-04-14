/**
 * @file 违章 & 主软 & M 登录
 * 获取userid
 */
import * as Tool from 'tool';
export const getUserId = (params) => {
  let isAutoApp = Tool.webApp.checkMainApp();
  let userId = '';
  if (isAutoApp) {
    userId = Tool.getCookie('app_userid');
  }
  return {
    userId: userId || 0
  };
};
