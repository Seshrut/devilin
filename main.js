const { app, BrowserWindow,ipcMain } = require('electron')
console.log('main here')
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences:{
        nodeIntegration: true,
        contextIsolation: false
      }
    })
  
    win.loadFile('index.html')
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on('promt',(evt,msg)=>{
// setup LLM
console.log("recieved promt: "+msg)
const {AI_preload} = require('./src/setup_llm.js');
AI_preload(api)
const {start} = require('./src/devloup.js');
start(msg,true)
})
const api = "removed" // remove api