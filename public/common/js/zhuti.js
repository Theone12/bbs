$(function () {
	$("#add").click(function() {
		var bk = $("#bk").val();
		var zhuti = $("#zhuti").val();
		if (zhuti == '') {
			alert('主题不能为空！');
			return;
		}
		$.ajax({
			url: '/admin/addZhuti',
			type: 'get',
			dataType: 'json',
			data: {bk_id: bk, name: zhuti},
			success: function (data) {
				if (data.result == 1) {
					alert('添加成功！');
				} else {
					alert('添加失败！');
				}
			}
		});
	})
})