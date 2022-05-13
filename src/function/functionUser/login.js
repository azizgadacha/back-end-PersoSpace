const bcrypt=require('bcrypt');
const User =require( '../../model/user');
const activeSession =require( '../../model/activeSession');
const Joi = require("joi");

const jwt=require("jsonwebtoken")

exports.login=(req, res) => {

    // Joy Validation

    const userSchema = Joi.object().keys({

        email: Joi.string().email().required(),

        password: Joi.string().required(),
    });
    const result = userSchema.validate(req.body);
    if (result.error) {
        res.status(422).json({
            success: false,
            msg: `Validation err: ${result.error.details[0].message}`,
        });
        return;
    }

    const { email } = req.body;
    const { password } = req.body;

    User.findOne({ email }            ).then((user) => {
        if (!user) {
            return res.json({ success: false, msg: 'Wrong credentials' });
        }

        if (!user.password) {
            return res.json({ success: false, msg: 'No password' });
        }

        bcrypt.compare(password, user.password, async (_err2, isMatch) => {
            if (isMatch) {
                if (!process.env.SECRET) {
                    throw new Error('SECRET not provided');
                }

                const token = jwt.sign({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                }, process.env.SECRET, {
                    expiresIn: 10860400, // 1 week
                });


                const query = {userId: user.id, token};

                await activeSession.create(query);
                // Delete the password (hash)
                user.password = undefined;
                return res.json({
                    success: true,
                    token,
                    user,
                });
            }
            return res.json({success: false, msg: 'Wrong credentials'});
        });
    });
}