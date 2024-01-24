// const csurf = require('csurf')
const {Todo,User} = require('../models')
const bcrypt = require('bcrypt')

const slatRounds = 10;

const TodoController = {
    getHome : async (req,res) => {
        res.render('index',{
            title : 'Todo application'
        })
    },
    getAllTodos : async (req,res) => {
        try{
            const todos = await Todo.AllTodos(req.user.id)
            /* const todosData = todos.map(todo => todo.toJSON()); */
            // console.log(todos.dueToday);+
            res.render('AllTodo',{
                dueYes : todos.dueYes,
                dueToday : todos.dueToday,
                dueLater : todos.dueLater,
            })
        }
        catch(err) {
            console.log(err)
            return res.status(422).json(err) 
        }
    },
    addTodo : async (req,res) => {
        console.log(req.user)
        try{
            const todo = await Todo.addTodo({title : req.body.title , dueDate : req.body.dueDate,userId : req.user.id})
            console.log(todo);
            return res.redirect('/todos')
            // return res.json(todo)
        }
        catch(err){
            console.log(err)
            return res.status(422).json(err)
        }
            
    },
    deleteTodo : async (req, res) => {
        const userId = req.user.id;
        try {
            const deletedTodo = await Todo.destroy({
                where: {
                    id: req.params.id,
                    userId
                },
                returning: true, 
            });
    
            if (deletedTodo > 0) {
                return res.json({success : true }); 
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
    },
    getTodoById: async (req, res) => {
        try {
            const todo = await Todo.findByPk(req.params.id);
            if (!todo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            return res.json(todo.toJSON());
        } catch (err) {
            console.log(err);
            return res.status(422).json(err);
        }
    },
    getSignupPage : async(req,res) => {
        res.render('signup')
    },
    addUser : async (req,res) =>  {

        const HashedPwd = await bcrypt.hash(req.body.password,slatRounds);
        try{
            const user = await User.create({
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email,
                password : HashedPwd
            })
            req.login( user,(err) => {
                if(err)
                {
                    console.log("err : "+ err)
                }
                res.redirect('/todos');
            })
            
        }
        catch(err) {
            console.log(err)
        }
    },
    getLoginPage : async (req,res) => {
        res.render('login');
    },
   /*  Login: async (req, res) => {
        try{
            if (req.isAuthenticated()) {
                console.log(req.user);
                res.redirect("/todos");
            } else {
                // Handle authentication failure, e.g., redirect to login page with an error message
                res.redirect("/login?error=authentication_failed");
            }
        }
        catch(err) {
            console.log(err)
        }
    } */
    
}

module.exports = TodoController;