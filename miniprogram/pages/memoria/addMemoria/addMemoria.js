  // miniprogram/pages/memoria/addMemoria/addMemoria.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImg: '',
    imgList: [],
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  chooseCover: function(){
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          coverImg: res.tempFilePaths[0]
        })
      }
    });
  },
  chooseImg: function () {
    wx.chooseImage({
      count: 3, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  addDating: function(e){
    let params = e.detail.value;
    let filePath = this.data.coverImg;
    let imgList = this.data.imgList;

    //判断内容是否填写完整！
    if (!filePath || imgList.length == 0){
      wx.showToast({
        title: '图片不能为空',icon: 'none'
      });
      return;
    }
    if(!params.place || !params.time || !params.content || !params.tag){
      wx.showToast({
        title: '内容不能为空', icon: 'none'
      });
      return;
    }
    //转换sex
    if(params.sex){
      params.sex="male";
    }else{
      params.sex="female";
    }
    //先上传图片
    wx.showLoading({
      title: '正在添加',
    });
    //先上传封面
    const cloudPath = new Date().getTime()+ 'cover' + filePath.match(/\.[^.]+?$/)[0];
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        let fileID = res.fileID;
        wx.cloud.getTempFileURL({
          fileList: [fileID],
          success: res => {
            //成功拿到封面
            let coverSrc = res.fileList[0].tempFileURL;
            //开始上传多张图片
            let idList = [];//存放fileid
            Promise.all(imgList.map((item) => {
              return wx.cloud.uploadFile({
                cloudPath: new Date().getTime()  + item.match(/\.[^.]+?$/)[0], // 文件名称 
                filePath: item,
              })
            }))
              .then((resCloud) => {
                console.log(resCloud)
                for(let i=0;i<resCloud.length;i++){
                  idList.push(resCloud[i].fileID);
                }
                //获取路径
                wx.cloud.getTempFileURL({
                  fileList: idList,
                  success: res => {
                    // get temp file URL
                    console.log(res)
                    let srcList = [];
                    for (let k = 0; k < res.fileList.length; k++) {
                      srcList.push(res.fileList[k].tempFileURL);
                    }
                    //进行到这一步拿到了图片要存储的数据
                    //coverSrc 封面图片的路径
                    //srcList 图片描述路径
                    //接下来就是存表单数据
                    
                    let uploadtime = new Date().getTime();
                    wx.cloud.callFunction({
                      name: 'addDating',
                      data: {
                        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                        coverSrc: coverSrc,
                        srcList: srcList,
                        place: params.place,
                        time: params.time,
                        sex: params.sex,
                        content: params.content,
                        uploadtime: uploadtime,
                        tag:params.tag
                      },success: function (res) {
                        console.log(res);
                          wx.hideLoading();
                          wx.showToast({
                            title: '添加成功',
                          });
                          wx.switchTab({
                            url: '../memoria',
                          })
                      }, fail: function (res) {
                        console.log(res)
                          wx.showToast({
                            icon: 'none',
                            title: '添加失败',
                          });
                          wx.hideLoading();
                          wx.switchTab({
                            url: '../memoria',
                          })
                      }
                    })

                  },
                  fail: err => {
                    // handle error
                    wx.showToast({
                      icon: 'none',
                      title: '添加失败',
                    });
                    wx.hideLoading();
                    wx.switchTab({
                      url: '../memoria',
                    })
                  }
                })
                //idList.push();
                
              }).catch((err) => {
                console.log(err)
              })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '添加失败',
            });
            wx.hideLoading();
            wx.switchTab({
              url: '../memoria',
            })
          }
        })

      },
      fail: e => {
        wx.showToast({
          icon: 'none',
          title: '添加失败',
        });
        wx.hideLoading();
        wx.switchTab({
          url: '../memoria',
        })
      },
    })
  }
})