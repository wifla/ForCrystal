// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const _id = event.id;
  const title = event.title;
  const place = event.place;
  const time = event.time;

  return await db.collection('day').doc(_id).update({
    data: {
      title: title,
      place: place,
      time: time,
    }
  }).then(res=>{
    return res;
  })
}