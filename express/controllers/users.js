const fs = require("fs");
const fsPromises = require("fs").promises;
const data = fs.readFileSync("./data/usuarios.json");
const Users = JSON.parse(data);
const readConfig = fs.readFileSync("./data/config.json");
const config = JSON.parse(readConfig);
const control = {};

control.read_all = (req, res, next) => {
    let users = Users.filter((dt) => {
        if (dt.deleted == false) {
            return true;
        } else {
            return false;
        }
    });
    res.status(200).json(users);
};

control.read_id = (req, res, next) => {
    let user = Users.find((dt) => {
        if (dt.id == req.params.id) {
            return true;
        }
    });
    res.status(200).send(user);
};

control.create = async (req, res, next) => {
    try{
        let newId,newUser;
        let findUser = Users.find(user=>{
            if(user.email==req.body.email){
                return true;
            }
        })
        if (!findUser) {
            newId = config.numeroIdUser;
            newUser = {
                id: newId,
                nome: req.body.nome,
                email: req.body.email,
                deleted: false,
            };
            if (!Users) {
                Users = [newUser];
            } else {
                Users.push(newUser);
            }
            if (req.body.nome && req.body.email) {
                await fsPromises.writeFile(
                    `./data/usuarios.json`,
                    JSON.stringify(Users, null, "\t"),
                    (err) => {
                        if (err) console.log("Erro escrevendo arquivo:", err);
                    }
                );
                config.numeroIdUser = await config.numeroIdUser+1;
                await fsPromises.writeFile(
                    `./data/config.json`,
                    JSON.stringify(config),
                    (err) => {
                        if (err) console.log("Erro escrevendo arquivo:", err);
                    }
                );
                res.status(200).json(newUser);
            }else{
                throw new Error("Nome ou/e Email incompleto");
            }
        }else{
            throw new Error("Email já cadastrado");
        }
    } catch(err){
        console.error(err)
        res.status(500).send(err)
    }
};
control.update = async (req, res, next) => {
    let user = Users.find((dt) => {
        if (dt.id == req.params.id) {
            return true;
        }
    });
    let index = Users.indexOf(user);
    Users[index].nome = req.body.nome;
    Users[index].email = req.body.email;
    await fsPromises.writeFile(
        `./data/usuarios.json`,
        JSON.stringify(Users, null, "\t"),
        (err) => {
            if (err) console.log("Erro escrevendo arquivo:", err);
        }
    );
    res.status(200).json(Users[index]);
};
control.delete = async (req, res, next) => {
    let user = Users.find((dt) => {
        if (dt.id == req.params.id) {
            return true;
        }
    });
    if (user) {
        let index = Users.indexOf(user);
        Users[index].deleted = true;
        await fsPromises.writeFile(
            `./data/usuarios.json`,
            JSON.stringify(Users, null, "\t"),
            (err) => {
                if (err) console.log("Erro escrevendo arquivo:", err);
            }
        );
        res.status(200).json(user);
    } else {
        res.status(200).send(
            "usuario já excluido ou nao constado no banco de dados"
        );
    }
};
module.exports = control;
