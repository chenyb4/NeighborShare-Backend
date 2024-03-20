const router = require('express').Router();
const credentialsController=require("../controllers/credentials");

router.post('',credentialsController.auth);

module.exports=router;
