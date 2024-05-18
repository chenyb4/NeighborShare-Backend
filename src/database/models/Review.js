const mongoose=require('mongoose');

const ReviewSchema=mongoose.Schema({
    for_user_id:{
        type:String,
        required:true
    },
    by_user_id:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('Reviews',ReviewSchema);
