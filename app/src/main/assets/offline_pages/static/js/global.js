//05-20
document.getElementsByTagName("html")[0].style.fontSize=document.documentElement.clientWidth*100/750+"px";

var cansearch=true;
var popip1 = {
	list:$("<ul class='g-popup1-list po_z'></ul>"),
	page: 0,
	container:$("<div class='g-popup1 lm_z'></div>"),
	busy: false,
	html:function(name, options){
		var self = this;
		self.page =0;
		self.container.children().remove();
		var section =$("<section class='g-seek'></section>");
		var searchText = $("<input type='text' placeholder='请输入关键字' >");
		//05-20
		var searchCancel = $("<i class='vn02 searchCancel' id='searchCancel'></i>");
		
		var searchButton = $("<span class='l_om vn27' id='search'></span>");
		var searchArea = $("<div class='content'></div>");
		searchArea.append(searchText);
		//05-20
		searchArea.append(searchCancel);
		
		searchArea.append(searchButton);
		section.append(searchArea);
		self.container.append(section);
		self.container.append("<section class='g-tijiao' onclick='popip1.remove()'>取消</section>");
		self.container.append(this.list);
		$(".g-xjlist").hide();
		$(".g-titleH2").hide();
		$("body").append(self.container);
		$(searchText).bind('keypress',function(event){
	        if(event.keyCode == "13")
	        {
	          $(searchButton).click();
	        }
	    });
		$(searchButton).click(function(e){
			cansearch=true;
			if(options.load)
			{
				self.page = 0;
        		self.busy=true;
        		$(self.list).children().remove();
				options.load(self, $(searchText).val(), self.page);
			}
		});
		//05-20
		$('#searchCancel').click(function(){
			$(searchText).val('');
		})
		
		self.item_selected =function(e){
			$(this).addClass("on").siblings("li").removeClass("on");
			var data = $(this).data('item');
			self.remove();
			if(options.onSelected)
			{
				options.onSelected(self, e, data);
			}
		};
		$(self.list).scroll(function(){
	        var offset_top = $(this).scrollTop();
	        var listH = $(this).height();
	        var selfH = $(self.container).height();
        	var sH = this.scrollHeight;
        	if( sH-offset_top-selfH<20){
        		if(self.busy)
        			return;
        		self.busy=true;
				options.load(self, $(searchText).val(), self.page);
    		}
	    });
      	$(searchButton).click();
	},

	appendData: function (data)
	{
		var self=this;
		self.page = data.page;
		$(data.dataset).each(function(idx, item){
			var li = $("<li></li>");
			if(typeof item == "object")
			{
				if(item.name!=undefined)
					$(li).append("<div >"+item.name+"</div>");
				else
				{
					if(item.value!=undefined)
						$(li).append("<div >"+item.value+"</div>");
					else
						$(li).append("<span class='vn08'></span>");
				}
			}
			else
			{
				$(li).append("<div >"+item+"</div>");
				$(li).append("<span class='vn08'></span>");
			}
			$(li).data('item', item);
			$(li).click(self.item_selected);
			self.list.append(li);
		});
		self.busy=false;
	},
	remove:function(){
		this.container.remove();
		$(".g-xjlist").show();
		$(".g-titleH2").show();
	}
}

