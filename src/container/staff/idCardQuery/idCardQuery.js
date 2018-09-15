import React from 'react';
import { Button, Input, Divider, List, Avatar, Table, Spin } from 'antd';
import { getQueryString, showSucMsg, showWarnMsg, formatDate, getUserKind, getUserId, formatImg, moneyFormat } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserDetail, query, query1 } from 'api/user';
import { getDict } from 'api/dict';

class AllStaffAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: [],
      data: '',
      salaryStatus: [],
      staffStatus: [],
      positionType: [],
      fetching: false
    };
  }
  componentDidMount() {
    this.setState({ fetching: true });
    Promise.all([
      getUserDetail(getUserId()),
      getDict('salary_status'),
      getDict('staff_status'),
      getDict('position_type')
    ]).then(([res1, res2, res3, res4]) => {
      console.log(res1);
      res2.map((item) => {
        this.state.salaryStatus[item.dkey] = item.dvalue;
      });
      res3.map((item) => {
        this.state.staffStatus[item.dkey] = item.dvalue;
      });
      res4.map((item) => {
        this.state.positionType[item.dkey] = item.dvalue;
      });
      this.setState({
        projectCodeList: res1.projectCodeList,
        companyCode: res1.companyCode,
        fetching: false
      });
    }).catch(() => { this.setState({ fetching: false }); });
  }
  clickQuery = () => {
    // debugger;
    console.log(this.state.projectCodeList);
    if (this.state.projectCodeList) {
      let idCard = document.getElementById('idCard').value;
      if (!idCard) {
        showWarnMsg('请输入身份证号码！');
        return;
      }
      this.setState({ fetching: true });
      query(idCard, this.state.projectCodeList).then(data => {
        this.setState({
          data: data,
          fetching: false
        });
      }).catch(() => { this.setState({ fetching: false }); });
    }
  };
  render() {
    if (this.state.data) {
      var dataD = [
        '姓名: ' + this.state.data[0].name,
        '性别: ' + this.state.data[0].sex,
        '民族: ' + this.state.data[0].idNation,
        '籍贯: ' + this.state.data[0].idAddress,
        '生日: ' + formatDate(this.state.data[0].birthday),
        '签发机关: ' + this.state.data[0].idPolice,
        '联系方式: ' + this.state.data[0].contactsMobile,
        '证件有效时间: ' + formatDate(this.state.data[0].idStartDate) + '——' + formatDate(this.state.data[0].idEndDate)
      ];
      var dataP = [
        formatImg(this.state.data[0].pict1),
        formatImg(this.state.data[0].pict2),
        formatImg(this.state.data[0].pict3),
        formatImg(this.state.data[0].pict4)
      ];
      var columns = [{
        title: '员工姓名',
        dataIndex: 'staffName'
      }, {
        title: '所属月份',
        dataIndex: 'month'
      }, {
        title: '应发工资',
        dataIndex: 'shouldAmount'
      }, {
        title: '迟到小时',
        dataIndex: 'delayHours'
      }, {
        title: '早退小时',
        dataIndex: 'earlyHours'
      }, {
        title: '请假天数',
        dataIndex: 'leavingDays'
      }, {
        title: '扣款金额',
        dataIndex: 'cutAmount'
      }, {
        title: '扣款说明',
        dataIndex: 'cutNote'
      }, {
        title: '实际工资',
        dataIndex: 'factAmount'
      }, {
        title: '发放金额',
        dataIndex: 'payAmount'
      }, {
        title: '最后一次发放时间',
        dataIndex: 'latePayDatetime'
      }, {
        title: '状态',
        dataIndex: 'status'
      }, {
        title: '备注',
        dataIndex: 'remark'
      }];
      var dataTab = [];
      for (let l = 0; l < this.state.data[0].salaryList.length; l++) {
        dataTab[l] = {
          key: l,
          staffName: this.state.data[0].salaryList[l].staffName,
          month: this.state.data[0].salaryList[l].month,
          shouldAmount: moneyFormat(this.state.data[0].salaryList[l].shouldAmount),
          delayHours: this.state.data[0].salaryList[l].delayHours,
          earlyHours: this.state.data[0].salaryList[l].earlyHours,
          leavingDays: this.state.data[0].salaryList[l].leavingDays,
          tax: moneyFormat(this.state.data[0].salaryList[l].tax),
          cutAmount: moneyFormat(this.state.data[0].salaryList[l].cutAmount),
          cutNote: this.state.data[0].salaryList[l].cutNote || '无',
          factAmount: moneyFormat(this.state.data[0].salaryList[l].factAmount),
          payAmount: moneyFormat(this.state.data[0].salaryList[l].payAmount),
          latePayDatetime: formatDate(this.state.data[0].salaryList[l].latePayDatetime),
          status: this.state.salaryStatus[this.state.data[0].salaryList[l].status],
          remark: this.state.data[0].salaryList[l].remark
        };
      }
      var columnsDown = [{
        title: '项目名称',
        dataIndex: 'projectName'
      }, {
        title: '员工姓名',
        dataIndex: 'staffName'
      }, {
        title: '入职时间',
        dataIndex: 'joinDatetime'
      }, {
        title: '离职时间',
        dataIndex: 'leavingDatetime'
      }, {
        title: '职位',
        dataIndex: 'position'
      }, {
        title: '累积请假天数',
        dataIndex: 'totalLeavingDays'
      }, {
        title: '迟到/早退每小时扣款金额',
        dataIndex: 'cutAmount'
      }, {
        title: '状态',
        dataIndex: 'status'
      }, {
        title: '更新时间',
        dataIndex: 'updateDatetime'
      }];
      var dataDownTab = [];
      var employList = this.state.data[0].employList;
      for (let l = 0; l < employList.length; l++) {
        dataDownTab[l] = {
          key: l,
          projectName: (employList[l] && employList[l].projectName) || '',
          staffName: this.state.data[0].name,
          joinDatetime: (employList[l] && formatDate(employList[l].joinDatetime)) || '',
          leavingDatetime: (employList[l] && formatDate(employList[l].leavingDatetime)) || '',
          position: (employList[l] && this.state.positionType[employList[l].position]) || '',
          totalLeavingDays: employList[l] && employList[l].totalLeavingDays,
          cutAmount: (employList[l] && moneyFormat(employList[l].cutAmount)) || '',
          status: (employList[l] && this.state.staffStatus[employList[l].status]) || '',
          updateDatetime: (employList[l] && formatDate(employList[l].updateDatetime)) || ''
        };
      };
    }
    return (
      <Spin spinning={this.state.fetching}>
        <div>
          <div>
            <Input id='idCard' placeholder="身份证号码" style={{ width: 300, marginRight: 20 }} />
            <Button onClick={this.clickQuery} type="primary" ghost style={{ marginRight: 10 }}>查询</Button>
          </div>
          <Divider orientation="left">人员信息</Divider>
          <div style={{ marginBottom: 50 }}>
            <List
              bordered
              style={{ width: 400 }}
              dataSource={dataD}
              renderItem={item => (<List.Item>{item}</List.Item>)}
            />
            <List
              bordered
              style={{ width: 400, marginDown: 20 }}
              dataSource={dataP}
              renderItem={item => (<Avatar src={item} style={{ width: 100, height: 100, margin: 20, borderColor: 'block' }} />)}
            />
          </div>
          <Divider orientation="left">工资条信息</Divider>
          <div style={{ marginBottom: 50 }}>
            <Table columns={columns} dataSource={dataTab} bordered />
          </div>
          <Divider orientation="left">目前所在项目信息</Divider>
          <div>
            <Table columns={columnsDown} dataSource={dataDownTab} bordered />
          </div>
        </div>
      </Spin>
    );
  }
}

export default AllStaffAddEdit;
