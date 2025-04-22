const express = require('express');
const app = express();
app.use(express.json());


let tasks = [];
let idCounter = 1;


const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};


const checkOver = (task) => {
  if (task.status !== 'completed' && new Date(task.deadline) < new Date()) {
    task.status = 'overdue';
  }
  return task;
};


app.use('/tasks', authMiddleware);


app.get('/tasks', (req, res) => {
  const updatedTasks = tasks.map(checkOver);
  res.json(updatedTasks);
});


app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task không tồn tại' });
  }
  res.json(checkOver(task));
});


app.post('/tasks', (req, res) => {
  const { title, deadline } = req.body;
  if (!title || !deadline) {
    return res.status(400).json({ error: 'Thiếu title hoặc deadline' });
  }
  const task = {
    id: idCounter++,
    title,
    deadline,
    status: 'pending',
  };
  tasks.push(task);
  res.status(201).json(checkOver(task));
});


app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task không tồn tại' });
  }
  const { title, deadline, status } = req.body;
  if (title) task.title = title;
  if (deadline) task.deadline = deadline;
  if (status) task.status = status;
  res.json(checkOver(task));
});


app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Task không tồn tại' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Lỗi server' });
});

app.listen(3000, () => {
  console.log('Server chạy trên cổng 3000');
});