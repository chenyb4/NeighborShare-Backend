const mongoose=require('mongoose');

const ComplaintSchema=mongoose.Schema({
    by_user_id:{
        type:String,
        required:true
    },
    for_item_id:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    is_resolved:{
        type:Boolean,
        required:true,
        default:false
    }

});

module.exports=mongoose.model('Complaint',ComplaintSchema);
