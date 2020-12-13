import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

let json;
let data;

router.post("/", async (req, res) => {
    let conta = req.body;
    try 
    {
        let contaNova = req.body;
        const contas = await readFile(global.arquivoContas);
        data = JSON.parse( contas );
        contaNova = {id:data.nextId++, ... contaNova};
        data.accounts.push(contaNova)

        await writeFile(global.arquivoContas , JSON.stringify(data,null,2) );
        res.status(200).send(contaNova);

    } catch (error) {
        res.status(400).send({error:error.message})
    }
    
    res.end();
});

router.get("/",async(req,res)=>{
    try {
        const contas = JSON.parse( await readFile(global.arquivoContas) );
        delete contas.nextId;
        res.send(contas);
    } catch (error) {
        res.status(400).send({error:error.message})
    }
});

router.get("/:id",async(req,res)=>{
    try {
        const contas = JSON.parse( await readFile(global.arquivoContas) ); 
        const novaConta = contas.accounts.find(
            conta => conta.id === parseInt(req.params.id ) 
        ) ;
        res.send(novaConta);
    } catch (error) {
        res.status(400).send({error:error.message})
    }
});

router.delete("/:id",async(req,res)=>{
    try {
        const contas = JSON.parse( await readFile(global.arquivoContas) );
        contas.accounts = contas.accounts.filter(
            conta => conta.id !== parseInt(req.params.id ) 
        ) ;
        await writeFile(global.arquivoContas , JSON.stringify(contas,null,2) );
        res.status(200).send(true);
    } catch (error) {
        res.status(400).send({error:error.message})
    }
});

router.put("/",async(req,res)=>{

    try {
        const conta = req.body;
        const contas = JSON.parse( await readFile(global.arquivoContas) );
        // DESCOBRINDO O INDICE
        const index = contas.accounts.findIndex(a => a.id === conta.id);

        contas.accounts[index] = conta;
        //REGRAVANDO
        await writeFile(global.arquivoContas , JSON.stringify(contas,null,2) );

        res.status(200).send(conta);
    } catch (error) {
        res.status(400).send({error:error.message})
    }
});
export default router;