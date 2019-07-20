// miniprogram/pages/memoria/memoriaDetail/memoriaDetail.js
const ImgLoader = require('../../../img-loader/img-loader.js')
import util from "../../../utils/comment.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    dbName: 'datingInfo',
    head:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let id = options.id;
    let head = JSON.parse(options.head);
    this.setData({
      _id: id,
      head: head
    });
    wx.showLoading({
      title: '正在加载',
    })
    
    this.loadDetail();
  },

  loadDetail: function(){
    let that = this;
    wx.cloud.callFunction({
      name: 'memoriaDetail',
      data:{
        _id: this.data._id,
        dbName: this.data.dbName
      }
    }).then(res=>{
      let memoriaDetail = res.result.data;
      memoriaDetail.uploadtime = util.timeHandle(memoriaDetail.uploadtime)
      that.setData({
        memoriaDetail: memoriaDetail
      });
      that.loadImg(memoriaDetail.srcList);
      
    }).catch(err=>{
      console.log(err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon:'none'
      });
      
    })
  },
  previewImg: function(e){
    let index = e.currentTarget.dataset.index;
    let srcList = this.data.memoriaDetail.srcList;
    wx.previewImage({
      urls: srcList,
      current: srcList[index]
    });
  },
  deleteDetail: function(e){
    let that = this;
    wx.showModal({
      title: '警告！',
      confirmColor: '#FF2400',
      content: '确定删除这篇约会日记吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
            icon:'none'
          })
          console.log(e);
          let _id = e.currentTarget.dataset.id;
          wx.cloud.callFunction({
            name: 'deleteDating',
            data: {
              _id: _id,
              dbName: that.data.dbName
            }
          }).then(res => {
            console.log(res)
            wx.hideLoading();
            wx.switchTab({
              url: '../memoria',
            })
          }).catch(err => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });

          })
          console.log(_id)
        } else if (res.cancel) {
          wx.showToast({
            title: '我们的纪念很珍贵',
            icon: 'none'
          });
        }
      }
    })
  },
  loadImg: function(arr){
    console.log(arr)
    this.imgLoader = new ImgLoader(this);
    arr.forEach(item => {
      this.imgLoader.load(item)
    });
    wx.hideLoading();
  }
})