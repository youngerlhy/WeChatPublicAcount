var https = require('https');

var DEFAULT_BUTTONS = {
	button : [
		{
			name : "活动",
			sub_button : [ {
				type : "view",
				name : "羽毛球报名",
				url : "http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com:80/",
				key : "sign up"
			} ]
		}, {
			name : "新闻",
			sub_button : [ {
				type : "view",
				name : "News In BID",
				url : "http://www.baidu.com",
				key : "News In BID"
			}, {
				type : "view",
				name : "Old News",
				url : "http://www.baidu.com",
				key : "Old News"
			} ]
		}, {
			name : "友链",
			sub_button : [ {
				type : "view",
				name : "妥尼唠英文",
				url : "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5NzA4MDA4MA==#wechat_redirect",
				key : "Tony English"
			}, {
				type : "view",
				name : "卡司游影",
				url : "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI1MDM3NzgzNQ==&scene=124#wechat_redirect",
				key : "Leo Public Account"
			}, {
				type : "view",
				name : "不务正业的大车车",
				url : "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4OTIwOTc5Mg==&scene=124#wechat_redirect",
				key : "Big Car"
			} ]
		} ]
	}

function createDefaultButtons(callback) {
	console.log('Start to create default buttons ...');
	var postData = JSON.stringify(DEFAULT_BUTTONS);

	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/menu/create?access_token=" + context.accessToken,
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Content-Length' : Buffer.byteLength(postData)
		}
	};

	var req = https.request(options, function(res) {
		console.log('statusCode:', res.statusCode);
		console.log('headers:\n', res.headers);

		res.on('data', function(data) {
			var result = JSON.parse(data);
			console.log("result:\n", result);
			if (result.errcode && 0 != result.errcode) {
				console.error(result.errmsg);
				return;
			}
			callback();
		});
	});
	req.on('error', function(e) {
		console.error(e);
	});
	req.write(postData);
	req.end();
};

function createConditionalButtons() {
	console.log('Start to create conditional buttons ...');
	var defaultButtonsStr = JSON.stringify(DEFAULT_BUTTONS);
	var defaultButtonsClone = JSON.parse(defaultButtonsStr);
	defaultButtonsClone.button.push({
		name : "管理",
		sub_button : [{
			name : "发起报名",
			type : "click",
			key : "launch sign up"
		},{
			name : "结束报名",
			type : "click",
			key : "stop sign up"
		}]
	});
	defaultButtonsClone.matchrule = {
		tag_id : context.tags[ADMIN_TAG_NAME],
	};
	var postData = JSON.stringify(defaultButtonsClone);

	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/menu/addconditional?access_token="
				+ context.accessToken,
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Content-Length' : Buffer.byteLength(postData)
		}
	};

	var req = https.request(options, function(res) {
		console.log('statusCode:', res.statusCode);
		console.log('headers:\n', res.headers);

		res.on('data', function(data) {
			var result = JSON.parse(data);
			console.log("result:\n", result);
		});
	});
	req.on('error', function(e) {
		console.error(e);
	});
	req.write(postData);
	req.end();
};

module.exports = function() {
	createDefaultButtons(createConditionalButtons);
};