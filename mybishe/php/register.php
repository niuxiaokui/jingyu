<?php
if($_GET){
    $username = $_GET['username'];
    $password = $_GET['password'];
    $email = $_GET['email'];
	$link = mysqli_connect('localhost', 'root','', 'mybishe');
	mysqli_query($link,"set names 'utf8'");
	if(!$link){
		echo "false";
	}
	else{	
		$mz="insert into user (username,password,email) values ('{$username}','{$password}','{$email}')";
		mysqli_query($link,$mz);
		$my="select ID from user where (username = '{$username}') and (password = '{$password}')";
		$implement=mysqli_query($link,$my);
		$result=mysqli_num_rows($implement);
		if($result){
			echo "true";
		}
		else{
			echo "false";
		}
	}
}
else{
	echo "false";
}
?>