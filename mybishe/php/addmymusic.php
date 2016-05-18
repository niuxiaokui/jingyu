<?php
if($_GET){
	$username = $_GET['username'];
	$song_id = $_GET['song_id'];
	$song_name = $_GET['song_name'];
	$singer_name = $_GET['singer_name'];
	$img_link = $_GET['img_link'];
	$song_link = $_GET['song_link'];
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
			$song="select song_id from {$username} where song_id='{$song_id}'";
			$songResult=mysqli_query($link,$song);
			$songLine=mysqli_num_rows($songResult);
			if($songLine){ // 判断是否添加过该歌曲
				echo "已添加过该歌曲";
			}
			else{
				$addMusic="insert into {$username} values ('{$song_id}','{$song_name}','{$singer_name}','{$img_link}','{$song_link}')";  //添加音乐
				$addMusicResult=mysqli_query($link,$addMusic);
				$data="select song_name from {$username} where song_id = '{$song_id}'";
				$dataResult=mysqli_query($link,$data);
				$dataLine=mysqli_num_rows($dataResult);
				if($dataLine){
					echo "添加成功！";
				}
				else{
					echo "添加失败！";
				}

			}
		}
		else{
			//创建表
			$createSurface = "create table {$username} (song_id varchar(20),song_name varchar(20),singer_name varchar(20),img_link varchar(150),song_link varchar(150))default charset utf8";	
			mysqli_query($link,$createSurface);
			$addMusic="insert into {$username} values ('{$song_id}','{$song_name}','{$singer_name}','{$img_link}','{$song_link}')";
			mysqli_query($link,$addMusic);
			$data='select song_name from "{$username}" where song_id = "{$song_id}"';
			$dataResult=mysqli_query($link,$data);
			$dataLine=mysqli_num_rows($dataResult);
			if($dataLine){
				echo "添加成功！";
			}
			else{
				echo "添加失败！";
			}
		}
	}		
}

?>