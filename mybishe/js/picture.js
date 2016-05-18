$(function(){
	var page = 0;
	var str = "河南理工大学";
	searchcontent(str)
	function searchcontent(keyword){
		$.ajax({
			url:"http://apis.baidu.com/image_search/search/search",
			type:"get",
			headers:{apikey:"73c93fef4a9678b6c4153624be17af53"},
			dataType:"json",
			data:{word:keyword,pn:page,rn:20,ie:"utf-8"},
			success:function(data){
                // console.log(data)
				context(data.data.ResultArray);	
			}
		})	
	}
	$(".search button").click(searchButton);
    function searchButton(){
        str=$(".searchBar").val();
        str = str.replace(/\s*/,"");
        str = str.replace(/\s*$/,"");
        str = str.replace(/\s+/g," ");
        if(str) {
        	page = 0;
        	$(".zhuti").empty();
            searchcontent(str);
        }  
    }
    $(".searchBar").on("keydown",function(){
        var event = event || window.event || arguments[0];
        if (event.keyCode == 13){
           searchButton();
        }
    })
    function context(data){
    	for(var i in data){
    		var txt = $('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 kuang"><img src="'+data[i].ObjUrl+'" alt="'+str+'" class="left"><a class="introduce" href="'+data[i].FromUrl+'" target="_blank">'+data[i].Desc+'</a></div>');
    		$(".zhuti").append(txt);
    	}
    	$(".left").on("click",function(){
    		$("#large .modal-title").append($(this).next().text());
    		$("#large .modal-body img").attr({src:$(this).attr("src")});
    		$('#large').modal('show');
    	})
    	xiapage(data.length);
    }
    function xiapage(length){
    	if(length === 20){
			var content=$("<div class='nextpage col-lg-12 col-md-12 col-sm-12 col-xs-12'><button class='xiayiye btn btn-default' type='button'>更多</button></div>");	
		}
		else{
			var content=$("<div style='text-align:center'>无更多图片</div>");
		}
		$(".zhuti").append(content);
		$(".xiayiye").click(function(){
			$(".nextpage").remove();
			page++;
			searchcontent(str)
		})
    }
})
