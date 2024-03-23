const mongoose=require('mongoose');

const ApartmentSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    PIN:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('Apartments',ApartmentSchema);
