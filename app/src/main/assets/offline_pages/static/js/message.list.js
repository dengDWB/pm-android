//我的消息
var mList = {
	mList:[],  //存储我的消息展开状态的数组
	mx:0,     //左右滑动X
	// remove:function(message){

	// },
	removeGroup:function(group){
		$(group).children('.message-list').children().each(function(idx, message){
			mList.remove(message);
		});
      	mList.updateMessageCount();		
	},
	init:function(){
		var mlistLength = $("#m-list>li").length;
		for(var i = 0; i < mlistLength; i++){ //绑定外层列表的滑动事件
			mList.mList.push(true);
			var mListClicks = document.getElementById("m-list"+(i+1));
			mListClicks.addEventListener('touchstart',mListClick,false);
			mListClicks.addEventListener('touchend',mListOverClick,false);
			mListClicks.addEventListener('touchmove',mListmove,false);
			var length2  = $("#m-list>li").eq(i).find("ul>li").length;
			for(var j = 0 ;j< length2; j++){  //绑定里面列表的滑动事件
				var mListClicks2 = document.getElementById("m-list"+(i+1)+"-li"+(j+1));
				mListClicks2.addEventListener('touchstart',mListClick,false);
				mListClicks2.addEventListener('touchend',mListOverClick,false);
				mListClicks2.addEventListener('touchmove',mListmove2,false);
			}
		}	
		$("#m-list>li>div").click(function(){  //外层列表的点击展开事件
			var index = $(this).parent("li").index();
			if(mList.mList[index]){
				$("#m-list>li").eq(index).find("ul").show();
				mList.mList[index] = false;
			}else{
				$("#m-list>li").eq(index).find("ul").hide();
				mList.mList[index] = true;
			}
		});
		$("#m-list>li>span").click(function(){  //外层已读点击删除   在没有刷新页面的情况下 隐藏掉
			mList.removeGroup($(this).parent("li"));
			// $(this).parent("li").remove();
		});
		$("#m-list>li>ul>li>span").click(function(){  //外层已读点击删除   在没有刷新页面的情况下 隐藏掉
			mList.remove($(this).parent("li"));
			// $(this).parent("li").remove();
		});
		function mListClick(e){	//触摸事件开始
			var here = 'touchstart' ? e.changedTouches[0] : e,
			hereX = here.pageX,
			hereY = here.pageY;
			var index = $(this).index();
			mList.mx = hereX;
		}
		function mListOverClick(e){  //触摸事件结束
			var here = 'touchstart' ? e.changedTouches[0] : e,
			hereX = here.pageX,
			hereY = here.pageY;
			var index = $(this).index();
			mList.mx = 0;
		}
		function mListmove(e){      //触摸事件按下移动
			// e.preventDefault();     
			var here = 'touchstart' ? e.changedTouches[0] : e,
			hereX = here.pageX,
			hereY = here.pageY;
			var index = $(this).index();
			var dx = hereX - mList.mx;	
			if(dx <= -40){ //左滑			
				$(this).parent("li").addClass("on");
			}else if(dx >= 40){ //右滑
				$(this).parent("li").removeClass("on");
				$(this).parent("li").find("ul>li").removeClass("on");
			}
		}
		function mListmove2(e){      //触摸事件按下移动2
			// e.preventDefault();
			var here = 'touchstart' ? e.changedTouches[0] : e,
			hereX = here.pageX,
			hereY = here.pageY;
			var index = $(this).index();
			var dx = hereX - mList.mx;	
			if(dx <= -40){ //左滑			
				$(this).addClass("on");
			}else if(dx >= 40){ //右滑
				$(this).removeClass("on");
			}
		}
	}
}