var popmulti = {
	list:$("<ul class='g-popup1-list po_d'></ul>"),
	page: 0,
	container:$("<div class='g-popup1 lm_z'></div>"),
	busy: false,
	get_item:undefined,
	html:function(name, options){
		var self = this;
		self.page =0;
		self.get_item = options.get_item;
		self.container.children().remove();
		var section =$("<section class='g-seek'></section>");
		var searchText = $("<input type='text' placeholder='请输入关键字' >");
		var searchButton = $("<span class='l_om vn27' id='search'></span>");
		var searchArea = $("<div class='content'></div>");
		searchArea.append(searchText);
		searchArea.append(searchButton);
		section.append(searchArea);
		var condition = $("<div class='choncd_0'></div>");
		$(condition).append("<div class='choncd_1 choncd_on'><span class='choncd_2' data-code='inner'>内部</span></div>");
		$(condition).append("<div class='choncd_1'><span class='choncd_2' data-code='tenant'>商场</span></div>");
		section.append(condition);

		self.container.append(section);
		self.container.append("<section class='g-tijiao' onclick='popmulti.remove()'>取消</section>");
		self.container.append(this.list);
		$(".g-xjlist").hide();
		$(".g-titleH2").hide();
		$("body").append(self.container);
		$(condition).find('.choncd_1').click(function(e){
			if($(this).hasClass('choncd_on'))
				return;
			$(this).addClass("choncd_on").siblings().removeClass("choncd_on");
          	$(searchButton).click();
		});
		$(searchText).bind('keypress',function(event){
	        if(event.keyCode == "13")
	        {
	          $(searchButton).click();
	        }
	    });
		$(searchButton).click(function(e){
			if(options.load)
			{
				self.page = 0;
        		self.busy=true;
        		$(self.list).children().remove();
        		var source = $('.choncd_1.choncd_on>.choncd_2').attr('data-code');
				options.load(self, source, $(searchText).val(), self.page);
			}
		});
		self.item_selected =function(e){
			$(this).addClass("on").siblings("li").removeClass("on");
			var data = $(this).data('item');
			self.remove();
			if(options.onSelected)
			{
				options.onSelected(self, e, data);
			}
		};
		$(self.list).scroll(function(){
	        var offset_top = $(this).scrollTop();
	        var listH = $(this).height();
	        var selfH = $(self.container).height();
        	var sH = this.scrollHeight;
        	if( sH-offset_top-selfH<20){
        		if(self.busy)
        			return;
        		self.busy=true;
        		var source = $('.choncd_1.choncd_on>.choncd_2').attr('data-code');
				options.load(self, source, $(searchText).val(), self.page);
    		}
	    });
      	$(searchButton).click();
	},

	appendData: function (data)
	{
		var self=this;
		self.page = data.page;
		$(data.dataset).each(function(idx, item){
			var li = $("<li class='multi-line'></li>");
			if(typeof self.get_item == "function")
			{
				var itemhtml = self.get_item(item);
				$(li).append(itemhtml);
			}
			else
				if(typeof item == "object")
				{
					if(item.name!=undefined)
						$(li).append("<div >"+item.name+"</div>");
					else
					{
						if(item.value!=undefined)
							$(li).append("<div >"+item.value+"</div>");
						else
							$(li).append("<span class='vn08'></span>");
					}
				}
				else
				{
					$(li).append("<div >"+item+"</div>");
					$(li).append("<span class='vn08'></span>");
				}
			$(li).data('item', item);
			$(li).click(self.item_selected);
			self.list.append(li);
		});
		self.busy=false;
	},
	remove:function(){
		this.container.remove();
		$(".g-xjlist").show();
		$(".g-titleH2").show();
	}
}


//弹出框选择商户、人员  、项目、项目类型  ---有搜索框/可选择材料来源
var pop_k = {
	html:function(){
		var html = [];
		html.push("<div class='g-popup1 lm_z'>");
		html.push("<section class='g-seek'>");
		html.push("<div class='content'>");
		html.push("<input type='text' placeholder='请输入关键字' />");
		html.push("<span class='l_om vn27'></span>");
		html.push("</div>");
		html.push("</section>");

		html.push("<div class='choncd_0'>");
		html.push("<div class='choncd_1'>");
		html.push("<span class='choncd_2'>商场</span>");
		html.push("</div>");
		html.push("<div class='choncd_1'>");
		html.push("<span class='choncd_2'>商场</span>");
		html.push("</div>");
		html.push("</div>");

		html.push("<ul class='g-popup1-list po_d'>");
		html.push("<li class=''>");
		html.push("<div>test</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		for(var i = 0 ; i<20; i++){
			html.push("<li>");
			html.push("<div class='yy_length'>test1</div>");
			html.push("<span class='vn08'></span>");
			html.push("</li>");
		}
		html.push("</ul>");
		html.push("<section class='g-tijiao' onclick='popip1.remove()'>取消</section>");
		html.push("</div>");
		$(".jm_all").hide();
		$("body").append(html.join(""));
		$(".g-popup1-list li").click(function(){

			var text_lz=$(this).children().eq(0).text();
			/*
			var str = text_lz.substr(0,18) + " ...";
            $(this).text(str);
            */
			$(this).addClass("on").siblings("li").removeClass("on");
			pop_k.remove();
			$(".lz").text(text_lz);
			$(".lz").css("opacity","1")
		})
		//选择材料来源
		$(".choncd_1").click(function(){
			$(this).addClass("choncd_on").siblings().removeClass("choncd_on")
		})
	},
	remove:function(){
		$(".g-popup1").remove();
		$(".jm_all").show();

	}
}
//弹出框选择商户、人员  、项目、项目类型  ---有搜索框 可选择材料来源end

