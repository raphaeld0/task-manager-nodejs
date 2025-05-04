const express = require("express");
const methodOverride = require("method-override");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

//crypt password
const bcrypt = require("bcrypt")
const saltRounds = 10;

const app = express();
const port = 8080;

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", "public/views");

//get task de todas as tasks
app.get("/task", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render("task", { task: tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send("deu erro");
    }
});


//get post de uma task
app.post("/task", async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description });
        await newTask.save();
        res.redirect("/task");
    } catch (error) {
        console.error(error);
        res.status(500).send("deu erro");
    }
});


//delete de task
app.delete("/task/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect("/task");
    } catch (error) {
        console.error(error);
        res.status(500).send("deu erro");
    }
});

// get tasks somente no insomnia
app.get("/tasks", async (req,res) =>{
    const Tasks = await Task.find();
    res.status(200).json(Tasks);
}) 

//post register user
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hash });
        await newUser.save();
        res.redirect("login")
    } catch (error) {
        console.error(error);
        res.status(500).send("deu erro");
    }
});


//register render
app.get("/register", async(req,res) =>{
    res.render("register")
})

// get user somente no insomnia
app.get("/users", async (req,res) =>{
    const Users = await User.find();
    res.status(200).json(Users);
}) 


// delete user somente no imsonmia
app.delete("/users/:_id", async (req, res) => {
        const { _id } = req.params;
        const deletado = await User.findByIdAndDelete(_id);

        if (!deletado) {
            return res.status(404).json({ mensagem: "nao achou." });
        }
        res.status(200).json({ mensagem: "deletou." });
});

//delete all users
app.delete("/users", async (req, res) => {
        const deletado = await User.deleteMany({});
        if (deletado.deletedCount === 0) {
            return res.status(404).json({ mensagem: "nenhum user." });
        }
        res.status(200).json({ mensagem: `${deletado.deletedCount} users.` });
});

//get login
app.get("/login", async (req,res) =>{
    res.render("login");
})

//post login
app.post("/login", async (req,res) =>{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if (!user){
        console.log("email errado")
        return res.send(`email errado`);}
    
    const tacerta = await bcrypt.compare(password, user.password);

    if (!tacerta){return res.send("senha errada")}

    return res.send("login certo")
})




app.listen(port, () => {
    console.log(`listening...`);
});
