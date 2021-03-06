var HAITOU_URL="http://haitoubang.sinaapp.com";
(function(){
	chrome.extension.sendRequest('get-cookie', function( cookie ){
		if(cookie && cookie !=""){
				getApplyList();
   	 	}else{
   	 		var haitou_user = window.localStorage.getItem('haitou-user')||"";
   	 		if(haitou_user && haitou_user!=""){
   	 			haitou_user = typeof haitou_user === 'string' ? $.parseJSON(haitou_user) : haitou_user;
   	 			var post_data={
   	 				email:haitou_user.email,
   	 				password:haitou_user.password,
   	 			}
   	 			$.ajax({
					type:"post",
					url:HAITOU_URL+'/api/accounts/signin',
					async:true,
					data:JSON.stringify(post_data)
				}).success(function(res){
					res = typeof res === 'string' ? $.parseJSON(res) : res;
					if(res && res.res_code===0){
						return getApplyList();
					}else{return getsiteList();}
				}).error(function(){getsiteList();})
   	 		}else{
				getsiteList();
   	 		}
   	 	}
	})
})();
function getApplyList(){
	$.ajax({
		type:"POST",
		url:HAITOU_URL+'/api/apply/list',
		data:JSON.stringify({'offset':'0','limit':'10'})
	}).success(function(res){
		$(".haitou-background").hide();
		res = typeof res === 'string' ? $.parseJSON(res) : res;
		if(res && res.res_code===0){
			if(res.msg && res.msg.length>0){
				return renderApplyList(res.msg);
			}
		}
		getsiteList();
	});
}
function status_text(s){
	switch(s){
		case 0:
			return "<span class='right'><a href='http://haitoubang.sinaapp.com/apply/list' class='text-success' target='_blank'>发送中</a>";
			break;
		case 1:
			return "<span class='right'><a href='http://haitoubang.sinaapp.com/apply/list' class='text-danger' target='_blank'>发送失败</a>";
			break;
		case 2:
			return "<span class='right'><a href='http://haitoubang.sinaapp.com/apply/list' class='text-success' target='_blank'>发送成功</a>";
			break;
		case 3:
			return "<span class='right'><a href='http://haitoubang.sinaapp.com/apply/list' class='text-success' target='_blank'>HR已读</a>";
			break;
		case 4:
			return "<span class='right'><a href='http://haitoubang.sinaapp.com/apply/list' class='text-success' target='_blank'>HR已回复</a>";
			break;
	}
}
function formatDate(d){
	if(!d){return '--'}
	try{
		var d=new Date(d*1000);
		return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	}catch(e){
		return '--'
	}
}
function subTitle(str){
	if(!str) return '--';
	return str.length>35?str.substring(0,35)+'...':str
}
function renderApplyList(list){
	var html="<li class='clearfix' style='height:16px'><span class='left'>申请记录</span><span class='right'>状态</span></li>";
	$("#sitelist").html("");
	for(var i=0;i<list.length;i++){
		html+="<li class='clearfix'><a href='"+list[i].url+"' target='_blank' class='left' title='"+list[i].job_title+"'><span class='vMiddle'>"+subTitle(list[i].job_title)+"</span><span class='vHeight'></span></a>"+status_text(list[i].status)+"<br><i>"+formatDate(list[i].create_time)+"</i></span></li>"
	}
	$("#applist").append("<ul>"+html+"</ul><p class='textCenter' style='padding:10px 0'><a target='_blank' href='http://haitoubang.sinaapp.com/apply/list'>查看更多</a></p>")
}
function getsiteList(){
	chrome.extension.sendRequest('get-site', function( site ){
		if(site){
			$(".haitou-background").hide();
			site = typeof site === 'string' ? $.parseJSON(site) : site;
			var html='<li>你还没有申请职位，去以下网站快速投递简历</li>';
			$("#applist").html("");
			for(var i=0;i<site.length;i++){
				html+="<li class='clearfix'><span class='left' title='"+site[i].title+"'><span class='vMiddle'>"+subTitle(site[i].title)+"</span><span class='vHeight'></span></span><span class='right'><a href='"+site[i].url+"' target='_blank' >去投简历</a></span></li>"
			}
			$("#sitelist").append("<ul>"+html+"</ul></p>")
		}
	})
}
