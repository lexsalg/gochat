function send() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status === 200) {
                success(req.response)
            } else {
                err()
            }
        }
    };
    let username = document.getElementById("username").value;
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
    let socket = new WebSocket("ws://localhost:8000/chat")
}


let submit = function (event) {
    event.preventDefault();
    send();
};


function main() {
    let form = document.getElementById("form_registro");
    form.addEventListener("submit", submit, true);

}


