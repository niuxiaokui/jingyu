$(function(){
	var str=null;
	var page=1;
	var id="T1";
	var channelId="5572a108b3cdc86cf39001cd";
// 页面导航样式
	if(document.body.clientWidth<992){
			$("#myTab").removeClass("nav-tabs").addClass("nav-pills");
			$("#myTab li a").attr({'data-toggle':'pill'}).addClass("pill");
		}
	window.onresize = function(){
		if(document.body.clientWidth<992){
			$("#myTab").removeClass("nav-tabs").addClass("nav-pills");
			$("#myTab li a").attr({'data-toggle':'pill'});
		}
		else{
			$("#myTab").removeClass("nav-pills").addClass("nav-tabs");
			$("#myTab li a").attr({'data-toggle':'tab'});
		}
	}
// 关键词处理
	$(".search button").click(searchButton)
	function searchButton(){
		page=1;
		id="T0";
		str=$(".searchBar").val();
		str = str.replace(/\s*/,"")
		str = str.replace(/\s*$/,"")
		str = str.replace(/\s+/g," ")
		if(str) {
			searchcontent(str,page);
		}	
	}
	$(".searchBar").on("keydown",function(){
        var event = event || window.event || arguments[0];
        if (event.keyCode == 13){
           searchButton();
        }
    })
// 关键词查询
	function searchcontent(str,page){
		$.ajax({
				url:"http://apis.baidu.com/showapi_open_bus/channel_news/search_news",
				type: "get",
				dataType:"json",
				headers:{"apikey":"73c93fef4a9678b6c4153624be17af53"},
				data:{title:str,page:page},
				success:function(data){
					$("#myTab li,.tab-pane").removeClass("active");
					$("#T0").empty();
					$("#T0").addClass("active");
					content(data,id);
				}
			})
	}

// 新闻频道_国内焦点（推荐）	
	$.ajax({
		url:"http://apis.baidu.com/showapi_open_bus/channel_news/search_news",
		type: "get",
		dataType:"json",
		headers:{"apikey":"73c93fef4a9678b6c4153624be17af53"},
		data:{channelId:channelId,page:page},
		success:function(data){
			content(data,id);
		}
	})

// 频道确定
	$("#myTab").click(function(event){
		e=event || window.event || arguments[0];
		page=1;
		switch(e.target.innerHTML){
			case "推荐": channelId="5572a108b3cdc86cf39001cd";id="T1";break;
			case "社会": channelId="5572a109b3cdc86cf39001da";id="T2";break;
			case "国内": channelId="5572a109b3cdc86cf39001db";id="T3";break;
			case "国际": channelId="5572a108b3cdc86cf39001ce";id="T4";break;
			case "财经": channelId="5572a109b3cdc86cf39001e0";id="T5";break;
			case "科技": channelId="5572a108b3cdc86cf39001d9";id="T6";break;
			case "军事": channelId="5572a108b3cdc86cf39001cf";id="T7";break;
			case "体育": channelId="5572a108b3cdc86cf39001d4";id="T8";break;
			case "娱乐": channelId="5572a10ab3cdc86cf39001eb";id="T9";break;
			case "女性": channelId="5572a108b3cdc86cf39001d8";id="T10";break;
			case "健康": channelId="5572a10ab3cdc86cf39001f3";id="T11";break;
			case "游戏": channelId="5572a108b3cdc86cf39001d6";id="T12";break;
		}
		eval('$("#'+id+'").empty()');
		channelcontent(channelId,page,id);
	})
// 频道查询
	function channelcontent(channelId,page,id){
		$.ajax({
			url:"http://apis.baidu.com/showapi_open_bus/channel_news/search_news",
			type:"get",
			dataType:"json",
			headers:{"apikey":"73c93fef4a9678b6c4153624be17af53"},
			data:{channelId:channelId,page:page},
			success: function(data){
				content(data,id);	
			}
		})
	}
// 频道内容输出
	function content(data,id){
		var news=data.showapi_res_body.pagebean.contentlist;
		if(news.length > 0){
			for(var i in news){
			// 有图
				if(news[i].imageurls.length>0){
					var text=$('<div class="row"><div class="col-lg-9 col-md-9 col-sm-8 col-xs-12"><h4><a href="'+news[i].link+'"><b>'+news[i].title+'</b></a></h4><div>'+news[i].desc+'</div><span class="source">'+news[i].source+'</span><span class="source"'+news[i].pubDate+'</span></div><a href="'+news[i].link+'" class="photograph col-lg-3 col-md-3 col-sm-4 hidden-xs"><img class="col-lg-12 col-md-12 col-sm-12 col-xs-12" src="'+news[i].imageurls[0].url+'" alt="'+news[i].title+'"></a></div>');
				}
			// 无图
				else{
					var text=$('<div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><h4><a href="'+news[i].link+'"><b>'+news[i].title+'</b></a></h4><div>'+news[i].desc+'</div><span class="source">'+news[i].source+'</span><span class="source">'+news[i].pubDate+'</span></div></div>');
				}
				eval('$("#'+id+'").append(text)');
			}
			xiapage(id,news.length);
		}
		else{
			var text=$("<h2 style='text-align:center'>居然没搜到您想要的资讯<br>宝宝不高兴！！！<br>更换关键词再试试？</h2>");
			eval('$("#'+id+'").append(text)');
		}				
	}
// 下一页
	function xiapage(id,length){
		if(length === 20){
			var content=$("<div class='nextpage col-lg-12 col-md-12 col-sm-12 col-xs-12'><button class='xiayiye btn btn-default' type='button'>更多</button></div>");
		}
		else{
			var content=$("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>无更多资讯</div>");
		}
		eval('$("#'+id+'").append(content)');
		$(".xiayiye").click(function(event){
			eval('$("#'+id+' .nextpage").remove()');
			page++;
			if(id === "T0"){
				searchcontent(str,page)
			}
			else{
				channelcontent(channelId,page,id);
			}
		})	
	}
})
