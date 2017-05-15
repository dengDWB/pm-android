console.log("roy_zhu");
// 如果是商户登入
var userinfo = {
   "uuid": "297ebe0e5603dbbc01568ca4ea431e64",
   "code": "roy_zhu",
   "name": "朱承光",
   "telephone": ""
};
// 用户权限组列表，仅仅包含 key，value
var userGroups = [];
userGroups.push({
  key:"8a0180ca5930022501597194a9a42cb4",
  value:"绍兴物业文员组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bee1c26d5e93",
  value:"福州工程物业组"
});
userGroups.push({
  key:"8a0180ca59300225015935c922245a58",
  value:"昆山物业工程组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be168fdb0071",
  value:"济南营运组"
});
userGroups.push({
  key:"8a0180ca5930022501597260bf0c3ded",
  value:"绍兴财务经理组"
});
userGroups.push({
  key:"8a0180ca593002250159726834393ff7",
  value:"绍兴业务文员组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bee00ae25e2a",
  value:"福州财务组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bef9568a60de",
  value:"福州招商组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be1631b5006a",
  value:"济南招商组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be15af0f0041",
  value:"济南总经办"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bee0ca4a5e58",
  value:"闽侯招商组"
});
userGroups.push({
  key:"8a0180ca59300225015935c98fc45a78",
  value:"昆山营运招商组"
});
userGroups.push({
  key:"8a0180ca593002250159726b888e407e",
  value:"绍兴服务组"
});
userGroups.push({
  key:"8a0180ca593002250159719310ee2c81",
  value:"绍兴财务出纳组"
});
userGroups.push({
  key:"8a0180ca5848500f0158712c80fd68e0",
  value:"南昌IT组"
});
userGroups.push({
  key:"8a0180ca5930022501597272d6bb41b8",
  value:"绍兴经理组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be173ad900a5",
  value:"济南财务组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bedfcd855e13",
  value:"福州IT组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be186cf000e4",
  value:"济南管理员组"
});
userGroups.push({
  key:"8a0180ca5930022501597262e1893ef2",
  value:"绍兴财务结算组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be17c5b900ba",
  value:"济南工程组"
});
userGroups.push({
  key:"297ebe0e4ffd772b01504561bca5724f",
  value:"集团用户组"
});
userGroups.push({
  key:"8a0180ca59300225015935c8e36f5a43",
  value:"昆山财务组"
});
userGroups.push({
  key:"8a0180ca59300225015972664cd83f87",
  value:"绍兴财务本金组"
});
userGroups.push({
  key:"8a0180ca59300225015935c94b465a5b",
  value:"昆山市场组"
});
userGroups.push({
  key:"8a0180ca5930022501597192e07c2c7e",
  value:"绍兴IT组"
});
userGroups.push({
  key:"8a0180ca571e4ee60157452ea8bb56f8",
  value:"济南信息组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bee206405e98",
  value:"福州市场组"
});
userGroups.push({
  key:"8a0180ca5b37188b015b7a452ee30e14",
  value:"上海世茂招商组"
});
userGroups.push({
  key:"8a0180ca593002250159719c08732d31",
  value:"绍兴物业主管组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be17f73400cf",
  value:"济南物业组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bee073265e41",
  value:"闽侯财务组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bee0fdc85e5d",
  value:"福州营运组"
});
userGroups.push({
  key:"8a0180ca593002250159726f3d0d4110",
  value:"绍兴业务主管组"
});
userGroups.push({
  key:"8a0180ca5747f52e0157be16ec1e0090",
  value:"济南推广组"
});
userGroups.push({
  key:"8a0180ca58b88fda0158bee155e55e7e",
  value:"闽侯工程物业组"
});
userGroups.push({
  key:"297ebe0e54c97497015523ee6b521782",
  value:"厦门财务部"
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
  code:"0001",
  uuid:"297ebe0e50121d3a0150455ec0200007",
  name:"52+南京下关"
});
stores.push({
  code:"0002",
  uuid:"297ebe0e50121d3a0150455fc27c0015",
  name:"52+武汉锦绣长江"
});
stores.push({
  code:"TEST",
  uuid:"297ebe0e51824d8d0151852e32c1001f",
  name:"测试项目"
});
stores.push({
  code:"0004",
  uuid:"297ebe0e54bfbe410154ebda894d0003",
  name:"厦门世茂"
});
stores.push({
  code:"0005",
  uuid:"297ebe0e557e053b0155970170bc04e5",
  name:"石狮世茂"
});
stores.push({
  code:"2060",
  uuid:"8a0180cb571ede000157451668740001",
  name:"世茂济南广场"
});
stores.push({
  code:"2070",
  uuid:"8a0180cb574806f90157799fb5560007",
  name:"南通世茂"
});
stores.push({
  code:"2050",
  uuid:"8a0180cb574806f9015779a3184c0008",
  name:"南昌世茂"
});
stores.push({
  code:"1020",
  uuid:"8a0180cb58b8892f0158bec8b5020003",
  name:"福州世茂"
});
stores.push({
  code:"2020",
  uuid:"8a0180cb591532e301591c97c3da009a",
  name:"昆山世茂"
});
stores.push({
  code:"2010",
  uuid:"8a0180cb59304110015967e8c85b1bfd",
  name:"绍兴世茂"
});
stores.push({
  code:"2030",
  uuid:"8a0180cb598882ec015a17b6793105ce",
  name:"苏州世茂"
});
stores.push({
  code:"1040",
  uuid:"8a0180cb5ad20434015ad24113ad0001",
  name:"烟台世茂"
});
stores.push({
  code:"1010",
  uuid:"8a0180cb5af56f6b015b08ea3764052f",
  name:"沈阳世茂"
});
stores.push({
  code:"0006",
  uuid:"8a0180cb5b42170f015b4383537c0006",
  name:"上海世茂"
});
stores.push({
  code:"0007",
  uuid:"8a0180cb5b466ae8015b58710e550478",
  name:"北京写字楼"
});
stores.push({
  code:"8888",
  uuid:"8a0180cb5b466ae8015b5c9c36b30481",
  name:"哈尔滨世茂"
});
// 项目uuid信息。
var stores_uuids = [];
stores_uuids.push("297ebe0e50121d3a0150455ec0200007");
stores_uuids.push("297ebe0e50121d3a0150455fc27c0015");
stores_uuids.push("297ebe0e51824d8d0151852e32c1001f");
stores_uuids.push("297ebe0e54bfbe410154ebda894d0003");
stores_uuids.push("297ebe0e557e053b0155970170bc04e5");
stores_uuids.push("8a0180cb571ede000157451668740001");
stores_uuids.push("8a0180cb574806f90157799fb5560007");
stores_uuids.push("8a0180cb574806f9015779a3184c0008");
stores_uuids.push("8a0180cb58b8892f0158bec8b5020003");
stores_uuids.push("8a0180cb591532e301591c97c3da009a");
stores_uuids.push("8a0180cb59304110015967e8c85b1bfd");
stores_uuids.push("8a0180cb598882ec015a17b6793105ce");
stores_uuids.push("8a0180cb5ad20434015ad24113ad0001");
stores_uuids.push("8a0180cb5af56f6b015b08ea3764052f");
stores_uuids.push("8a0180cb5b42170f015b4383537c0006");
stores_uuids.push("8a0180cb5b466ae8015b58710e550478");
stores_uuids.push("8a0180cb5b466ae8015b5c9c36b30481");
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
