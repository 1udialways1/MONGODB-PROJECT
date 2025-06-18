const mongoose = require("mongoose");

// Replace 'userDB' with your actual database name
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.error("Connection Failed", err);
});

// Create schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create model
const collection = mongoose.model("users", LoginSchema);

module.exports = collection;
