/**
 * StateController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Client = require('../../assets/js/client');
var parseProfile = require('../../assets/js/parseProfile');
var _ = require('underscore');
module.exports = {

  //登陆操作
  login: function (req, res) {
    //1 获取参数前端
    var data = {
      UserCode: req.body['username'],
      UserPwd: req.body['password']
    };
    var option = req.body['option'];

    //2判断为admin登陆 还是 普通用户登陆
    if (option === 'admin') {
      //3 如admin登陆,直接获取数据库数据进行比较
      //3.1 匹配信息成功,把admin信息保存到session中
      //3.2 匹配信息失败,返回错误信息,转页
    }
    if (option === 'user') {
      //4 如是普通用户登陆

      //4.1 先从数据库中直接查找数据库中能查找到相应的记录,即对密码进行比较
      //4.1.1 如密码不匹配,则发送请求到学生服务子系统进行抓取,
      //4.1.1.1 抓取成功,更新数据到数据库,保存用户信息到session,转页
      //4.1.1.2 抓取失败,返回失败消息,转页
      //4.1.2 密码匹配,保存用户信息到session,转页

      //4.2 数据中没有相应记录,则发送请求道学生服务子系统进行抓取,
      //4.2.1 抓取成功,保存数据到数据库,保存用户信息到session,转页
      //4.2.2 抓取失败 返回错误信息,转页
      var client = new Client('jwc.wyu.cn', '/student', 'gbk');
      client.get('/', {}, {}, function () {
        client.get('/createsession_a.asp', {}, {}, function () {
          client.get('/createsession_b.asp', {}, {}, function () {
            client.get('/rndnum.asp', {}, {}, function () {
              client.cookie['LogonNumber'] = '';
              client.post('/logon.asp', data, {
                Referer: 'http://jwc.wyu.cn/student/body.htm'
              }, function (err, res, body) {
                var success = /welcome/.test(body);
                if (success) {
                  client.get('/f1.asp', {}, {}, function (err, res, body) {
                    try {
                      console.log(body);
                      var profile = parseProfile(body);
                      console.log(profile.class, profile.name);
                    } catch (err) {
                      console.log(err);
                      console.log('资料加载失败');
                    }
                  });
                } else {
                  console.log('登录信息错误');
                }
              });
            });
          });
        });
      });
    }
    res.redirect('/');
  },

  //登出操作
  logout: function (req, res) {

  }


};
