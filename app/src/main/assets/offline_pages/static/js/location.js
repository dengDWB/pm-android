/**
     * 创建地址下拉选择框使用之前，请将sitedata.js加载进来
     * @param object targ 创建位置，<p>可以为id号，也可以为jquery选择符
     * 格式[province,area,county]
     * province为省，area为地区，county为县
     * @param object addr 初始化地址<p>
     * 格式为[province,area,county]
     * province为省，area为地区，county为县
	 *@author:norkts
	 *@copyright:no
     *@email:norkts@zju.edu.cn
     *@date:2011-11-03
  */

function siteSelect(targ,addr)
{
	// var $=$||function(id){var elm=[];elm[0]=document.getElementById(id.replace("#","")); return elm;};//检查是否加载jquery，否则添加$函数
	//查找select目标
    targ[0]=$('#'+targ[0])[0];
    targ[1]=$('#'+targ[1])[0];
    targ[2]=$('#'+targ[2])[0];
	if(!targ[0] || !targ[1] || !targ[2] || !arrCity)
	{
		alert("未定义位置或未引入js");
		return false;//如果目标元素不存在或sitedata.js未引入则退出
	}


	//列出省
    function provList()
    {
        for(var name in arr)
        {
            var opt=document.createElement("option");
            opt.value=arr[name]["name"];
            if(opt.value=="请选择")
            {
                opt.value="";
            }
            opt.text=arr[name]["name"];
            if(arr[name]["name"]==addr[0])
            {
                opt.selected="selected";
                provIndex=name;//输出值
            }
            try{
                provinceSel.add(opt,null);
            }catch(ex){
                provinceSel.add(opt);
            }
        }
    }
	
	//列出区、市
    function areaList()
    {
        for(var name in arr)
        {
            var opt=document.createElement("option");
            opt.value=arr[name]["name"];
            if(opt.value=="请选择")
            {
                opt.value="";
            }
            opt.text=arr[name]["name"];
            if(arr[name]["name"]==addr[1])
            {
                opt.selected="selected";
                areaIndex=name;//输出值
            }
            try{
                areaSel.add(opt,null);
            }catch(ex){
                areaSel.add(opt);
            }
        }
    }

	//列出县、市
    function countyList()
    {
        for(var name in arr)
        {
            if (arr[name]["name"] =='市辖区') continue;
            var opt=document.createElement("option");
            opt.value=arr[name]["name"];
            if(opt.value=="请选择")
            {
                opt.value="";
            }
            opt.text=arr[name]["name"];

            if(arr[name]["name"]==addr[2])
            {
                opt.selected="selected";
                countyIndex=name;
            }
            try{
                countySel.add(opt,null);
            }catch(ex){
                countySel.add(opt);
            }
        }
    }

    var provinceSel=targ[0];
	provinceSel.innerHTML="";//删除所有已设置的option
    var provIndex=0;
	var siteData=arrCity;
    var arr=siteData;
    provList();

    var areaSel=targ[1];
	areaSel.innerHTML="";//删除所有已设置的option
    var areaIndex=0;
    arr=siteData[provIndex]["sub"];
    areaList();

    var countySel=targ[2];
	countySel.innerHTML="";//删除所有已设置的option
    var countyIndex=0;
    arr=siteData[provIndex]["sub"][areaIndex]["sub"];
    countyList();

    //市级联动
    provinceSel.onchange=function(){
        addr[1]="";
        provIndex=provinceSel.selectedIndex;
        arr=siteData[provIndex]["sub"];
        areaSel.innerHTML="";
        areaList();
        countySel.innerHTML="";
        $(areaSel).change();
    };
    //县级联动
    areaSel.onchange=function(){
        addr[2]="";
        provIndex=provinceSel.selectedIndex;
        areaIndex=areaSel.selectedIndex;
        arr=siteData[provIndex]["sub"][areaIndex]["sub"];
        countySel.innerHTML="";
        countyList();
    }


}