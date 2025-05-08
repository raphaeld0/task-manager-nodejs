const express = require("express");
const methodOverride = require("method-override");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_SECRET;
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
app.use(cors());

//jwt user

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, jwtKey, (err, user) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ message: "Invalid token." });
        }
        console.log("Decoded token:", user); 
        req.user = user;
        next();
    });
}

//jwt admin
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
}

app.set("view engine", "ejs");
app.set("views", "public/views");

//get task de todas as tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        const taskCount = await Task.countDocuments({ userId: req.user.id });
        res.status(200).json({ tasks, totalTasks: taskCount });
    } catch (err) {
        console.error(err);
        res.status(500).send("deu erro");
    }
});


//get das tasks de um usuario baseado no ID
app.get("/task", authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        const taskCount = await Task.countDocuments({ userId: req.user.id });
        res.status(200).json({tasks, totalTasks: taskCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching tasks." });
    }
});

//post de uma task
app.post("/task", authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;

        // Cria a tarefa com o ID do usuário autenticado
        const newTask = new Task({
            title,
            description,
            userId: req.user.id, // Associa a tarefa ao usuário autenticado
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the task." });
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
app.get("/tasks", authenticateToken, async (req, res) => {
    const Tasks = await Task.find({userId: req.user.id});
    res.status(200).json(Tasks);
})
//post register user
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userFind = await User.findOne({ email });

        if (userFind) {
            return res.status(400).json({ message: "Looks like there’s already an account with this email. Try logging in!" });
        }


        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hash });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});


//register render
app.get("/register", async (req, res) => {
    res.render("register")
})

// get user somente no insomnia
app.get("/users", async (req, res) => {
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


//delete de TODAS as tasks
app.delete("/tasks", async (req, res) => {
    const deletado = await Task.deleteMany({});
    if (deletado.deletedCount === 0) {
        return res.status(404).json({ mensagem: "nenhum task." });
    }
    res.status(200).json({ mensagem: `${deletado.deletedCount} tasks.` });
    
});


// update user
app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        // ve se o email ja existe
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== id) {
                return res.status(400).json({ message: "Email already exists. Please use a different email." });
            }
        }
        // novo hash se mudar a senha
        let updatedFields = { username, email };
        if (password) {
            const salt = await bcrypt.genSalt(saltRounds);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        // att no db
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the user." });
    }
});

//get login
app.get("/login", async (req, res) => {
    res.render("login");
})

//post login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);

    if (!senhaCorreta) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, username: user.username}, jwtKey, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
});


// Rota acessível apenas para usuários autenticados
app.get('/home', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Welcome to the home page!", user: req.user });
});

// Rota acessível apenas para administradores
app.get('/admin', authenticateToken, authorizeAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome to the admin page!" });
});

app.get('/tasks/:_id', authenticateToken, (req, res) => {
    res.status(200).json({ message: "welcome!" })

});

app.listen(port, () => {
    console.log(`listening...`);
});

//get das tasks de um user