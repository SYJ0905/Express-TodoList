var express = require('express');
var router = express.Router();
const firebaseAdmin = require('../plugins/firebase-admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  firebaseAdmin.ref('todo').once('value', dataSnapshot => {
    const listData = [];
    dataSnapshot.forEach(item => {
      const itemInfo = item.val(); // item.val() 為一物件
      itemInfo.key = item.key; // item.key 取唯一值
      listData.push(itemInfo);
    });
    res.render('index', {
      title: 'Express',
      listData,
    });
  });
});

router.post('/addTodo', function(req, res, next) {
  // 接收前端傳進來的資料
  const todo = {
    content: req.body.content,
  };
  firebaseAdmin.ref('todo').push(todo)
    .then(() => {
      // 顯示資料庫內容，並回傳前端 AJAX response 物件
      firebaseAdmin.ref('todo').once('value', (dataSnapshot) => {
        // 將物件形式的 dataSnapshot.val() 中的 key 加入到各自的物件內，並重組陣列回傳
        const listData = [];
        dataSnapshot.forEach((item) => {
          const itemInfo = item.val(); // item.val() 為一物件
          itemInfo.key = item.key; // item.key 取唯一值
          listData.push(itemInfo);
        });
        res.send({
          success: true,
          result: listData,
          message: '資料儲存成功',
        });
      });
    });
});

router.delete('/deleteTodo', function(req, res) {
  const todoId = req.body.id;
  firebaseAdmin.ref('todo').child(todoId).remove()
    .then(() => {
      firebaseAdmin.ref('todo').once('value', (dataSnapshot) => {
        const listData = [];
        dataSnapshot.forEach(item => {
          const itemInfo = item.val(); // item.val() 為一物件
          itemInfo.key = item.key; // item.key 取唯一值
          listData.push(itemInfo);
        });
        res.send({
          success: true,
          result: listData,
          message: '刪除成功',
        });
      });
    });
});

module.exports = router;