const express=require('express');
const app=express();
const port=3000;
const mongoose=require('mongoose');


app.use('/apartments',require('./routes/apartment'));


mongoose.connect('mongodb://localhost:27017').then(r => console.log('db connected'))

app.listen(port,()=>{
    console.log(`backend running on port ${port}`);
})
