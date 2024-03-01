const mongoose=require('mongoose');

const ItemSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    ownerEmail:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    }
});

module.exports=mongoose.model('Items',ItemSchema);
