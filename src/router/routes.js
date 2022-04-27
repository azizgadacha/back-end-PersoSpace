
const express=require('express');
const { checkToken } =require( '../config/safeRoutes');
const widgetController =require( '../controller/widgetController');
const { AdminstratorVlidation } =require( '../config/AdminstratorVlidation');

const {editUser} = require("../function/functionUser/editUser");
const {login} =require( '../controller/login');
const {edituser} =require( '../controller/edituser');
const {editPass} =require( '../controller/editPass');
const {addWidget} =require( '../function/functionwidget/addWidget');
const {deleteWidget} =require( '../function/functionwidget/deleteWidget');
const {ShareDataToWidget} =require( '../function/functionData/ShareDataToWidget');

const {getall} =require( '../controller/gelall');
const {registre} =require( '../controller/registre');
const {forget} =require( '../controller/forget');
const {change} =require( '../controller/change');
const {validation} =require( '../controller/validation');
const {addworkspace}=require('../controller/addworkspace')
const {getinsideworkspace}=require('../controller/getinsideworkspace')
const {logout} =require( '../controller/logout');
const {getworkspace} = require("../controller/getworkspace");
const {deleteworkspace}=require('../controller/deleteworkspace');
const {deleteLinkWidget}=require('../function/functionData/deleteLinkWidget');

const {DeleteUser} = require("../controller/DeleteUser");

const multer=require('multer')

const {addinsideworkspace} = require("../controller/addinsideworkspace");

const {shareWorkspace} = require("../controller/shareWorkspace");
const {getSharedWorkspace} = require("../controller/getSharedWorkspaces");
const {editworkspace} = require("../controller/editworkspace");


const {getWidget} = require("../function/functionwidget/getWidget");
const {lpm} = require("../config/lpm");
const {getData} = require("../function/functionData/getData");
const {shareDataToWidget}=require('../function/functionData/ShareDataToWidget')


const fileStorage=multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,'./upload')
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+'--'+Math.floor(Math.random()*1000)+file.originalname.replace(/\s+/g,'-'))
        }
    }
)

const upload=multer({storage:fileStorage});
const router = express.Router();

router.post('/widget',lpm,widgetController);


router.post('/editUser', checkToken,AdminstratorVlidation,editUser );
router.post('/register',upload.single('file'),checkToken,registre,);
router.post('/login', login);
router.post('/logout', checkToken,logout );
router.post('/forget', forget);
router.post('/all', checkToken, getall);
router.post('/edit', checkToken,edituser);
router.post('/editPass', checkToken,editPass);
router.post('/deleteUser', checkToken,DeleteUser);
router.post('/change',change);
router.post('/validation',validation);
router.post('/getData',getData);



router.post('/addworkspace',checkToken,addworkspace);
router.post('/editworkspace',checkToken,editworkspace);

router.post('/getworkspace',checkToken,getworkspace);

router.post('/shareData',ShareDataToWidget);


router.post('/addinsideworkspace',checkToken,addinsideworkspace)
router.post('/shareWorkspace',checkToken,shareWorkspace)
router.post('/getsharedWorkspace',checkToken,getSharedWorkspace)



router.post('/getinsideworkspace',checkToken,getinsideworkspace);
router.post('/addworkspace',checkToken,addworkspace);
router.post('/deleteworkspace',checkToken,deleteworkspace)




router.post('/addWidget', checkToken,addWidget);
router.post('/deleteLinkWidget', checkToken, deleteLinkWidget);


router.post('/getworkspace',checkToken,getworkspace);
router.post('/getWidget',checkToken,getWidget);
router.post('/deleteWidget',checkToken,deleteWidget)




module.exports= router;
