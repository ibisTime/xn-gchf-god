import React from 'react';
import { Card, Button } from 'antd';
import {
  getUserId,
  getUserKind,
  dateTimeFormat
} from 'common/js/util';
import { getUserDetail } from 'api/user';
import { handle } from 'api/downLoad';
import { getDictList } from 'api/dict';

class PostRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      statusDict: {}
    };
    this.lookDetail = this.lookDetail.bind(this);
  };
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      handle(data.projectCodeList, 1).then(data => {
        this.setState({
          data: data
        });
      });
    });
    getDictList({ parentKey: 'message_status' }).then(data => {
      let dict = {};
      data.forEach(d => {
        dict[d.dkey] = d.dvalue;
      });
      this.setState({ statusDict: dict });
    });
  }
  lookDetail(code) {
    this.props.history.push(`/waitList/postRequest/addedit?code=${code}`);
  };
  render() {
    const { data, statusDict } = this.state;
    return (
       <div style={{ width: '100%' }}>
      { data.length
         ? data.map((v, i) =>
            <Card key={v.code} style={{ width: '100%', padding: '0px', borderColor: 'rgb(153,212,255)', boxShadow: '0px 0px 30px rgba(153,212,255,0.6) inset', marginBottom: '10px' }}>
                <div style={{ marginBottom: '18px' }}>
                  <span>发件人：</span>
                  <i style={{ fontStyle: 'normal' }}>{ v.sendCompanyProject }</i>
                  <i style={{ fontStyle: 'normal', marginLeft: 20 }}>{ dateTimeFormat(v.sendDatetime) }</i>
                </div>
                <div style={{ width: '100%', marginBottom: '20px' }}>
                  <i style={{ display: 'inline-block', whiteSpace: 'nowrap', fontStyle: 'normal' }}>{ v.title }</i>
                  <Button type="primary" style={{ float: 'right', borderRadius: '15px', width: '82px', height: '31px', padding: 0 }} onClick={ () => { this.lookDetail(v.code); } }>查看</Button>
                </div>
                <p style={{ display: 'inline-block', color: 'red' }}>{ statusDict[v.status] || '' }</p>
            </Card>)
          : <div style={{ width: '100%', height: '500px', textAlign: 'center' }} >
              <img src={require('./noInfo.png')} alt="" style={{ width: '261px', height: '168px', margin: '15% auto 34px' }} />
              <p style={{ fontSize: '14px', color: '#939599' }}>暂无信息</p>
            </div>
      }</div>
    );
  }
}

export default PostRequest;