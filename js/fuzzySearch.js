/**
 * 模糊匹配
 * cqyang
 * 给拥有匹配功能的输入框添加一个类名---buy-house-ipt
 * 根据定义传入相应的config参数
 */
function MHPiPei(config) {
	this.obj = config.obj; //获取模糊匹配的输入框
	this.list = config.list; //匹配成功后返回的数据列表
	this.tip = config.tip; //匹配不成功显示的提示
	this.listOuter = config.listOuter; //存放列表的外层盒子（父元素）
	this.url = config.url;
}

MHPiPei.prototype = {
	constructor: MHPiPei,
	init: function() {
		this.handleFocus();
		this.handleClick();
	},
	getHouse: function(newValue) {
		var $this = this;
		$.ajax({
			url: $this.url,
			type: "get",
			dataType: "script",
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			// data: {
			// 	fuzzy: 1,
			// 	productname: encodeURI(newValue),
			// 	charset: "utf-8"
			// },
			scriptCharset: 'UTF-8',
			success: function() {
				if (INIT_DATA.data.length == 0) {
					$this.list.hide();
					$this.list.html("");
					$this.tip.show();
				} else {
					var str = '';
					var html = $this.list.html();
					$.each(INIT_DATA.data, function(index, val) {
						var strongWord = val.name.replace(newValue, '<em class="strong">' + newValue + '</em>');
						str += '<li class="house_list_item" data-id="' + val.id + '">' + strongWord + '</li>';
					});
					$this.list.html(str);
					$this.list.show();
					$($this.tip).hide();
				}
			},
			error: function(e) {
				console.log(e)
			}
		});
	},
	handleFocus: function() {
		var searchTimer = null;
		var $this = this;
		$('.buy-house-ipt', this.obj).on('focus', function() {
			var that = $(this);
			var oldValue = $.trim(that.val()),
				newValue;
			clearInterval(searchTimer);
			searchTimer = setInterval(function() {
				newValue = $.trim(that.val());
				if (oldValue != newValue) {
					if (newValue) {
						$this.getHouse(newValue);
					} else {
						$this.list.hide();
						$this.list.html("");
					}
					oldValue = newValue;
				}
			}, 100);
		});
		$('.buy-house-ipt', this.obj).on('blur', function() {
			//失去焦点后，清掉定时器
			clearInterval(searchTimer);
		});
	},
	handleClick: function() {
		var $this = this;
		$($this.list).on('click', 'li', function() {
			var productId = $(this).attr("data-id");
			$(".buy-house-ipt").val($(this).text());
			$this.list.hide();
		});
	}
}