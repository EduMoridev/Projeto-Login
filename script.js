function togglePopup(id) {
    const popover = document.getElementById(id)
    popover.classList.toggle("popover-open")
}

//register
async function register() {
        const username = document.querySelector("#username_register").value
        const senha = document.querySelector("#senha_register").value
        const cpf = document.querySelector("#cpf_register").value
        console.log(username, cpf, senha)

        try {
            const response = await fetch("http://localhost:3000/create-user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password: senha,
                    cpf
                })
            })

            console.log(response)
        } catch (error) {
            console.log(error)
        }
}
//login
async function login() {
    const username = document.querySelector("#username_login").value
    const senha = document.querySelector("#senha_login").value

    const cpfElement = document.querySelector("#show_cpf")

    if (!username) return alert("Informe um usuário")
    if (!username) return alert("Informe uma senha")
    
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password: senha
            })
        }).then(response => response.json())

        if (!response.success) return alert("Falha")

        cpfElement.innerHTML = `CPF: ${response.data[0].cpf}`
    } catch (error) {
        console.log(error)
    }
}

// history

async function getHistory() {
    const list = document.querySelector("#history")
    const items = await fetch("http://localhost:3000/get-history").then(response => response.json())
    console.log(items)
    if (items.data.length > 0) {
        for (const item of items.data) {
            console.log(item)
            list.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.username}</td>
                <td>${item.datetime}</td>
            </tr>
            `;
        }
    }
}

async function handleHistory() {
    togglePopup('hist-popup');
    // await getHistory()
}