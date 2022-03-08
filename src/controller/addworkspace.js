const Workspace =require('../model/workspace');
const Joi = require('joi');
const User =require( '../model/user');
const activeSession =require('../model/activeSession')


exports.addworkspace=async (req,res)=>{
    const {user_id,WorkspaceName,description} = req.body;
    const token = String(req.body.token);
    activeSession.find({token})
        .then((session)=>{
            let id= session[0].userId
            console.log(id)
            User.find({_id:id})
                .then((users)=>{
                  const query={
                      user_id,
                      WorkspaceName,
                      description
                  };
                  Workspace.create(query).then((w)=>{
                      res.json({success:true,WorkspaceID:w._id,msg:'The Workspace was successfully created'});
                  })
                      .catch(()=>{res.json({success:false,msg:'The workspace not created'})})
                })
                .catch(() => res.json({ success: false }));
        })
        .catch(()=>res.json({success:false}))

}














/*const workspaceSchema=Joi.object().keys({
     WorkspaceName:Joi.string().alphanum().allow(" ") .min(4).max(15)
         .optional().required(),
     description:Joi.string().alphanum().allow(" ") .min(4).max(15)
         .optional().required(),
 });
 const result = workspaceSchema.validate(req.body);
 if (result.error) {
     res.status(422).json({
         success: false,
         msg: `Validation err: ${result.error.details[0].message}`,
     });
     return;
 }

   */