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

mongoose.connect('mongodb://localhost:27017').then(r => console.log('db connected'))

app.listen(port,()=>{
    console.log(`backend running on port ${port}`);
})

