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
} from '@redux/staff/allStaff';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffAllStaff,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      searchParams: null,
      province: null,
      city: null,
      area: null
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({
        projectCodeList: data.projectCodeList,
        province: data.province,
        city: data.city,
        area: data.area
      });
    });
  }
  render() {
    const fields = [{
      field: 'name',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '证件号'
    }, {
      field: 'mobile',
      title: '手机号'
    }, {
      field: 'birthdays',
      title: '生日',
      type: 'datetime',
      formatter: (v, d) => {
        return formatDate(d.birthday);
      }
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '名字/证件号',
      hidden: true,
      search: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    const btnEvent = {
      // 工作履历
      history: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/history?staffCode=${selectedRowKeys[0]}`);
        }
      },
      // 请假明细
      leaveRecords: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/leaveRecords?staffCode=${selectedRowKeys[0]}`);
        }
      }
    };
    return this.state.province && this.state.city && this.state.area ? this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        updater: '',
        province: this.state.province,
        city: this.state.city,
        area: this.state.area
      },
      pageCode: 631415
    }) : null;
  }
}

export default AllStaff;
