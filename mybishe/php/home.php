<?php
if($_GET){
    $username = $_GET['r_username'];
	$link = mysqli_connect('localhost','root','','mybishe');
	mysqli_query($link,"set names 'utf8'");
	if(!$link){
  		echo "false";
	}
	else{	
		$my="select password from user where username='{$username}'";
		$implement=mysqli_query($link,$my);
		$result=mysqli_num_rows($implement);
		if(!$result){
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