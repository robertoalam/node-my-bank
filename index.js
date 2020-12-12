import express from "express";
import rotasContas from "./rotas/contas.js";
import { promises as fs } from "fs";

const { readFile , writeFile } = fs;

const app = express();
app.use( express.json() );


// app.use("/conta",rotasContas);
// app.use("/account",rotasContas);

app.use("/",(req , res , next) =>{
    console.log('TESTE');
    res.send('teste');
    next();
});

app.listen(3000, async ()=>{
    const initialJson = {
        nextId:1,
        accouts:[]
    }
    try {
        await readFile("./contas/contas.json")    
    } catch (error) {
        await writeFile("./contas/contas.json" , JSON.stringify(initialJson,null,2));
    }
    
    console.log('API STARTED')
});