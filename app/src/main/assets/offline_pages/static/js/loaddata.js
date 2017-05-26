//商品列表

function goodssearch(key) {
    key = key ? key : $("#txtSearch").val();
    if (goodslist) {
        goodslist.setUrl(apiUrl + "order/products", {
            storeUuid: stores[0].uuid,
            tenantUuid: tenant.uuid,
            contractUuid: contracts[0].uuid,
            keyword: key
        }, true);
    }
    else {
        goodslist = $("#goodslist").paging({
            pagingUrl: apiUrl + "order/products",
            pagingType: "post",
            param: {
                storeUuid: stores[0].uuid,
                tenantUuid: tenant.uuid,
                contractUuid: contracts[0].uuid,
                keyword: key
            },
            onBind: function (sourceData) {
                if (sessionStorage.goods) {
                    var resultData = JSON.parse(sessionStorage.getItem("goods")).data;
                    for (var i = 0; i < resultData.length; i++) {
                        $("#chk" + resultData[i].code).prop("checked", true);   
                    }
                    sessionStorage.removeItem("goods");
                }
            }
        });
    }
}
//订单列表

function ordersearch() {
    var param = {
        storeUuid: stores[0].uuid,
        tenantUuid: tenant.uuid,
        contracts: [contracts[0].uuid]
    }
    if (/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test($("#txtSearch").val())) {
        param.customerTelephone = $("#txtSearch").val()
    }
    else {
        param.customerName = $("#txtSearch").val()
    }
    if (orderlist) {
        orderlist.setUrl(apiUrl + "order/orders", param, true);
    }
    else {
        orderlist = $("#orderlist").paging({
            pagingUrl: apiUrl + "order/orders",
            param: param,
            pagingType: "post"
        })
    }
}
function delOrder(uuid, isDetail, version) {
    var delConfirm = $.tooltip({
        type: tooltiptype.confirm,
        autoShow: true,
        content: "您确定要删除么？",
        title: "删除确认",
        confirm: function () {
            $.extendget({
                url: apiUrl + "order/remove?id=" + uuid + "&version=" + version,
                type: "DELETE",
                success: function (data) {
                    if (data.success) {
                        if (isDetail) {
                            //window.location.href = "order.html";
                            window.SYP.pageLink("订单列表", "order.html", -1);
                        }
                        else { 
                        delConfirm.close();
                        $("#goods" + uuid).remove();
                        }
                    }
                }
            })
        }
    })
}
//新增订单
function bindSessionData() {
    if (sessionStorage.getItem("order")) {
        var datas = JSON.parse(sessionStorage.getItem("order")).data;
        $("[name='customerName']").val(datas.name);
        $("[name='customerTelephone']").val(datas.phone);
        $("[name='boothTelephone']").val(datas.managephone);
        $("[name='receiptAddress']").val(datas.address)
        $("[name='gift']").val(datas.gift);
        $("[name='voucher']").val(datas.voucher);
        $("[name='remark']").val(datas.remark);
        $("[value='" + datas.deliveryMode + "']").prop("checked", true);
        $("#install").prop("checked", datas.install);
        sessionStorage.removeItem("order");
    }
    else {
        $("#txtboothTelephone").val(userinfo.telephone)
    }
}
function save() {
    if ($("#orderform").validate()) {
        var goods = [];
        var activitys = [];
        var prom = false;
        $(".activeitem:checked").each(function (i, v) {
            activitys.push({
                activityId: $(this).val(),
                promotionUuid: $(this).attr("promotionUuid"),
                contract: {
                    code: $(this).attr("contractcode"),
                    name: $(this).attr("contractname"),
                    uuid: $(this).attr("contractuuid"),
                },
                serialNumber: 0,
                discountAmount: 0,
                name: $(this).attr("activityName")
            })
            prom = true;
        })
        var discountRate = $(".cell").first().val();
        for (var i = 0; i < sourceData.length; i++) {
            goods.push({
                uuid: sourceData[i].uuid,
                code: sourceData[i].code,
                name: sourceData[i].name,
                specification: $("#txtspec" + sourceData[i].code).val(),
                model: $("#txtmodel" + sourceData[i].code).val(),
                grade: sourceData[i].grade,
                qty: $("#txtqty" + sourceData[i].code).val(),
                unit: sourceData[i].unit,
                price: sourceData[i].price,
                originalPrice: sourceData[i].originalPrice,
                stdTotal: $("#txtqty" + sourceData[i].code).val() * sourceData[i].price,
                remark: sourceData[i].remark,
                returnQty: sourceData[i].returnQty,
                returnTotal: sourceData[i].returnTotal,
                pdtUuid: sourceData[i].uuid,
                payedTotal: 0
            })
        }
        if (goods.length == 0) {
            $.tooltip({
                content: "请先返回选择商品",
                autoShow: true,
                autoHide: true,
            })
            return false;
        }
        var params = {
            bizState: "ineffect",
            tenant: {
                uuid: tenant.uuid,
                code: tenant.code,
                name: tenant.name
            },
            store: {
                uuid: stores[0].uuid,
                code: stores[0].code,
                name: stores[0].name
            },
            contract: {
                uuid: contracts[0].uuid,
                code: contracts[0].code,
                name: contracts[0].name
            },
            prom: prom,//是否促销？
            preActivities: activitys,
            lines: goods,
            fileIds: [],
            frozenState: "unfrozen",
            discountRate: discountRate,
            orderDate: $("#orderdate").val() + " " + $("#ordertime").val()
        }
        if ($("#install").is("checked")) {
            params.install = $("#install").val()
        }
        $("[name='paymentCategory']:checked").val() == "deposit" ? params.preDeposit = $("#preDeposit").val() : false;
        $("#orderform").formSubmit({
            url: apiUrl + "order/save?time=" + get_now_full() + '&operator.id=100295001&operator.fullname=月星家居常州店&operator.namespace=yx',
            pparam: params,
            success: function (data) {
                if (data.success) {
                    window.SYP.pageLink("订单列表", "order.html", -1);
                    //window.location.href = "order.html";
                }
            }
        })
    }
}
function uploadImg() {
    var time = new Date().getTime();
    var str = "<div class='boarditem_c_i cols-margin-4 relative' code='" + time + "'>";
    str += "<span class='closeico ico del absolute' onclick='delPic(" + time + ")'></span>";
    str += "<img src='static/images/1.jpg' id='img" + time + "' code='" + time + "' />";
    str += "<input id='img" + time + "' type='hidden' /></div>";
    $("#piclist").prepend($(str));
    $.rows({
        control: $("#piclist")
    })
}

//订单详情
function bindOrderDetail() {
    $("#detail").bindData({
        url: apiUrl + "order/" + getQueryString("id"),
        dataColumn: "body",
        onBind: function (data) {
            goodsData = data.lines;
            activityData = data.preActivities;
            for (var i = 0; i < goodsData.length; i++) {
                goodsData[i].stdTotal1 = goodsData[i].stdTotal;
            }
            $("#goodslist").bindData({
                data: goodsData,
                dataColumn: ""
            })
            $("#countnum").text(goodsData.length);
            $("#countmoney").text(data.stdTotal);
            if (activityData.length > 0) {
                $("#activitylist").bindData({
                    data: activityData,
                    dataColumn: ""
                })
            }
            else {
                $("#activityboard").remove();
            }

        }
    })
}