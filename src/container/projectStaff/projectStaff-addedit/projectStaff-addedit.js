import React from 'react';
import fetch from 'common/js/fetch';
import cookies from 'browser-cookies';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/projectStaff/projectStaff-addedit';
import { getQueryString, showSucMsg, formatDate, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail } from 'api/user';
import {dateTimeFormat, moneyFormat} from '../../../common/js/util';
@DetailWrapper(
  state => state.projectStaffAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectStaffAddedit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'projectCodeList': data.projectCodeList });
      });
    }
  }
  render() {
    const fields = [{
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '证件号',
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
      field: 'contacts',
      title: '紧急联系人',
      formatter: (v, d) => {
        return d.staff.contacts;
      }
    }, {
      field: 'contactsMobile',
      title: '紧急联系人手机号',
      formatter: (v, d) => {
        return d.staff.contactsMobile;
      }
    }, {
      field: 'projectName',
      title: '所在工程'
    }, {
      field: 'departmentName',
      title: '所在部门'
    }, {
      field: 'position',
      title: '职位',
      type: 'select',
      key: 'position_type'
    }, {
      field: 'salary',
      title: '日薪',
      formatter: moneyFormat
    }, {
      field: 'cutAmount',
      title: '迟到早退每小时扣减金额',
      formatter: moneyFormat
    }, {
      field: 'status',
      title: '状态',
      key: 'staff_status',
      type: 'select'
    }, {
      field: 'joinDatetime',
      title: '入职时间',
      type: 'date'
    }, {
      field: 'leavingDatetime',
      title: '离职时间',
      type: 'date'
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields: fields,
      code: this.code,
      view: this.view,
      detailCode: 631467
    });
  }
}

export default ProjectStaffAddedit;
