const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const taskSchema = {
    name: String
};

const Task = mongoose.model('Task', taskSchema);

const task1 = new Task({
    name: "Welcome to your to-do list"
});

const task2 = new Task({
    name: "Hit the + button to add new tasks"
});

const task3 = new Task({
    name: "<-- Hit this if you have completed this task."
});

const defaultTasks = [task1, task2, task3];

app.get('/', (req, res) => {
    let today = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    } 
    let day = today.toLocaleDateString("en-US", options);
    Task.find({}, (err, foundTasks) => {
        if(err) console.log(err);
        if (!foundTasks.length) {
            Task.insertMany(defaultTasks, (err) => {
                if (err) console.log(err);
                else console.log("Successfully saved the default tasks to the Database");
            });
        }
        res.render('list', {kindOfDay: day, newListItems: foundTasks});
    });
});

app.post('/', (req, res) => {
    let itemName = req.body.newTask;
    let task = new Task({
        name: itemName
    });
    task.save();
    res.redirect('/');
});

app.post('/delete', (req, res) => {
    let taskid = req.body.checkbox;
    Task.findOneAndRemove({_id: taskid}, (err) => {
        if(err) console.log(err);
        else console.log('One item successfully removed');
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});