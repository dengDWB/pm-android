console.log("app");
// 如果是商户登入
var userinfo = {
   "uuid": "2c918cf25b2858de015b47e41d4a41c7",
   "code": "app",
   "name": "app",
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
var contract = {
  "uuid":"",
  "code":"",
  "name":""
 };
// 所合同信息
var contracts = [];
// 项目信息列表
var stores= [];
stores.push({
  code:"8000",
  uuid:"2c918cf15a985c7b015ab269c1970a76",
  name:"XXX购物中心"
});
stores.push({
  code:"5055",
  uuid:"2c918cf15b60ed11015b6512e1640521",
  name:"cocc项目购物中心"
});
// 项目uuid信息。
var stores_uuids = [];
stores_uuids.push("2c918cf15a985c7b015ab269c1970a76");
stores_uuids.push("2c918cf15b60ed11015b6512e1640521");
// 角色权限链接
var permission_links = []
permission_links.push("/cre-app/bizTypeRentReport/read");
permission_links.push("/cre-app/bizTypeSalesReport/read");
permission_links.push("/cre-app/bizTypeSalesStaticReport/read");
permission_links.push("/cre-app/communicate/create");
permission_links.push("/cre-app/communicate/delete");
permission_links.push("/cre-app/communicate/read");
permission_links.push("/cre-app/communicate/update");
permission_links.push("/cre-app/complainAdvice/create");
permission_links.push("/cre-app/complainAdvice/deal");
permission_links.push("/cre-app/complainAdvice/finished");
permission_links.push("/cre-app/complainAdvice/read");
permission_links.push("/cre-app/complainAdvice/submit");
permission_links.push("/cre-app/complainAdvice/update");
permission_links.push("/cre-app/contract/audit");
permission_links.push("/cre-app/deviceRepair/create");
permission_links.push("/cre-app/deviceRepair/grabSingle");
permission_links.push("/cre-app/deviceRepair/read");
permission_links.push("/cre-app/deviceRepair/repair");
permission_links.push("/cre-app/deviceRepair/submit");
permission_links.push("/cre-app/deviceRepair/update");
permission_links.push("/cre-app/floorSalesReport/read");
permission_links.push("/cre-app/floorSalesStaticReport/read");
permission_links.push("/cre-app/inspectionFacilities/create");
permission_links.push("/cre-app/inspectionFacilities/read");
permission_links.push("/cre-app/inspectionFacilities/submit");
permission_links.push("/cre-app/inspectionFacilities/update");
permission_links.push("/cre-app/meassage/read");
permission_links.push("/cre-app/meterInput/create");
permission_links.push("/cre-app/meterInput/read");
permission_links.push("/cre-app/meterInput/submit");
permission_links.push("/cre-app/meterInput/update");
permission_links.push("/cre-app/operInspect/create");
permission_links.push("/cre-app/operInspect/read");
permission_links.push("/cre-app/operInspect/update");
permission_links.push("/cre-app/operInspect/updateTime");
permission_links.push("/cre-app/passengersReport/read");
permission_links.push("/cre-app/passengersSalesReport/read");
permission_links.push("/cre-app/passengersStaticReport/read");
permission_links.push("/cre-app/projectRepair/create");
permission_links.push("/cre-app/projectRepair/finished");
permission_links.push("/cre-app/projectRepair/grabSingle");
permission_links.push("/cre-app/projectRepair/read");
permission_links.push("/cre-app/projectRepair/repair");
permission_links.push("/cre-app/projectRepair/sendSingle");
permission_links.push("/cre-app/projectRepair/submit");
permission_links.push("/cre-app/projectRepair/update");
permission_links.push("/cre-app/public/read");
permission_links.push("/cre-app/receiptReport/read");
permission_links.push("/cre-app/rentReport/read");
permission_links.push("/cre-app/repairCategoryReport/read");
permission_links.push("/cre-app/repairPersonReport/read");
permission_links.push("/cre-app/repairStaticReport/read");
permission_links.push("/cre-app/repairWorkhourReport/read");
permission_links.push("/cre-app/saleInput/create");
permission_links.push("/cre-app/saleInput/read");
permission_links.push("/cre-app/saleInput/submit");
permission_links.push("/cre-app/saleInput/update");
permission_links.push("/cre-app/salesDetailReport/read");
permission_links.push("/cre-app/statement/read");
permission_links.push("/cre-app/task/read");
userinfo.permissions = permission_links;
// userid 占位符替换
$("#_userid_").replaceWith(userinfo.code);
