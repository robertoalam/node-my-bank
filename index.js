import express from "express";
import rotasContas from "./rotas/contas.js";
import { promises as fs } from "fs";

const { readFile , writeFile } = fs;

global.arquivoContas = "./contas/contas.json";

const app = express();
app.use( express.json() );


app.use("/contas",rotasContas);
app.use("/account",rotasContas);

// app.use("/",(req , res , next) =>{
//     console.log('TESTE');
//     res.send('teste');
//     next();
// });

app.listen(3000, async ()=>{
    const initialJson = {
        nextId:1,
        accounts:[]
    }
    try {
        await readFile(global.arquivoContas)    
    } catch (error) {
        await writeFile(global.arquivoContas , JSON.stringify(initialJson,null,2));
    }
    
    console.log('API STARTED')
});