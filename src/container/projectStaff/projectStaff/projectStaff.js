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
} from '@redux/projectStaff/projectStaff';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.projectStaff,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class ProjectStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      searchParams: null
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCodeList': data.projectCodeList });
    });
  }
  render() {
    const featStatusData = [{
      dkey: '0',
      dvalue: '无效'
    }, {
      dkey: '1',
      dvalue: '有效'
    }];
    const pict1StatusData = [{
      dkey: '0',
      dvalue: '未拍摄'
    }, {
      dkey: '1',
      dvalue: '已拍摄'
    }];
    const fields = [{
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '身份证号码',
      formatter: (v, d) => {
        return d.staff.idNo;
      }
    }, {
      field: 'mobile',
      title: '手机号',
      formatter: (v, d) => {
        return d.staff.mobile;
      }
    }, {
      field: 'projectName',
      title: '所在工程'
    }, {
      field: 'departmentName',
      title: '部门'
    }, {
      field: 'position',
      title: '职位',
      type: 'select',
      key: 'position_type'
    }, {
      field: 'pict1Status',
      title: '图片信息',
      data: pict1StatusData,
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      field: 'featStatus',
      title: '特征值状态',
      data: featStatusData,
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '姓名/手机号',
      hidden: true,
      search: true
    }, {
      field: 'projectCode',
      placeholder: '所在工程',
      listCode: '631357',
      params: {
        projectCodeList: this.state.projectCodeList
      },
      keyName: 'code',
      valueName: 'name',
      type: 'select',
      hidden: true,
      search: true
    }, {
      field: 'pict1Status',
      placeholder: '图片信息',
      data: pict1StatusData,
      type: 'select',
      keyName: 'dkey',
      valueName: 'dvalue',
      hidden: true,
      search: true
    }, {
      field: 'featStatus',
      placeholder: '特征值状态',
      data: featStatusData,
      type: 'select',
      keyName: 'dkey',
      valueName: 'dvalue',
      hidden: true,
      search: true
    }];
    const btnEvent = {
      detail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/addedit?staffCode=${selectedRows[0].staffCode}&code=${selectedRowKeys[0]}&projectCode=${selectedRows[0].projectCode}`);
        }
      }
    };
    return this.state.projectCodeList ? this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        updater: '',
        projectCodeList: this.state.projectCodeList
      },
      pageCode: 631465
    }) : null;
  }
}

export default ProjectStaff;
