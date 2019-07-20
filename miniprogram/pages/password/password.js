// pages/password/password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwdArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  makeCall: function(){
    wx.showModal({
      title: '求救作者',
      confirmColor: 'rgba(238, 198, 198,1)',
      content: '拨打电话，询问密码',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '13697499258',
          })
        } else if (res.cancel) {
          
        }
      }
    })
    
  },
  inputPwd: function(e){
    let value = e.currentTarget.dataset.value;
    let pwdArr = this.data.pwdArr;
    pwdArr.push(value);
    this.setData({
      pwdArr: pwdArr
    })
    if(pwdArr.length == 4){
      let password = pwdArr.join('');
      if (password == '0513'){
        wx.switchTab({
          url: '../index/index',
        })
        return;
      }else{
        let that = this;
        wx.showToast({
          title: '密码错误',
          icon: 'none'
        })
        pwdArr = [];
        setTimeout(()=>{
          that.setData({
            pwdArr: pwdArr
          })
        },200)
      }
    }
    
  },
  deletePwd: function(){
    let pwdArr = this.data.pwdArr;
    if(pwdArr.length == 0){
      return;
    }
    pwdArr.pop();
    this.setData({
      pwdArr: pwdArr
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})