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
} from '@redux/hetong/chengbaoshang';
import { listWrapper } from 'common/js/build-list';
import { getUserDetail } from 'api/user';
import { getQueryString, showSucMsg, getUserId, getUserKind } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.hetongChengbaoshang,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Chengbaoshang extends React.Component {
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
      field: 'companyName',
      title: '所属公司',
      hidden: true
    }, {
      field: 'projectCode',
      title: '工程名称',
      type: 'select',
      search: true,
      listCode: '631357',
      params: {
        updater: ''
      },
      keyName: 'code',
      valueName: 'name'
    }, {
      field: 'bname',
      title: '承包商名称'
    }, {
      field: 'bmobile',
      title: '承包商手机号'
    }, {
      field: 'contractDatetime',
      title: '签约时间',
      type: 'date'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      search: true,
      title: '关键字',
      placeholder: '承包商名字/手机号',
      hidden: true
    }];
    return this.state.projectCodeList ? this.props.buildList({
      fields,
      pageCode: 631375,
      rowKey: 'code',
      searchParams: {
        projectCodeList: this.state.projectCodeList
      }
    }) : null;
  }
}

export default Chengbaoshang;
