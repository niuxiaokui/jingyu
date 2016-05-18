$(function(){
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
// 百度音乐榜
// type  1、新歌榜 2、热歌榜 8、Billboard 11、摇滚榜 12、爵士 13、推荐 14、影视金曲榜 20、华语金曲榜 21、欧美金曲榜 22、经典老歌榜 23、情歌对唱榜 25、网络歌曲
    var type=13; 
    var offset=0; 
    var id="T1";
    var n=1;
    var songid1=null;
    var audio=document.getElementById('audio');
    bodycontent(13,offset,id);
// 确定榜单
    $("#myTab").click(function(event){
        offset=0;
        n=1;
        e=event || window.event || arguments[0];
        switch(e.target.innerHTML){
            case "推荐" : type=13;id="T1";break;
            case "新歌" : type=1;id="T2";break;
            case "热歌" : type=2;id="T3";break;
            case "老歌" : type=22;id="T4";break;
            case "情歌" : type=23;id="T5";break;
            case "华语" : type=20;id="T6";break;
            case "网络" : type=25;id="T7";break;
            case "摇滚" : type=11;id="T8";break;
            case "影视" : type=14;id="T9";break;
            case "欧美" : type=21;id="T10";break;
            case "爵士" : type=12;id="T11";break;    
            case "Billboard" : type=8;id="T12";break;
        }
        eval('$("#'+id+'").empty()');
        bodycontent(type,offset,id);
    })
// 查询榜单
    function bodycontent(type,offset,id) {
        $.ajax({
            url: "http://tingapi.ting.baidu.com/v1/restserver/ting",
            type:"get",
            dataType: "jsonp",
            data:{format: "json",from: "webapp_music",method:"baidu.ting.billboard.billList",type:type,size:20,offset:offset},
            success: function(data) {
                content(data,id);
                xiapage(id,data.song_list,offset);
                $(".right2").on("click",function(){
                    var songid2=$(this).next().next().text();
                    if(songid1 !== songid2){
                        $(".right2").not(this).removeClass("glyphicon-pause").addClass("glyphicon-play"); 
                        $(this).removeClass("glyphicon-play").addClass("glyphicon-pause");                       
                        idurl(songid2);
                        songid1 = songid2;
                    }
                    else{
                        if(audio.paused){
                            $(this).removeClass("glyphicon-play").addClass("glyphicon-pause"); 
                            audio.play();
                        }
                        else{
                            $(this).removeClass("glyphicon-pause").addClass("glyphicon-play"); 
                            audio.pause();
                        }
                    }
            　　});  
                $(".right3").on("click",function(){
                    var name=$(".username").text();
                    if(name.length === 0){
                        $("#nologin").modal('show');
                    }
                　　else{
                    　　var id=$(this).next().next().next().text();
                        addsql(id,name);
                    }
            　　});    
            }
        })            
    }
// 添加到数据库
    function addsql(id,name){
        $.ajax({
            url: "http://tingapi.ting.baidu.com/v1/restserver/ting",
            type:"get",
            dataType: "jsonp",
            data:{format: "json",from: "webapp_music",method:"baidu.ting.song.play",songid:id},
            success: function(data) {
                var song_name = data.songinfo.title;
                var singer_name = data.songinfo.author;
                var img_link = data.songinfo.pic_radio;
                var song_link = data.bitrate.show_link;
                $.ajax({
                    url: "php/addmymusic.php",
                    type:"get",
                    data:{
                        username : name,
                        song_id : id,
                        song_name : song_name,
                        singer_name : singer_name,
                        img_link : img_link,
                        song_link : song_link
                    },
                    success: function(data) {
                        $("#alert .modal-title").text(data);
                        $("#alert").modal('show');
                    }
                })
            }
        })
    }
// 输出榜单内容
    function content(data,id){
        if(data.song_list !== null && data.song_list.length>0){
            for(var i in data.song_list){
                var text=$('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 music clear"><div class="left">'+n+'</div><div class="title">'+data.song_list[i].title+'</div><div class="right3 glyphicon glyphicon-plus"></div><div class="right2 glyphicon glyphicon-play"></div><div class="right1">'+data.song_list[i].author+'</div><div class="hidden">'+data.song_list[i].song_id+'</div></div>');
                eval('$("#'+id+'").append(text)');
                n++;          
            }
        }
        else if(data.song_list === null){
            var content=$("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' style='text-align:center'>无更多乐曲</div>");
            eval('$("#'+id+'").append(content)');
        }
        else{
            var text=$("<h2 style='text-align:center'>居然没搜到您想要的乐曲<br>宝宝不高兴！！！<br>更换关键词再试试？</h2>");
            eval('$("#'+id+'").append(text)');
        }    
    }
// 下一页
    function xiapage(id,length){
        if(length !== null &&length.length === 20){
            var content=$("<div class='nextpage col-lg-12 col-md-12 col-sm-12 col-xs-12'><button class='xiayiye btn btn-default' type='button'>更多</button></div>");
            offset+=20;  
        }
        else{
            var content=$("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' style='text-align:center'>无更多乐曲</div>");
        }
        eval('$("#'+id+'").append(content)');
        $(".xiayiye").click(function(){
            eval('$("#'+id+' .nextpage").remove()');
            if(id === "T0"){
                searchcontent(str);
            }
            else{
                bodycontent(type,offset,id);
            }
        })  
    }
// 根据id查询url
    function idurl(songid){
        $.ajax({
            url: "http://tingapi.ting.baidu.com/v1/restserver/ting",
            type:"get",
            dataType: "jsonp",
            data:{format: "json",from: "webapp_music",method:"baidu.ting.song.play",songid:songid},
            success: function(data) {
                var url=data.bitrate.show_link;
                $("#audio").attr({src:url})
            }
        })
    }
// 百度搜索
// 关键词处理
    $(".search button").click(searchButton);
    function searchButton(){
        str=$(".searchBar").val();
        str = str.replace(/\s*/,"");
        str = str.replace(/\s*$/,"");
        str = str.replace(/\s+/g," ");
        if(str) {
            searchcontent(str);
        }   
    }
    $(".searchBar").on("keydown",function(){
        var event = event || window.event || arguments[0];
        if (event.keyCode == 13){
           searchButton();
        }
    })
// 关键词查询
    function searchcontent(keyword){
        n=1;
        $.ajax({
            url: "http://tingapi.ting.baidu.com/v1/restserver/ting",
            type:"get",
            dataType: "jsonp",
            data:{format: "json",from: "webapp_music",method:"baidu.ting.search.catalogSug",query:keyword},
            success: function(data) {
                $("#myTab li,.tab-pane").removeClass("active");
                $("#T0").empty().addClass("active");
                if(data.error_message === "failed"){
                   var content=$("<h2 style='text-align:center'>居然没搜到您想要的乐曲<br>宝宝不高兴！！！<br>更换关键词再试试？</h2>");
                    $("#T0").append(content);
                }
                else{
                    seacontent(data.song);
                    $(".right2").on("click",function(){
                        var songid2=$(this).next().next().text();
                        if(songid1 !== songid2){
                            $(".right2").not(this).removeClass("glyphicon-pause").addClass("glyphicon-play"); 
                            $(this).removeClass("glyphicon-play").addClass("glyphicon-pause");                       
                            idurl(songid2);
                            songid1 = songid2;
                        }
                        else{
                            if(audio.paused){
                                $(this).removeClass("glyphicon-play").addClass("glyphicon-pause"); 
                                audio.play();
                            }
                            else{
                                $(this).removeClass("glyphicon-pause").addClass("glyphicon-play"); 
                                audio.pause();
                            }
                        }
                　　});
                    $(".right3").on("click",function(){
                        var name=$(".username").text();
                        if(name.length === 0){
                            $("#nologin").modal('show');
                        }
                    　　else{
                        　　var id=$(this).next().next().next().text();
                            addsql(id,name);
                        }
                　　});      
                }
            }
        })
    }
// 查询结果输出
    function seacontent(song){
       for(var i in song){
            var text=$('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 music clear"><span class="left">'+n+'</span><span class="title">'+song[i].songname+'</span><span class="right3 glyphicon glyphicon-plus"></span><span class="right2 glyphicon glyphicon-play"></span><span class="right1">'+song[i].artistname+'</span><span class="hidden">'+song[i].songid+'</span></div>');
            $("#T0").append(text);
            n++;          
       }
       if(n !== 11){
            var content=$("<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' style='text-align:center'>无更多乐曲</div>");
            $("#T0").append(content);
       }
    }
})
