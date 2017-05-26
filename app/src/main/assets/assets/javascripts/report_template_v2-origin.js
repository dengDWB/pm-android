/* jslint plusplus: true */
/* global
     $:false,
     ReportTemplateV2:false,
     TemplateData:false,
     echarts:false
*/
/*
 * version: 2.0.0
 * author: jay_li@intfocus.com
 * date: 16/04/23
 *
 * ## change log:
 *
 * ### 16/05/08:
 *
 * - add: echart component type#`pie`
 * - fixed: tab switch with hidden other tab-part-*
 *
 * ### 16/12/23
 *
 * fixed: SingleValue 计算值小数位未约束，导致爆屏
 *
 */

(function(){

  "use strict";

  window.ReportTemplateV2 = {
    charts: [],
    tableSort : {},
    toThousands: function(num) {
        var num = Number(num).toFixed(2).toString(),
            result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }

        result = result.replace(",.", ".");
        return result.replace("-,", "-");
    },
    screen: function() {
        var w = window,
        d = document,
        e = d.documentElement,
        obj = {}; // new Object(); // The object literal notation {} is preferable.
        obj.width = w.innerWidth || e.innerWidth;
        obj.height = w.innerHeight || e.innerHeight;
        return obj;
    },
    modal: function(ctl) {
        var date1 = new Date().getTime(),
            $modal = $("#ReportTemplateV2Modal");

        $modal.modal("show");
        $modal.find(".modal-title").html($(ctl).data("title"));
        $modal.find(".modal-body").html($(ctl).data("content"));

        var date2 = new Date().getTime(),
            dif = date2 - date1;
        console.log("duration: " + dif);
    },
    outerApi: function(ctl) {
      var $modal = $("#ReportTemplateV2Modal"),
          url = $(ctl).data("url"),
          split = url.indexOf("?") > 0 ? "&" : "?";

      url = url + split + $(ctl).data("params");

      $modal.modal("show");
      $modal.find(".modal-title").html($(ctl).data("title"));

      $.ajax({
        type: "GET",
        url: url,
        success:function(result, status, xhr) {
          $modal.find(".modal-body").html("loading...");

          try {
              var contentType = xhr.getResponseHeader("content-type") || "default-not-set",
                  table = "<table id='modalContentTable' class='table'><tbody>";

              $("#contentType").html(contentType);
              if(contentType.toLowerCase().indexOf("application/json") < 0) {
                table = table + "<tr><td style='width:30%;'>提示</td><td style='width:70%;'>content-type 有误</td></tr>";
                table = table + "<tr><td style='width:30%;'>期望值</td><td style='width:70%;'>application/json</td></tr>";
                table = table + "<tr><td style='width:30%;'>响应值</td><td style='width:70%;'>" + contentType + "</td></tr>";
                table = table + "</tbody></table>";

                $modal.find(".modal-body").html(table);
                return;
              }

              var json = JSON.parse(JSON.stringify(result)),
                  regPhone1 = /^1\d{10}$/,
                  regPhone2 = /^0\d{2,3}-?\d{7,8}$/,
                  regEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

              if(result === null || result.length === 0) {
                table = table + "<tr><td style='width:30%;'>响应</td><td style='width:70%;'>内容为空</td></tr>"
                table = table + "<tr><td style='width:30%;'>链接</td><td style='width:70%;word-break:break-all;'>" + url + "</td></tr>"
              }

              for(var key in json) {
                var value = json[key];
                if(regPhone1.test(value) || regPhone2.test(value)) {
                  value = "<a class='sms' href='tel:" + value + "'>" + value + "</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                          "<a class='tel' href='sms:" + value + "'> 短信 </a>";
                }
                else if(regEmail.test(value)) {
                  value = "<a class='mail' href='mailto:'" + value + "'>" + value + "</a>";
                }
                table = table + "<tr><td style='width:30%;'>" + key + "</td><td style='width:70%;'>" +value + "</td></tr>";
              }
              table = table + "</tbody></table>";

              $modal.find(".modal-body").html(table);
          } catch (e) {
              console.log(e);
              $modal.find(".modal-body").html("response:\n" + JSON.stringify(result) + "\nerror:\n" + e);
          }

          // modal width should equal or thinner than screen
          var width = ReportTemplateV2.screen().width - 10;
          $("#modalContentTable").css("max-width", width + "px");
        },
        error:function(XMLHttpRequest, textStatus, errorThrown) {
              $modal.find(".modal-body").html("GET " + url + "<br>状态:" + textStatus + "<br>报错:" + errorThrown);
        }
      });
    },
    checkArrayForChart: function(array) {
        for(var index = 0, len = array.length; index < len; index ++) {
          if(array[index] === null) {
            array[index] = undefined;
          }
        }
        return array;
    },
    createArrayReleated: function(tableRows){
      var resetArray = [];
      for(var rowIndex = 0, rowLen = tableRows.length; rowIndex < rowLen; rowIndex ++) {
         var val = tableRows[rowIndex];
         if(tableRows[rowIndex][0] === 1){ resetArray.push(val); }
         if(tableRows[rowIndex][0] === 2){
            if(resetArray[resetArray.length-1]['children'] === undefined){  resetArray[resetArray.length-1]['children'] = []; }
            resetArray[resetArray.length-1]['children'].push(val);
         }
         if(tableRows[rowIndex][0] === 3){
            if(resetArray[resetArray.length-1]['children'][resetArray[resetArray.length-1]['children'].length-1]['children'] === undefined){ resetArray[resetArray.length-1]['children'][resetArray[resetArray.length-1]['children'].length-1]['children'] = []; }
            resetArray[resetArray.length-1]['children'][resetArray[resetArray.length-1]['children'].length-1]['children'].push(val);
         }
      }
      return resetArray;
    },
    orderByTableList: function(tableid,field) {
       var array = tableid.split("_");
       window.ReportTemplateV2.tableSort[tableid] = field;
       if($.isArray(array) && array.length == 3){
          var tabObj = window.TemplateData.templates[array[0]].parts[array[1]].config[array[2]];
          var tableInnerHTML = ReportTemplateV2.generateTableV2(tabObj.table.head, tabObj.table.data, tabObj.outer_api, array[0]+"_"+array[1]+"_"+array[2]);
          $("#tb_"+tableid).empty().html(tableInnerHTML);
       }
    },
    generateTableTrV2: function(deep, maxDeep, outerApi, row, i_t) {
      var isOuterAapi = (typeof(outerApi) !== 'undefined'),
          rowString;
      for(var dataIndex = 1, dataLen = row.length; dataIndex < dataLen; dataIndex ++) {
          var data = row[dataIndex];
          if(isOuterAapi && deep === maxDeep && outerApi.target === dataIndex) {
            data = "<a href='javascript:void(0);' onclick='ReportTemplateV2.outerApi(this);' style='text-decoration: underline;'" +
                   "data-title='" + data + "' " +
                   "data-url='" + outerApi.url + "' " +
                   "data-params='" + outerApi.data[i_t] + "'>" + data +
                   "</a>";
          }
          if(dataIndex === 1) {
            var tabtd = row['children'] !== undefined ? "<a href='javascript:;' data-id='"+i_t+"' class='table-more table-more-closed'><span class='icon'></span><span class='text'>"+data+"</span></a>" : data;
            var hasChildClass = row['children'] !== undefined ? " hasChild" : "";
            i_t += "";
            var i_t_array = i_t.indexOf("_")?i_t.split('_'):i_t;
            if(deep === 1){
                rowString = "<tr class='trfirstlev'><td>"+tabtd+"</td>";
            }
            if(deep === 2){
                rowString = "<tr class='tr-item-"+i_t_array[0]+hasChildClass+" trtwolev' style='display:none'><td>"+tabtd+"</td>";
            }
            if(deep === 3){
                rowString = "<tr class='tr-item-"+i_t_array[0]+"_"+i_t_array[1]+hasChildClass+" trthreelev' style='display:none'><td>" + tabtd + "</td>";
            }
          }
          else {
            rowString += "<td>" + data + "</td>";
          }
        }
        rowString += "</tr>";
        return rowString;
    },
    generateTableV2: function(heads, rows, outerApi, tableid) {
      var newRows = ReportTemplateV2.createArrayReleated($.extend(true, [], rows)), fieldsort, fieldby;
      //
      // fixed: 初始化状态，以服务器端 `num` 排序
      //
      // var newRows = newRows.sortBy(window.ReportTemplateV2.tableSort[tableid]);
      var newRows = newRows.sortBy(window.ReportTemplateV2.tableSort[tableid]);
      if(window.ReportTemplateV2.tableSort[tableid][0] == '-'){
        fieldsort = window.ReportTemplateV2.tableSort[tableid].substr(1);
        fieldby= ''
      } else {
        fieldsort = window.ReportTemplateV2.tableSort[tableid];
        fieldby='-';
      }
      var tmpArray = [],
          isOuterAapi = (typeof(outerApi) !== 'undefined'),
          htmlString;
      for(var index = 1, len = heads.length; index <= len; index ++) {
        var sortby = index == fieldsort ? fieldby+index:index;
        var sorttg = '';
        if(index == fieldsort) {
            sorttg = fieldby == '-' ? '↑':'↓';
        }
        tmpArray.push('<a href="javascript:void(0);" onclick="ReportTemplateV2.orderByTableList(\''+tableid+'\', \''+sortby+'\')" >'+heads[index-1]+sorttg+'</a>');
      }
      htmlString = "<thead><th>" + tmpArray.join("</th><th>") + "</th></thead>";
      // level maximum deep
      var maxDeep = 1;
      for(var rowIndex = 0, rowLen = newRows.length; rowIndex < rowLen; rowIndex++) {
        if(maxDeep == 3) continue;

        if(newRows[rowIndex]['children'] != undefined && newRows[rowIndex]['children'].length>0){
          maxDeep = 2;
        }
        if(newRows[rowIndex]['children'] !== undefined) {
          for(var rowIndex2 = 0, rowLen2 = newRows[rowIndex]['children'].length; rowIndex2 < rowLen2; rowIndex2++) {
            if(newRows[rowIndex]['children'][rowIndex2]['children'] != undefined && newRows[rowIndex]['children'][rowIndex2]['children'].length > 0) {
              maxDeep = 3;
            }
          }
        }
      }
      console.log('table ' + tableid + ' deep: ' + maxDeep);
      // clear array
      tmpArray.length = 0;
      for(var rowIndex = 0, rowLen = newRows.length; rowIndex < rowLen; rowIndex++) {
        if(newRows[rowIndex]['children'] != undefined && newRows[rowIndex]['children'].length>0){
          newRows[rowIndex]['children'] = newRows[rowIndex]['children'].sortBy(window.ReportTemplateV2.tableSort[tableid]);
        }
        tmpArray.push(ReportTemplateV2.generateTableTrV2(1, maxDeep, outerApi, newRows[rowIndex], rowIndex));
         if(newRows[rowIndex]['children'] !== undefined) {
            for(var rowIndex2 = 0, rowLen2 = newRows[rowIndex]['children'].length; rowIndex2 < rowLen2; rowIndex2++) {
              if(newRows[rowIndex]['children'][rowIndex2]['children'] != undefined && newRows[rowIndex]['children'][rowIndex2]['children'].length > 0) {
                newRows[rowIndex]['children'][rowIndex2]['children'] = newRows[rowIndex]['children'][rowIndex2]['children'].sortBy(window.ReportTemplateV2.tableSort[tableid]);
              }
              tmpArray.push(ReportTemplateV2.generateTableTrV2(2, maxDeep, outerApi, newRows[rowIndex]['children'][rowIndex2], rowIndex+'_'+rowIndex2));
              if(newRows[rowIndex]['children'][rowIndex2]['children'] !== undefined) {
                 for(var rowIndex3 = 0, rowLen3 = newRows[rowIndex]['children'][rowIndex2]['children'].length; rowIndex3 < rowLen3; rowIndex3++) {
                    tmpArray.push(ReportTemplateV2.generateTableTrV2(3, maxDeep, outerApi, newRows[rowIndex]['children'][rowIndex2]['children'][rowIndex3], rowIndex+'_'+rowIndex2+'_'+rowIndex3));
                 }
              }
            }
         }
      }
      htmlString += "<tbody>" + tmpArray.join("") + "</tbody>";
      return htmlString;
    },
    generateTablesV2: function(outerIndex, innerIndex, tabs, partsindex) {
      var tabIndex = (new Date()).valueOf() + outerIndex * 1000 + innerIndex,
          tmpArray = [],
          htmlString, i, len;

      for(i = 0, len = tabs.length; i < len; i ++) {
        tmpArray.push("<li class='" + (i === 0 ? "active" : "") + "'>\
                        <a data-toggle='tab' href='#tab_" + tabIndex + "_" + i + "'>" + tabs[i].title + "</a>\
                      </li>");
      }
      htmlString = "<ul class='nav nav-tabs' style='background-color:#2ec7c9;'>" +
                     tmpArray.join("") +
                   "</ul>";
      // clear array
      tmpArray.length = 0;
      for(i = 0, len = tabs.length; i < len; i ++) {
        window.ReportTemplateV2.tableSort[outerIndex+"_"+partsindex+"_"+i] = "1";
        tmpArray.push("<div id='tab_" + tabIndex + "_" + i + "' class='tab-pane animated fadeInUp " + (i === 0 ? "active" : "") + "'>\
                        <div class='row'  style='margin-left:0px;margin-right:0px'>\
                          <div class='col-lg-12' style='padding-left:0px;padding-right:0px'>\
                            <table data-config='"+i+"' id='tb_"+outerIndex+"_"+partsindex+"_"+i+"' class='table table-striped table-bordered table-hover'>"
                              + ReportTemplateV2.generateTableV2(tabs[i].table.head, tabs[i].table.data, tabs[i].outer_api, outerIndex+"_"+partsindex+"_"+i) +
                            "</table>\
                          </div>\
                        </div>\
                      </div>");
      }
      htmlString += "<div class='tab-content tabs-flat no-padding'>" +
                      tmpArray.join("") +
                    "</div>";

      return "\
      <div class='row tab-part tab-part-" + outerIndex + "'  style='margin-left:0px;margin-right:0px'>\
        <div class='col-xs-12'  style='padding-left:0px;padding-right:0px'>\
          <div class='dashboard-box'>\
            <div class='box-tabbs'>\
              <div class='tabbable'>"
                + htmlString + "\
              </div>\
              \
            </div>\
          </div>\
        </div>\
      </div>";
    },
    generateTable: function(heads, rows, outerApi) {
      var tmpArray = [],
          isOuterAapi = (typeof(outerApi) !== 'undefined'),
          htmlString;

      for(var index = 0, len = heads.length; index < len; index ++) {
        tmpArray.push(heads[index]);
      }
      htmlString = "<thead><th>" + tmpArray.join("</th><th>") + "</th></thead>";
      // clear array
      tmpArray.length = 0;
      for(var rowIndex = 0, rowLen = rows.length; rowIndex < rowLen; rowIndex ++) {
        var row = rows[rowIndex],
            isRoot = (row[0] === 1 || row[0] === "1"),
            rowString;

        for(var dataIndex = 1, dataLen = row.length; dataIndex < dataLen; dataIndex ++) {
          var data = row[dataIndex];

          if(isOuterAapi && !isRoot && outerApi.target === dataIndex) {
            data = "<a href='javascript:void(0);' onclick='ReportTemplateV2.outerApi(this);' " +
                   "data-title='" + data + "' " +
                   "data-url='" + outerApi.url + "' " +
                   "data-params='" + outerApi.data[rowIndex] + "'>" + data +
                   "</a>";
          }
          if(dataIndex === 1) {
            rowString = (isRoot ? "\
              <tr>\
                <td>\
                  <a href='#' class='table-more table-more-closed'>"
                    + data +
                  "</a>\
                </td>"
                :
              "<tr class='more-items' style='display:none'> \
                <td>&nbsp;&nbsp;&nbsp;"
                  + data +
                "</td>");
          }
          else {
            rowString += "<td>" + data + "</td>";
          }
        }
        rowString += "</tr>";

        tmpArray.push(rowString);
      }
      htmlString += "<tbody>" + tmpArray.join("") + "</tbody>";

      return htmlString;
    },
    generateTables: function(outerIndex, innerIndex, tabs) {
      var tabIndex = (new Date()).valueOf() + outerIndex * 1000 + innerIndex,
          tmpArray = [],
          htmlString, i, len;

      for(i = 0, len = tabs.length; i < len; i ++) {
        tmpArray.push("<li class='" + (i === 0 ? "active" : "") + "'>\
                        <a data-toggle='tab' href='#tab_" + tabIndex + "_" + i + "'>" + tabs[i].title + "</a>\
                      </li>");
      }
      htmlString = "<ul class='nav nav-tabs' style='background-color:#2ec7c9;'>" +
                     tmpArray.join("") +
                   "</ul>";

      // clear array
      tmpArray.length = 0;
      for(i = 0, len = tabs.length; i < len; i ++) {
        tmpArray.push("<div id='tab_" + tabIndex + "_" + i + "' class='tab-pane animated fadeInUp " + (i === 0 ? "active" : "") + "'>\
                        <div class='row'  style='margin-left:0px;margin-right:0px'>\
                          <div class='col-lg-12' style='padding-left:0px;padding-right:0px'>\
                            <table class='table table-striped table-bordered table-hover'>"
                              + ReportTemplateV2.generateTable(tabs[i].table.head, tabs[i].table.data, tabs[i].outer_api) +
                            "</table>\
                          </div>\
                        </div>\
                      </div>");
      }
      htmlString += "<div class='tab-content tabs-flat no-padding'>" +
                      tmpArray.join("") +
                    "</div>";

      return "\
      <div class='row tab-part tab-part-" + outerIndex + "'  style='margin-left:0px;margin-right:0px'>\
        <div class='col-xs-12'  style='padding-left:0px;padding-right:0px'>\
          <div class='dashboard-box'>\
            <div class='box-tabbs'>\
              <div class='tabbable'>"
                + htmlString + "\
              </div>\
              \
            </div>\
          </div>\
        </div>\
      </div>";
    },

    // after require echart.js
    // `innerIndex` = outerIndex * index
    generateChart: function(outerIndex, innerIndex, config) {
      ReportTemplateV2.charts.push({ index: innerIndex, options: ReportTemplateV2.generateChartOptions(config) });
      return "\
      <div class='row tab-part tab-part-" + outerIndex + "'  style='margin-left:0px;margin-right:0px'>\
        <div class='widget'>\
          <div class='widget-body'>\
            <div class='row'>\
              <div class='col-sm-12'  style='padding-left:0px;padding-right:0px'>\
                <div id='template_chart_" + innerIndex + "' class='chart chart-lg'></div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>";
    },
    generateChartOptions: function(option) {
      var chart_type = option.chart_type,
          chart_option;
      if(chart_type === 'pie') {
        chart_option = {
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              x: 'left',
              data: option.legend
          },
          series: [
            {
              name:option.title,
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              // itemStyle: {
              //     normal: {
              //         shadowBlur: 200,
              //         shadowColor: 'rgba(0, 0, 0, 0.5)'
              //     }
              // },
              data: option.data
            }
          ]
        };
        console.log(JSON.stringify(chart_option));
      }
      else {
        var seriesColor = ['#96d4ed', '#fe626d', '#ffcd0a', '#fd9053', '#dd0929', '#016a43', '#9d203c', '#093db5', '#6a3906', '#192162'];
        for(var i = 0, len = option.series.length; i < len; i ++) {
            option.series[i].data = ReportTemplateV2.checkArrayForChart(option.series[i].data);
            option.series[i].itemStyle = { normal: { color: seriesColor[i] } };
        }
        var yAxis;
        for(var i = 0, len = option.yAxis.length; i < len; i ++) {
           yAxis = option.yAxis[i];
           yAxis.nameTextStyle = { color:'#323232' /*cbh*/ };
           option.yAxis[i] = yAxis;
        }
        chart_option = {
          tooltip : {
              trigger: 'axis'
          },
          legend: {
              x: 'center',
              y: 'top',
              padding: 5,    // [5, 10, 15, 20]
              data: option.legend
          },
          toolbox: {
              show : false,
              x: 'right',
              y: 'top',
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: false}
              }
          },
          calculable: true,
          grid: {
            show:true,
            backgroundColor:'transparent',
            y: 80, y2:20, x2:10, x:40
          },
          xAxis : [
             {
                  type : 'category',
                  boundaryGap : true,
                  splitLine:{
                    show:false,
                  },
                  axisTick: {
                    show:false,/*cbh*/
                  },
                  data : option.xAxis
              }
          ],
          yAxis : option.yAxis,
          series : option.series
        };
      }

      return chart_option;
    },
    generateBanner: function(outerIndex, innerIndex, config) {
      var modelTitle = "说明";
      if(config.title.length) {
        modelTitle = config.title;
      }
      return "\
      <div class='row tab-part tab-part-" + outerIndex + "' style='margin-left:0px;margin-right:0px'>\
          <div class='col-lg-12 col-sm-12 col-xs-12' style='padding-left:0px;padding-right:0px'>\
            <div class='databox radius-bordered bg-white' style='height:100%;'>\
              <div class='databox-row'>\
                <div class='databox-cell cell-12 text-align-center bordered-right bordered-platinum' style='min-height:40px;'>\
                  \
                  <div class='databox-stat radius-bordered bg-qin' style='color:#fff;left:7px;right:initial;'>\
                    <div class='stat-text'>"
                      + config.date + "\
                    </div>\
                  </div>\
                  <span class='databox-number lightcarbon'> "
                    + config.title + "\
                  </span>\
                  <span class='databox-number sonic-silver no-margin'>"
                    + config.subtitle + "\
                  </span>\
                  \
                  <div class='databox-stat '>\
                    <div class='stat-text'>\
                      <a href='javascript:void(0);'  onclick='ReportTemplateV2.modal(this);' data-title='" + modelTitle + "' data-content='" + config.info + "'>" + "\
                        <span style='font-size:20px;' class='qin glyphicon glyphicon-search'></span>\
                      </a>\
                    </div>\
                  </div>\
                  <div class='databox-stat '>\
                    <div class='stat-text'>\
                      <a href='javascript:void(0);'  onclick='ReportTemplateV2.modal(this);' data-title='" + modelTitle + "' data-content='" + config.info + "'>" + "\
                        <span style='font-size:20px;' class='qin glyphicon glyphicon-info-sign'></span>\
                      </a>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            </div>\
          </div>\
      </div>";
    },
    generateSingleValue: function(outerIndex, innerIndex, config) {
      var part_trend_value_diff = config.main_data.data - config.sub_data.data;
      var part_trend_value_perc = part_trend_value_diff / config.main_data.data;

      return "\
        <div class='row tab-part tab-part-" + outerIndex + "' style='margin-left:0px;margin-right:0px'>\
          <div class='container-fluid area'>\
            <div class='row'>\
              <div class='col-xs-12'>\
                <div class='block'>\
                  <header data-part-id='block-title' class='block-header'>\
                    <div class='triangle triangle-" + config.state.arrow + "' style='color:" + config.state.color +"'>\
                    </div>\
                    <div class='block-title'>"
                      + config.title + "\
                    </div>\
                  </header>\
                  <div class='body-content-wrapper'>\
                    <div class='labels-container block-body'>\
                      <div class='tap-area-1' style='display:block;'>\
                        <div class='field-label' style='color:" + config.state.color +"'>"
                          + config.main_data.name + "\
                        </div>\
                        <div class='total-label'>"
                          + config.sub_data.name +"\
                        </div>\
                      </div>\
                      <div class='tap-area-2' style='display:block;'>\
                        <div class='field-value-label' style='color:" + config.state.color +"'>"
                          + ReportTemplateV2.toThousands(config.main_data.data) +"\
                        </div>\
                        <div class='total-value-label' style='color:" + config.state.color +"'>"
                          + ReportTemplateV2.toThousands(config.sub_data.data) + "\
                        </div>\
                      </div>\
                      <div class='field-percent-label'>\
                        <div class='trent-wrapper' style='display:inline-block'>\
                          <span class='part-trent-value' style='color:" + config.state.color +"'>"
                            + ReportTemplateV2.toThousands(part_trend_value_diff) +"\
                          </span>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>";
    },
    generateInfo: function(outerIndex, innerIndex, config) {
      // return "\
      // <div class='row tab-part tab-part-" + outerIndex + "' style='margin-left:0px;margin-right:0px'>\
      //     <div class='col-lg-12 col-sm-12 col-xs-12' style='padding-left:0px;padding-right:0px'>\
      //       <div class='databox radius-bordered bg-white' style='height:100%;'>\
      //         <div class='databox-row'>\
      //           <div class='databox-cell cell-12 text-align-center bordered-right bordered-platinum' style='min-height:40px;'>\
      //             <span class='databox-number sonic-silver no-margin' style='font-size:13px'>"
      //               + config.text + "\
      //             </span>\
      //           </div>\
      //         </div>\
      //       </div>\
      //     </div>\
      // </div>";

      return "<h5 class='row-title before-qin'>" + config.text + "</h5>";
    },
    generateTemplate: function(outerIndex, template) {
      var parts = template.parts,
          htmlString = "",
          i, len, innerIndex;
      for(i = 0, len = parts.length; i < len; i ++) {
        var part_type = parts[i].type;
        innerIndex = outerIndex * 1000 + i;
        if(part_type === 'banner') {
          htmlString += ReportTemplateV2.generateBanner(outerIndex, innerIndex, parts[i].config);
        }
        else if(part_type === 'single_value') {
          htmlString += ReportTemplateV2.generateSingleValue(outerIndex, innerIndex, parts[i].config);
        }
        else if(part_type === 'tables') {
          htmlString += ReportTemplateV2.generateTablesV2(outerIndex, innerIndex, parts[i].config, i);
        }
        else if(part_type === 'chart') {
          htmlString += ReportTemplateV2.generateChart(outerIndex, innerIndex, parts[i].config);
        }
        else if(part_type === 'info') {
          htmlString += ReportTemplateV2.generateInfo(outerIndex, innerIndex, parts[i].config);
        }
      }
      return htmlString;
    },
    generateTemplates: function(templates) {
      var tabNav = document.getElementById("tabNav"),
          tabContent = document.getElementById("tabContent"),
          colNum = parseInt(12 / templates.length),
          template,
          i, len;

      for(i = 0, len = templates.length; i < len; i ++) {
        template = templates[i];

        tabNav.innerHTML += "\
          <div class='col-lg-" + colNum + " col-md-" + colNum + " col-sm-" + colNum + " col-xs-" + colNum + "'>\
            <a class='day-container " + (i === 0 ? "highlight" : "") + "' data-index=" + i + ">\
              <div class='day'>"
                + template.title + "\
              </div>\
            </a>\
          </div>";

        tabContent.innerHTML += ReportTemplateV2.generateTemplate(i, template);
      }

      var chartOptions = ReportTemplateV2.charts, chart, chart_id;
      for(i = 0, len = chartOptions.length; i < len; i ++) {
        chart_id = document.getElementById("template_chart_" + chartOptions[i].index);
        if(/3\.1\.\d+/.test(echarts.version)) {
          chart = echarts.init(chart_id, 'macarons');
          console.log('tempalte engine v2: echart ~> 3.1+');
        }
        // "2.2.7"
        else {
          chart = echarts.init(chart_id);
          chart.setTheme('macarons');
          console.log('tempalte engine v2: echart <~ 3.1+');
        }
        chart.setOption(chartOptions[i].options);
      }

      // echarts will not work when its container has 'hidden' class
      for(i = 1, len = templates.length; i < len; i ++) {
        $('.tab-part-' + i).addClass('hidden');
      }

      var modalHtml = '\
        <div class="modal fade in" id="ReportTemplateV2Modal">\
          <div class="modal-dialog">\
            <div class="modal-content">\
              <div class="modal-header">\
                <button aria-label="Close" class="close" data-dismiss="modal" type="button">\
                  <span aria-hidden="true"> ×</span>\
                </button>\
                <h4 class="modal-title">...</h4>\
              </div>\
              <div class="modal-body">\
              loading...\
              </div>\
              <div class="modal-footer">\
                <span id="contentType" style="line-height:34px;width:50%;text-align:left;float:left;color:silver;"></span>\
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>\
              </div>\
            </div>\
          </div>\
        </div>';

      $(modalHtml).appendTo($("body"));

      // fixed: tab 下表格内容过长而导致样式上的屏幕溢出
      $(".tab-pane table").css({
        "table-layout": "fixed",
        "word-break": "break-all",
        "max-width": ReportTemplateV2.screen().width + "px"
      });
    },
    setSearchItems: function() {
      var items = [];
      for(var i = 0, len = window.TemplateDatas.length; i < len; i++) {
        items.push(window.TemplateDatas[i].name);
      }

      window.MobileBridge.setSearchItems(items);
    }
  }
}).call(this)

