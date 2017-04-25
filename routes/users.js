var express = require('express');
var moment = require('moment');
var crypto = require('crypto');
var router = express.Router();
var db = require('../lib/mysqls');

var cookie_name = '';
var para;
router.all('*',function (req, res, next) {
	para = {};
	if (req.cookies.userInfo) {
		cookie_name = req.cookies.userInfo;
	} else {
		cookie_name = '';
	}
	para['name'] = cookie_name;
	para['menu'] = 'home';
	next();
})



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/home', function(req, res, next) {
	console.log(req.cookies);
	db.query('select * from bk', function (err, data, fields) {
		if (err) {
			throw err;
		}
		para['bk'] = data;
		db.query('select * from zhuti', function (err, data1, fields) {
			console.log({name: req.cookies.userInfo,bk: data,zhuti: data1});
			if (req.cookies.userInfo) {
				para['zhuti'] = data1;
				res.render('user/index', para);
			} else {
				res.render('user/login', para);
			}
		})
			
	});
		
  
});

router.get('/register', function (req, res, next) {
	res.render('user/register', para);
});

router.get('/login', function (req, res, next) {
	console.log(para);
	res.render('user/login', para);
});
router.get('/zhuti', function (req, res, next) {
	let id = req.query.id;
	para['zt_id'] = id;
	db.query('select bk.bkname,bk.bkadmin,zhuti.name,zhuti.tiezi_num from bk,zhuti where bk.id = zhuti.bk_id and zhuti.id = ?;',[id],function (err, data, fields) {
		if (err) {
			throw err;
		}
		para['bkname'] = data[0].bkname;
		para['zhutiname'] = data[0].name;
		para['bkadmin'] = data[0].bkadmin;
		para['tiezi_num'] = data[0].tiezi_num;
		para['menu'] = 'zhuti';
		console.log(id);
		console.log('select * from tiezi where zhuti_id = 12');
		db.query('select * from tiezi where zhuti_id = ?',[id],function (err, data1, fields){
			console.log(data1);
			para['tiezi'] = data1;
			console.log(para);
			if (data.length == 1) {
				res.render('user/zhuti', para);
			} else {
				res.redirect('back');
			}
		})
			
	})
		
});

router.get('/isRepeat', function (req, res, next) {
	var name = req.query.user;
	console.log(name);
	db.query('select * from user where name = ?',[name],function (err, data, fields) {
		if (data.length > 0) {
			res.json({result: 1});
		} else {
			res.json({result: 0});
		}
	})
});
router.get('/regi', function (req, res, next) {
	var createtime = moment().format('YYYY-MM-DD hh:mm:ss');
	let {name, password} = req.query;
	console.log(password);
	var md5 = crypto.createHash('md5');
	md5.update(password);
	password = md5.digest('hex');
	console.log(password);
	db.query('insert into user(name, password, createtime) values(?,?,?)',[name, password, createtime],function (err, data, fields) {
			if (err) {
				throw err;
			}
			if (data.affectedRows > 0) {
				// res.redirect('/users/login');
				res.json({result: 1});
			} else {
				res.json({result: 0});
			}
	})
});
router.get('/logi', function (req, res, next) {
	let {name, password} = req.query;
	let md5 = crypto.createHash('md5');
	md5.update(password);
	password = md5.digest('hex');
	db.query('select * from user where name = ? and password = ?',[name,password],function (err, data, fields) {
		console.log('查出来的用户：',data);
		if (data.length == 1) {
			console.log('查出来了');
			res.cookie('userInfo', name, { httpOnly: true });
			res.redirect('/users/home');
		} else {
			console.log('没有查出来了');
			res.redirect('back');
		}

	})
});
router.get('/logout', function (req, res, next) {
	res.clearCookie('userInfo');
	res.redirect('back');
});
router.get('/fatie/:id', function (req, res, next) {
	var id = req.params.id;
	para['zt_id'] = id;
	if (cookie_name == '') {
		res.redirect('/users/login');
	} else {
		para['menu'] = 'fatie';
		res.render('user/fatie',para);
	}
	
});
router.post('/addtz', function (req, res, next) {
	let {zhuti_id, content, title} = req.body;
	let edittime = moment().format('YYYY-MM-DD hh:mm:ss');
	let author = para['name'];
	db.query('insert into tiezi(zhuti_id, content, edittime, title, author) values(?,?,?,?,?)',[zhuti_id, content, edittime, title, author], function (err, data, fields) {
		if (err) {
			throw err;
		}
		if (data.affectedRows == 1) {
			res.json({result: 1});
		} else {
			res.json({result: 0});
		}
	})
});
router.get('/tiezi', function (req, res, next) {
	var id = req.query.id;
	db.query('select * from tiezi where id = ?', [id], function (err, data, fields) {
		res.send(data);
	})
})
module.exports = router;
