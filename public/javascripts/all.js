// DOM 宣告
const todoContent = document.querySelector('#todoContent');
const send = document.querySelector('#send');
const todoList = document.querySelector('.todoList');

send.addEventListener('click', sendTodo);
todoList.addEventListener('click', deleteTodo);

function sendTodo() {
  const todo = {
    content: todoContent.value,
  };
  // AJAX
  axios.post('/addTodo', todo)
    .then((res) => {
      console.log(res);
      renderTodo(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function renderTodo(data) {
  if (data.success) {
    const dataList = data.result;
    let str = '';
    dataList.forEach(item => {
      str += `
        <li data-key="${ item.key }">${ item.content } - 
          <a href="#" data-key="${ item.key }">刪除</a>
        </li>
      `;
    });
    todoList.innerHTML = str;
  } else {
    return
  }
}

function deleteTodo(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'A') return;
  const data = {
    id: e.target.dataset.key,
  };
  axios.delete('/deleteTodo', {
    data,
  })
    .then((res) => {
      console.log(res);
      renderTodo(res.data);
    });
}