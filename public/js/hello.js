let Username;
let final_conexion;

function send() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status === 200) {
                success(req.response);

            } else {
                err()
            }
        }
    };
    let username = document.getElementById("username").value;
    Username = username;
    // let user = {username};
    req.open('Post', 'http://localhost:8000/validate', true);
    // req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    // req.send(user);
    let formData = new FormData();
    formData.append("username", username);
    req.send(formData);
}

function success(res) {
    let data = JSON.parse(res);
    if (data['isValid']) {
        connect()
    }
}

function err() {
    console.log('err')
}

function connect() {
    document.getElementById('container-chat').style.display = 'flex';
    document.getElementById('container').style.display = 'none';
    let socket = new WebSocket(`ws://localhost:8000/chat/${Username}`);
    final_conexion = socket;
    socket.onopen = (res) => {
        socket.onmessage = (res) => {
            let val = document.getElementById("chat-area").value;
            document.getElementById("chat-area").value = val + "\n" + res.data;
        }
    }
}


let submitUser = function (event) {
    event.preventDefault();
    send();
};

let submitMessage = function (e) {
    e.preventDefault();
    let msg = document.getElementById("msg").value;
    final_conexion.send(msg);
    document.getElementById("msg").value = "";
};


function main() {
    let form = document.getElementById("form_registro");
    form.addEventListener("submit", submitUser, true);
    let fm = document.getElementById("form_message");
    fm.addEventListener("submit", submitMessage, true);

}


