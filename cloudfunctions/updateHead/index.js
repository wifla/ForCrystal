// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id;
  let sex = event.sex;
  let src = event.src;
  
  try {
    if(sex == 'male'){
      return await db.collection('head').doc(id).update({
        data: {
          male: src
        }
      });
    }else{
      return await db.collection('head').doc(id).update({
        data: {
          female: src
        }
      });
    }
    
  } catch (e) {
    console.error(e)
  }
}