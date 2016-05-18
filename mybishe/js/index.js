$(function(){
// 轮播图
	$("#myCarousel").carousel({
		interval:3000,
		pause:'hover',//悬停
		// wrap:false,// 循环
	})
// 注册
	$('#toRegister').click(function() {
		$("#login,#nologin").modal('hide');
		$('#register').modal('show');
	});
	$(".reset").click(function(){
		$(".form-group div").empty();
	})
// 登录
	$('.toLogin,#registerLogin,#toLogin').click(function() {
		$("#register,#registerSuccess,#nologin").modal('hide');
		$('#login').modal('show');
	});
// sessionStorage,localStorage
	var username=localStorage.getItem("l_username") || sessionStorage.getItem("l_username");
	var password=localStorage.getItem("l_password") || sessionStorage.getItem("l_password");
// 登录前
	var cancellation=$('<li><a class="btn btn-default" data-toggle="modal" href="#login" type="button"><strong>登录</strong></a></li><li><a class="btn btn-default" data-toggle="modal" href="#register" type="button"><strong>注册</strong></a></li>');
	if(username && password){
		toOnline(username,password);
	}
	function toOnline(username,password){
		$.ajax({
			url: "php/login.php",
			data: {username: username,password: password},
			type: "post",
			dataType:"json",
			success: function(data){
				online(username);
			}
		})
	}
// 登录后
	function online(username){
		var onLine=$('<li class="dropdown"><a href="" class="dropdown-toggle username" data-toggle="dropdown" style="text-align:center">'+username+'</a><ul class="dropdown-menu"><li><a href="mymusic.html" style="text-align:center">我的音乐</a></li><li class="cancellation"><a  class="btn btn-default" type="button">注销</a></li></ul></li> ');
		$("#welcome").html("亲爱的"+username);
		$(".login").empty().append(onLine);
		$(".cancellation").click(function(){
			// localStorage.removeItem("username");
			// localStorage.removeItem("password");
			// sessionStorage.removeItem("username");
			// sessionStorage.removeItem("password");
			localStorage.clear();
			sessionStorage.clear();
			$(".login").empty().append(cancellation);
		})
	}

// 注册表单验证
	$("#r_form").validate({
		rules:{
			r_username:{
				required:true,
				rangelength:[6,12],
				remote: {
				    url: "php/home.php",   		//后台处理程序
				    type: "get",            //数据发送方式
				    dataType: "json",       //接受数据格式  
				    data: {                 //要传递的数据
				        r_username: function() {
				            return $("#r_username").val();
				        }
					}
				}		
			},
			r_password:{
				required:true,
				rangelength:[8,20]
			},
			email:{
				required:true,
				email:true
			}
		},
	// 单个设置提示语
		messages:{
				r_username:{
					required:"用户名不能为空",
					rangelength:"请输入6~12个字符",
					remote:"用户名不可用"
				},	
				r_password:{
					required:"密码不能为空",
					rangelength:"请输入8~20个字符"
				},	
				email:{
					required:"邮箱不能为空",
					email:"请输入合法的邮箱"
				}	
			},
	//  更改为异步提交
		submitHandler:function() {
            var r_username = $('#r_username').val();
            var r_password = $('#r_password').val();
            var email = $('#email').val();
            ajaxRegisterForm(r_username, r_password, email);            
        },
    // 修改出错提示语出现的位置
        errorPlacement: function(error, element) {
		   error.appendTo( element.next() );
		}
    });
// 异步执行方法
	function ajaxRegisterForm(r_username, r_password, email) {
		$.ajax({
			url: "php/register.php",
			data: {username: r_username,password: r_password,email: email},
			dataType:"json",
			type: "get",
			success: function(data){
				$("#register").modal('hide');
				if(data){
					$("#registerSuccess").modal('show');
				}
				else{
					$("#registerFailed").modal('show');
				}
			}
		})
	}
// 登录表单验证
	$("#l_form").validate({
		rules:{
			l_username:{
				required:true
			},
			l_password:{
				required:true
			}
		},
	// 单个设置提示语
		messages:{
				l_username:{
					required:"用户名不能为空"
				},	
				l_password:{
					required:"密码不能为空"
				}
			},
	// 用其他方式替代默认的submit   
		submitHandler:function() {
            var l_username = $('#l_username').val();
            var l_password = $('#l_password').val();
            ajaxLoginForm(l_username, l_password);            
        },
    // 修改出错提示语出现的位置
        errorPlacement: function(error, element) {
        	error.appendTo( element.next() );
		}
    });
    function ajaxLoginForm(l_username, l_password) {
    	$.ajax({
			url: "php/login.php",
			data: {username: l_username,password: l_password},
			type: "post",
			dataType:"json",
			success: function(data){	
				if(data){
					if($('#checkbox').is(':checked')){
						localStorage.setItem("l_username",l_username);
						localStorage.setItem("l_password",l_password);	
					}
					else{
						sessionStorage.setItem("l_username",l_username);
						sessionStorage.setItem("l_password",l_password);
					}
					$("#login").modal('hide');
					$("#loginSuccess").modal('show');
					online(localStorage.getItem("l_username")||sessionStorage.getItem("l_username"));
				}
				else{
					$("#login").modal('hide');
					$("#loginFailed").modal('show');
				}
			}
		})
    }
 })    
