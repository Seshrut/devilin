
async function start(user_input,debug=false) {
    const fs = require('fs');
    const path = require('path');
    //set tries counter to 0
    var counter = 0;
    const dirPath = path.join(require('os').homedir(), 'Documents', 'Devilin');// main path
    if (!fs.existsSync(dirPath)) {// if main path absent
        fs.mkdir(dirPath);
    }
    // unique session folder
    var datetime = '';
    for (let i = 0; i < 5; i++) {
        datetime += (Date().toString().split(" ")[i]);
    }

    // Replace colons with dashes to make it a valid directory name
    datetime = datetime.replace(/:/g, '-');

    const sessionDirPath = path.join(dirPath, datetime.trim());
    fs.mkdirSync(sessionDirPath); // Use mkdirSync for synchronous operation

    // start git in the repo
    const execSync = require('child_process').execSync;
    const output = execSync('git init', { cwd: sessionDirPath });
    if (debug) {console.log(output);}

    const talk = require('src/setup_llm.js');
    responce = talk(user_input)
    if(debug){console.log(responce)}
    await theloop(responce,debug=debug);

}




async function theloop(llm_responce, debug = false) {
    // talk to gemini
    var code = llm_responce.split('```')

    // remove escape characters(TODO)

    if (debug){console.log(code)}
    if (debug){console.log("counter at: "+counter)}
    // check if code is divided (if more than 2 ``` then code is divided)

    if (code.length > 3) {// multifile error
        if (!multifile){
            // multifile error
            counter ++
            if (counter > 5){
                if (debug){console.log("Error:1 expected single got many");console.log(code)}
                return "Error: 1" // could not be done in one file
            }
            else{
                theloop(await talk("[machine]\nError: expected code to be in a singular file."))
            }
        }
    }

    // name and keep files
    for (let i = 0; i > code.length; i=i+2){
        // code[i] -> file name code[i+1] -> file content
        var filename = code[i]
        var filedata = code[i+1]
        if (debug){console.log("fileName: "+filename);console.log("fileData: "+filedata)}
        // add file to repo
        fs.writeFileSync(filename, filedata);
    }


    
    
}


module.exports = { start, theloop };