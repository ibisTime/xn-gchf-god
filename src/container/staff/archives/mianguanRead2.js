import React from 'react';
import { Base64 } from 'js-base64';
import axios from 'axios';
import originJsonp from 'jsonp';
import './mianguanRead.css';
import Photo from './touxiang.png';
import Figure from './figure.png';
import { getQueryString, getUserId, showWarnMsg, showSucMsg } from 'common/js/util';
import { mianguanPicture, getFeatInfo, getStaffDetail } from 'api/user';

function jsonp(url, data, option) {
    return new Promise((resolve, reject) => {
        originJsonp(url + '?' + data, {
            name: 'getFaceFeature'
        }, (err, data) => {
        if(!err) {
            resolve(data);
        } else {
            reject(err);
        }
        });
    });
}

class mianguanRead2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        'text': '',
        'mediaStreamTrack': '',
        'feat': '',
        'vedio': false,
        'imgFlag': true,
        'shot': false,
        'pict1': '',
        'next': false,
        'reshot': false // reshot为true则是重拍过的
    };
    this.openVideo = this.openVideo.bind(this);
    this.cutImg = this.cutImg.bind(this);
    this.getFeat = this.getFeat.bind(this);
    this.handleShotClick = this.handleShotClick.bind(this);
    this.next = this.next.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.code = getQueryString('code', this.props.location.search);
    this.pict1 = getQueryString('pict1', this.props.location.search);
    this.idNo = getQueryString('idNo', this.props.location.search);
    this.ruzhi = getQueryString('ruzhi', this.props.location.search);
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
  // 获取媒体方法（旧方法）
      navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.video = document.getElementById('video');
      this.mediaStreamTrack = '';
      this.openVideo();
      getStaffDetail(this.idNo).then((res) => {
        if(res.pic2 || res.pict2) {
          this.setState({
            next: true
          });
        }
        if(res.pict1) {
          this.setState({
            pict1: res.pict1,
            feat: res.feat,
            vedio: false,
            shot: false
          });
        } else {
          this.setState({
            vedio: true,
            shot: true
          });
          // this.openVideo();
        }
      });
  };
  next() {
    this.props.history.push(`/staff/jiandang/idInfoRead`);
  };
  // 打开摄像头
  openVideo(argument) {
    // 使用新方法打开摄像头
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            this.mediaStreamTrack = typeof (stream.stop) === 'function' ? stream : stream.getTracks()[1];
            if (this.video.srcObject) {
                this.video.srcObject = stream;
            } else {
                this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video.play();
            }, 300);
        }).catch(function(err) {
            console.log(err);
        });
    } else if (navigator.getMedia) { // 使用旧方法打开摄像头
        navigator.getMedia({
            video: true
        }, (stream) => {
            this.mediaStreamTrack = stream.getTracks()[0];
            if (this.video.srcObject) {
                this.video.srcObject = stream;
            } else {
                this.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            setTimeout(() => {
                this.video.play();
            }, 300);
        }, function(err) {
            console.log(err);
        });
    }
  };
  // 截取图像
  cutImg() {
    this.setState({
        vedio: false,
        imgFlag: false,
        shot: false
    });
    // this.context = this.canvas.getContext('2d');
    // this.context.scale(0.5, 0.5);
    // this.context.drawImage(this.video, 340, 0, 600, 790, 0, 0, 1020, 1350);
    // this.context.drawImage(this.video, 130, 0, 600, 720, 0, 0, 1520, 1850);
    this.context = this.canvas.getContext('2d');
    this.canvas.width = 338 * 3;
    this.canvas.height = 408 * 3;
    let scaleH = this.video.videoHeight / 408;
    let scaleW = this.video.videoWidth / 338;
    if (scaleH > scaleW) {
      let sy = (this.video.videoHeight - 408 * scaleW) / 2;
      this.context.drawImage(this.video, 0, sy, this.video.videoWidth, 408 * scaleW, 0, 0, 338 * 3, 408 * 3);
    } else {
      let sx = (this.video.videoWidth - scaleH * 338) / 2;
      this.context.drawImage(this.video, sx, 0, scaleH * 338, this.video.videoHeight, 0, 0, 338 * 3, 408 * 3);
    }
  };
  getPixelRatio() {
    var backingStore = this.context.backingStorePixelRatio ||
    this.context.webkitBackingStorePixelRatio ||
    this.context.mozBackingStorePixelRatio ||
    this.context.msBackingStorePixelRatio ||
    this.context.oBackingStorePixelRatio ||
    this.context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  };
  getFeat() {
      let base64 = this.canvas.toDataURL('image/jpeg');
      // getFeatInfo(base64).then((res) => {
      //   var result = /getFaceFeature\({"data":"([^]+)"}\)/.exec(res);
      //   if (!result || result[1] === 'error' || result[1] === 'NOFACE') {
      //       showWarnMsg('请对准人脸');
      //       return;
      //   };
      //   this.setState({
      //       feat: result[1]
      //   });
      // });
      // jsonp('http://118.31.17.181/getfeature', Base64.encode(base64))
    // axios.post('https://feat.jm60s.com/getfeature', encodeURIComponent(base64), {
    //     withCredentials: true
    // }).then((rs) => {
    //         var result = /getFaceFeature\({"data":"([^]+)"}\)/.exec(rs.data);
    //         if (!result || result[1] === 'error' || result[1] === 'NOFACE') {
    //             showWarnMsg('请对准人脸');
    //             return;
    //         };
    //         this.setState({
    //             feat: result[1]
    //         });
    //     });
    axios.post('https://feat.aijmu.com/getfeature', base64, {
      withCredentials: false
    }).then((rs) => {
      // console.log(rs);
      // console.log(rs.data);
      var result = /getFaceFeature\({"data":"([^]+)"}\)/.exec(rs.data);
      if (!result || result[1] === 'error' || result[1] === 'NOFACE') {
        showWarnMsg('请对准人脸');
        this.setState({ feat: '' });
        return;
      };
      this.setState({
        feat: result[1]
      });
    });
  }
  handleShotClick() {
    this.setState({
      reshot: true
    });
    this.state.shot === true ? this.shot() : this.cancel();
  }
  shot() {
    this.cutImg();
    this.getFeat();
  }
  cancel() {
    this.setState({
        vedio: true,
        shot: true,
        feat: ''
    });
  };
  handleSubmit(e) {
    e.preventDefault();
    // this.props.history.push(`/staff/jiandang/idPicture2?ruzhi=${this.ruzhi}&idNo=${this.idNo}&code=${this.code}`);
    var info = {};
    // if (this.state.feat) {
        info.feat = this.state.feat;
    //     info.feat = 'NOFACE';
    console.log(this.state.reshot);
    if(this.state.reshot) {
      info.pic1 = this.canvas.toDataURL('image/jpeg');
    } else {
      info.pic1 = this.state.pict1;
    }
    this.upload(info);
    // } else if (!this.state.feat) {
    //     showWarnMsg('请重新拍摄');
    // };
};
  upload(info) {
      info.code = this.code;
      info.updater = getUserId();
      if(info.feat) {
        mianguanPicture(info).then(rs => {
          if (rs.isSuccess) {
            showSucMsg('提交成功');
            this.props.history.push(`/staff/jiandang/idPicture2?ruzhi=${this.ruzhi}&idNo=${this.idNo}&code=${this.code}`);
          } else {
            showWarnMsg(rs.errorInfo || '提交失败');
          }
        });
      } else {
        showWarnMsg('请拍摄免冠照');
      }
  };

  render() {
    return (
        <div>
          <div className="title"><i></i><span>人脸采集</span></div>
          <div className="video-box" style={{ display: this.state.vedio ? 'block' : 'none' }} onClick={ this.handleShotClick }>
            <div className="figure"><img src={Figure} alt=""/></div>
            <video id="video" className="video3"></video>
          </div>
          <div className="img-box" style={{ display: this.state.vedio ? 'none' : 'block' }} onClick={ this.handleShotClick }>
            <div style={{ display: this.state.pict1 ? 'none' : 'block' }}>
              <div className="border">
                <span></span><span></span><span></span><span></span>
                <img src={Photo} className="userImg3" id="userImg" style={{ display: this.state.imgFlag ? 'inline-block' : 'none' }}/>
              </div>
              <div className="tips">
                <span>点击拍摄</span>
                <span>请保持正脸在线框之内</span>
              </div>
            </div>
            <div style={{ display: this.state.pict1 ? 'block' : 'none' }}>
              <img src={this.state.pict1} className="haveUserImg" alt=""/>
            </div>
            <canvas id="canvas" className="inner-item" style={{ width: '340px', height: '410px' }} width="1020" height="1230"></canvas>
          </div>
          <div style={{ paddingTop: 20 }}>
            <div className="btn-item3" style={{ textAlign: 'center' }}>
              <div>
                <button className="ant-btn ant-btn-primary ant-btn-lg" style={{ width: 250 }} id="cut" onClick={ this.handleSubmit }>下一步</button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default mianguanRead2;