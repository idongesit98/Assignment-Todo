const express = require('express')
const userModel = require('../Models/User');
const passport = require('passport');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login')

//renders the home page
router.get('/', connectEnsureLogin.ensureLoggedIn(), (req,res) =>{
    res.render('index')
});

//renders the login page
router.get('/login',(req,res) => {
    res.render('login');
});

router.get('/signup',(req,res) => {
    res.render('signup');
});

router.get('/reset',(req,res) => {
    res.render('reset', {error:null,success:null});
})


//Register a new user
router.post('/signup', async (req,res) => {
    //const user = req.body
    try {
        const user = new userModel({username:req.body.username})
        await userModel.register(user, req.body.password);
        passport.authenticate('local')(req,res, () => {
            res.redirect('/login')
        })
    } catch (error) {
        console.error("Error during registration:", error)
        res.status(500).send("An error occured during registration.")
    }
});

//login a new user
router.post('/login',passport.authenticate('local',{
    successRedirect:'/tasks',
    failureRedirect:'/'
}));

//logout a user
router.post('/logout',(req,res,next) => {
    req.logout(err => {
        if(err){
            return next(err);
        }
        res.redirect('/login')
    });
});

//reset passwords
router.post('/reset', async(req,res) =>{
    try {
        const userInfo = req.body;
        const user = await userModel.findOne({username:userInfo.username});

        if(!user){
            return res.render('reset', {error:'User not found',success:null});
        }
        user.changePassword(userInfo.password,userInfo.new_password,(err,user) => {
            if(err){
                console.log(err);
                res.status(500).send(err)
            }else{
                res.render('reset',{error:null, success: 'Password changes successfully!'});
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('An error occured')
    }
})


module.exports = router