var chose_mem1 = {
	list:$("<ul class='g-popup1-list mem_li po_z'></ul>"),
	page: 0,
	container:$("<div class='g-popup1 lm_z'></div>"),
	busy: false,
	get_item:undefined,
	html:function(name, options){
		var self = this;
		self.page =0;
		self.get_item = options.get_item;
		self.container.children().remove();
		var section =$("<section class='g-seek'></section>");
		var searchText = $("<input type='text' placeholder='请输入关键字' >");
		var searchButton = $("<span class='l_om vn27' id='search'></span>");
		var searchArea = $("<div class='content'></div>");
		searchArea.append(searchText);
		searchArea.append(searchButton);
		section.append(searchArea);

		self.container.append(section);
		self.container.append("<div class='mem_hide '>确定</div>");
		self.container.append(this.list);
		$(".g-xjlist").hide();
		$(".g-titleH2").hide();
		$("body").append(self.container);

		$(searchText).bind('keypress',function(event){
	        if(event.keyCode == "13")
	        {
	          $(searchButton).click();
	        }
	    });
	    self.container.find(".mem_hide").click(function(e){
			var item = self.container.find('.mem_li li.on');
			var data =$(item).data('item');
			if(data==undefined)
				return;
			if(options.onSelected)
			{
				options.onSelected(self, e, data);
			}
			self.remove();
		});
		$(searchButton).click(function(e){
			if(options.load)
			{
				self.page = 0;
        		self.busy=true;
        		$(self.list).children().remove();
				options.load(self, $(searchText).val(), self.page);
			}
		});
		self.item_selected =function(e){
			$(this).addClass("on").siblings("li").removeClass("on");
		};
		$(self.list).scroll(function(){
	        var offset_top = $(this).scrollTop();
	        var listH = $(this).height();
	        var selfH = $(self.container).height();
        	var sH = this.scrollHeight;
        	if( sH-offset_top-selfH<20){
        		if(self.busy)
        			return;
        		self.busy=true;
				options.load(self,  $(searchText).val(), self.page);
    		}
	    });
      	$(searchButton).click();
	},

	appendData: function (data)
	{
		var self=this;
		self.page = data.page;
		$(data.dataset).each(function(idx, item){
			var li = $("<li></li>");
			if(typeof item == "object")
			{
				if(item.name!=undefined)
					$(li).append("<div class='yy_length'>"+item.name+"</div>");
				else
				{
					if(item.value!=undefined)
						$(li).append("<div class='yy_length'>"+item.value+"</div>");
				}
			}
			else
			{
				$(li).append("<div class='yy_length'>"+item+"</div>");
			}
			$(li).append("<span class='vn08'></span>");
			$(li).data('item', item);
			$(li).click(self.item_selected);
			self.list.append(li);
		});
		self.busy=false;
	},
	remove:function(){
		this.container.remove();
		$(".g-xjlist").show();
		$(".g-titleH2").show();
	}
}

