const btn_post = document.querySelector("#cadastro .form button");
const elNome = document.querySelector("#cadastro .form #nome");
const elEmail = document.querySelector("#cadastro .form #email");
const list = document.querySelector("#lista table tbody");

const modal = document.querySelector("#modal");
const closed = document.querySelector("#modal .close");
const closeAlert = document.querySelector(".alert .close");
const modalAlert = document.querySelector(".alert");
const textAlert = document.querySelector(".alert p");
const btn_put = document.querySelector("#modal .form button");
const modNome = document.querySelector("#modal .form #nome");
const modId = document.querySelector("#modal .form #id");
const modEmail = document.querySelector("#modal .form #email");
function Num_0(num, size) {
    var s = "0000" + num;
    return s.substring(s.length - size);
}
const Alerta=(_str)=>{
    textAlert.innerText = `${_str}`
    modalAlert.classList.add('show')
    return setTimeout(()=>{
        modalAlert.classList.remove('show')
    },5000)
}
closeAlert.addEventListener('click',()=>{
    modalAlert.classList.remove('show')
    clearTimeout(Alerta)
})
function Listar() {
    fetch("http://localhost:8000/usuarios", {
        method: "GET",
        headers: { "Content-type": "application/json" },
    }).then(res=>res.json())
    .then(json=>{
        list.innerHTML = "";
        let color = "cor1";
        json.forEach((user) => {
            list.innerHTML += `<tr class="${color}">
                    <td>${Num_0(user.id, 4)}</td>
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td><button onclick="Editar(${
                        user.id
                    })"><ion-icon name="create"></ion-icon></button></td>
                    <td><button onclick="Deletar(${
                        user.id
                    })"><ion-icon name="close"></ion-icon></button></td>
                </tr>`;
            if (color == "cor1") {
                color = "cor2";
            } else {
                color = "cor1";
            }
        });
    })
}

window.addEventListener("load", Listar());
btn_post.addEventListener("click", async() => {
    try{
        if(elEmail.value<=3){
            throw new Error("Email incompleto")
        }
        if(elNome.value<=3){
            throw new Error("Nome incompleto")
        }
        let _data = {
            nome: elNome.value,
            email: elEmail.value,
        };
        await fetch("http://localhost:8000/usuarios", {
            method: "POST",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
            }).then(Listar())
            .catch((err) => Alerta(err));
    }catch(err){
        Alerta(err);
    }
});

async function Deletar(num) {
    await fetch(`http://localhost:8000/usuarios/${num}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
        }).then(Listar())
        .catch((err) => console.log(err));
}
async function Editar(num) {
    await fetch(`http://localhost:8000/usuarios/${num}`, {
        method: "GET",
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then((response) => response.json())
        .then((json) => {
            modal.classList.add("show");
            modEmail.value = json.email;
            modId.value = json.id;
            modNome.value = json.nome;
        })
        .catch((err) => console.log(err));
}
btn_put.addEventListener("click", async () => {
    let _data = {
        nome: modNome.value,
        email: modEmail.value,
    };

    await fetch(`http://localhost:8000/usuarios/${modId.value}`, {
        method: "PUT",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            modal.classList.remove("show");
        }).then(Listar())
        .catch((err) => console.log(err));
});
closed.addEventListener("click", () => {
    modal.classList.remove("show");
});
