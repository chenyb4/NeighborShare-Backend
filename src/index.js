const express=require('express');
const app=express();
const port=3000;
const mongoose=require('mongoose');
require('dotenv').config();

const cors = require('cors');
const bodyParser=require('body-parser');


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/apartments',require('./routes/apartment'));
app.use('/items',require('./routes/item'));
app.use('/users',require('./routes/user'));
app.use('/credentials',require('./routes/credentials'));
app.use('/complaints',require('./routes/complaint'));
app.use('/reviews',require('./routes/review'));

mongoose.connect(process.env.DB_CONNECTION).then(r => console.log('db connected'))

app.listen(port,()=>{
    console.log(`backend running on port ${port}`);
})

