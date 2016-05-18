<?php
header('Content-type:text/json');
if($_GET){
	$username = $_GET['username'];
	$link = mysqli_connect('localhost','root','','mybishe');
	mysqli_query($link,"set names utf8");
	if(!$link){
		echo "连接数据库失败";
	}
	else{
		$surface="show tables like '{$username}'";
		$surfaceResult=mysqli_query($link,$surface);
		$surfaceLine=mysqli_num_rows($surfaceResult);
		if ($surfaceLine){ //判断是否存在个人音乐表
			$song="select * from {$username}";
			$result=mysqli_query($link,$song);
			$num=mysqli_num_rows($result);
			if($num){
				while($row = mysqli_fetch_array($result,MYSQL_ASSOC)){
					$json[]=$row;
				}
				echo json_encode($json);
			}
			else{
				echo "0";
			}
		}
		else{
			echo "0";
		}
	}
}
?>