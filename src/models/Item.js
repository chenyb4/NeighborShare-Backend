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
    },
    apartmentNumber:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        required:true,
        default:true
    }
});

module.exports=mongoose.model('Items',ItemSchema);
