// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var dbName = event.dbName;
  var columnName = event.columnName;
  var pageIndex = event.pageIndex;//页码
  var pageSize = event.pageSize;//每页的数据数目
  const countResult = await db.collection(dbName).count();
  const total = countResult.total;//总记录数
  //总页数
  const totalPage = Math.ceil(total / pageSize);
  var hasMore;//是否还有下一页
  if(pageIndex > totalPage || pageIndex == totalPage){
    hasMore = false;
  }else{
    hasMore = true;
  }

  //返回前端 页码从1开始
  return db.collection(dbName).orderBy(columnName, 'desc').skip((pageIndex-1) * pageSize).limit(pageSize).get().then( res => {
    res.hasMore = hasMore;
    return res;
  })
}