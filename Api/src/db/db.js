const mongoose = require("mongoose")
require('dotenv').config()

const db = async()=>{
   try{
     await mongoose.connect(process.env.DB_API_KEY).then(()=>{
        console.log("Banco de dados conectado!");
        
    })
   }catch(e){
    console.log(e);
    
   }
}  
module.exports = db;