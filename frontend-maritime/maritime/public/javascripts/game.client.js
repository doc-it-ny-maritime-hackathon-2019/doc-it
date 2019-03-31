'use strict';

if (window.innerWidth < 800) {
    window.location.replace('/player');
}

window.addEventListener('load', function () {
    init();
});

function showhide(checkbox, id) {
    if (document.querySelector('#' + checkbox).checked) {
        document.querySelector('#' + id).style.display = 'block';
    } else {
        document.querySelector('#' + id).style.display = 'none';
    }
}

function saved() {
    document.querySelector("#saved").style = 'text-align: center; border: 1px solid #c3e6cb; background-color: #d4edda; border-radius: .25rem; opacity:100;';
    setTimeout(function () {
        document.querySelector("#saved").style = 'text-align: center; border: 1px solid #c3e6cb; background-color: #d4edda; border-radius: .25rem; opacity:0;-moz-transition: opacity 2s ease-in-out;';
    }, 1);
}



function init() {
    const socket = io({
        transports: ['websocket']
    });

    socket.emit('gameClient connect');
    socket.on('init', function (msg) {
        document.querySelector('#gameID').textContent = msg;
    });

    socket.on('load', function (msg) {
        document.querySelector('#content').innerHTML = msg;
    });
    socket.on('getID', function (msg) {
        document.querySelector('#gameID').textContent = msg;
    });
    socket.on('docMissing', function (msg){
        document.querySelector('#'+msg).textContent = "File Missing";
        document.querySelector('#'+msg).style = "color:red";
    });
    socket.on('itemMissing', function (msg,item){
        document.querySelector('#'+msg).textContent = "Missing items:";
        let listItem = document.createElement("li");
        listItem.textContent = item;
        document.querySelector('#'+msg+'ul').append(listItem);
    });




    document.querySelector('#player1').addEventListener('click', function () {
        socket.emit('getPage', 'step1');
    });
    document.querySelector('#player2').addEventListener('click', function () {
        socket.emit('getPage', 'step2');

        setTimeout(() => {
            document.querySelector('#submit').addEventListener('click', function () {
                saved();

                let data = {};
                data.owner = document.querySelector('#owner').value;
                data.departureDate = document.querySelector('#departureDate').value;
                data.arrivalDate = document.querySelector('#arrivalDate').value;
                data.PoLoading = document.querySelector('#PoLoading').value;
                data.PoDischarge = document.querySelector('#PoDischarge').value;
                data.dangerous = document.querySelector('#dangerous').value;
                data.dangerType = document.querySelector('#dangerType').value;
                data.agriculture = document.querySelector('#agriculture').value;
                data.agriType = document.querySelector('#agriType').value;
                data.military = document.querySelector('#military').value;

                let output = JSON.stringify(data);
                socket.emit('saveData', output);
            });
        }, 200);
    });
    document.querySelector('#player3').addEventListener('click', function () {
        socket.emit('getPage', 'step3');

        setTimeout(() => {
            document.querySelector('#submit').addEventListener('click', function () {
                saved();
                sendFile();       
            });
        }, 200);
    });
    document.querySelector('#player4').addEventListener('click', function () {
        socket.emit('getPage', 'step4');
    });
    document.querySelector('#player5').addEventListener('click', function () {
        socket.emit('getPage', 'step5');
    });

    
    var uploader = new SocketIOFileClient(socket);

    uploader.on('ready', function() {
        console.log('SocketIOFile ready to go!');
    });
    uploader.on('loadstart', function() {
        console.log('Loading file to browser before sending...');
    });
    uploader.on('progress', function(progress) {
        console.log('Loaded ' + progress.loaded + ' / ' + progress.total);
    });
    uploader.on('start', function(fileInfo) {
        console.log('Start uploading', fileInfo);
    });
    uploader.on('stream', function(fileInfo) {
        console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
    });
    uploader.on('complete', function(fileInfo) {
        console.log('Upload Complete', fileInfo);
    });
    uploader.on('error', function(err) {
        console.log('Error!', err);
    });
    uploader.on('abort', function(fileInfo) {
        console.log('Aborted: ', fileInfo);
    });

    function sendFile() {
        socket.emit("Upload");
        // Send File Element to upload
        var fileEl = document.getElementById('bol');
        // var uploadIds = uploader.upload(fileEl);

        // Or just pass file objects directly
        var uploadIds = uploader.upload(fileEl.files);
    }
}