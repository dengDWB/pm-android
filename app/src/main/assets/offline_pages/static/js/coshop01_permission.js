console.log("coshop01");
// 如果是商户登入
var userinfo = {
   "uuid": "2c918cf25b7c6653015b7d2ece951c74",
   "code": "coshop01",
   "name": "coshop01",
   "telephone": ""
};
// 用户权限组列表，仅仅包含 key，value
var userGroups = [];
userGroups.push({
  key:"2c918cf25b60f532015b66579fc33d4b",
  value:"co用户组"
});
// 用户权限组数组的第一个
var userGroup = (userGroups.length > 0 ? userGroups[0]: {});
// 商户信息
var tenant = {
  "uuid":"",
  "code":"",
  "name":""
};
// --------------
// 如果是商铺登入
// contact为商铺列表中的合同信息。取第一个商铺的第一个合同信息。
var contract = {};
// 所合同信息
var contracts = [];
contracts.push({
  "uuid":"995d7a33-e1ba-4608-ac05-8befd2e3fd6a",
  "code":"50551704130005",
  "name":"儿童节舞蹈教育",
  "store":{
     "uuid":"2c918cf15b60ed11015b6512e1640521",
     "code":"5055",
     "name":"coco项目购物中心"
  }
});
// 项目信息列表
var stores= [];
stores.push({
  code:"5055",
  uuid:"2c918cf15b60ed11015b6512e1640521",
  name:"coco项目购物中心"
});
// 项目uuid信息。
var stores_uuids = [];
stores_uuids.push("2c918cf15b60ed11015b6512e1640521");
// 角色权限链接
var permission_links = []
permission_links.push("/cre-app/complainAdvice/create");
permission_links.push("/cre-app/complainAdvice/read");
permission_links.push("/cre-app/meassage/read");
permission_links.push("/cre-app/projectRepair/create");
permission_links.push("/cre-app/projectRepair/read");
permission_links.push("/cre-app/projectRepair/submit");
permission_links.push("/cre-app/saleInput/create");
permission_links.push("/cre-app/saleInput/read");
permission_links.push("/cre-app/saleInput/submit");
permission_links.push("/cre-app/statement/read");
permission_links.push("/cre-app/task/read");
userinfo.permissions = permission_links;
// userid 占位符替换
$("#_userid_").replaceWith(userinfo.code);
