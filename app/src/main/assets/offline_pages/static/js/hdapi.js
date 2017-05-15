/**
HDAPI
**/

(function($) {
  // "use strict";
  if ($.HDAPI) {
    return;
  }

  var username ='yourapp-name';
  var password ='yourapp-password';

  $.HDAPI = {
    version: '1.1.3',
    /* server: 'http://hdcre.shimaoco.com:8280',*/
	  server: 'http://cre.test.hd123.cn:8280',
    getTasks: function(data, callback) {
      return HDgetTasks(data, callback);
    },

    getSubjects: function(data, callback) {
      return HDgetSubjects(data, callback);
    },

    queryUsers: function(data, callback) {
      return HDqueryUsers(data, callback);
    },

    queryWarehouses: function(data, callback) {
      return HDqueryWarehouses(data, callback);
    },

    queryMaterials: function(data, callback) {
      return HDqueryMaterials(data, callback);
    },

    querygroups: function(data, callback) {
      return HDquerygroups(data, callback);
    },

    queryequipments: function(data, callback) {
      return HDqueryequipments(data, callback);
    },

    queryemployees: function(data, callback) {
      return HDqueryemployees(data, callback);
    },

    queryareas: function(data, callback) {
      return HDqueryareas(data, callback);
    },

    queryfloors: function(data, callback) {
      return HDqueryfloors(data, callback);
    },

    querybuildings: function(data, callback) {
      return HDquerybuildings(data, callback);
    },

    query_device: function(data, callback) {
      return HDquery_device(data, callback);
    },

    save_device: function(extra, data, callback) {
      return HDsave_device(extra, data, callback);
    },

    get_device: function(uuid, data, callback) {
      return HDget_device(uuid, data, callback);
    },

    get_oper_inspect: function(uuid, data, callback) {
      return HDget_oper_inspect(uuid, data, callback);
    },

    save_oper_inspect: function(extra, data, callback) {
      return HDsave_oper_inspect(extra, data, callback);
    },

    get_basic_device: function(uuid, callback) {
      return HDget_basic_device(uuid, callback);
    },

    get_basic_devices: function(uuid, callback) {
      return HDget_basic_devices(uuid, callback);
    },

    get_inspect_items: function(category, callback) {
      return HDget_inspect_items(category, callback);
    },

    get_inspect_category: function(callback) {
      return HDget_inspect_category(callback);
    },

    get_inspect_category_detail: function(uuid, callback) {
      return HDget_inspect_category_detail(uuid, callback);
    },

    get_worktask: function(taskuuid, callback) {
      return HDget_worktask(taskuuid, callback);
    },

    create_device: function(extra, data, callback) {
      return HDcreate_device(extra, data, callback);
    },

    create_oper_inspect: function(extra, data, callback) {
      return HDcreate_oper_inspect(extra, data, callback);
    },

    query_oper_inspect: function(data, callback) {
      return HDquery_oper_inspect(data, callback);
    },

    create_worktask: function(extra, data, callback) {
      return HDcreate_worktask(extra, data, callback);
    },

    solve_worktask: function(version, taskuuid, extra, data, callback) {
      return HDsolve_worktask(version, taskuuid, extra, data, callback);
    },

    deliver_worktask: function(version, taskuuid, extra, data, callback) {
      return HDdeliver_worktask(version, taskuuid, extra, data, callback);
    },

    cancel_worktask: function(version, taskuuid, extra, data, callback) {
      return HDcancel_worktask(version, taskuuid, extra, data, callback);
    },

    get_cleantask: function(taskuuid, callback) {
      return HDget_cleantask(taskuuid, callback);
    },

    create_cleantask: function(extra, data, callback) {
      return HDcreate_cleantask(extra, data, callback);
    },

    solve_cleantask: function(version, taskuuid, extra, data, callback) {
      return HDsolve_cleantask(version, taskuuid, extra, data, callback);
    },

    deliver_cleantask: function(version, taskuuid, extra, data, callback) {
      return HDdeliver_cleantask(version, taskuuid, extra, data, callback);
    },

    cancel_cleantask: function(version, taskuuid, extra, data, callback) {
      return HDcancel_cleantask(version, taskuuid, extra, data, callback);
    },

    salesStatisticReport: function(data, callback) {
      return HDsalesStatisticReport(data, callback);
    },

    HDsalesOrdinaryReport: function(data, callback) {
      return HDsalesOrdinaryReport(data, callback);
    },

    salesReport: function(data, callback) {
      return HDsalesReport(data, callback);
    },

    rentalReport: function(data, callback) {
      return HDrentalReport(data, callback);
    },

    receiptReport: function(data, callback) {
      return HDreceiptReport(data, callback);
    },

    passengersReport: function(data, callback) {
      return HDpassengersReport(data, callback);
    },

    getUserMessages: function(userId, callback) {
      return HDgetUserMessages(userId, callback);
    },

    getUserMessage: function(userId, msgId, callback) {
      return HDgetUserMessage(userId, msgId, callback);
    },

    salesTotal: function(data, callback) {
      return HDsalesTotal(data, callback);
    },

    getAllPayments: function(callback) {
      return HDgetAllPayments(callback);
    },

    querySettle: function(data, callback) {
      return HDquerySettle(data, callback);
    },

    loadSettle: function(data, callback) {
      return HDLoadSettle(data, callback);
    },

    getSettle: function(contract, settle, callback) {
      return HDgetSettle(contract, settle, callback);
    },

    queryTasks: function(data, callback) {
      return HDqueryTasks(data, callback);
    },

    getTask: function(taskuuid, callback) {
      return HDgetTask(taskuuid, callback);
    },

    executeTask: function(data, callback) {
      return HDexecuteTask(data, callback);
    },

    getTaskOperatorLogs: function(taskuuid, callback) {
      return HDgetTaskOperatorLogs(taskuuid, callback);
    },

    change_password: function(user, data, callback) {
      return HDchange_password(user, data, callback);
    },

    get_contract: function(billtype, contractuuid, callback) {
      return HDget_contract(billtype, contractuuid, callback);
    },

    query_notice: function(data, callback){
      return HDquery_notice(data, callback);
    },
    get_notice: function(uuid, callback){
      return HDget_notice(uuid, callback);
    },

    create_device_repair: function(extra, data, callback) {
      return HDcreate_device_repair(extra, data, callback);
    },

    get_device_repair: function(uuid, data, callback) {
      return HDget_device_repair(uuid, data, callback);
    },

    save_device_repair: function(extra, data, callback) {
      return HDsave_device_repair(extra, data, callback);
    },

    query_device_repair: function(data, callback) {
      return HDquery_device_repair(data, callback);
    },

    signin_device_repair: function(extra, data, callback) {
      return HDsignin_device_repair(extra, data, callback);
    },

    assign_device_repair: function(data, callback) {
      return HDassign_device_repair(data, callback);
    },

    create_complaint: function(extra, data, callback) {
      return HDcreate_complaint(extra, data, callback);
    },

    get_complaint: function(uuid, data, callback) {
      return HDget_complaint(uuid, data, callback);
    },

    save_complaint: function(extra, data, callback) {
      return HDsave_complaint(extra, data, callback);
    },

    query_complaint: function(data, callback) {
      return HDquery_complaint(data, callback);
    },

    get_maintain_types: function(callback) {
      return HDget_maintain_types(callback);
    },

    get_maintain: function(uuid, data, callback) {
      return HDget_maintain(uuid, data, callback);
    },

    save_maintain: function(extra, data, callback) {
      return HDsave_maintain(extra, data, callback);
    },

    query_maintain: function(data, callback) {
      return HDquery_maintain(data, callback) ;
    },

    create_maintain: function(extra, data, callback) {
      return HDcreate_maintain(extra, data, callback) ;
    },

    create_salesInput: function(extra, data, callback) {
      return HDcreate_salesInput(extra, data, callback);
    },

    save_salesInput:function(extra, data, callback) {
      return HDsave_salesInput(extra, data, callback);
    },

    get_salesInput: function(uuid, data, callback) {
      return HDget_salesInput(uuid, data, callback);
    },

    query_salesInput:function(data, callback) {
      return HDquery_salesInput(data, callback);
    },
    get_contract: function(billtype, contractuuid, callback) {
      return HDget_contract(billtype, contractuuid, callback);
    },
    query_contract:function(data, callback) {
      return HDquery_contract(data, callback);
    },
    get_servicemen:function(callback) {
      return HDget_servicemen(callback);
    },
    query_tenant: function (data, callback) {
      return HDquery_tenant(data, callback);
    },

    get_tenant: function(uuid, data, callback) {
      return HDget_tenant(uuid, data, callback);
    },

    signInTask: function (data, callback) {
      return HDsignInTask(data, callback);
    },

    get_maintain_default_configuration: function (uuid, callback) {
      return HDget_maintain_default_configuration(uuid, callback);
    },

    get_materials: function (data, callback) {
      return HDget_materials(data, callback);
    },
    create_meterinput: function(extra, data, callback) {
      return HDcreate_meterinput(extra, data, callback);
    },

    query_meterinput: function(data, callback) {
      return HDquery_meterinput(data, callback);
    },

    get_meterinput: function(uuid, data, callback) {
      return HDget_meterinput(uuid, data, callback);
    },

    get_meters: function(uuid, callback) {
      return HDget_meters(uuid, callback);
    },

    get_attachment: function(uuid, callback) {
      return HDget_attachment(uuid, callback);
    },

    query_user_process_permissions: function(data, callback) {
      return HDquery_user_process_permissions(data, callback);
    },
  };
  function POST(url, data, callback)
  {
    $.ajax({
      headers: {
        Accept: "application/json"
      },
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
      },
      contentType: 'application/json',
      type: 'POST',
      url:url,
      dataType: 'JSON',
      data: JSON.stringify(data)
    }).done(function(result) {
      if (callback)
        callback(result);
    }).fail(function(result){
      if(callback)
      {
        if(result.readyState==4)
        {
          if(result && result.responseJSON && result.responseJSON.message)
            callback({success:false,message:result.responseJSON.message});
          else if( result && result.responseText )
            callback({success:false,message:'接口调用失败:'+result.responseText});
        }
      }
    });
  }
  $(document).ajaxError(function (e, xhr, settings, exception) {
    console.log(xhr.status);
  });

  function PUT(url, data, callback)
  {
    $.ajax({
      headers: {
        Accept: "application/json"
      },
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
      },
      contentType: 'application/json',
      type: 'PUT',
      url:url,
      dataType: 'JSON',
      data:JSON.stringify(data)
    }).done(function(result) {
      if (callback)
        callback(result);
    }).fail(function(result, textstatus, xhr){
      if(callback)
      {
        if(result.readyState==4)
        {
          if(result && result.responseJSON && result.responseJSON.message)
            callback({success:false,message:result.responseJSON.message});
          else if( result && result.responseText )
            callback({success:false,message:'接口调用失败:'+result.responseText});
        }
      }
    });;
  }

  function GET(url, data, callback)
  {
    $.ajax({
      headers: {
        Accept: "application/json"
      },
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
      },
      contentType: 'application/json',
      type: 'GET',
      url:url,
      dataType: 'JSON',
      data: JSON.stringify(data)

    }).done(function(result) {
      if (callback)
        callback(result);
    }).fail(function(result){
      if(callback)
      {
        if(result.readyState==4)
        {
          if(result && result.responseJSON && result.responseJSON.message)
            callback({success:false,message:result.responseJSON.message});
          else if( result && result.responseText )
            callback({success:false,message:'接口调用失败:\n返回数据\n'+result.responseText+'\nHTTP STATUS CODE:'+result.status});
        }
      }
    });
  }

  function HDmonitorReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/monitor-report", data, callback);
  }

  function HDstoresReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/stores-report", data, callback);
  }

  function HDsalesReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/sales-report", data, callback);
  }

  function HDpassengersReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/passengers-report", data, callback);
  }

  function HDmaintainReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/maintain/static-report", data, callback);
  }

  function HDmaintainRepairReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/maintain/repair-report", data, callback);
  }

  function HDsalesReportRange(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/sales-report-range", data, callback);
  }

  function HDsalesStatisticReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/statistic/sales-report-type", data, callback);
  }

  function HDsalesOrdinaryReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/ordinary/sales-report-type", data, callback);
  }

  function HDrentalReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/rental-report", data, callback);
  }

  function HDreceiptReport(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/report/receipt-report", data, callback);
  }
  function HDgetUserMessages(userId, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/message/"+userId, undefined, callback);
  }

  function HDgetUserMessage(userId, msgId, callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/1/message/"+userId+"/"+msgId, undefined, callback);
  }

  function HDcreate_salesInput(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/sales-input/create?"+extra, data, callback);
  }

  function HDsave_salesInput(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/sales-input/save?"+extra, data, callback);
  }

  function HDget_salesInput(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/sales-input/"+uuid, data, callback);
  }

  function HDquery_salesInput(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/sales-input/query", data, callback);
  }

  function HDsalesTotal(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/sales-input/sales-total/", data, callback);
  }

  function HDquerySettle(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/statement/query/", data, callback);
  }
  function HDLoadSettle(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/statement/load/", data, callback);
  }

  function HDgetSettle(contract, settle, callback){
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/statement/"+contract+"/"+settle, undefined, callback);
  }

  function HDqueryTasks(data, callback){
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/task/query", data, callback);
  }

  function HDgetTask(taskuuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/task/"+taskuuid, undefined, callback);
  }

  function HDsignInTask(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/task/signIn", data, callback);
  }

  function HDexecuteTask(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/task/execute", data, callback);
  }

  function HDassignTask(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/task/assign", data, callback);
  }

  function HDgetTaskOperatorLogs(taskuuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/task/operLogs/"+taskuuid, undefined, callback);
  }

  function HDgetTasks(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/data/getTasks",data,callback);
  }

  function HDgetSubjects(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/data/getSubjects", data, callback);
  }

  function HDqueryUsers(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/user", data, callback);
  }

  function HDqueryWarehouses(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/data/queryWarehouses", data, callback);
  }

  function HDquerygroups(data, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/data/groups", data, callback);
  }

  function HDqueryemployees(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/authenticates/employees", data, callback);
  }

  function HDqueryareas(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/data/areas", data, callback);
  }

  function HDqueryfloors(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/statement/floors", data, callback);
  }

  function HDquerybuildings(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/statement/buildings", data, callback);
  }

  function HDqueryequipments(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/data/equipments", data, callback);
  }

  function HDqueryMaterials(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/data/queryMaterials", data, callback);
  }

  function HDget_worktask(taskuuid, callback){
    var url = $.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/workRecord-task/"+taskuuid
    GET(url,undefined,callback);
  }

  function HDcreate_worktask(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/workRecord-task/create?"+extra, data, callback);
  }

  function HDsolve_worktask(version, taskuuid, extra, data, callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/workRecord-task/solve?id="+taskuuid+"&version="+version+"&"+extra, data, callback);
  }

  function HDdeliver_worktask(version, taskuuid, extra, data,callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/workRecord-task/deliver?id="+taskuuid+"&version="+version+"&"+extra, data, callback);
  }

  function HDcancel_worktask(version, taskuuid, extra, data,callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/workRecord-task/cancel?id="+taskuuid+"&version="+version+"&"+extra, data, callback);
  }

  function HDget_cleantask(taskuuid, callback){
    var url = $.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/cleanbill-task/"+taskuuid
    GET(url,undefined,callback);
  }
  function HDcreate_cleantask(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/cleanbill-task/create?"+extra, data, callback);
  }
  function HDsolve_cleantask(version, taskuuid, extra, data, callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/cleanbill-task/solve?id="+taskuuid+"&version="+version+"&"+extra, data, callback);
  }

  function HDdeliver_cleantask(version, taskuuid, extra, data,callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/cleanbill-task/deliver?id="+taskuuid+"&version="+version+"&"+extra, data, callback);
  }

  function HDcancel_cleantask(version, taskuuid, extra, data,callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/ifs/1/cleanbill-task/cancel?id="+taskuuid+"&version="+version+"&"+extra, data, callback);
  }

  function HDchange_password(user, data, callback) {
    PUT($.HDAPI.server + "/cre-agency-app-server/rest/1/authenticates/"+user+"/password",data,callback);
  }

  function HDget_contract(billtype, contractuuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/contract/"+billtype+"/"+contractuuid, undefined, callback);
  }

  function HDquery_contract(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/contract/query", data, callback);
  }

  function HDquery_user_process_permissions(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/process/allStartProcesses", data, callback);
  }

  function HDcreate_complaint(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/complaint/create?"+extra, data, callback);
  }

  function HDget_complaint(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/complaint/"+uuid, data, callback);
  }

  function HDsave_complaint(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/complaint/save?"+extra, data, callback);
  }

  function HDquery_complaint(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/complaint/query", data, callback);
  }

  function HDcreate_device(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/create?"+extra, data, callback);
  }

  function HDquery_device(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/query", data, callback);
  }

  function HDget_device(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/"+uuid, data, callback);
  }

  function HDsave_device(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/save?"+extra, data, callback);
  }

  function HDcreate_meterinput(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/meter/input/create?"+extra, data, callback);
  }

  function HDquery_meterinput(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/meter/input/query", data, callback);
  }

  function HDget_meterinput(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/meter/input/"+uuid, data, callback);
  }

  function HDquery_notice(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/notice/query", data, callback);
  }

  function HDget_notice(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/notice/"+uuid, undefined, callback);
  }

  function HDget_maintain_default_configuration(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/default?storeUuid="+uuid, undefined, callback);
  }

  function HDget_maintain_types(callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/types", undefined, callback);
  }

  function HDcreate_maintain(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/create?"+extra, data, callback);
  }

  function HDget_maintain(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/"+uuid, data, callback);
  }

  function HDsave_maintain(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/save?"+extra, data, callback);
  }

  function HDquery_maintain(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/query", data, callback);
  }

  function HDsignin_maintain(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/signIn", data, callback);
  }

  function HDassign_maintain(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/maintain/assign", data, callback);
  }

  function HDcreate_oper_inspect(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/oper-inspect/create?"+extra, data, callback);
  }

  function HDquery_oper_inspect(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/oper-inspect/query", data, callback);
  }

  function HDget_oper_inspect(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/oper-inspect/"+uuid, data, callback);
  }

  function HDsave_oper_inspect(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/oper-inspect/save?"+extra, data, callback);
  }

  function HDget_basic_devices(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/device/devices?storeUuid="+uuid, undefined, callback);
  }

  function HDget_basic_device(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/device/"+uuid, undefined, callback);
  }

  function HDget_inspect_items(category, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/device/inspectItems?category="+category, undefined, callback);
  }

  function HDget_meters(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/meter/meters?storeUuid="+uuid, undefined, callback);
  }

  function HDget_meter(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/meter/"+uuid, undefined, callback);
  }

  function HDget_materials(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/materials", data, callback);
  }

  function HDgetAllPayments(callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/sales/all-payments", undefined, callback);
  }

  function HDget_servicemen(callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/device/servicemans", undefined, callback);
  }

  function HDget_inspect_category(callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/oper-inspect/category", undefined, callback);
  }

  function HDget_inspect_category_detail(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/basic/oper-inspect/category/"+uuid, undefined, callback);
  }

  function HDquery_tenant(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/tenant/query", data, callback);
  }

  function HDget_tenant(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/tenant/"+uuid, data, callback);
  }

  function HDget_attachment(uuid, callback) {
    GET($.HDAPI.server + "/cre-agency-app-server/rest/1/media/"+uuid, undefined, callback);
  }

  function HDcreate_device_repair(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/repair/create?"+extra, data, callback);
  }

  function HDget_device_repair(uuid, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/repair/"+uuid, data, callback);
  }

  function HDsave_device_repair(extra, data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/repair/save?"+extra, data, callback);
  }

  function HDquery_device_repair(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/repair/query", data, callback);
  }

  function HDsignin_device_repair(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/repair/signIn", data, callback);
  }

  function HDassign_device_repair(data, callback) {
    POST($.HDAPI.server + "/cre-agency-app-server/rest/1/device/repair/assign", data, callback);
  }

}(window.jQuery));
