
const express = require("express")
const app = express()

const cors = require("cors")
const db = require("./db")

app.use(cors())
app.use(express.json())

app.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {

        if (!(username || password)) throw new Error("Username ou Senha não foram preenchidos.")

        await db.connect()
        
        const { rows } = await db.query("SELECT cpf, password FROM auth WHERE auth.username = $1", [username])

        const user = rows[0]

        if (!user) throw new Error("O usuário não existe.")

        if (user.password != password) throw new Error("Senha incorreta")
            
        const date = new Date();
        
        const formattedDate = date.toISOString().slice(0, 19).replace('T', ' '); 
        
        await db.query("INSERT INTO logs (username, id, datetime) VALUES ($1, $2, $3)", [username, user.cpf, formattedDate]);
        
        console.log(formattedDate);

        res.status(202).json({
            success: true,
            data: rows
        })
    } catch (error) {
     console.log(error)
     res.status(400).json({
        message: error.message,
        success: false
     })
    }
})

app.post("/create-user", async (req, res) => {
    const { username, password, cpf} = req.body

    console.log(password)

    try {
        await db.connect()

        await db.query("INSERT INTO auth (username, password, cpf) VALUES ($1, $2, $3)", [username, password, cpf])
        
        res.status(202).json({
            success: true
        })

    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
})

app.get("/get-history", async (_, res) => {
    try {
        await db.connect()

        const { rows: data } = await db.query("SELECT id, username, datetime FROM logs")
        res.status(202).json({
            message: true,
            data
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
})

app.get("/generate-db", async (req,res) => {

    await db.query("CREATE TABLE auth (username varchar(255), password varchar(15), cpf varchar(14)); CREATE TABLE logs (id varchar(255), username varchar(255), datetime text)")

    res.status(200).json()
})

app.listen(3000, () => {
    console.log("servidor rodando na porta 3000")
})