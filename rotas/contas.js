import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

let data;
let dados;

router.post("/", async (req, res , next) => {
    let conta = req.body;
    try {
        let contaNova = req.body;

        if( !contaNova.name ) {
            throw new Error("Sem Nome!")
        }

        if( contaNova.saldo == null) {
            throw new Error("Sem Saldo!")
        }

        dados = await readFile(global.arquivoContas);
        data = JSON.parse( dados );
        contaNova = {id:data.nextId++, ... contaNova};
        contaNova = {
            id:data.nextId++, 
            nome:contaNova.nome,
            saldo: contaNova.saldo
        };
        data.contas.push(contaNova)

        await writeFile(global.arquivoContas , JSON.stringify(data,null,2) );
        res.status(200).send(contaNova);
        logger.info(`POST / conta - ${JSON.stringify(contaNova)}`);
    } catch (error) {
        // res.status(400).send({error:error.message})
        next(error);
    }
    res.end();
});

router.get("/",async(req,res,next)=>{
    try {
        dados = JSON.parse( await readFile(global.arquivoContas) );
        delete dados.nextId;
        res.send(dados);
        logger.info("GET / contas");
    } catch (error) {
        // res.status(400).send({error:error.message})
        next(error);
    }
});

router.get("/:id",async(req,res,next)=>{
    try {
        dados = JSON.parse( await readFile(global.arquivoContas) ); 
        const novaConta = dados.contas.find(
            conta => conta.id === parseInt(req.params.id ) 
        ) ;
        res.send(novaConta);
        logger.info(`GET / contas - ID ${req.params.id}`);
    } catch (error) {
        // res.status(400).send({error:error.message})
        next(error);
    }
});

router.delete("/:id",async(req,res,next)=>{
    try {
        dados = JSON.parse( await readFile(global.arquivoContas) );
        dados.contas = dados.contas.filter(
            conta => conta.id !== parseInt(req.params.id ) 
        ) ;
        await writeFile(global.arquivoContas , JSON.stringify(contas,null,2) );
        res.status(200).send(true);
        logger.info(`DELETE /contas/:id - ${req.params.id}`);
    } catch (error) {
        // res.status(400).send({error:error.message})
        next(error);
    }
});

router.put("/",async(req,res,next)=>{

    try {

        if( !contaNova.name ) {
            throw new Error("Sem Nome!")
        }

        if( contaNova.saldo > 0) {
            throw new Error("Sem Saldo!")
        }

        const conta = req.body;
        dados = JSON.parse( await readFile(global.arquivoContas) );
        // DESCOBRINDO O INDICE
        const index = dados.contas.findIndex(a => a.id === conta.id);

        if(index === -1){
            throw new Error("Registro não encontrado!")
        }

        dados.contas[index].nome = conta.nome;
        dados.contas[index].saldo = conta.saldo;
        //REGRAVANDO
        await writeFile(global.arquivoContas , JSON.stringify(dados,null,2) );

        res.status(200).send(conta);

        logger.info(`PUT / contas - ${JSON.stringify(conta)}`);
    } catch (error) {
        // res.status(400).send({error:error.message})
        next(error);
    }
});

router.patch("/novoSaldo" , async (req , res , next)=>{
    try {

        if( contaNova.saldo == null) {
            throw new Error("Sem Saldo!")
        }

        const conta = req.body;

        dados = JSON.parse( await readFile(global.arquivoContas) );
        // DESCOBRINDO O INDICE
        const index = dados.contas.findIndex(a => a.id === parseInt(conta.id) );

        if(index === -1){
            throw new Error("Registro não encontrado!")
        }

        dados.contas[index].saldo = conta.saldo;
        
        await writeFile(global.arquivoContas , JSON.stringify(dados,null,2) );

        res.send(dados.contas[index]);

        logger.info(`PATCH / contas/novoSaldo - ${JSON.stringify(dados.contas[index])}`);
    } catch (error) {
        // res.status(400).send({error:error.message})
        next(error);
    }
});


// TRATAR ERROS 
router.use((err , req, res , next)=>{
    logger.error(`${req.method} ${req.baseUrl} ${err.message}`)
    res.status(400).send({error: err.message});
});
export default router;