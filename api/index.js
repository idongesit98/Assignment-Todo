const express = require('express');
const passport = require('passport')
const db = require('./MongoDb/db')
const connectEnsureLogin = require('connect-ensure-login');
const userModel = require('./Models/User')
const session = require('express-session')
//const MongoStore = require('connect-mongo')
const PORT = 3000;
const app = express();
const path = require('path')

require('dotenv').config()
require('./config/authServices')

//mongodb connection
const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
    console.error('MongoDB URI is missing. Set MONGO_URI in environment variables.');
    process.exit(1);
}

db.connectToMongoDB();
const authRoutes = require('./Routes/userRoute');
const taskRoutes = require('./Routes/taskRoute')

app.use(session({
    secret:process.env.SESSION_SECRET || 'default-secret',
    resave:false,
    saveUninitialized:true,  //true,
    // store:MongoStore.create({
    //     mongoUrl:mongoUri,
    //     ttl:14 * 24 * 60 * 60
    // }),
    cookie:{
        //secure:process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000
    }
}));

app.use(express.urlencoded({extended:false}));
app.use(passport.initialize())
app.use(passport.session());
passport.use(userModel.createStrategy())
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser());

//app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//secure the routes
app.use('/tasks',connectEnsureLogin.ensureLoggedIn(), taskRoutes)

app.use('/',authRoutes)

//catch errors middleware
app.use((err,req,res,next) => {
    console.log(err);
    res.status(500).send('Something broke!')
});

app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`)
})