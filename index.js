import express from "express";
import rotasContas from "./rotas/contas.js";
import { promises as fs } from "fs";
import winston from "winston";
import cors from "cors";

const { readFile , writeFile } = fs;
function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
        return anoF+mesF+diaF;
    return diaF+"/"+mesF+"/"+anoF;
}

global.arquivoContas = "./contas/contas.json";
var arquivoLog = dataAtualFormatada();
global.arquivoLog = "./logs/"+arquivoLog+".log";



const {combine , timestamp , label , printf } = winston.format;
const meuFormato = printf(({ level , message , label , timestamp})=>{
    return `${timestamp} [${label}] ${level}: ${message}`
})
global.logger = winston.createLogger({
    level:"silly",
    transports:[
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename:global.arquivoLog }),
    ],
    format: combine(
        label({ label: "my-bank-api"}),
        timestamp(),
        meuFormato
    )
})

const app = express();
app.use( express.json() );
app.use(cors());
app.use( express.static("public") );

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
        contas:[]
    }
    try {
        await readFile(global.arquivoContas);
        logger.info('API STARTED')
    } catch (error) {
        await writeFile(global.arquivoContas , JSON.stringify(initialJson,null,2)).then(()=>{
            logger.info('ERRO AO CRIAR ARQUIVO')
        }).catch( err=>{
            logger.error(err)
        });
        
    }
    
});