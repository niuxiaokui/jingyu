$(function(){
	var songlistnum = -1;		// 歌曲总数目
	var songindex = 0;		// 正在播放歌曲的序号
	var songid = null;		// 正在播放歌曲的id
	var audioa = $(".myAudioPlayer");		// 获取播放器节点
	var nowtime = 0;		// 当前位置
	var longtime = null;		// 总长度
	var volumewidth = $(".volume").width();		// 音量条
	var volumcolorwidth = 0.5*volumewidth;
	var speed = 30;		
    var x = lastX = 0;
	var box = $(".page_2");
	var height,width;
	height = 300;
	width = document.body.clientWidth < 768 ? document.body.clientWidth : document.body.clientWidth * 0.8;
	var canvas = document.getElementById('canvas');
	var ac = new (window.AudioContext || window.wdbkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext)		// 创建主体
	var audioSrc = ac.createMediaElementSource(audioa[0]);		// 创建一个MediaElementAudioSourceNode(媒体元素音频源结点)
	var analyser = ac.createAnalyser();		// 创建数据分析对象
	var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();		// 主要控制音量
	audioSrc.connect(analyser);
	gainNode.gain.value = 0.5;
	gainNode.connect(ac.destination);
	var size = width < 768 ? 32 : 64;
	var Dots = [];
	analyser.fftSize = size*2;		// FFT  范围32~2048  实时得到其值的一般
	analyser.connect(gainNode)
	var source=null;
	// 控制声音
	function chengeVolume(percent){
		gainNode.gain.value=percent;
	}
	visualizer();		// 获得数据
	function visualizer(){
		var arr = new Uint8Array(analyser.frequencyBinCount);
		requestAnimationFrame = window.requestAnimationFrame || window.wdbkitrequestAnimationFrame || window.mozrequestAnimationFrame || window.msrequestAnimationFrame || window.orequestAnimationFrame;		// 浏览器绘制间隔函数
		function v(){		// 实时更新
			analyser.getByteFrequencyData(arr);
			draw(arr);
			requestAnimationFrame(v)
		}
		requestAnimationFrame(v);
	}
	function draw(arr){		// 绘画
		ctx.clearRect(0,0,width,height);		// 清除画布
		var w=width/size;
		var cw = w*0.6;
		var capH = 5;		// 正方形
		for(var i = 0;i<size; i++){		// 柱状还是圆点
			var yuan=Dots[i];
			if(draw.type == "column"){
				ctx.fillStyle = line;
				var h= arr[i]/256*height;
				ctx.fillRect(w*i,height-h,cw,h);
				ctx.fillRect(w*i,height-(yuan.cap+capH),cw,capH);		// 帽子
				yuan.cap-= 2;
				if(yuan.cap < 0){
					yuan.cap = 0;
				}
				if(h > 0 && yuan.cap < h+2){
					yuan.cap = h+2 > height - capH ? height - capH : h+2;
				}

			}
			else if(draw.type == "dots"){
				ctx.beginPath();
				var r = 10 + arr[i] / 256 * (height > width ? width : height ) / 10;
				ctx.arc(yuan.x,yuan.y,r,0,Math.PI*2,true);
				var g=ctx.createRadialGradient(yuan.x,yuan.y,0,yuan.x,yuan.y,r);
				g.addColorStop(0,"#fff");
				g.addColorStop(1,yuan.color);
				ctx.fillStyle = g;
				ctx.fill();
				yuan.x+=yuan.dx;
				yuan.x=yuan.x>width?0:yuan.x;
			}
		}
	}
	draw.type = "column";
	var ctx = canvas.getContext("2d");
	var line;
	canvas.height = height;
	canvas.width = width;
	line = ctx.createLinearGradient(0,0,0,height);
	line.addColorStop(0,"red");
	line.addColorStop(0.5,"yellow");
	line.addColorStop(1,"blue");
	getDose()
	window.onresize = function(){
		height = box.height();
		width = box.width();
		canvas.height = height;
		canvas.width = width;
		line = ctx.createLinearGradient(0,0,0,height);
		line.addColorStop(0,"red");
		line.addColorStop(0.5,"yellow");
		line.addColorStop(1,"blue");
		getDose()
	}
// 圆点
	function random(m,n){
		return Math.round(Math.random()*(n-m)+m)
	}
	function getDose(){
		Dots = [];
		for (var i = 0; i < size; i++) {
			var x= random(0,width);
			var y= random(0,height);
			var color = "rgba("+random(0,255)+","+random(0,255)+","+random(0,255)+",0.3)";
			Dots.push({x:x,y:y,dx:random(1,3),color:color,cap:0})
		};
	}


// 播放进度
	audioa.on("timeupdate",function(){
	// 总长度
		longtime = audioa[0].duration
		var longm = Math.floor(longtime/60);
		var longs = Math.floor(longtime%60);
		if(longs < 10){
			$(".duration").text(longm+":0"+longs);
		}
		else{
			$(".duration").text(longm+":"+longs);
		}
	// 当前位置
		nowtime = audioa[0].currentTime;
		var nowm = Math.floor(nowtime/60);
		var nows = Math.floor(nowtime%60);
		if(nows < 10){
			$(".currentTime").text(nowm+":0"+nows);
		}
		else{
			$(".currentTime").text(nowm+":"+nows);
		}
		var longwidth = $(".playprogress").width();
		var width = Math.floor(nowtime/longtime*longwidth);
		eval("$('.progresscolor').width("+width+")");
	});
// 指定位置播放
	$(".playprogress").click(function(event){
		if(songlistnum !== -1){
			var clickx = event.clientX;
			var playerleft = $(".playprogress").offset().left;
			var width = clickx-playerleft;
			var playerwidth = $(".playprogress").width();
			eval("$('.progresscolor').width("+width+")");
			audioa[0].currentTime = width/playerwidth*longtime;
		}
	})	
// sessionStorage,localStorage
	var username=localStorage.getItem("l_username") || sessionStorage.getItem("l_username");
	var password=localStorage.getItem("l_password") || sessionStorage.getItem("l_password");
	$.ajax({
		url: "php/getmymusic.php",
		data: {username : username},
		type: "get",
		success: function(data){
			if(data){
				songlistnum = data.length - 1;
				songlist(data);
				playsong(0);
			}
			else{ 
				state();
			}		
		}
	})
// 无收藏音乐时状态
	function state(){
		$(".page_1").append("<h3>您还未添加任何歌曲</h3>");
		$(".song_name").text("欢迎您");
		$(".song_singer").text(username);
		$(".songpicture").attr({src:"images/lb2.jpg"});
		$(".progresscolor").attr({width:0});
		$(".currentTime,.duration").text("0:00");
	}
// 音乐列表
	function songlist(data){
		for(var i in data){
			var song = $('<div class="list clear"><div class="playing"></div><div class="listnum"><div class="name">'+data[i].song_name+'</div><div class="singer">'+data[i].singer_name+'</div></div><div class="delete">删除</div><div class="hidden">'+data[i].song_id+'</div><div class="hidden">'+data[i].img_link+'</div><div class="hidden">'+data[i].song_link+'</div></div></div>');
			$(".page_1").append(song);
		}
		songid = data[0].song_id;
	// 点击播放
		$(".listnum").on("click",function(){
			songindex = $(this).parent().index();
			$(".playing").empty();		// 清除图标
			var icon = $('<div class="glyphicon glyphicon-music"></div>');		// 添加图标
			$(this).prev().append(icon);
			var sname = $(this).children().first().text();		// 歌曲
			$(".song_name").text(sname);
			var ssinger = $(this).children().last().text();     // 歌手
			$(".song_singer").text(ssinger);
			songid = $(this).next().next().text();		// id
			var simg = $(this).next().next().next().text();		// 图片
			$(".songpicture").attr({src:simg});
			var slink = $(this).next().next().next().next().text();		// 链接
			// audioa.attr({src:slink});
			audioa.attr({src:"Sugar.mp3"});
			$(".playpause .glyphicon").removeClass('glyphicon-play').addClass('glyphicon-pause');
			audioa[0].play();
		})
	// 删除
		$(".delete").on("click",function(){
			var deleteindex = $(this).parent().index();
			var song_id = $(this).next().text();
			$.ajax({
				url:"php/removemymusic.php",
				data:{username : username, song_id : song_id},
				type:"get",
				success:function(data){
					if(Number(data)){
						songlistnum--;
						eval('$(".page_1 .list:eq('+deleteindex+')").remove()');
						if(songlistnum === -1){
							state();
							$(".playpause .glyphicon").removeClass('glyphicon-pause').addClass('glyphicon-play');
							audioa[0].pause();
							$(".myAudioPlayer").attr({src:""});
						}
						else {
							if(songindex > deleteindex){
								songindex--;	
							}
							else if(songindex === deleteindex){
								if(songindex === 0){
									songindex = songlistnum;
								}
								else{
									songindex--;
								}
								playsong(songindex);
							}
						}
					}
				}
			})	
		})
	}
// 播放、暂停
	$(".playpause").click(function(){
		if(songlistnum !== -1){
			if(audioa[0].paused){
				$(".playpause .glyphicon").removeClass('glyphicon-play').addClass('glyphicon-pause');
				audioa[0].play();
			}
			else{
				$(".playpause .glyphicon").removeClass('glyphicon-pause').addClass('glyphicon-play');
				audioa[0].pause();
			}
		}
	})
// 上一曲
	$(".previous").click(function(){
		if(songlistnum !== -1){
			if(songindex === 0){
				songindex = songlistnum;
			}
			else{
				songindex--;
			}
			playsong(songindex);
		}
		changelrc();
	})
// 下一曲
	$(".next").click(function(){
		if(songlistnum !== -1){
			if(songindex === songlistnum){
				songindex = 0;
			}
			else{
				songindex++;
			}
			playsong(songindex);
			changelrc();
		}
	})
// 上、下、删除操作后播放
	function playsong(songindex){
		var thissong= $(".page_1").children().eq(songindex);
		$(".playing").empty();		// 清除图标
		var icon = $('<div class="glyphicon glyphicon-music"></div>');		// 添加图标
		thissong.children(".playing").append(icon);
		var sname = thissong.children(".listnum").children(".name").text();		// 歌曲
		$(".song_name").text(sname);
		var ssinger = thissong.children(".listnum").children(".singer").text();     // 歌手
		$(".song_singer").text(ssinger);
		songid = thissong.children(".hidden").eq(0).text();		// id
		var simg = thissong.children(".hidden").eq(1).text();		// 图片
		$(".songpicture").attr({src:simg});
		var slink = thissong.children(".hidden").eq(2).text();		// 链接
		// audioa.attr({src:slink});
		audioa.attr({src:"Sugar.mp3"});
		$(".playpause .glyphicon").removeClass('glyphicon-play').addClass('glyphicon-pause');
		audioa[0].play();
	}
	$(".muted").click(function(){
		if(songlistnum !== -1){
			$(".muted").empty();
			if(audioa[0].muted){
				audioa[0].muted = false;
				chengeVolume(volumenum);
				eval("$('.volumecolor').width("+volumcolorwidth+")");
				if(volumenum > 0.5){
					$(".muted").append('<div class="glyphicon glyphicon-volume-up"></div>');
				}
				else{
					$(".muted").append('<div class="glyphicon glyphicon-volume-down"></div>');
				}
			}
			else{
				audioa[0].muted = true;
				$(".muted").append('<div class="glyphicon glyphicon-volume-off"></div>');
				$(".volumecolor").width(0)
				volumenum = gainNode.gain.value;
			}
		}
	});
// 控制声音
	$(".volume").click(function(event){
		if(songlistnum !== -1){
			var e = event || window.event || arguments[0];
			var x = e.clientX;
			var playerleft = $(".volume").offset().left;
			volumcolorwidth = x-playerleft;
			eval("$('.volumecolor').width("+volumcolorwidth+")");
			volumenum = volumcolorwidth/volumewidth;

			$(".muted").empty();
			if(volumenum < 0){
				volumenum = 0;
			}
			else if(volumenum > 0.5){
				$(".muted").append('<div class="glyphicon glyphicon-volume-up"></div>');
			}
			else{
				$(".muted").append('<div class="glyphicon glyphicon-volume-down"></div>');
			}
			chengeVolume(volumenum);
		}
	})
// 重力感应
	var ganying = true;
	$(".zhongli").click(function() {
		if(ganying){
			$(window).on('devicemotion',deviceMotion); 
        	$(".zhongli").text("已开启“摇一摇”换歌");
        	ganying = false;
		}
		else{
			$(window).off('devicemotion');  
			$(".zhongli").text("未开启“摇一摇”换歌");
			ganying = true;
		}
	    function deviceMotion() {
			var acceleration = event.accelerationIncludingGravity;
			x = acceleration.x;
			if(Math.abs(x-lastX) > speed) {
			    if(songlistnum !== -1){
					if(songindex === songlistnum){
						songindex = 0;
					}
					else{
						songindex++;
					}
					playsong(songindex);
				}
			}
			lastX = x;
	    }	
	});
// 显示歌词
   	$(".lyric").on("click",function(){
   		changelrc();
   		$(".page_3").removeClass('hidden');
		$(".page_1,.page_2").addClass('hidden');
   	})
   	function changelrc(){
		if(songlistnum !== -1){
			$(".page_3").empty();
	   		$.ajax({
	            url: "http://tingapi.ting.baidu.com/v1/restserver/ting",
	            type:"get",
	            dataType: "jsonp",
	            data:{format:"json",from:"webapp_music",method:"baidu.ting.song.lry",songid:songid},
	            success: function(data) {
	            	var str = data.lrcContent;
	            	var time = /\[.*\]/g;		// 替换时间[00:00]
	            	str = str.replace(time,"<br>")
					$(".page_3").append(str);	
				}
			})
		}
	}
// 显示列表
   	$(".songlist").click(function(){
   		$(".page_1").removeClass('hidden');
		$(".page_2,.page_3").addClass('hidden');
   	});
// 音乐可视化效果一
   	$(".visualization_1").click(function(){
   		$(".page_2").removeClass('hidden');
		$(".page_1,.page_3").addClass('hidden');
		draw.type = "column";
   	});
// // 音乐可视化效果二
   	$(".visualization_2").click(function(){
   		$(".page_2").removeClass('hidden');
		$(".page_1,.page_3").addClass('hidden');
		draw.type="dots";
   	});
})