import express from "express"
import {PORT} from "./config.js"

const app = express()

app.get("", (req,res)=>{
	res.send("welcome XD")
})

app.listen(PORT)
console.log("Se usa ",PORT)