console.log("apptest10");
// 如果是商户登入
var userinfo = {
   "uuid": "2c918aeb5a21fa02015a7e20712408de",
   "code": "apptest10",
   "name": "apptest10",
   "telephone": "15699999999"
};
// 用户权限组列表，仅仅包含 key，value
var userGroups = [];
userGroups.push({
  key:"2c918cf259912d42015a17c1a1d35e17",
  value:"世茂测试"
});
// 用户权限组数组的第一个
var userGroup = (userGroups.length ? userGroups[0]: {});
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
// 项目信息列表
var stores= [];
stores.push({
  code:"shimaoco",
  uuid:"2c918cf15a165aae015a16ba689f0002",
  name:"上海世茂-测试"
});
// 项目uuid信息。
var stores_uuids = [];
stores_uuids.push("2c918cf15a165aae015a16ba689f0002");
// 角色权限链接
var permission_links = []
permission_links.push("/cre-app/deviceRepair/create");
permission_links.push("/cre-app/deviceRepair/grabSingle");
permission_links.push("/cre-app/deviceRepair/read");
permission_links.push("/cre-app/deviceRepair/repair");
permission_links.push("/cre-app/deviceRepair/submit");
permission_links.push("/cre-app/deviceRepair/update");
permission_links.push("/cre-app/inspectionFacilities/create");
permission_links.push("/cre-app/inspectionFacilities/read");
permission_links.push("/cre-app/inspectionFacilities/submit");
permission_links.push("/cre-app/inspectionFacilities/update");
permission_links.push("/cre-app/meterInput/create");
permission_links.push("/cre-app/meterInput/read");
permission_links.push("/cre-app/meterInput/submit");
permission_links.push("/cre-app/meterInput/update");
permission_links.push("/cre-app/operInspect/create");
permission_links.push("/cre-app/operInspect/read");
permission_links.push("/cre-app/operInspect/update");
permission_links.push("/cre-app/projectRepair/create");
permission_links.push("/cre-app/projectRepair/finished");
permission_links.push("/cre-app/projectRepair/grabSingle");
permission_links.push("/cre-app/projectRepair/read");
permission_links.push("/cre-app/projectRepair/repair");
permission_links.push("/cre-app/projectRepair/sendSingle");
permission_links.push("/cre-app/projectRepair/submit");
permission_links.push("/cre-app/projectRepair/update");
permission_links.push("/cre-app/public/read");
permission_links.push("/cre-app/task/read");
userinfo.permissions = permission_links;
// userid 占位符替换
$("#_userid_").replaceWith(userinfo.code);
