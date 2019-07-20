// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const coverSrc = event.coverSrc;
  const srcList = event.srcList;
  const place = event.place;
  const time = event.time;
  const sex = event.sex;
  const content = event.content;
  const uploadtime = event.uploadtime;
  const tag = event.tag;

  return await db.collection('datingInfo').add({
    data: {
      coverSrc: coverSrc,
      srcList: srcList,
      place: place,
      time: time,
      sex: sex,
      content: content,
      uploadtime: uploadtime,
      tag: tag
    }
  });
}