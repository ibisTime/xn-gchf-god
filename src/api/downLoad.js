import { getUserName, getUserId } from 'common/js/util';
import fetch from 'common/js/fetch';

export function downLoad(messageCode, projectCodeList) {
  return fetch(631446, {
    messageCode,
    projectCodeList
  });
}

export function downLoadO(messageCode) {
  return fetch(631446, {
    messageCode
  });
}

// 详情页查询数据
export function detailDate(code) {
  return fetch(631437, {
    code
  });
}

export function downNum(code, backDownload, download) {
  return fetch(631431, {
    userId: getUserId(),
    code,
    backDownload,
    download
  });
}

// 列表查询 待处理 待反馈
export function handle(projectCodeList, status) {
  return fetch(631436, {
    projectCodeList,
    status
  });
}