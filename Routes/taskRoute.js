const express = require('express')
const connectEnsureLogin = require('connect-ensure-login');
const Task = require('../Models/task');
const router = express.Router();

//Create a new task
router.post('/create', connectEnsureLogin.ensureLoggedIn(), async (req,res) => {
    const task = new Task({
        title:req.body.title,
        description:req.body.description,
        user:req.user.id
    });
    await task.save();
    res.redirect('/tasks')
})

//Update task Status
router.post('/:id/update',connectEnsureLogin.ensureLoggedIn(), async(req,res) => {
    const {id} = req.params;
    const {status} = req.body;

    try {
        if (!['pending','completed','deleted'].includes(status)) {
            return res.redirect('/tasks');
        }
        const updatedTask = await Task.findByIdAndUpdate(id, {status});
        if (!updatedTask) {
            return res.redirect('/tasks')
        }
        res.redirect('/tasks');

    } catch (error) {
       console.error('Error updating task status:', error);
       res.redirect('/tasks')
    }
});

//Get all task
router.get('/', connectEnsureLogin.ensureLoggedIn(), async (req,res) => {
    try {
        //This fetch task for the logged in user
        const tasks = await Task.find({user:req.user.id});

        //render the task.ejs view and pass the tasks
        res.render('tasks', {tasks});
    } catch (error) {
        console.error('Error fetching tasks:', error)
        res.status(500).send('Server Error');
    }
});

router.get('/:id',(req,res) => {
    const id = req.params.id
    Task.findById(id)
        .then(task => {
            res.status(200).send(task)
        }).catch(error => {
            console.log(error)
            res.status(404).send(error)
        })
})

module.exports = router;