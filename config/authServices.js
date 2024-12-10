const userModel = require('../Models/User');
const localStrategy = require('passport-local').Strategy;
const passport = require('passport')


passport.use(
    new localStrategy(
        {
            usernameField: 'username', // Customize field names if needed
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                // Using the authenticate method provided by passport-local-mongoose
                user.authenticate(password, (err, authenticatedUser, options) => {
                    if (err) {
                        return done(err);
                    }
                    if (!authenticatedUser) {
                        return done(null, false, { message: options.message || 'Invalid password' });
                    }
                    return done(null, authenticatedUser, { message: 'Logged in successfully' });
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

