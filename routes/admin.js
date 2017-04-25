var express = require('express');
var moment = require('moment');
var router = express.Router();
var db = require('../lib/mysqls');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/page/index');
});
// 首页
router.get('/home', function (req, res, next) {
	res.render('admin/page/home', {title: '超级后台首页'})
});
// 所有板块
router.get('/list', function (req, res, next) {
	console.log(db);
	db.query('select * from bk',function (err, data, fields) {
		if (err) {
			throw err;
		}
		console.log(data);
		res.render('admin/page/list', {data: data});
	});
});
// 新加板块
router.get('/add', function (req, res, next) {
	res.render('admin/page/add', {title: '超级后台首页'})
});
router.get('/addc', function (req, res, next) {
	console.log(req.query);
	var bkname = req.query.bkname;
	var bkadmin = req.query.bkadmin;
	db.query('insert into bk(bkname,bkadmin) values(?,?)',[bkname,bkadmin],function (err, data, fields) {
		if (err) {
			throw err;
		}
		if (data.affectedRows == 1) {
			res.send('新加板块成功!');
		}
	});
});
// 编辑板块
router.get('/edit/:id', function (req, res, next) {
	var id = req.params.id;
	// res.send(id);
	db.query('select * from bk where id = ?', [id], function (err, data, fields) {
		console.log(data);
		res.render('admin/page/edit',{data: data[0]});
	})
});
router.get('/editc', function (req, res, next) {
	let {bkname,bkadmin,id} = req.query;
	db.query('update bk set bkname=?,bkadmin=? where id = ?',[bkname,bkadmin,id], function (err, data, fields) {
			if (err) {
				throw err;
			}
			if (data.affectedRows == 1) {
				res.redirect('list');
			}
	})
});
router.get('/delete/:id', function (req, res, next) {
	var id = req.params.id;
	db.query('delete from bk where id = ?',[id],function (err, data, fields) {
		if (err) {
			throw err;
		}
		console.log(data);
		if (data.affectedRows == 1) {
			res.redirect('/admin/list');
		}
	})
});
router.get('/login', function (req, res, next) {
	res.render('admin/page/login');
});
router.get('/ztadd', function (req, res, next) {
	db.query('select * from bk', function (err, data, fields) {
		if (err) {
			throw err;
		}
		res.render('admin/page/zhuti',{bk:data});
	})
	
});
router.get('/addZhuti', function (req, res, next) {
	// req.json(req.query);
	let {bk_id, name} = req.query;
	var createtime = moment().format('YYYY-MM-DD hh:mm:ss');
	db.query('insert into zhuti(bk_id, name, createtime) values(?,?,?)',[bk_id, name, createtime], function (err, data, fields) {
		if (data.affectedRows == 1) {
			res.json({result: 1});
		} else {
			res.json({result: 0});
		}
	})
});
router.get('/ztlist', function (req, res, next) {
	db.query('select zhuti.id,bk.bkname,zhuti.name from bk,zhuti where bk.id = zhuti.bk_id',function (err, data, fields) {
		console.log(data);
		// res.json(data);
		res.render('admin/page/ztlist',{data: data});
	})
});
router.get(/\/ztdelete\/\d+/, function (req, res, next) {
	var id = req.url.replace('/ztdelete/','');
	console.log(id);
	db.query('delete from zhuti where id = ?;', [id], function (err, data, fields) {
		if (data.affectedRows == 1) {
			res.redirect('back');
		} else {
			res.redirect('back');
		}
	})
})
module.exports = router;
