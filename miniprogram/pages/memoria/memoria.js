// miniprogram/pages/memoria/memoria.js
import util from '../../utils/comment.js';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSize: 2,
    columnName: 'uploadtime',
    dateList:[],
    hasMore: true,
    head: {},
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
    this.loadList();
  },
  onShow: function(){
    this.loadList();
  },

  goAdd: function(){
    wx.navigateTo({
      url: 'addMemoria/addMemoria',
    })
  },
  loadList: function(){
    // if(!this.data.hasMore){
    //   wx.showToast({
    //     icon: 'none',
    //     title: '没有更多啦',
    //   });
    //   return;
    // }
    wx.cloud.callFunction({
      name: 'pagination',
      data: {
        dbName: 'datingInfo',
        pageIndex: 1,
        pageSize: 2,
        columnName: this.data.columnName
      }
    }).then(res=>{
      let hasMore = res.result.hasMore;
      let dateList = this.data.dateList;
      dateList = res.result.data;
      for(let i =0;i<dateList.length;i++){
        dateList[i].uploadtime = util.timeHandle(dateList[i].uploadtime);
      }
      //拿到数据顺便拿
      this.setData({
        hasMore: hasMore,
        dateList: dateList
      });
      this.loadHead();
      
    })
  },
  loadHead: function () {
    let that = this;
    db.collection('head').where({
      '_id': 'XN1iOE_Mv-8c57rs'
    })
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res)
          that.setData({
            head: res.data[0],
          });
          wx.hideLoading()
        }
      })
  },
  loadMore: function(){
    if(!this.data.hasMore){
      wx.showToast({
        title: '没有数据啦',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      loading: true
    });
    let pageIndex = this.data.pageIndex + 1;
    wx.cloud.callFunction({
      name: 'pagination',
      data: {
        dbName: 'datingInfo',
        pageIndex: pageIndex,
        pageSize: this.data.pageSize,
        columnName: this.data.columnName
      }
    }).then(res => {
      let hasMore = res.result.hasMore;
      let dateList = this.data.dateList;
      for (let k = 0; k < res.result.data.length; k++) {
        res.result.data[k].uploadtime = util.timeHandle(res.result.data[k].uploadtime);
      }
      dateList = dateList.concat(res.result.data);
      //拿到数据顺便拿
      this.setData({
        hasMore: hasMore,
        dateList: dateList,
        loading:false,
        pageIndex: pageIndex
      });
      wx.hideLoading();
    })
  },
  goDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'memoriaDetail/memoriaDetail?id=' + id + '&&head=' + JSON.stringify(this.data.head)
    })
  }
})