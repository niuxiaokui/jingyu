<?php
if($_GET){
	$username = $_GET['username'];
	$song_id = $_GET['song_id'];
	$link = mysqli_connect('localhost','root','','mybishe');
	mysqli_query($link,"set names utf8");
	if(!$link){
		echo "连接数据库失败";
	}
	else{
		$removesong="delete from {$username} where song_id = {$song_id}";
		mysqli_query($link,$removesong);
		$num=mysqli_affected_rows($link);
		if($num){
			echo "1";
		}
		else{
			echo "0";
		}
	}	
}
else{
	echo "0";
}
?>