var chose_mem = {
	html:function(name, data, callback){
/*		var html = [];
		html=$("<div class='g-popup1 lm_c'></div>");
		$(html).append("<div class='please_chose'>请选择</div>");

		$(html).append("<ul class='g-popup1-list mem_li po_z'></ul>");
		$(data).each(function(idx, item){
			var li = $("<li></li>");
			if(typeof item == "object")
			{
				if(item.name!=undefined)
					$(li).append("<div class='yy_length'>"+item.name+"</div>");
				else
				{
					if(item.value!=undefined)
						$(li).append("<div class='yy_length'>"+item.value+"</div>");
				}
			}
			else
			{
				$(li).append("<div class='yy_length'>"+item+"</div>");
			}
			$(li).append("<span class='vn08'></span>");
			$(li).data('item', item);
			$(html).children('ul').append(li);
		});*/
		$(html).append("<div class='mem_hide '>确定</div>");
		$(".g-xjlist").hide();
		$(".g-titleH2").hide();
		$("body").append(html);
		$(".g-popup1-list li").click(function(e){
			$(this).addClass("on").siblings("li").removeClass("on");
		});
		$(".mem_hide").click(function(e){
			var item = $('.mem_li li.on');
			var data = $(item).data('item');
			if(data==undefined)
				return;
			if(callback)
			{
				callback(chose_mem, e, data);
			}
			chose_mem.remove();
		});
	},
	remove:function(){
		$(".g-popup1").remove();
		$(".g-xjlist").show();
		$(".g-titleH2").show();
	}
}
var popipm = {
	data:null,
	onSelected:null,
	yb:false,
	html:function(name, data, onSelected){
    window.MobileBridge.toggleShowBanner("hidden");
    	this.yb = false;
		this.data = data;
		this.data.sort(by("name"));
		this.onSelected = onSelected;
		var html = [];
		html=$("<div class='g-popup1 lm_c'></div>");
		//05-20
		var section =$("<section class='g-seek'></section>");
		var searchText = $("<input type='text' placeholder='请输入关键字' oninput='popipm.screen(this)'>");
		var searchCancel = $("<i class='vn02 searchCancel' id='searchCancel' style='display:none'></i>");
		var searchButton = $("<span class='l_om vn27' id='search'  style='display:none'></span>");
		var searchArea = $("<div class='content'></div>");
		searchArea.append(searchText);
		searchArea.append(searchCancel);
		searchArea.append(searchButton);
		section.append(searchArea);	
		$(html).append(section);

		$(html).append("<ul class='g-popup1-list po_c'></ul>");
	
		$(data).each(function(idx, item){
			
			var li = $("<li></li>");
			if(typeof item == "object")
			{
				
				if(name=="请选择仪表")
				{   
					popipm.yb = true;
					var itemname="",itemcode="",itempos="";
					if(item.name)
					{
						itemname=item.name;
					}
					if(item.code)
					{
						itemcode=item.code;
					}
					if(item.position)
					{
						itempos=item.position;
					}
					if(item.name!=undefined)
					{
						$(li).append("<div>"+itemname+"   ("+itemcode+")   "+"<em class='spanp'>"+itempos+"</span></div>");
					}
			   }
			   else
			   {
					if(item.name!=undefined)
						$(li).append("<div >"+item.name+"</div>");
					else
					{
						if(item.value!=undefined)
							$(li).append("<div >"+item.value+"</div>");
						else
							$(li).append("<span class='vn08'></span>");
					}
				}
			}
			else
			{
				$(li).append("<div >"+item+"</div>");
				$(li).append("<span class='vn08'></span>");
			}
			$(li).data('item', item);
			$(html).children('ul').append(li);
		});
		$(html).append("<section class='g-tijiao' onclick='popipm.remove()'>取消</section>");
		$(".g-xjlist").hide();
		$(".g-titleH2").hide();
		$("body").append(html);
		$(".g-popup1-list li").click(function(e){
			$(this).addClass("on").siblings("li").removeClass("on");
			var data = $(this).data('item');
			popipm.remove();
			if(onSelected)
			{
				onSelected(popipm, e, data);
			}
		});
		$(".p_hide").click(function(){
			$(this).parent().parent().hide();
			$(".g-xjlist").show();
			$(".g-titleH2").show();
		});
		//05-20
		$('#searchCancel').click(function(){
			$(searchText).val('');
			popipm.screen($(searchText));
		})
	},
	remove:function(){
		$(".g-popup1").remove();
		$(".g-xjlist").show();
		$(".g-titleH2").show();
    window.MobileBridge.toggleShowBanner("show");
	},
	screen:function(me){		
		var html = [];
		var con = $(me).val();
		var obj = [];
		for(var i = 0; i<popipm.data.length; i++){
			if(!popipm.yb){
				if(popipm.data[i].name.indexOf(con) >= 0 ){
					html.push('<li><div>'+popipm.data[i].name+'</div></li>');
					obj.push(popipm.data[i])
				}
			}else{
				if(popipm.data[i].position == null || popipm.data[i].position == '' || popipm.data[i].position == undefined){
					popipm.data[i].position = '';
				}
				if(popipm.data[i].name.indexOf(con) >= 0 || popipm.data[i].code.indexOf(con) >= 0 || popipm.data[i].position.indexOf(con) >= 0){
					html.push('<li><div>'+popipm.data[i].name+'  ('+popipm.data[i].code+') <em class="spanp">'+popipm.data[i].position+'</em></div></li>');
					obj.push(popipm.data[i])
				}
			}
		}
		//result.body.sort(by("code"));
		$('.g-popup1-list').html(html.join(''));
		$(".g-popup1-list li").unbind();
		$(".g-popup1-list li").click(function(e){
			$(this).addClass("on").siblings("li").removeClass("on");
			var index = $(this).index();
			var data = obj[index]
			if(popipm.onSelected)
			{
				popipm.onSelected(popipm, e, data);
			}
			popipm.remove();
		});
	}
}
//弹出框选择商户、人员  、项目、项目类型 --无搜索框 end



