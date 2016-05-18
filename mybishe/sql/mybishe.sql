-- 创建用户表
create table user( 
	id int auto_increment primary key, 
	username varchar(12), 
	password varchar(20), 
	email varchar(40) 
)charset utf8;
-- 创建用户音乐表
create table {$username}(
	song_id varchar(20),
	song_name varchar(20),
	singer_name varchar(20),
	img_link varchar(150),
	song_link varchar(150)
)default charset utf8;