$(function(){
// ip查位置天气
	$.ajax({
		url:"http://api.map.baidu.com/location/ip",
		type: "get",
		dataType:"jsonp",
		data:{ip:"",ak:"KWBBb4o9L09elbki7Iqrx1UW"},
		success:function(data){
			var city=$(".city");
			city.html(data.content.address_detail.city)
			$.ajax({
				url:"http://op.juhe.cn/onebox/weather/query",
				type: "get",
				dataType:"jsonp",
				data:{cityname:city.html(),key:"472b0b927017d622ca22dd4cc2d7a4df"},
				success:function(data){
					var weather=data.result.data.realtime.weather;
					$(".war_a").html("天气："+weather.info)
					$(".war_b").html("温度："+weather.temperature);
					$(".war_c").html("湿度："+weather.humidity);
					$(".war_d").html("污染："+data.result.data.life.info.wuran[0]);
				}
			})
		}
	})


// 经纬度查位置天气
	// 调用浏览器中地理位置API
	// navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
 //    function successCallback(d) {
 //        //根据回调函数返回的坐标对象，获取经纬度
 //        var lon = d.coords.longitude;
 //        var lat = d.coords.latitude;
 //        $.ajax({
	// 		url:"http://apis.baidu.com/showapi_open_bus/weather_showapi/point",
	// 		type: "get",
	// 		dataType:"json",
	// 		headers:{apikey:"73c93fef4a9678b6c4153624be17af53"},
	// 		data:{lng:lon,lat:lat,from:5},
	// 		success:function(data){
	// 			var now=data.showapi_res_body.now;
	// 			$(".city").html(data.showapi_res_body.cityInfo.c7+"-"+data.showapi_res_body.cityInfo.c3)
	// 			$(".war_a").html("天气："+now.weather)
	// 			$(".war_b").html("温度："+now.temperature+"℃");
	// 			$(".war_c").html(now.wind_direction+now.wind_power);
	// 			$(".war_d").html("更新时间："+now.temperature_time);
	// 		}
	// 	}) 

 //    }
 //    function errorCallback(d){
 //    	console.log("定位失败");
 //    }
})