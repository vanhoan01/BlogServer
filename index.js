const express = require("express");
const mongoose = require("mongoose");
const port = process.env.port || 5000;
const app = express();

/*
    mongodb://localhost:27017/AppDB
*/
mongoose.connect('mongodb+srv://HoanBlog:251201@cluster0.pfgawms.mongodb.net/AppDB?retryWrites=true&w=majority', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("MongoDb connected");
});

//middleware
app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user", userRoute);
app.route("/").get((req, res) => res.json("your first rest api"));

app.listen(port, () => console.log('you server is running on port '+port));
