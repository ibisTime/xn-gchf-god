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
} from '@redux/map/map';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserKind, getUserId } from 'common/js/util';
import ModalDetail from 'common/js/build-modal-detail';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.mapMap,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Map extends React.Component {
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
    const btnEvent = {
      // 查看考勤
      attendance: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/kaoqin?code=${selectedRowKeys[0]}`);
        }
      },
      // 详情
      proDetail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectManage/project/addedit?v=1&projectCode=${selectedRowKeys[0]}`);
        }
      },
      // 发薪可延迟天数
      salaryDelayDays: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].status === '2') {
            this.setState({
              showSalaryDelayDays: true
            });
            this.projectCode = selectedRowKeys[0];
          }else {
            showWarnMsg('该项目未处于在建状态，不能设置薪资发放可延迟天数');
          }
        }
      }
    };
    const fields = [{
      field: 'name',
      title: '工程名称'
    }, {
      field: 'projectCode',
      title: '工程名称',
      type: 'select',
      search: true,
      hidden: true,
      listCode: '631357',
      params: {
        updater: '',
        projectCodeList: this.state.projectCodeList
      },
      keyName: 'code',
      valueName: 'name'
    }, {
      field: 'startDatetime',
      title: '项目开始时间',
      type: 'datetime'
    }, {
      field: 'endDatetime',
      title: '项目结束时间',
      type: 'datetime'
    }, {
      field: 'chargeUser',
      title: '负责人'
    }, {
      field: 'chargeMobile',
      title: '负责人手机号'
    }, {
      title: '状态',
      field: 'status',
      key: 'project_status',
      type: 'select'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      title: '关键字',
      placeholder: '手机号',
      hidden: true,
      search: true
    }];
    const salaryDelayDaysOptions = {
      fields: [{
        field: 'salaryDelayDays',
        title: '薪资发放可延迟天数',
        required: true
      }],
      addCode: 631472,
      beforeSubmit: (param) => {
        param.projectCode = this.projectCode;
        return param;
      },
      onOk: () => {
        this.props.getPageData();
      }
    };
    return this.state.projectCodeList ? (
        <div>{ this.props.buildList({
          fields,
          btnEvent,
          searchParams: {
            projectCodeList: this.state.projectCodeList
          },
          pageCode: 631356
        }
    )}<ModalDetail
        title='薪资发放可延迟天数'
        visible={this.state.showSalaryDelayDays}
        hideModal={() => this.setState({ showSalaryDelayDays: false })}
        options={salaryDelayDaysOptions} />
    </div>) : null;
  }
}

export default Map;
