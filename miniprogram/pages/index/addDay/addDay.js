// miniprogram/pages/index/addDay/addDay.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  uploadDay: function(e){

    let params = e.detail.value;
    if(!params.title||!params.place||!params.time){
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '正在添加',
    })
    db.collection('day').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        title: params.title,
        place: params.place,
        time: params.time,
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        wx.hideLoading();
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
        wx.switchTab({
          url: '../index',
        })
      }
    })
  }
})