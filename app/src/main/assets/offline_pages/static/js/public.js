$(function(){	
	
	$(".hd_xf38").click(function(){
		
		$(this).prev().click();
	})
	
	$(".swu8").click(function(){
		
		$(".hd_time2").click();
	})
	
	$('.xmost2').click(function(){
		$(this).addClass('cxo1').siblings().removeClass('cxo1');
		//$('.xline5> .xline6:eq('+$(this).index()+')').show().siblings().hide();	
	})
	
	$(".xmosp2").click(function(){
		$(this).toggleClass('cxo1');
	})
	$(".chose36").click(function(){
		$(this).toggleClass('hai49');
	})
	$(".large").click(function(e){
	  $(".fj_large").show()
	  e.stopPropagation();
	})
	$(".lgclose").click(function(e){
	  $(".fj_large").hide()
	  e.stopPropagation();
	})
	$(".fujian_4").click(function(e){
	  $(this).parent().parent().remove()
	  e.stopPropagation();
	})
	$('.thing1 p').click(function(){
		$(this).addClass('avtr').siblings().removeClass('avtr');
		$('.bark1> .thing3:eq('+$(this).index()+')').show().siblings().hide();	
	})
	$('.bark3').on('click','.hd_po',function(){
	
		$(this).parent().next().toggle();
		$(this).parent().toggleClass('nig')
		//$(".xss").toggle();
	
	})
	
	
	$('.erok22').on('click',function(){
		var htmls=$(".erok26").html();
		$(".erok25").append(htmls)
	
	})
	
	$('.erok23').on('click',function(){
		var workremove=$(".erok25").children().last();
		workremove.remove();
	
	})
	
	
	var work=$(".crop9").html();
	$('.erok30').on('click',function(){
		
		$(".crop11").append(work)
	
	})
	
	
	$('.erok31').click(function(){
		var workremove=$(".crop11").children().last();
		workremove.remove();
	
	})
	
	var cailiao=$(".neipa18").html();
	$('.erok90').click(function(){
		$(".neipa19").append(cailiao)
	
	})
	$('.erok91').click(function(){
		var workremove=$(".neipa19").children().last();
		workremove.remove();
	
	})
	//多选
	$(".bark3").on('click','.urop1',function(){
		$(this).parent().toggleClass('ncg');
	})
	
	//单选
	$(".bark3").on('click','.urop1_single',function(){
		$(this).parent().toggleClass('ncg').siblings().removeClass('ncg');
	})
   
//多选弹出

// $(".bark3").on('click','.xuan8',function(){
// 	//var lis=$(".chose1 .xss li").length;
// 	var _height = $(window).height();
// 	var h=_height-150;
// 	$(".chose1 .xss").height(h);
// 	$(".chose1").show();
// 	$("body").addClass("hd_sp3");
	
	
// })

//单选弹出
// $(".bark3").on('click','.xuan8_single',function(){
// 	//var lis2=$(".chose_single .xss li").length;
// 	var _height = $(window).height();
// 	var h=_height-150;
// 	$(".chose_single .xss").height(h);
// 	$(".chose_single").show();
// 	$("body").addClass("hd_sp3");
	
// })


//单选关闭
$(".xuan2").on('click',function(){
	$(".chose_single").hide();
	$("body").removeClass("hd_sp3");
})
//多选关闭
$(".xuan2").on('click',function(){
	$(".chose1").hide();
	$("body").removeClass("hd_sp3");
})	

//select改为div
$(".task_kin").on('click',function(){
	var newText=$(this).parent().children(("[class='ncg']")).last().text();
	$(this).parent().parent().prev().children().eq(0).text(newText);
	$(".task_kin10").hide();
	$(this).parent().parent().prev().removeClass("nig");
});

//首页项目导航下拉
$(".hdapp11").click(function(){
	$(".hd_more").toggle();
	
});
$(".hd_more1").click(function(){
	$(this).toggleClass('mor')
});
$(".hdapp11").click(function(){
	$(this).parent().toggleClass('moe')
});
$(".xuan2").click(function(){
	$(".hd_more").hide();
	$(".hd_more10").attr('class','hd_more10 paig');
});


//眼睛
$(".hdshow1").click(function(){
	
	$(this).parent().toggleClass('moc');
	$(this).parent().parent().toggleClass('mof')
    $(".hdapp22").toggleClass('un_ct');
    
    var h1=$(window).height();
    var h2=h1-$(".hdapp1").height()-$(".hdapp9").height()-$(".hdapp22").height()-$(".foot").height();
    console.log('点击后-屏幕高度'+h1);
    console.log('点击后-header'+$(".hdapp1").height());
    console.log('点击后-图片高度'+$(".hdapp22").height());
    console.log('点击后-尾部'+$(".foot").height());
    console.log('******************')
    $(".hdapp18").height(h2/3);
   if($(".hdapp18").height()>130)
   {

    $('.hdapp16').css({
    'font-size' : '2.4em',
    'margin' : '23% 0 8% 0',
    
    });
   }
   if($(".hdapp18").height()>110 & $(".hdapp18").height()<130)
  {
	$('.hdapp16').css({
    'margin' : '15% 0 3%',
    
   });
 
 }
 if($(".hdapp8").hasClass('mof'))
 {
	if($('.hdapp18').height()<145)
	{
	$('.hdapp16').css({
    'margin' : '10% 0 1.6%',
    'font-size' : '1.67em',
    'height' : '1em',
    });
    $('.hdapp19').css({
    
    'padding' : '.4em 0 0 0',
    });
    
   }
	if($('.hdapp18').height()<170 & $('.hdapp18').height()>145)
	{
	$('.hdapp16').css({
    'margin' : '16% 0 3%',
    'font-size' : '2.4em',
    'height' : '1em',
 
    });	
	}
 
}else{
	if($('.hdapp18').height()<150){
	$('.hdapp16').css({
    'display' : 'block',
    });
	}
}	
});


//合同审批切换



//首页切换
$(".hdapp10").click(function(){ 
	$(this).addClass("hd_on").siblings().removeClass("hd_on");
	$('.hdapp12 > .hdwq:eq('+$(this).index()+')').show().siblings().hide();
})

//合同审批页面收起展开
$(".hdsect8").click(function(){
	$(this).parent().toggleClass('fbc');
	$(this).parent().parent().find(".hd_ht").toggle();
	var hei3=$(".hdsect_es3").height();
	if($(".hdsect6").hasClass("fbc"))
	
	$(".hdsect_es2").css('height',hei3);	
	else
	$(".hdsect_es2").css('height',hei3);
	
})

//楼层销售报表脚本
$(".hd_xf1").click(function(){
	$(this).parent().toggleClass('moe');
	$(this).parent().next().toggle()
})


//选择月份弹窗
$(".change2").click(function(e){
	e.stopPropagation();
	$(".hd_xf28").show();
})
$(".change1").click(function(e){
	e.stopPropagation();
	var chan_text=$(this).text();
	$(".hd_xf28").hide();
	$(".change").text(chan_text);
})
$(".hd_size5").click(function(e){
    e.stopPropagation();
	$(".hd_xf28").hide();
})




//日期插件样式美化
$(".hd_xf82").click(function(){
	
	$(this).next().click()
	
})


//合同审批意见弹窗
$(".hd_xf90").click(function(){
	$(".hd_xf85").show()
})
$(".hd_xf91").click(function(){
	$(".hd_xf85").hide()
})



//首页登录切换
$(".hd_xf95").click(function(){
	$(this).addClass("hd_xdon").siblings().removeClass("hd_xdon");
	$('.hd_xf97 > .hd_xf98:eq('+$(this).index()+')').show().siblings().hide();
})

//日期美化
$(".hd_time1").click(function(){
	$(".hd_time2").click()
})
$(".hd_xf101").click(function(){
	$(".hd_xf100").click()
})


//对账单页面选择年月插件样式修改
$(".hd_wy9").click(function(){
	$(this).prev().click()
});


//物业办公界面美化
$(".bark3").on('click','.hd_vd',function(){
	$(this).prev().click();
});
$(".hd_vd").click(function(){
	$(this).prev().click();
});
//巡检弹窗
$(".bark3").on('click','.se_single',function(){
	var _height = $(window).height();
	var h=_height-150;
	$(".se_chose1 .xss").height(h);
	$(".se_chose1").show();
	$("body").addClass("hd_sp3");
	
});

//关闭巡检弹窗
$(".se_lm3").on('click',function(){
	$(".se_chose1").hide();
	$("body").removeClass("hd_sp3");
});

//巡检弹窗内单选
$(".bark3").on('click','.sele',function(){
	$(this).parent().toggleClass('ncg').siblings().removeClass('ncg');
	if($(".se_lm8").parent().hasClass("ncg"))
		$(".se_lm7").show();
	else
		$(".se_lm7").hide();
});

//合同审批滑动
var width1=$(".hdsp1").width();
$(".hdsp2").width(width1/4)


// var jlLeft = $("#p-menu p").eq(4).offset().left;
// var swiper3 = new Swiper('.swiper3', {
// 				paginationClickable: true,
// 				onSlideChangeStart:function(swiper){	
// 					if(swiper.activeIndex == 4){
// 						$(".hdsp1").scrollLeft(jlLeft);
// 					}else if(swiper.activeIndex == 3){
// 						$(".hdsp1").scrollLeft(0);
// 					}
// 					$("#p-menu .hdsp2:eq("+swiper.activeIndex+")").click();
// 					$("#p-menu .hdsp2").eq(swiper.activeIndex).addClass("hd_on").siblings("p").removeClass("hd_on");		
// 				},
// 				onTransitionEnd:function(swiper){
// 					var he = $(".hdsect_es2").eq(swiper.activeIndex).find(".hdsect_es3").height() + 10;
// 					$(".hdsect_es").css("height",he+"px");
// 					$(".hdsect_es").css("overflow","hidden");
					
// 				}
// 			});
			
// 			$('.hdsp2').click(function(){
// 				swiper3.slideTo($(this).index(),1000,true);
// 			})
// 			var he = $(".hdsect_es2").eq(0).find(".hdsect_es3").height() + 10;
// 					$(".hdsect_es").css("height",he+"px");
// 					$(".hdsect_es").css("overflow","hidden");


})//jQuery闭合脚本标签



