const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const z = require("zod");

async function connect() {
    await mongoose.connect(
        "mongodb+srv://narottamphodegaa:X6JRgSfwDRYIset7@cluster0.oujncit.mongodb.net/todo-narottam"
    );
}

connect();

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const requiredBody = z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(6).max(20),
    });

    // const parseData = requiredBody.parse(req.body);
    const parseResult = requiredBody.safeParse(req.body);
    if(!parseResult.success){
        res.json({
            message:"Incorrect Format",
            error:parseResult.error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let errorThrown = false;
    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        // console.log(hashedPassword);

        await UserModel.create({
            email: email,
            password: hashedPassword,
            name: name,
        });
    } catch (e) {
        res.json({
            message: "User Already Exist",
        });
        errorThrown = true;
    }
    if (!errorThrown) {
        res.json({
            message: "You are signed up",
        });
    }
});

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email,
    });

    if (!response) {
        res.status(403).json({
            message: "User does not exists",
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, response.password);

    if (passwordMatch) {
        const token = jwt.sign(
            {
                id: response._id.toString(),
            },
            JWT_SECRET
        );

        res.json({
            token,
        });
    } else {
        res.status(403).json({
            message: "Incorrect creds",
        });
    }
});

app.post("/todo", auth, async function (req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done,
    });

    res.json({
        message: "Todo created",
    });
});

app.get("/todos", auth, async function (req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId,
    });

    res.json({
        todos,
    });
});

app.listen(3000);
