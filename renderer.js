const {ipcRenderer} = require('electron');
const button = document.getElementById('send');

// send promt to AI
button.addEventListener('click',()=> {
    // promt to send
    const text = document.getElementById('inp').value;
    // send promt to send to ai
    ipcRenderer.send('promt',text);

})

//add tabs
var tabs = 1;
var leftMargin = 2;
const tabplus = document.getElementById('tabplus');
const tabminus = document.getElementById('tabminus');
const tab = document.getElementById('tab');
tabplus.addEventListener('click',()=>{
    tabminus.style.backgroundColor = 'crimson';
    if (tabs<6){
        console.log('tabplus');
        tabs++;
        leftMargin = leftMargin + 11.8;
        // copy tab1, put under tab and change left margine
        var newTab =  document.getElementById('tab1').cloneNode()
        newTab.id = 'tab' + tabs;
        newTab.style.marginLeft = leftMargin + '%';
        newTab.innerHTML = tabs.toString()
        newTab.classList.add('box')
        newTab.classList.add('tab')
        tab.appendChild(newTab);
        //set tabplus gb color to green
        tabplus.style.backgroundColor = 'chartreuse';
    }
    if(tabs>=6){
        tabplus.style.backgroundColor = 'grey';
    }
})
//remove tabs
tabminus.addEventListener('click',()=>{
    tabplus.style.backgroundColor = 'chartreuse';
    if (tabs>1){
        console.log('tabminus');
        var tabToRemove = document.getElementById('tab' + tabs.toString());
        tab.removeChild(tabToRemove);
        tabs--;
        leftMargin = leftMargin - 11.8;
        // remove tab
        //set tabminus gb color to green
        tabminus.style.backgroundColor = 'crimson';
    }
    if(tabs<=1){
        tabminus.style.backgroundColor = 'grey';
    }
})
//click event
function clicked(id){
    console.log(id)
}

// Recieve file updates
ipcRenderer.on('file',(evt,msg)=>{

})



// Recieve status updates
ipcRenderer.on('status',(evt, msg)=>{

})