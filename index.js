import express from "express";
import fs, { write } from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readUsers = () => {
    try {
        const users = fs.readFileSync("./db.json");
        return JSON.parse(users);
    } catch (error) {
        console.log(error);
    }
};

const writeUsers = (users) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(users))
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("In-House Company Backend API");
});

app.get("/users", (req, res) => {
    const users = readUsers();
    res.json(users.usuarios)
});

app.get("/users/:id", (req, res) => {
    const users = readUsers();
    const id = parseInt(req.params.id);
    const user = users.usuarios.find((user) => user.id === id);
    res.json(user);
});

app.post("/users", (req, res) => {
    const users = readUsers();
    const body = req.body;
    const newUser = {
        id: users.usuarios.length + 1,
        ...body,
    }
    users.usuarios.push(newUser);
    writeUsers(users);
    res.json(newUser);
});

app.put("/users/:id", (req, res) => {
    const users = readUsers();
    const body = req.body;
    const id = parseInt(req.params.id);
    const userIndex = users.usuarios.findIndex((user) => user.id === id);
    users.usuarios[userIndex] = {
        ...users.usuarios[userIndex],
        ...body,
    };
    writeUsers(users);
    res.json({ message: "User updated successfully" });
});

app.delete("/users/:id", (req, res) => {
    const users = readUsers();
    const id = parseInt(req.params.id);
    const userIndex = users.usuarios.findIndex((user) => user.id === id);
    users.usuarios.splice(userIndex, 1);
    writeUsers(users);
    res.json({ message: "User deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});