window.onerror = function(e) {
  window.alert(e);
}
$(function() {
  ReportTemplateV2.setSearchItems();
  MobileBridge.getReportSelectedItem(function(selectedItem) {
    if(selectedItem && selectedItem.length) {
      window.TemplateDataConfig.selected_item = selectedItem;
      for(var i = 0, len = window.TemplateDatas.length; i < len; i ++) {
        if(window.TemplateDatas[i].name === selectedItem) {
          window.TemplateData.templates = window.TemplateDatas[i].data;
          break;
        }
      }
    }
    ReportTemplateV2.generateTemplates(window.TemplateData.templates);
    //ReportTemplateV2.caculateHeightForTable(".tab-part-0");
    $('a.table-more').each(function() {
      /* var $this = $(this),
                $currentRow = $this.closest('tr'),
                items = $currentRow.nextUntil('tr[class!=more-items]').map(function(){ return 1; }).get();

            if(items === undefined || items.length === 0) {
                $this.addClass('table-more-without-children');
            }*/
    });
    $(document).on("click","a.table-more",function(e) {
      e.preventDefault()
      var $this = $(this),
          $currentRow = $this.closest('tr');
          $currentRow.siblings(".tr-item-"+$(this).attr('data-id')).each(function(e){
            if($(this).is(":hidden")){
              if($(this).hasClass("hasChild") && !$(this).find('a.table-more').hasClass('table-more-closed')){
                $(this).siblings("tr[class='tr-item-"+$(this).find('a.table-more').attr('data-id')+" trthreelev']").show();
              }
              $(this).show();
            } else {
              if($(this).hasClass("hasChild") && !$(this).find('a.table-more').hasClass('table-more-closed')){
                $(this).siblings("tr[class='tr-item-"+$(this).find('a.table-more').attr('data-id')+" trthreelev'] ").hide();
              }
              $(this).hide();
            }
          });
      //$currentRow.nextUntil('tr[class!=more-items]').toggle();
      $this.toggleClass('table-more-closed');
    });

    $('a.day-container').click(function(el) {
      el.preventDefault();

      $(".day-container").removeClass("highlight");
      $(this).addClass("highlight");

      var tabIndex = $(this).data("index");
      var klass = ".tab-part-" + tabIndex;
      $(".tab-part").addClass("hidden");
      $(klass).removeClass("hidden");
      //ReportTemplateV2.caculateHeightForTable(klass);
    });
  });
});

Array.prototype.sortBy = function() {
    function _sortByAttr(attr) {
        var sortOrder = 1;
        if (attr[0] == "-") {
            sortOrder = -1;
            attr = attr.substr(1);
        }
        return function(a, b) {
            var cp_a = a[attr], cp_b = b[attr];
            cp_a = (typeof cp_a == 'string' && cp_a.substr(-1) == '%')?cp_a.substr(0,cp_a.length-1) * 1:cp_a;
            cp_b = (typeof cp_b == 'string' && cp_b.substr(-1) == '%')?cp_b.substr(0,cp_b.length-1) * 1:cp_b;
            var result = (cp_a < cp_b) ? -1 : (cp_a > cp_b) ? 1 : 0;
            return result * sortOrder;
        }
    }
    function _getSortFunc() {
        if (arguments.length == 0) {
            throw "Zero length arguments not allowed for Array.sortBy()";
        }
        var args = arguments;
        return function(a, b) {
            for (var result = 0, i = 0; result == 0 && i < args.length; i++) {
                result = _sortByAttr(args[i])(a, b);
            }
            return result;
        }
    }
    return this.sort(_getSortFunc.apply(null, arguments));
}
