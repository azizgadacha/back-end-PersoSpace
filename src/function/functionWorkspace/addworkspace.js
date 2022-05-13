const Workspace =require('../../model/workspace');
const Joi = require('joi');
const User =require( '../../model/user');
const activeSession =require('../../model/activeSession')

exports.addworkspace=async (req,res)=>{



    verif={WorkspaceName:req.body.WorkspaceName,description: req.body.description,token:req.body.token}
    const userSchema = Joi.object().keys({
       WorkspaceName: Joi.string().allow(" ") .min(4).max(13)
            .optional().required(),
        description: Joi.string().allow(" ") .min(4).max(25)
            .optional().required(),
        token:Joi.string().required(),
    });
    const result = userSchema.validate(verif);

    if (result.error) {
        res.status(422).json({
            success: false,
            msg: `Validation err: ${result.error.details[0].message}`,
        });
        return;
    }
    const {superior_id,WorkspaceName,description} = req.body;

            User.find({_id:superior_id})
                .then((users)=>{
                  const query={
                      superior_id:superior_id,
                      WorkspaceName,
                      description
                  };

                    Workspace.findOne({WorkspaceName,superior_id:superior_id}).then((w1)=> {

                        if (w1) {

                            res.json({success: false, msg: 'Workspace already exists'});
                      } else {

                            Workspace.create(query).then((w) => {


                              res.json({
                                  success: true,
                                  WorkspaceID: w._id,
                                  msg: 'The Workspace was successfully created'
                              });
                          })
                              .catch(() => {
                                  res.json({success: false, msg: 'The workspace not created'})
                              })
                      }
                  })
                })
                .catch(() => res.json({ success: false }));
        }















