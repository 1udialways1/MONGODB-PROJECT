// server.js (Backend)
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});

const collection = mongoose.model("users", userSchema);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new collection({ name: username, password: hashedPassword });
        await newUser.save();
        res.status(200).send('Account created successfully!');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect password");
        }
        res.status(200).send('Login successful');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
