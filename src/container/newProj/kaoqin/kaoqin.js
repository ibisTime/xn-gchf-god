import React from 'react';
import fetch from 'common/js/fetch';
import { Modal } from 'antd';
import XLSX from 'xlsx';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/newProj/kaoqin';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getQueryString, dateTimeFormat, getUserId, getUserKind } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.newProjKaoqin,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Kaoqin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({
        projectCodeList: data.projectCodeList
      });
    });
    this.monthData = [];
    for(let i = 1; i <= 12; i++) {
      this.monthData.push({
        dkey: i,
        dvalue: i + '月'
      });
    }
    this.dayData = [];
    for(let i = 1; i <= 31; i++) {
      this.dayData.push({
        dkey: i,
        dvalue: i + '日'
      });
    }
  }
  render() {
    const fields = [{
      field: 'projectName',
      title: '工程名称'
    }, {
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'startDatetime',
      title: '上班时间',
      type: 'datetime'
    }, {
      field: 'endDatetime',
      title: '下班时间',
      type: 'datetime'
    }, {
      field: 'status',
      title: '出工状态',
      type: 'select',
      search: true,
      key: 'attendance_status'
    }, {
      field: 'settleDatetime',
      title: '结算时间',
      type: 'date'
    }, {
      field: 'createDatetime1',
      title: '考勤生成时间',
      type: 'datetime',
      formatter: (v, d) => {
        return dateTimeFormat(d.createDatetime);
      }
    }, {
      field: 'projectCode',
      title: '工程名称',
      type: 'select',
      listCode: '631357',
      params: {
        updater: '',
        projectCodeList: this.state.projectCodeList
      },
      keyName: 'code',
      valueName: 'name',
      search: true,
      hidden: true
    }, {
      field: 'createDatetime',
      title: '考勤生成日期',
      type: 'date',
      hidden: true
    }, {
      field: 'createMonth',
      title: '考勤生成月份',
      type: 'select',
      data: this.monthData,
      keyName: 'dkey',
      valueName: 'dvalue',
      search: true,
      hidden: true
    }, {
      field: 'createDay',
      title: '考勤生成日期',
      type: 'select',
      search: true,
      data: this.dayData,
      keyName: 'dkey',
      valueName: 'dvalue',
      hidden: true
    }];
    return this.state.projectCodeList ? (
        <div>
          {this.props.buildList({
            fields,
            searchParams: { projectCodeList: this.state.projectCodeList },
            pageCode: 631395,
            singleSelect: false,
            buttons: [{
              code: 'export',
              name: '导出',
              handler: () => {
                this.props.doFetching();
                fetch(631395, { projectCodeList: this.state.projectCodeList, limit: 10000, start: 1 }).then((data) => {
                  this.props.cancelFetching();
                  let tableData = [];
                  let title = [];
                  fields.map((item) => {
                    if (item.title !== '关键字' && item.title !== '考勤生成日期' && item.field !== 'projectCode' && item.title !== '考勤生成月份') {
                      title.push(item.title);
                    }
                  });
                  tableData.push(title);
                  data.list.map((item) => {
                    let temp = [];
                    this.props.searchData.status.map((v) => {
                      if (v.dkey === item.status) {
                        item.status = v.dvalue;
                      }
                    });
                    temp.push(item.projectName,
                        item.staffName,
                        item.startDatetime ? dateTimeFormat(item.startDatetime) : '',
                        item.endDatetime ? dateTimeFormat(item.endDatetime) : '',
                        item.status,
                        item.settleDatetime ? dateTimeFormat(item.settleDatetime) : '',
                        item.createDatetime ? dateTimeFormat(item.createDatetime) : '',
                        item.remark
                    );
                    tableData.push(temp);
                  });
                  const ws = XLSX.utils.aoa_to_sheet(tableData);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
                  XLSX.writeFile(wb, '考勤记录.xlsx');
                });
              }
            }]
          })}
        </div>
    ) : null;
  }
}

export default Kaoqin;
