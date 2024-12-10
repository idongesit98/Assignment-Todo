const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const UserSchema = new mongoose.Schema(
    {
        username:String,
        password:String
    },
    {
        timestamp:true
    }
);

UserSchema.plugin(passportLocalMongoose)
const UserModel = mongoose.model("User",UserSchema)

module.exports = UserModel