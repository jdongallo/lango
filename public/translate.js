"use strict"

let object = undefined;
const input = document.getElementById("word");
let engText = "";
let transText = "";

function createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    return xhr;
}

input.addEventListener("keyup", getTranslation)

function getTranslation(event) {
    if (event.keyCode == 13) {
        let url = "/translate?english=" + document.getElementById("word").value;
        let xhr = createCORSRequest('GET', url);
    
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
    
        xhr.onload = function() {
            let responseStr = xhr.responseText;
            object = JSON.parse(responseStr);
            let output = document.getElementById("outputDiv");
            output.textContent = object.Spanish;
            engText = object.English;
            transText = object.Spanish;
        }
    
        xhr.onerror = function() {
            alert('There was an error in making the request');
        }
    
        xhr.send();
    }
}

function saveInput() {
    let url = "/store?english=" + engText + "&spanish=" + transText;
    let xhr = createCORSRequest('GET', url);

    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    xhr.onload = function() {
        let responseStr = xhr.responseText;
        let output = document.getElementById("outputDiv");
        output.textContent = responseStr;
    }

    xhr.onerror = function() {
        alert('There was an error in making the request');
    }

    xhr.send();
}

export {
    object, input, engText, transText, createCORSRequest, getTranslation, saveInput
};