//图片放大查看
var imgShow={
	html:function(src){
		var html = [];
		html.push("<section class='g-imgShow' onclick='imgShow.remove();'>");
		html.push("<div class='img'><img src='"+src+"'/></div>");
		html.push("</section>");
		$(".g-xjlist").hide();
		$(".g-titleH2").hide();
		$(".g-xjcontent").hide();
		$(".g-photograph").hide();
		$("body").append(html.join(""));
	},
	remove:function(){
		$(".g-xjlist").show();
		$(".g-titleH2").show();
		$(".g-xjcontent").show();
		$(".g-photograph").show();
		$(".g-imgShow").remove();
	}
}
//图片放大查看 end


//图片放大查看	公告页面的
var imgShow2={
	html:function(src){
		var html = [];
		html.push("<section class='g-imgShow' onclick='imgShow.remove();'>");
		html.push("<div class='img'><a href='"+src+"' download><img src='"+src+"'/></a></div>");
		html.push("</section>");
		$(".g-xjlist").hide();
		$(".g-titleH2").hide();
		$(".g-xjcontent").hide();
		$(".g-photograph").hide();
		$("body").append(html.join(""));
	},
	remove:function(){
		$(".g-xjlist").show();
		$(".g-titleH2").show();
		$(".g-xjcontent").show();
		$(".g-photograph").show();
		$(".g-imgShow").remove();
	}
}

