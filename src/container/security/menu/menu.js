import React from 'react';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/security/menu';
import { listWrapper } from 'common/js/build-list';
import { getUserKind, getRoleCode } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.securityMenu,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class Menu extends React.Component {
  render() {
    const fields = [{
      title: '菜单名称',
      field: 'name',
      search: true
    }, {
      title: '菜单url',
      field: 'url'
    }, {
      title: '父菜单编号',
      field: 'parentCode',
      type: 'select',
      listCode: '631066',
      params: { type: '1', roleCode: getRoleCode(), systemCode: 'S' },
      keyName: 'code',
      valueName: '{{code.DATA}} {{name.DATA}}',
      search: true
    }, {
      title: '类型',
      field: 'type',
      type: 'select',
      data: [{
        dkey: '1',
        dvalue: '菜单'
      }, {
        dkey: '2',
        dvalue: '按钮'
      }],
      keyName: 'dkey',
      valueName: 'dvalue',
      search: true
    }, {
      title: '菜单顺序',
      field: 'orderNo'
    }];
    return this.props.buildList({
      fields,
      searchParams: {
        updater: '',
        systemCode: 'S'
      },
      pageCode: 631065,
      deleteCode: 631061
    });
  }
}

export default Menu;
