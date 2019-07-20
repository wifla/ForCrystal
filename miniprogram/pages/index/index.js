//index.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    showUpdate:false,//显示修改弹窗
    dayArr:[],//纪念日数组
    updateDetail:{},//修改详细资料
    date:'',//日期
    dayCount: 0,//统计时间
    head:{},//存放头像路径
    headPreview: null,
    headSex:null,
    showBottomDia:false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  onShow: function(){
    this.loadDay();
  },
  onLoad: function() {
    this.loadHead();
    this.loadDay();
  
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = new Date().getTime() + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log(res)
            let fileID = res.fileID;
            wx.cloud.getTempFileURL({
              fileList: [fileID],
              success: res => {
                // get temp file URL
                let src = res.fileList[0].tempFileURL;
                console.log(src)
                let sex = that.data.headSex;
                let id = 'XN1iOE_Mv-8c57rs';
                wx.cloud.callFunction({
                  name: 'updateHead',
                  data: {
                    id: id,
                    sex: sex,
                    src: src
                  }, success: function (res) {
                    console.log(res);
                    that.onLoad();
                    wx.showToast({
                      title: '修改成功',
                    });
                  }, fail: function (res) {
                    //console.log(res)
                  }
                })
                
              },
              fail: err => {
                // handle error
                
              }
            })
             
          },
          fail: e => {
            console.error('修改失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            });
            
          },
          complete: () => {
            wx.hideLoading()
            
          }
        })

      },
      fail: e => {
        console.error(e)

      }
    })
  },


  //跳转到添加页面
  goAdd:function(){
    wx.navigateTo({
      url: 'addDay/addDay',
    })
  },
  deleteDay: function(e){
    let that = this;
    wx.showModal({
      title: '警告！',
      confirmColor: '#FF2400',
      content: '确定删除该条纪念日吗',
      success(res) {
        if (res.confirm) {
          console.log(e);
          let id = e.currentTarget.dataset.id;
          // db.collection('day').doc(id).remove({
          //   success(res) {
          //     wx.showToast({
          //       title: '删除成功',
          //     });
          //     that.loadDay();
          //   }
          // })


          wx.cloud.callFunction({
            name: 'deleteDating',
            data: {
              _id: id,
              dbName: 'day'
            }
          }).then(res => {
            wx.showToast({
              title: '删除成功',
            });
            that.loadDay();
            
          }).catch(err => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });

          })

        } else if (res.cancel) {

        }
      }
    })
  },
  //显示修改dialog
  showUpdate: function(e){
    let detail = e.currentTarget.dataset.detail;
    console.log(detail)
    this.setData({
      showUpdate: true,
      updateDetail:detail
    })
  },
  //隐藏修改dialog
  hideUpdate: function () {
    this.setData({
      showUpdate: false
    })
  },


  //获取day集合数据
  loadDay:function(){
    let that = this;
    // db.collection('day').where({
    // })
    //   .get({
    //     success(res) {
    //       // res.data 是包含以上定义的两条记录的数组
    //       let dayArr = res.data;
    //       let date2 = new Date();
    //       let date1 = new Date(Date.parse('2018-05-13'.replace(/-/g, "/")));
    //       var iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
    //       for(let i=0;i<dayArr.length;i++){
    //         let now = new Date();
    //         let start = new Date(Date.parse(dayArr[i].time.replace(/-/g, "/")));
    //         dayArr[i].count = parseInt(Math.abs(start.getTime() - now.getTime()) / 1000 / 60 / 60 / 24);
            
    //       }
    //       that.setData({
    //         dayArr: dayArr,
    //         dayCount: iDays
    //       });
          
          
    //     }
    //   })



      wx.cloud.callFunction({
        name: 'loadDay',
        data:{
          dbName: 'day'
        }
      }).then(res=>{
        console.log(res)
        let dayArr = res.result.data;
        let date2 = new Date();
        let date1 = new Date(Date.parse('2018-05-13'.replace(/-/g, "/")));
        var iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
        for (let i = 0; i < dayArr.length; i++) {
          let now = new Date();
          let start = new Date(Date.parse(dayArr[i].time.replace(/-/g, "/")));
          dayArr[i].count = parseInt(Math.abs(start.getTime() - now.getTime()) / 1000 / 60 / 60 / 24);

        }
        that.setData({
          dayArr: dayArr,
          dayCount: iDays
        });
      }).catch(err=>{

      })
  },

  //获取头像
  loadHead:function(){
    let that = this;
    db.collection('head').where({
      '_id':'XN1iOE_Mv-8c57rs'
    })
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res)
          that.setData({
            head: res.data[0],
          });
        }
      })
  },

  bindDateChange(e) {
    let updateDetail = this.data.updateDetail;
    updateDetail.time = e.detail.value;
    this.setData({
      date:updateDetail.time
    })
  },
  updateDay: function(e){
    let that = this;
    
    let params = e.detail.value;
    if(!params.time){
      params.time = this.data.updateDetail.time;
    }
    console.log(params)
    let id = this.data.updateDetail._id;
    
    if (!params.title || !params.place || !params.time) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      });
      return;
    }
    console.log(e)


    // db.collection('day').doc(id).update({
    //   // data 传入需要局部更新的数据
    //   data: {
    //     title: params.title,
    //     place: params.place,
    //     time: params.time,
    //   },
    //   success(res) {
    //     wx.showToast({
    //       title: '修改成功',
    //     });
    //     that.setData({
    //       showUpdate: false,
    //       updateDetail: {},
    //       date: ' '
    //     });
    //     that.loadDay();
    //   }
    // })


    wx.cloud.callFunction({
      name: 'updateDay',
      data: {
        _id: id,
        title: params.title,
        place: params.place,
        time: params.time,
      },
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '修改成功',
      });
      that.setData({
        showUpdate: false,
        updateDetail: {},
        date: ' '
      });
      that.loadDay();
    }).catch(err => {
      console.log(err)
    })

  },
  previewImg: function () {
    wx.previewImage({
      urls: [this.data.headPreview],
    });
    this.setData({
      showBottomDia: false,
      headPreview: null,
      headSex: null
    })
  },
  hideBottomDia:function(){
    this.setData({
      showBottomDia: false,
      headPreview: null,
      headSex: null
    })
  },
  showBottomDia:function(e){
    this.setData({
      showBottomDia: true,
      headPreview: e.currentTarget.dataset.src,
      headSex: e.currentTarget.dataset.sex
    })
  },
  changeHead:function(){
    let sex = this.data.headSex;
    this.setData({
      showBottomDia: false,
      headPreview: null,
      
    }) 
    this.doUpload();
  }
})
