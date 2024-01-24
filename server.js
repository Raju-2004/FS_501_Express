const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const TodoController = require("./controllers/todoControllers");
// const csurf = require('csurf')
// const cookieParser = require('cookie-parser')
const passport = require("passport");
const bcrypt = require('bcrypt')
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");

app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('shh! some secret string'))
// app.use(csurf({cookie:true}))
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my-super-secret-key",
    cookie: {
      maxAge: 24 * 60 * 60 * 100,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username,
        },
      })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) return done(null, user);
          else return done(null, false, { message: "Invalid password" });
        })
        .catch((error) => {
          return done(error);
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

app.get("/", TodoController.getHome);
app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  TodoController.getAllTodos
);
app.post("/todos",connectEnsureLogin.ensureLoggedIn(), TodoController.addTodo);
app.get("/todos/:id", TodoController.getTodoById);
app.get("/signup", TodoController.getSignupPage);
app.put("/todos/:id/markAsCompleted",connectEnsureLogin.ensureLoggedIn(), TodoController.CompleteTodo);
app.delete("/todos/:id",connectEnsureLogin.ensureLoggedIn() ,TodoController.deleteTodo);
app.post("/users", TodoController.addUser);
app.get("/login", TodoController.getLoginPage);
app.post(
  "/login",
  passport.authenticate("local", {
   /*  successRedirect: "/todos", */
    failureRedirect: "/login",
  }),
  (req,res) => {
    console.log(req.user);
    res.redirect("/todos");
  }
);
app.get('/signout',(req,res,next)=>{
  req.logout((err) => {
    if(err) {return next(err)}
    res.redirect('/')
  })
  
});

module.exports = app;
