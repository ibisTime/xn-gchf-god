import React from 'react';
import { Modal } from 'antd';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/daifa/daifa';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, moneyFormat } from 'common/js/util';
import ModalDetail from 'common/js/build-modal-detail';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.daifaDaifa,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Daifa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      code: '',
      projectCodeList: ''
    };
    getUserDetail(getUserId()).then((data) => {
      this.setState({ projectCodeList: data.projectCodeList });
    });
  }
  render() {
    const fields = [{
      field: 'code',
      title: '编号',
      hidden: true
    }, {
      field: 'projectCode',
      title: '项目编号',
      hidden: true
    }, {
      field: 'projectName',
      title: '工程名称'
    }, {
      field: 'month',
      title: '月份'
    }, {
      field: 'number',
      title: '工资条人数（人）'
    }, {
      field: 'totalAmounts',
      title: '共计金额（元)',
      formatter: (v, d) => {
        return moneyFormat(d.totalAmount);
      }
    }, {
      field: 'status',
      title: '状态',
      type: 'select',
      key: 'message_status'
    }, {
      field: 'createDatetime',
      title: '生成时间',
      type: 'datetime'
    }];
    return this.state.projectCodeList ? (
        <div>
          {this.props.buildList({
            fields: fields,
            searchParams: {
              updater: '',
              status: 0,
              projectCodeList: this.state.projectCodeList
            },
            pageCode: 631435,
            rowKey: 'code'
          })}
        </div>
    ) : null;
  }
}

export default Daifa;
