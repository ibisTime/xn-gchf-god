import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newId/yezhu-addedit';
import { getQueryString, showWarnMsg, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
@DetailWrapper(
  state => state.newIdYezhuAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class YezhuAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      title: '项目名',
      field: 'projectName'
    }, {
      title: '登录名',
      field: 'loginName'
    }, {
      title: '真实姓名',
      field: 'realName'
    }, {
      title: '手机号',
      field: 'mobile',
      mobile: true
    }, {
      title: '备注',
      field: 'remark'
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      key: 'userId',
      view: this.view,
      detailCode: 631087,
      addCode: 631070
    });
  }
}

export default YezhuAddEdit;
