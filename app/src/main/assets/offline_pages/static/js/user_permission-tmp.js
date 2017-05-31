console.log("gl001");
// 如果是商户登入
var userinfo = {
   "uuid": "8ae5940e552b6069015625d3cacb07c5",
   "code": "100383",
   "name": "梁亦高",
   "telephone": "213"
};
// 用户权限组列表，仅仅包含 key，value
var userGroups = [];
// 用户权限组数组的第一个
var userGroup = (userGroups.length > 0 ? userGroups[0]: {});
// 商户信息
var tenant = {
  "uuid":"8ae5940e552b6069015625d3cacb07c5",
  "code":"8ae5940e552b6069015625d3cacb07c5",
  "name":"8ae5940e552b6069015625d3cacb07c5"
};
// --------------
// 如果是商铺登入
// contact为商铺列表中的合同信息。取第一个商铺的第一个合同信息。
var contract = {};
// 所合同信息
var contracts = [];
contracts.push({
  "uuid":"8ae5940e57e51f4b0157fb3994d611da",
  "code":"900102161025000012",
  "name":"北卡罗",
  "store":{
     "uuid":"8ae5940e55e2f4c801560b326baf0565",
     "code":"900102",
     "name":"月星家居上海澳门路店"
  }
});
// 项目信息列表
var stores= [];
stores.push({
  code:"900102",
  uuid:"8ae5940e55e2f4c801560b326baf0565",
  name:"月星家居上海澳门路店"
});
// 项目uuid信息。
var stores_uuids = [];
stores_uuids.push("8ae5940e55e2f4c801560b326baf0565");
// 角色权限链接
var permission_links = []
userinfo.permissions = permission_links;
// userid 占位符替换
$("#_userid_").replaceWith(userinfo.code);
