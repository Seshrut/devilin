const {ipcRenderer} = require('electron');
const button = document.getElementById('send');
var selectedtab = 'tab1'
//how to save test cases
// var testcases={'tab1':{'inp':{'inp1':'oogabooga'},'out':{}},'tab2':{'inp':{},'out':{}},'tab3':{'inp':{},'out':{}},'tab4':{'inp':{},'out':{}},'tab5':{'inp':{},'out':{}},'tab6':{'inp':{},'out':{}}}
var testcases={'tab1':{'inp':{'inp1':''},'out':{'out1':''}}}
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
        testcases[newTab.id]={'inp':{},'out':{}}
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
        delete testcases['tab'+tabs]
    }
    if(tabs<=1){
        tabminus.style.backgroundColor = 'grey';
    }
})
//selected tab
function clickedtab(id){
    //save data in past opened id
    var lastinpbox = Object.keys(testcases[selectedtab]['inp']).length
    // save inputs
    for(let i = 1;i<=lastinpbox;i++){
        var idtosave = 'inp' + i.toString();
        testcases[selectedtab]['inp'][idtosave] = document.getElementById(idtosave).value;
        document.getElementById(idtosave).remove()
    }
    console.log(testcases)
    // save outputs
    var lastoutbox = Object.keys(testcases[selectedtab]['out']).length
    for(let i = 1;i<=lastoutbox;i++){
        var idtosave = 'out'+i.toString();
        testcases[selectedtab]['out'][idtosave] = document.getElementById(idtosave).value;
        document.getElementById(idtosave).remove()
    }
    //change tab
    selectedtab = id;
    //get new data and show
    // fur input
    var newinpbox = Object.keys(testcases[selectedtab]['inp']).length
    for(let i = 1;i<=newinpbox;i++){
        var boxtoadd = document.createElement('input')
        boxtoadd.id = 'inp' + i.toString()
        boxtoadd.type = 'text'
        boxtoadd.classList.add('inpbox')
        boxtoadd.placeholder = 'Input'
        boxtoadd.value = testcases[selectedtab]['inp'][boxtoadd.id]
        document.getElementById('inputs').insertBefore(boxtoadd, document.getElementById('inpminus'))
    }
    //fur output
    var newoutbox = Object.keys(testcases[selectedtab]['out']).length
    for(let i = 1;i<=newoutbox;i++){
        var boxtoadd = document.createElement('input')
        boxtoadd.id = 'out' + i.toString()
        boxtoadd.type = 'text'
        boxtoadd.classList.add('inpbox')
        boxtoadd.placeholder = 'Output'
        boxtoadd.value = testcases[selectedtab]['out'][boxtoadd.id]
        document.getElementById('outputs').insertBefore(boxtoadd, document.getElementById('outminus'))
    }

}


function rmclick(id){// works for inp and out
    //input or output
    var oi = id.slice(0,3)
    //remove last inp box present in inputs div
    var lastbox = Object.keys(testcases[selectedtab][oi]).length
    if (lastbox!=0){
        var idtoremove = oi + lastbox.toString()
        delete testcases[selectedtab][oi][idtoremove]
        document.getElementById(idtoremove).remove()
    }

}

function addclick(id){// works for inp and out
    //inp or output
    var oi = id.slice(0, 3)
    //add inp box to inputs div
    var lastbox = Object.keys(testcases[selectedtab][oi]).length
    var idtoadd = oi + (lastbox+1).toString()
    testcases[selectedtab][oi][idtoadd] = ''
    var newbox = document.createElement('input')
    newbox.id = idtoadd
    newbox.type = 'text'
    newbox.classList.add('inpbox')
    if(oi=='inp'){var parentid = 'inputs'}else{var parentid = 'outputs'}
    newbox.placeholder = parentid.slice(0,parentid.length-1)
    var oiid = oi+'minus'
    document.getElementById(parentid).insertBefore(newbox,document.getElementById(oiid))
}

// Recieve file updates
ipcRenderer.on('file',(evt,msg)=>{

})



// Recieve status updates
ipcRenderer.on('status',(evt, msg)=>{

})