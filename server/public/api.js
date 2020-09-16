let base_url = 'http://localhost:3000/api/'
let loginToken = null;
let ws = null;

/**
API Caller helper to refactor common API code that requires bearer tokens (all http requests have POST method)
@param {string} api API URL
@param {object} body body needed for the API call (pass as empty object if not needed)
@param {number} successCode success status code e.g. 200
@param {function} dataReturner data returning function, processes data to return it in a specific format
@param {function} rejectWithValue  rejectWithValue function for that specific async thunk that calls it
*/

async function apiCaller(api, body, successCode, dataReturner, ) {
    try {
        let req_init = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`, 
            },
        }
        // if body is an empty object, do not include it
        if (!(Object.keys(body).length === 0 && body.constructor === Object)){
            req_init['body'] = JSON.stringify(body);
        }
        
        const res = await fetch(api, req_init);
        
        if (res.ok) {
            const data = await res.json()
            if (data.statusCode != successCode) {
                throw new Error((data.err !== undefined) 
                ? `${data.statusCode}: ${data.message} - ${JSON.stringify(data.err.details).replace(/[\[\]\{\}"'\\]+/g, '').split(':').pop()}`
                : `${data.statusCode}: ${data.message}`) 
            }
            if (!dataReturner) { return data; }
            return dataReturner(data)
        }
        throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
        return err.toString()
    }
}

async function login() {
    let req = {
        email: document.getElementById("emailTB").value,
        password: document.getElementById("passwordTB").value,
        type: document.getElementById("typeTB").value,
    }
    
    let res = await apiCaller(base_url + "auth/login", req, 200);

    if (typeof res != 'object') {
        alert('Error: ' + res);
    } else {
        loginToken = res.token;
        document.getElementById("tokenP").innerHTML = loginToken;
    }
}

function wsConnect() {
    let url = "ws://localhost:3000/api/session/ws?token=" + loginToken + "&committeeId=" + document.getElementById("committeeIdTB").value;
    ws = new WebSocket(url);

    ws.onmessage = (event) => {
        let res = JSON.parse(event.data);
        if (res.type == "DATA") {
            document.getElementById("chatDIV").innerHTML += "<br>Server: " + res.message;
        } else if (res.type == "RES") {
            document.getElementById("chatDIV").innerHTML += "<br>Server: " + event.data;
        }
    }
    
    ws.onopen = (event) => {
        document.getElementById("chatDIV").innerHTML += "<br>|Connected|";
        let req = {
            type: "GET_INITIAL_DATA"
        };
        ws.send(JSON.stringify(req));
    }
}

function wsDisconnect() {
    if (ws) {
        document.getElementById("chatDIV").innerHTML += "<br>|Disconnected|";
        ws.close();
        ws = null;
    } else {
        console.log("ws is null!");
    }
}

function wsEcho() {
    if (!ws) { return null; }
    if (ws.readyState == 1) {
        let req = {
            type: "ECHO",
            echo: document.getElementById("echoTB").value
        }
        document.getElementById("chatDIV").innerHTML += "<br>You: " + req.echo;
        ws.send(JSON.stringify(req));
    }
}