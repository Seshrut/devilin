const {ipcRenderer} = require('electron');
const button = document.getElementById('send');

// send promt to AI
button.addEventListener('click',()=> {
    // promt to send
    const text = document.getElementById('inp').value;
    // send promt to send to ai
    ipcRenderer.send('promt',text);

})


// Recieve file updates
ipcRenderer.on('file',(evt,msg)=>{

})



// Recieve status updates
ipcRenderer.on('status',(evt, msg)=>{

})