const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    apartment_id:{
        type:String,
        required:false
    },
    secret:{
        type:String,
        required:false
    }
});

module.exports=mongoose.model('Users',UserSchema);
