import React from 'react';
import fetch from 'common/js/fetch';
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
} from '@redux/newProj/project-kaoqin';
import ModalDetail from 'common/js/build-modal-detail';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getQueryString, dateTimeFormat, getUserId, getUserKind } from 'common/js/util';
import { getUserDetail } from 'api/user';
import { getProject } from 'api/project';
import { monthData, dayData } from 'common/js/config';

@listWrapper(
  state => ({
    ...state.newProjProjectKaoqin,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class ProjectKaoqin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: '',
      companyCode: '',
      showShangban: false,
      showXiaban: false,
      companyName: '',
      projectName: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({
        projectCodeList: data.projectCodeList,
        companyCode: data.companyCode,
        companyName: data.companyName
      });
    });
    getProject(this.code).then((res) => {
      this.setState({
        projectName: res.name
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
            searchParams: { projectCode: this.code },
            pageCode: 631395,
            singleSelect: false,
            buttons: [{
              code: 'export',
              name: '导出',
              handler: (selectedRowKeys, selectedRows) => {
                fetch(631395, { projectCode: this.code, limit: 10000, start: 1 }).then((data) => {
                  let tableData = [];
                  let title = [];
                  fields.map((item) => {
                    if (item.title !== '关键字' && item.title !== '开始时间' && item.title !== '结束时间' && item.title !== '考勤生成日期') {
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
                  XLSX.writeFile(wb, this.state.companyName + this.state.projectName + '考勤记录.xlsx');
                });
              }
            }, {
              code: 'goback',
              name: '返回',
              handler: (selectedRowKeys, selectedRows) => {
                this.props.history.go(-1);
              }
            }]
          })}
        </div>
    ) : null;
  }
}

export default ProjectKaoqin;
