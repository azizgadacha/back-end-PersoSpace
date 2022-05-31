
const User =require( '../../model/user');
const bcrypt = require("bcrypt");
const fs = require("fs");
exports.edituser=(req, res) => {
    const { id,username, email,password,phone } = req.body;



    User.findOne({ _id: id }).then((user) => {
        if (user) {
            const query = { _id: user._id };

            bcrypt.compare(password, user.password, async (_err2, isMatch) => {
                let newvalues ;

                if (isMatch) {
                    if (req.body.sendPhoto==='true')
                    {
                        if (fs.existsSync('./upload/' + user.photo) && (user.photo != 'avatar_1.png')) {

                            if (user.photo)
                                fs.unlinkSync("./upload/" + user.photo)
                        }
                        var  file=req.file.filename

                        newvalues = { username, email,phone,photo:file }

                    }
                    else
                        newvalues = { username, email,phone}






                    User. findOneAndUpdate(query, newvalues).then(
                        (user) => {

                            User.findOne(query).then((use)=>{

                            use.password = undefined;

                            return res.json({ success: true,passprob:false,user:use });}

                            )


                        }
                    ).catch(() => {
                  console.log("kkkkkkkkkkkkkkkk")
                       return  res.json({ success: false, passprob:false, msg: 'There was an error. Please contact the administrator' });
                    });



                }else {

                    return res.json({success: false, passprob: true, msg: 'Wrong credentials'});
                }});


        } else {

          return  res.json({ success: false,passprob:false, msg: "User didn't excite" });
        }
    })


}