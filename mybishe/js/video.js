$(function(){
	var category=null;
	var page=null;
	var id="T0";
	var str=null;
	var hottime=0;
// 热门推荐查询
	hotVideo("电视剧");
	hotVideo("电影");
	hotVideo("综艺");
	hotVideo("体育");
	hotVideo("动漫");
	function hotVideo(category){
		$.ajax({
			type:"get",
			url:"https://openapi.youku.com/v2/shows/by_category.json",
			dataType:"jsonp",
			data:{ client_id :"6827f86a5340ea7b",category:category,count:4},
			success:function(data){
				hot(data);
				hottime++;
				if(hottime === 5){
					$(".video img").click(function(){
						var videoid=$(this).next().next().next().next().next().text()
				 		window.open("shipin.html?videoid="+videoid);
					})	
				}
			}
		})
	}
// 热门内容输出
	function hot(data){
		for(var i in data.shows){
			var contern=$('<div class="video col-lg-3 col-md-4 col-sm-6 col-xs-12"><img src="'+data.shows[i].thumbnail+'" alt="'+data.shows[i].name+'"><span>'+data.shows[i].name+'</span><span>评分：'+data.shows[i].score+'</span><span>'+data.shows[i].view_count+'次</span><span>'+data.shows[i].published+'</span><span class="hidden">'+data.shows[i].id+'</span></div>');
			$("#T0 .row").append(contern);
		}	
	}
		
// 频道确定
	$("#myTab").click(function(event){
		e=event || window.event || arguments[0];
		page=1;
		// 非火狐       IE           火狐
		switch(e.target.innerHTML){
			case "电视剧"	: 	category="电视剧";id="T1";break;
			case "电影"		: 	category="电影";id="T2";break;
			case "综艺"		: 	category="综艺";id="T3";break;
			case "动漫"		: 	category="动漫";id="T4";break;
			case "教育"		: 	category="教育";id="T6";break;
			case "纪录片"	: 	category="纪录片";id="T7";break;
			case "体育"     : 	category="体育";id="T8";break;
		}
		firstpage(category,page,id);
	})
// 频道查询
	function firstpage(category,page,id){
		$.ajax({
			url:"https://openapi.youku.com/v2/shows/by_category.json",
			type:"get",
			dataType:"json",
			data:{client_id :"6827f86a5340ea7b",category:category,page:page},
			success: function(data){
				content(data,id);	
			}
		})
	}
// 频道内容输出
	function content(data,id){
		eval('$("#'+id+'").empty()');
		if(data.shows.length>0){
			for(var i in data.shows){
				var contern=$('<div class="video col-lg-3 col-md-4 col-sm-6 col-xs-12"><img src="'+data.shows[i].thumbnail+'" alt="'+data.shows[i].name+'"><span>'+data.shows[i].name+'</span><span>评分：'+data.shows[i].score+'</span><span>'+data.shows[i].view_count+'次</span><span>'+data.shows[i].published+'</span><span class="hidden">'+data.shows[i].id+'</span></div>');
				eval('$("#'+id+'").append(contern)');
			}
			$(".video img").on("click",function(){
				var videoid=$(this).next().next().next().next().next().text()
		 		window.open("shipin.html?videoid="+videoid);
			})
			shangxiapage(id,data.shows.length)
		}
	}
// 关键词处理
	$(".search button").click(searchButton);
    function searchButton(){
        str=$(".searchBar").val();
        str = str.replace(/\s*/,"");
        str = str.replace(/\s*$/,"");
        str = str.replace(/\s+/g," ");
        if(str) {
			searchpage(str,page);
		}	
	}
	$(".searchBar").on("keydown",function(){
        var event = event || window.event || arguments[0];
        if (event.keyCode == 13){
           searchButton();
        }
    })
// 关键词查询
	function searchpage(str,page){
		$.ajax({
			url:"https://openapi.youku.com/v2/searches/video/by_keyword.json",
			type: "get",
			dataType:"json",
			data:{client_id:"6827f86a5340ea7b",keyword:str,page:page},
			success:function(data){
				$("#myTab li,.tab-pane").removeClass("active");
				$("#T0").empty().addClass("active");
				searchContent(data);
			}
		})
	}
// 查询结果输出
	function searchContent(data) {
		if(data.videos.length>0){
			for(var i in data.videos){
				var content=$('<div class="video col-lg-3 col-md-4 col-sm-6 col-xs-12"><img src="'+data.videos[i].bigThumbnail+'" alt="'+data.videos[i].title+'"><span>'+data.videos[i].category+'</span><span>'+data.videos[i].view_count+'</span><span>'+data.videos[i].duration+'秒</span><span>'+data.videos[i].published+'</span><span class="hidden">'+data.videos[i].id+'</span></div>')
				$("#T0").append(content);
			}
			$(".video img").on("click",function(){
				var videoid=$(this).next().next().next().next().next().text();
		 		window.open("shipin.html?videoid="+videoid);
			})
			shangxiapage("T0",data.videos.length);
		}
		else{
			var content=$("<h2 style='text-align:center'>居然没搜到您想要的视频<br>宝宝不高兴！！！<br>更换关键词再试试？</h2>");
			$("#T0").append(content);
		}	
	}
// 上、下一页
	function shangxiapage(id,length){
		if(length === 20){
			if(page === 1){
				var content=$("<ul class='pager col-lg-12 col-md-12 col-sm-12 col-xs-12'><li><a class='xia' href='javascript:;'>下一页</a></li></ul>");
			}
			else{
				var content=$("<ul class='pager col-lg-12 col-md-12 col-sm-12 col-xs-12'><li><a class='shang' href='#'>上一页</a></li><li><a class='xia' href='javascript:;'>下一页</a></li></ul>");
			}
		}
		else{
			if(page === 1){
				var content=$("<ul class='pager col-lg-12 col-md-12 col-sm-12 col-xs-12'><li>无更多视频</li></ul>");
			}
			else{
				var content=$("<ul class='pager col-lg-12 col-md-12 col-sm-12 col-xs-12'><li><a class='shang' href='#'>上一页</a></li></ul>");
			}
		}
		eval('$("#'+id+'").append(content)');
		$(".pager .shang").click(function(){
			page--;
			if(id === "T0"){
				searchpage(str,page);
			}
			else{
				firstpage(category,page,id);
			}
		})
		$(".pager .xia").click(function(event){
			page++;
			if(id === "T0"){
				searchpage(str,page);
			}
			else{
				firstpage(category,page,id);
			}
		})	
	}
		
})
