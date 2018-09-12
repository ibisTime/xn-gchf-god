import React from 'react';
import fetch from 'common/js/fetch';
import { Form, Input, Select, Button } from 'antd';
import { getQueryString, showSucMsg, dateTimeFormat } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode, getZhiHang } from 'api/project';
import { getUserId, getUserDetail } from 'api/user';
import { ruzhiFormItemLayout } from 'common/js/config';
import './account-addedit.css';
import './../../../common/css/blueTitle.css';

const rule0 = {
  required: true,
  message: '必填字段'
};
const FormItem = Form.Item;
class AccountAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      projectCode: '',
      projectName: '',
      zhihang: [],
      updateDatetime: '',
      code: '',
      disabled: true,
      accountName: '',
      bankcardNumber: '',
      bankSubbranch: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    fetch(631365, { projectCode: this.code, start: 1, limit: 10 }).then((res) => {
      this.props.form.setFieldsValue({
        accountName: res.list[0].accountName,
        bankcardNumber: res.list[0].bankcardNumber,
        bankSubbranch: res.list[0].bankSubbranch
      });
      this.setState({
        accountName: res.list[0].accountName,
        bankcardNumber: res.list[0].bankcardNumber,
        bankSubbranch: res.list[0].bankSubbranch,
        updateDatetime: res.list[0].updateDatetime,
        code: res.list[0].code,
        projectName: res.list[0].projectName
      });
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { projectName, disabled, accountName, bankcardNumber, bankSubbranch, zhihang } = this.state;
    return (
        <div>
          <div className="blue-title"><i></i><span>专户信息</span></div>
          <div>
            <div>
              <div>
                <div className="account-content">
                  <div className="title">{projectName}账户信息</div>
                  <div className="updateDateTime">更新时间:{dateTimeFormat(this.state.updateDatetime)}</div>
                  <Form>
                    <FormItem label="工资专户户名" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('accountName', {
                        rules: [rule0]
                      })(
                          disabled
                              ? <span>{accountName}</span>
                              : <Input style={{ width: '280px' }} placeholder="请输入工资专户户名"/>
                      )}
                    </FormItem>
                    <FormItem label="工资专户账户" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('bankcardNumber', {
                        rules: [rule0]
                      })(
                          disabled
                              ? <span>{bankcardNumber}</span>
                              : <Input style={{ width: '280px' }} placeholder="请输入工资专户账户"/>
                      )}
                    </FormItem>
                    <FormItem label="工资专户开户行" {...ruzhiFormItemLayout}>
                      {getFieldDecorator('bankSubbranch', {
                        rules: [rule0]
                      })(
                          disabled
                              ? <span>{bankSubbranch}</span>
                              : <Select style={{ width: '280px' }} placeholder="请选择工资专户开户行">
                                {zhihang.map((item) => <Option key={item.code} value={item.code}>{item.bankSubbranchName}</Option>)}
                              </Select>
                      )}
                    </FormItem>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
    // const fields = [{
    //   field: 'code',
    //   value: this.code,
    //   hidden: true
    // }, {
    //   field: 'projectName',
    //   title: '工程名称',
    //   readonly: true
    // }, {
    //   field: 'bankSubbranch',
    //   title: '开户行'
    // }, {
    //   field: 'accountName',
    //   title: '户名',
    //   required: true
    // }, {
    //   field: 'bankcardNumber',
    //   title: '银行卡号',
    //   required: true
    // }, {
    //   field: 'status',
    //   title: '状态',
    //   key: 'account_status',
    //   type: 'select',
    //   search: true,
    //   readonly: true
    // }];
    // const fieldso = [{
    //   field: 'code',
    //   value: this.code,
    //   hidden: true
    // }, {
    //   field: 'projectName',
    //   title: '工程名称',
    //   readonly: true
    // }, {
    //   field: 'accountName',
    //   title: '户名',
    //   required: true
    // }, {
    //   field: 'bankCode',
    //   title: '银行代号',
    //   required: true
    // }, {
    //   field: 'bankName',
    //   title: '银行名',
    //   required: true
    // }, {
    //   field: 'bankcardNumber',
    //   title: '银行账户',
    //   required: true
    // }, {
    //   field: 'subbranch',
    //   title: '开户行',
    //   required: true
    // }, {
    //   field: 'status',
    //   title: '状态',
    //   key: 'account_status',
    //   type: 'select',
    //   search: true,
    //   readonly: true
    // }];
    // return this.props.buildDetail({
    //   fields: this.view ? fields : fieldso,
    //   code: this.code,
    //   view: this.view,
    //   detailCode: 631367,
    //   editCode: 631362
    // });
  }
}

export default Form.create()(AccountAddEdit);
