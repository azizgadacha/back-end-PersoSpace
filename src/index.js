//Project import
const express=require("express")
const app=express()
const cors=require("cors")
const compression =require("compression")
const initPassport =require( './config/passport.js')
const passport =require('passport');

//Router import And controller

const WorkspaceRoutes=require("./router/WorkspaceRoutes")
const WidgetRoutes=require("./router/WidgetRoutes")
const UserRoutes=require("./router/UserRoutes")
const ForgetRoutes=require("./router/ForgetRoutes")
const DataRoutes=require("./router/DataRoutes")
const NotificationRoutes=require("./router/NotificationRoutes")
const {find, addUser, DeleteUser} = require("./controller/SocketController");
const connection=require( './db/DataBase');



app.use(cors());

require("dotenv").config()
connection.Connection()
app.use(express.json());

app.use(compression());

app.use(express.urlencoded({extended:true}))
app.use(express.static('upload'))
app.use(express.json())
initPassport(passport);

app.use(passport.initialize());
//Routes  declaration
app.use("/api/Workspace",WorkspaceRoutes)
app.use("/api/Forget",ForgetRoutes)
app.use("/api/Notification",NotificationRoutes)
app.use("/api/Widget",WidgetRoutes)
app.use("/api/Data",DataRoutes)
app.use("/api/User",UserRoutes)

let port=process.env.PORT||5000

const server=app.listen(port,()=>{
})

let UserConnected=[]



const io=require('socket.io')(server,{
 cors:{
  origin:'*'
 }
})
io.on('connection',(socket)=>{

    socket.on("add_User",(UserId)=>{
    addUser(UserId,socket.id,UserConnected)
 })

 socket.on("send_Notification",(data)=>{
    for (let item of data.NotificationListe ){

         let{exist,index}= find(item.UserId,UserConnected)
   if(exist) {
   io.to(UserConnected[index].SocketId).emit("send_Notification_to_user", {notification: {user:item.user,notification:item.notification,name:item.NameShared}})
   }
 }
 })

socket.on("RemoveShareNotification",(data)=>{


    for (let item of data.NotificationListe ){
    let{exist,index}= find(item.receiver,UserConnected)
   if(exist) {
   io.to(UserConnected[index].SocketId).emit("delete_Notification_from_user", {notification: item._id})
   }

   }
 })
 socket.on("disconnect" ,()=>{
  DeleteUser(socket.id,UserConnected)
  console.log("good by")

 })
})
