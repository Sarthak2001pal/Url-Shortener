const express = require("express")
const {connectToMongoDb} = require("./connection")
const urlRoute =  require("./routes/url_router")
const path = require("path")
const staticRoute = require("./routes/staticRouter")
const URL = require("./models/url")
const app = express()
const PORT = 8000

connectToMongoDb("mongodb://localhost:27017/short-url")
.then(()=>console.log("MongoDb Connected"))

app.set("view engine","ejs")
app.set("views", path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use('/url',urlRoute)

app.use("/",staticRoute )

app.get('/url/:shortId',async(req,res)=>{
    const shortId = req.params.shortId
    const entry = await URL.findOneAndUpdate(
    {
        shortId
    },
    {
        $push:{
        visitHistory:{
            timestamp: Date.now()
        }
    }})
    res.redirect(entry.redirectUrl)
})

app.listen(PORT,()=>console.log(`Server started at port:${PORT}`))