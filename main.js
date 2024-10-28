const { app, BrowserWindow,ipcMain } = require('electron')
const api = "removed" // remove api
const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
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
// todo
})

function AI_preload(){
  // import
  const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
  // provide api key
  const genAI = new GoogleGenerativeAI(api);

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            catagory: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ];
    // use the model
    const gen_model = genAI.getGenerativeModel({ model: "gemini-pro" }, safetySettings);
    // tweak model (TODO)

}

// function to talk to model
async function talk(promt) {
  const msg = promt;
  try {
      const result = await ichat.sendMessage(msg);
      const response = await result.response;
      const text = response.text();
      return text;
  }
  catch (error) {
      console.log(error)
  }
}