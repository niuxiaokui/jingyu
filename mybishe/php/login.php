<?php 
if($_POST){
    $username = $_POST['username'];
    $password = $_POST['password'];
  	$link = mysqli_connect('localhost', 'root','', 'mybishe');
	mysqli_query($link,"set names 'utf8'");
	if(!$link){
		echo "false";
	}
	else{	
		$my="select password from user where (username = '{$username}') and (password = '{$password}')";
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

?>