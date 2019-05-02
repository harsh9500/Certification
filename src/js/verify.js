function verifyCerti(){
	var arr = ["-461534293","-1659404298","921746789"]
	var hash = $("#string_hashv").text();
	obj={
		
	}
	var i;
	for(i=0;i<3;i++)
	{
		if(hash==arr[i])
		{
			$("#result").html("Verified!!!");
			$("#result").show();
			break;
		}
		
	}
	if(i==3)
		{
			$("#result").html("Fake!!!");
			$("#result").show();
		}
}