const express=require('express');
const app=express();
const port=3000;
const mongoose=require('mongoose');

const cors = require('cors');
const bodyParser=require('body-parser');


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/apartments',require('./routes/apartment'));
app.use('/items',require('./routes/item'));
app.use('/users',require('./routes/user'));
app.use('/credentials',require('./routes/credentials'));

mongoose.connect('mongodb+srv://chenyb0417:Fmk3etHR6ctYS1Bl@cluster0.kuwlp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(r => console.log('db connected'))

app.listen(port,()=>{
    console.log(`backend running on port ${port}`);
})

