import React from 'react';
import cookies from 'browser-cookies';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/yewuManage/account';
import { listWrapper } from 'common/js/build-list';
import { getUserDetail } from 'api/user';
import { getUserKind, getUserId } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.yewuManageAccount,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCodeList': data.projectCodeList });
    });
  }
  render() {
    const fields = [{
      field: 'projectCode',
      title: '工程编号',
      hidden: true
    }, {
      field: 'projectCode',
      title: '工程名称',
      type: 'select',
      search: true,
      listCode: '631357',
      params: {
        updater: '',
        projectCodeList: this.state.projectCodeList
      },
      keyName: 'code',
      valueName: 'name'
    }, {
      field: 'bankNames',
      title: '开户行',
      formatter: (v, d) => {
        return d.bankName + d.subbranch;
      }
    }, {
      field: 'bankCode',
      title: '银行类别',
      hidden: true
    }, {
      field: 'bankcardNumber',
      title: '银行账户'
    }, {
      field: 'status',
      title: '状态',
      key: 'account_status',
      type: 'select'
    }, {
      field: 'createDatetime',
      title: '创建时间',
      type: 'datetime'
    }, {
      field: 'keyword',
      title: '关键字',
      placeholder: '户名/银行',
      search: true,
      hidden: true
    }];
    return this.state.projectCodeList ? this.props.buildList({
      fields,
      rowKey: 'projectCode',
      pageCode: 631365,
      searchParams: {
        projectCodeList: this.state.projectCodeList
      }
    }) : null;
  }
}

export default Account;
