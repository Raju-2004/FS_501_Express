const {Todo} = require('../models')

const TodoController = {
    getAllTodos : async (req,res) => {
        try{
            const todos = await Todo.AllTodos()
            const todosData = todos.map(todo => todo.toJSON());
            console.log(todosData);
            res.json(todos)
            // res.render('todo',{todos})
        }
        catch(err) {
            console.log(err)
            return res.status(422).json(err) 
        }
    },
    addTodo : async (req,res) => {
        try{
            const todo = await Todo.addTodo({title : req.body.title , dueDate : req.body.dueDate})
            console.log(todo);
            return res.json(todo)
        }
        catch(err){
            console.log(err)
            return res.status(422).json(err)
        }
            
    },
    deleteTodo : async (req, res) => {
        try {
            const deletedTodo = await Todo.destroy({
                where: {
                    id: req.params.id
                },
                returning: true, 
            });
    
            if (deletedTodo > 0) {
                return res.json({ deletedTodo }); 
            } else {
                return res.status(404).json({ error: 'Todo not found' }); 
            }
        } catch (err) {
            console.log(err);
            return res.status(422).json(err);
        }
    },
    CompleteTodo : async (req,res)=>{
        console.log('We have to update a todo with ID:',req.params.id)
        const todo = await Todo.findByPk(req.params.id)
        try{
            const updatedTodo = await todo.markAsCompleted()
            return res.json(updatedTodo)
        }
        catch(err) {
            console.log(err)
            return res.status(422).json(err)
        }
    }
}

module.exports = TodoController;