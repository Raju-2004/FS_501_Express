const express = require('express')
const app = express()
const {Todo} = require('./models')
const bodyParser = require('body-parser')
const path = require('path')
const TodoController = require('./controllers/todoControllers')

app.use(bodyParser.json())
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')))


app.get('/',(req,res) => {
    res.render('index')
})


app.get('/todos',TodoController.getAllTodos)
app.post('/todos',TodoController.addTodo)
app.put('/todos/:id/markAsCompleted',TodoController.CompleteTodo)
app.delete('/todos/:id',TodoController.deleteTodo );


module.exports = app;