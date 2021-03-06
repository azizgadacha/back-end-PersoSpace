const Workspace =require('../model/workspace');
const mongoose = require("mongoose");
const Widget = require("../model/Widget");
const data = require("../model/data");
const User = require("../model/user");
const activeSession = require("../model/activeSession");
const fs = require("fs");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const workspace = require("../model/workspace");

//Share Data  ToWidget

exports.ShareDataToWidget= async (req, res,next) => {
    const {idData,superiorID,WidgetName,type,}= req.body;

    workspace.findOne({_id:superiorID})
        .then((work)=>{
            if(work) {
                Widget.findOne({superior_id: superiorID, WidgetName:WidgetName.toLowerCase()}).then((widgetGetit) => {
                    if (widgetGetit) {

                        res.json({success: false, msg: "widget already exist", WidgetExisite: true})

                    } else {
                        data.find({usedIn:{ $elemMatch : { superiorID:superiorID,WidgetName:WidgetName.toLowerCase(), type:{$in:["Rate", "Donuts","Bar"]}} }}).then((datwidget)=> {
                                if (datwidget.length > 0) {

                                    res.json({
                                        success: false,
                                        msg: "widget with the same name already exist",
                                        WidgetExisite: true
                                    })
                                } else {

                                    data.findOneAndUpdate({_id: idData}, {
                                        $addToSet: {
                                            usedIn: {
                                                superiorID,
                                                type,
                                                WidgetName:WidgetName.toLowerCase()
                                            }
                                        }
                                    }).then(
                                        (dataupdated) => {


                                            if (dataupdated){
                                                res.json({
                                                    success: true,
                                                    widget: {
                                                        idData: idData,
                                                        WidgetName: WidgetName.toLowerCase(),
                                                        sourceDB: true,
                                                        type: type,
                                                        label: dataupdated.label,
                                                        data: dataupdated.data
                                                    },
                                                    WidgetExisite: false
                                                })}
                                            else {

                                                res.json({
                                                    success: false,
                                                    msg: "internal problem please try later",
                                                    WidgetExisite: false
                                                })
                                            }
                                        }
                                    )

                                        .catch(() => res.json({
                                            msg: "internal problem please try later",
                                            success: false,
                                            WidgetExisite: false
                                        }));


                                }
                            }
                        )
                    }


                })
            }
            else
                res.json({success: false, msg: "Workspace No Longer Exist"})
        })




}

//get data

exports.getData= (req, res,next) => {
    let{superior_Id}=req.body
    data.find()
        .then((data)=>{
            res.json({success: true, data});





        })
        .catch(() => res.json({ success: false }));
}

//edit Widget link


exports.editWidgetlink=(req, res) => {


    const { idData,newName,superiorID,type,WidgetName } = req.body;

    workspace.findOne({_id:superiorID})
        .then((work)=>{

            if(work) {
                Widget.findOne({ WidgetName:newName.toLowerCase() }).then((widgetexist) => {
                    if(widgetexist) {

                        res.json({ success: false,Existance:true, msg: "widget with the same name already exist",})

                    }else{
                        data.find({usedIn:{ $elemMatch : { superiorID:superiorID,WidgetName:newName.toLowerCase(), type:{$in:["Rate", "Donuts","Bar"]}} }}).then((DataWidget)=> {
                            if (DataWidget.length > 0) {

                                res.json({ success: false,Existance:true, msg: "widget with the same name already exist",})

                            }else{






                data.findOneAndUpdate({_id: idData,usedIn:{$elemMatch : { superiorID,WidgetName:WidgetName.toLowerCase(), type:{$in:["Rate", "Donuts","Bar"]}}}  }, {
                    $set:{ 'usedIn.$.WidgetName':

                            newName

                    }})   .then((dataUpdated) => {
                    if (dataUpdated) {
                        let widgetupd = {
                            idData: idData,
                            WidgetName: newName.toLowerCase(),
                            sourceDB: true,
                            oldName: WidgetName.toLowerCase(),
                            type,
                            label: dataUpdated.label,
                            data: dataUpdated.data
                        }
                        res.json({success: true, widget: widgetupd})
                    } else
                        res.json({success: false,})


                })}})}})



            }
            else
                res.json({success: false,msg:'Workspace No Longer Exist'})
        })
}

//delete Widget link
exports.deleteLinkWidget= (req, res,next) => {

    const {superiorID,idData,type,WidgetName}= req.body;
    workspace.findOne({_id:superiorID})
        .then((work)=>{
            if(work) {
                data.updateOne({_id: idData}, {$pull: {usedIn: {superiorID, type, WidgetName:WidgetName.toLowerCase()}}})
                    .then((dataSend) => {

                        if (dataSend.modifiedCount == 1) {

                            res.json({success: true, widget: {WidgetName:WidgetName.toLowerCase(), type}});
                        } else {

                            res.json({success: false})
                        }

                    })
                    .catch((e) => {


                        res.json({success: false});
                    })
            }else
                res.json({success: false,msg:"Widget No Longer Exist"});
        })
}


