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

//get task de todas as tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
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
        res.status(200).json({ tasks, totalTasks: taskCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching tasks." });
    }
});

//post de uma task
app.post("/task", authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;

        const newTask = new Task({
            title,
            description,
            userId: req.user.id,
        });

        const user = req.user;
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role, username: user.username }, jwtKey, { expiresIn: '1h' });
        res.send(token)
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
        const user = req.user;
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role, username: user.username }, jwtKey, { expiresIn: '1h' });
        res.send(token)
    } catch (error) {
        console.error(error);
        res.status(500).send("deu erro");
    }
});

// get tasks somente no insomnia
app.get("/tasks", authenticateToken, async (req, res) => {
    const Tasks = await Task.find({ userId: req.user.id });
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


//updade do status de uma task

app.put("/task/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found." });
        }

        const user = req.user;
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role, username: user.username }, jwtKey, { expiresIn: '1h' });
        res.send(token)
        res.status(200).json({ message: "Task updated successfully.", task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the task." });
    }
});


// update name user
app.put("/userchange/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        // att no db
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const token = jwt.sign({
            id: updatedUser._id,
            email: updatedUser.email,
            role: updatedUser.role,
            username: updatedUser.username
        }, jwtKey, { expiresIn: '1h' });

        res.status(200).json({ message: "User updated successfully.", user: updatedUser, token });

    } catch (error) { "erro" }
});


// update email user
app.put("/emailchange/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "That email already exists in our database." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const token = jwt.sign({
            id: updatedUser._id,
            email: updatedUser.email,
            role: updatedUser.role,
            username: updatedUser.username
        }, jwtKey, { expiresIn: '1h' });

        return res.status(200).json({ message: "Email updated successfully.", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
});



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

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, username: user.username }, jwtKey, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
});


app.get('/home', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Welcome to the home page!", user: req.user });
});

app.get('/admin', authenticateToken, authorizeAdmin, (req, res) => {
    res.status(200).json({ message: "Welcome to the admin page!" });
});

app.get('/tasks/:_id', authenticateToken, (req, res) => {
    res.status(200).json({ message: "welcome!" })

});

app.listen(port, () => {
    console.log(`listening...`);
});
