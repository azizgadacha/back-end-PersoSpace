const  mongoose=require("mongoose")

const workspace = new mongoose.Schema({

    superior_id: String,

    WorkspaceName: String,

    description: String,
    Share:Array,
    date:{type:Date,
        default: new Date()

    },

},)

module.exports=mongoose.model("workspace",workspace)