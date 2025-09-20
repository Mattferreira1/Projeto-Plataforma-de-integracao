const express = require("express")
const app = express()
const db = require("./db/db.js")
const UserRoutes = require("./routes/UserRotas.js")
const ProdutosRouter = require("./routes/ProdutosRotas.js")
db()


// const { Resend } = require("resend");

// const resend = new Resend("re_PLiLdpJ4_3ZW5S2EcSYfqCdcS9Nhd45i2");
// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'matheus2100discord@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });

app.use(express.json())

app.get("/",(req,res)=>{
    return res.status(200).json({
        'message': "Rota raiz"
    })
})
app.use("/users", UserRoutes)
app.use("/produtos", ProdutosRouter)

module.exports = app;

app.listen(3000, ()=>{
    console.log("Rodando na porta http://localhost:3000");
    return
    
})