//工程报修列表排序
var gcw = {
	html:function(direction, callback){
		var html = [];
		html.push("<div class='gcw_20'>");
		html.push("<div class='gcw_25'>");
		html.push("<div class='gcw_23'>请选择</div>");
		html.push("<ul class='gcw_21'>");
		if(direction == 'desc')
			html.push("<li class='gcw_28 on' data-code='desc'>");
		else
			html.push("<li class='gcw_28' data-code='desc'>");
		html.push("<div class='gcw29'>顺序</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(direction == 'asc')
			html.push("<li class='gcw_28 on' data-code='asc'>");
		else
			html.push("<li class='gcw_28' data-code='asc'>");
		html.push("<div class='gcw29'>倒序</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		html.push("</ul>");
		html.push("<div class='gcw_mor1 gcw_hide'>取消</div>");
		html.push("</div>");
		html.push("<div class='gcw_mor2 gcw_hide'></div>");
		html.push("</div>");
		$("body").append(html.join(""));
		$(".gcw_25 li").click(function(){
			var text_lm=$(this).children().eq(0).text();
			$(this).addClass("on").siblings("li").removeClass("on");
			if(callback)
			{
				var order = $("li.gcw_28.on").attr('data-code');
				callback(order);
			}
			gcw.remove();
		});
		$(".gcw_hide").click(function(){
			gcw.remove();
		});
	},
	remove:function(){
		$(".gcw_20").remove();
		$(".lm_gcw2").show();
	}
}
//工程报修列表排序 end

//等级
var grades = {
	html:function(grade, callback){
		var html = [];
		html.push("<div class='gcw_20'>");
		html.push("<div class='gcw_25'>");
		html.push("<div class='gcw_23'>请选择</div>");
		html.push("<ul class='gcw_21'>");
		// html.push("<li class='gcw_28' data-code='large'>");
		if(grade == 'large')
			html.push("<li class='gcw_28 on' data-code='large'>");
		else
			html.push("<li class='gcw_28' data-code='large'>");
		html.push("<div class='gcw29 on' data-code='large'>高</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(grade == 'oneClass')
			html.push("<li class='gcw_28 on' data-code='oneClass'>");
		else
			html.push("<li class='gcw_28' data-code='oneClass'>");
		html.push("<div class='gcw29'>中</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		// html.push("<li class='gcw_28' data-code='twoClass'>");
		if(grade == 'twoClass')
			html.push("<li class='gcw_28 on' data-code='twoClass'>");
		else
			html.push("<li class='gcw_28' data-code='twoClass'>");
		html.push("<div class='gcw29'>低</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		html.push("</ul>");
		html.push("<div class='gcw_hide gcw_mor1'>取消</div>");
		html.push("</div>");
		html.push("<div class='gcw_mor2 gcw_hide'></div>");
		html.push("</div>");
		$("body").append(html.join(""));
		$(".gcw_25 li").click(function(){
			var text=$(this).children().eq(0).text();
			$(this).addClass("on").siblings("li").removeClass("on");
			var grade = $("li.gcw_28.on").attr('data-code');
			if(callback)
			{
				callback(grade, text);
			}
			grades.remove();
		})
		$(".gcw_hide").click(function(){
			grades.remove();
		})
	},
	remove:function(){
		$(".gcw_20").remove();
		//$(".lm_gcw2").show();
	}
}
//等级 end


//评价rated
var rated = {
	html:function(){
		var html = [];
		html.push("<div class='gcw_20'>");
		html.push("<div class='gcw_25'>");
		html.push("<section class='gc_pl0'>");
		html.push("<div class='gc_pl1'>");
		html.push("<div class='gcw_21'>");
		html.push("<div class='gc_pl3'>满意");
		html.push("<div class='pl_card'></div>");
		html.push("</div>");
		html.push("</div>");
		html.push("</div>");
		html.push("<div class='gc_pl1'>");
		html.push("<div class='gcw_21'>");
		html.push("<div class='gc_pl3'>不满意");
		html.push("<div class='pl_card'></div>");
		html.push("</div>");
		html.push("</div>");
		html.push("</div>");

		html.push("</section>");
		//html.push("<div class='rated_hide'>取消</div>");
		html.push("<div class='rated_hide'>确定</div>");
		html.push("</div>");

		html.push("</div>");
		$("body").append(html.join(""));
		$(".gc_pl1").click(function(){

			$(this).addClass("pl_on").siblings().removeClass("pl_on");
			//rated.remove();
		})
		$(".rated_hide").click(function(){
			rated.remove();

		})
	},
	remove:function(){
		$(".gcw_20").remove();

	}
}
//评价 end


//工程报修状态选择
var gcside = {
	html:function(bzState, callback){
		var html = [];
		html.push("<div class='gcw_20'>");
		html.push("<div class='gcw_25'>");
		html.push("<div class='gcw_23'>请选择</div>");
		html.push("<ul class='gcw_21' >");
		if(bzState == 'ineffect')
			html.push("<li class='gcw_28 on' data-code='ineffect'>");
		else
			html.push("<li class='gcw_28' data-code='ineffect'>");
		html.push("<div class='gcw29'>未生效</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == 'repairing')
			html.push("<li class='gcw_28 on' data-code='repairing'>");
		else
			html.push("<li class='gcw_28' data-code='repairing'>");
		html.push("<div class='gcw29'>维修中</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == 'solved')
			html.push("<li class='gcw_28 on' data-code='solved'>");
		else
			html.push("<li class='gcw_28' data-code='solved'>");
		html.push("<div class='gcw29'>已解决</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == 'finished')
			html.push("<li class='gcw_28 on' data-code='finished'>");
		else
			html.push("<li class='gcw_28' data-code='finished'>");
		html.push("<div class='gcw29'>已完成</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == 'aborted')
			html.push("<li class='gcw_28 on' data-code='aborted'>");
		else
			html.push("<li class='gcw_28' data-code='aborted'>");
		html.push("<div class='gcw29'>已作废</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == '' || bzState == undefined || bzState == null)
			html.push("<li class='gcw_28 on'>");
		else
			html.push("<li class='gcw_28'>");
		html.push("<div class='gcw29'>全部</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		html.push("</ul>");
		html.push("<div class='gcw_mor1 gcw_hide'>取消</div>");
		html.push("</div>");
		html.push("<div class='gcw_mor2 gcw_hide'></div>");//新增 点击非操作区隐藏
		html.push("</div>");
		$("body").append(html.join(""));
		$(".gcw_25 li").click(function(){
			var text_lm=$(this).children().eq(0).text();
			$(this).toggleClass("on").siblings("li").removeClass("on");
			if(callback)
			{
				var state = $("li.gcw_28.on").attr('data-code');
				callback(state);
			}
			gcside.remove();
		})
		$(".gcw_hide").click(function(){
			gcside.remove();
		})
	},
	remove:function(){
		$(".gcw_20").remove();
		$(".lm_gcw2").show();
	}
}
//工程报修状态选择 end





//消息滑动删除
var mList = {
	mList:[],  //存储我的消息展开状态的数组
	mx:0,     //左右滑动X
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
		/*$("#m-list>li>div").click(function(){  //外层列表的点击展开事件
			var index = $(this).parent("li").index();
			if(mList.mList[index]){
				$("#m-list>li").eq(index).find("ul").show();
				mList.mList[index] = false;
			}else{
				$("#m-list>li").eq(index).find("ul").hide();
				mList.mList[index] = true;
			}
		})*/
		$("#m-list>li>span,#m-list>li>ul>li>span").click(function(){  //外层已读点击删除   在没有刷新页面的情况下 隐藏掉
			$(this).parent("li").hide();
		})
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
			//e.preventDefault();
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
			//e.preventDefault();
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
//消息滑动删除 end
var m_loading = {
	html:function(){
		var html = [];
        html.push("<div class='m_load'>");
        html.push("<div class='load2'>");
        html.push("<span class='loading'>");
    	html.push("<span class='bar1'></span>");
    	html.push("<span class='bar2'></span>");
    	html.push("<span class='bar3'></span>");
    	html.push("<span class='bar4'></span>");
    	html.push("<span class='bar5'></span>");
    	html.push("<span class='bar6'></span>");
    	html.push("<span class='bar7'></span>");
    	html.push("<span class='bar8'></span>");
    	html.push("<span class='bar9'></span>");
    	html.push("<span class='bar10'></span>");
    	html.push("<span class='bar11'></span>");
    	html.push("<span class='bar12'></span>");
	    html.push("</span>");

        //html.push("<span class='load_text'>加载中...</span>");
        html.push("</div>");
        html.push("</div>");
        $("body").append(html.join(""));
        $(".xxx").click(function(){
        	m_loading.remove();
        });

	},
	remove:function(){
		$(".m_load").remove();

	}
}

//运营巡检列表页状态筛选
var yy_state = {
	html:function(bzState, callback){
		var html = [];
		html.push("<div class='gcw_20'>");
		html.push("<div class='gcw_25'>");
		html.push("<div class='gcw_23'>请选择</div>");
		html.push("<ul class='gcw_21'>");
		if(bzState == 'ineffect')
			html.push("<li class='gcw_28 on' data-code='ineffect'>");
		else
			html.push("<li class='gcw_28' data-code='ineffect'>");
		html.push("<div class='gcw29'>未生效</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == 'dealing')
			html.push("<li class='gcw_28 on' data-code='dealing'>");
		else
			html.push("<li class='gcw_28' data-code='dealing'>");
		html.push("<div class='gcw29'>处理中</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == 'solved')
			html.push("<li class='gcw_28 on' data-code='solved'>");
		else
			html.push("<li class='gcw_28' data-code='solved'>");
		html.push("<div class='gcw29'>已解决</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		if(bzState == 'finished')
			html.push("<li class='gcw_28 on' data-code='finished'>");
		else
			html.push("<li class='gcw_28' data-code='finished'>");
		html.push("<div class='gcw29'>已完成</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		// if(bzState == 'dealing.overtime')
		// 	html.push("<li class='gcw_28 on' data-code='dealing.overtime'>");
		// else
		// 	html.push("<li class='gcw_28' data-code='dealing.overtime'>");
		// html.push("<div class='gcw29'>超时未解决</div>");
		// html.push("<span class='vn08'></span>");
		// html.push("</li>");
		// if(bzState == 'solved.overtime')
		// 	html.push("<li class='gcw_28 on' data-code='solved.overtime'>");
		// else
		// 	html.push("<li class='gcw_28' data-code='solved.overtime'>");
		// html.push("<div class='gcw29'>超时解决</div>");
		// html.push("<span class='vn08'></span>");
		// html.push("</li>");
		// if(bzState == 'finished.overtime')
		// 	html.push("<li class='gcw_28 on' data-code='finished.overtime'>");
		// else
		// 	html.push("<li class='gcw_28' data-code='finished.overtime'>");
		// html.push("<div class='gcw29'>超时完成</div>");
		// html.push("<span class='vn08'></span>");
		// html.push("</li>");
		if(bzState == '.all')
			html.push("<li class='gcw_28 on' data-code='.all'>");
		else
			html.push("<li class='gcw_28' data-code='.all'>");
		html.push("<div class='gcw29'>全部</div>");
		html.push("<span class='vn08'></span>");
		html.push("</li>");
		html.push("</ul>");
		html.push("<div class='gcw_mor1 gcw_hide'>取消</div>");
		html.push("</div>");
		html.push("<div class='gcw_mor2 gcw_hide'></div>");//新增 点击非操作区隐藏
		html.push("</div>");
		$("body").append(html.join(""));
		$(".gcw_25 li").click(function(){
			var text_lm=$(this).children().eq(0).text();
			$(this).addClass("on").siblings("li").removeClass("on");
			if(callback)
			{
				var state = $("li.gcw_28.on").attr('data-code');
				callback(state);
			}
			yy_state.remove();
		});
		$(".gcw_hide").click(function(){
			yy_state.remove();
		});
	},
	remove:function(){
		$(".gcw_20").remove();
		$(".lm_gcw2").show();
	}
}
/*====update0413 cynthia  start===*/
   function checkContactNumber(mobile) {  
        var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;  
        //var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;  
        var isPhone = /^(((0\d{3}[\-])?\d{7}|(0\d{2}[\-])?\d{8}))([\-]\d{2,4})?$/;
        var c = /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/;
        //如果为1开头则验证手机号码  
        if (mobile.substring(0, 1) == 1) {  
            if (!isMobile.exec(mobile) && mobile.length != 11) {  
                return false;  
            }  
        }  
        else if(mobile.indexOf('-') == 3){//如果有 - 那么有是有区号的
        	if (!isPhone.test(mobile)) {  
                return false;  
            } 
        }else{
            if (!c.test(mobile)) {  
                return false;  
            }  
        }  
        //否则全部不通过  
//      else {  
//          return false;  
//      }  
        return true;  
    } 
/*====update0413 cynthia  end===*/ 
//click弹出框框事件
$(function() {
	/*====update0413 cynthia  start===*/
	 $(".jm_nme").on("click",function(){$(this).toggleClass("jm_nme_hid");})
	 /*====update0413 cynthia  end===*/ 
	// var sWidth = document.body.scrollWidth;
	// $("html").css("font-size", sWidth / 7.1);
})
/*updatecynthia start===*/
function buttonFixed()
{		 var u = navigator.userAgent;
             var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端 		   
  				var winHeight = $(window).height();   //获取当前页面高度
            $(window).resize(function(){
               var thisHeight=$(this).height();
                if(winHeight - thisHeight >50){
                    $(".g-tijiao").hide();
                    $(".submitbtn").hide();

                }else{
                    $(".g-tijiao").show();
                    $(".submitbtn").show();
                }

            }); 
            if(isAndroid)
            {
            	$(".wrap").css({position:"static"});
            } 
            else
            {$(".wrap").css({position:"fixed"});}
    //         var isIOS = (/iphone|ipad/gi).test(navigator.appVersion);//判断是不是ios系统
				//  if (isIOS) {
				// $('#payments').on('focus', 'input', function () {

				// $(".g-tijiao").hide();

				// }).on('focusout', 'input', function () {

				//  $(".g-tijiao").show();

				// });

				//  }
 }		


	 Date.prototype.Format = function (fmt) { //author: meizz
	    var o = {
	         "M+": this.getMonth() + 1, //月份
	         "d+": this.getDate(), //日
	         "h+": this.getHours(), //小时
	         "m+": this.getMinutes(), //分
	         "s+": this.getSeconds(), //秒
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
	         "S": this.getMilliseconds() //毫秒
	     };
	     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	     if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	 }


var by = function(name) { 
	return function(o, p) {   
		var a, b;   
		if(typeof o === "object" && typeof p === "object" && o && p) {     
			a = o[name];     
			b = p[name];     
			if(a === b) {       
				return 0;     
			}     
			if(typeof a === typeof b) {       
				return a < b ? -1 : 1;     
			}     
			return typeof a < typeof b ? -1 : 1;   
		}   
		else {     
			throw("error");   
		} 
	}
}
   
 /*updatecynthia0518 end===*/


function dateVerify(obj,type){	//1为不能选择大于当前日期    2为必须大于当前日期
	var selectDate = $(obj).val();
	selectDate = new Date(selectDate).getTime();
	var myDate = new Date();
	myDate = myDate.getTime(myDate);    
	if(type == 1 && selectDate > myDate){
		showMessage('选择日期不能大于当前日期');
		$(obj).val('');
		return false;
	}
	if(type == 2 && selectDate < myDate){
		showMessage('选择日期必须大于当前日期');
		$(obj).val('');
		return false;
	}
	return true;
}
