
async function start(user_input,chat_session,debug=false) {
    const fs = require('fs');
    const path = require('path');
    const dirPath = path.join(require('os').homedir(), 'Documents', 'Devilin');// main path
    if (!fs.existsSync(dirPath)) {// if main path absent
        fs.mkdirSync(dirPath);
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
    const {spawn} = require('child_process');
    const output = execSync('git init', { cwd: sessionDirPath });
    if (debug) {console.log(output);}

    const {talk} = require('./setup_llm');
    responce = await talk(user_input + '\n do not forget to add ~file.extension it is critical',chat_session)
    if(debug){console.log(responce)}
    while (True){
        //set tries counter to 0
        var counter = 0;
        try{
        condition = await theloop(responce,chat_session,sessionDirPath,spawn,counter,debug=debug);
        }
        catch (error) {
            console.log(error)
            break
        }
        if (condition[0]=='['){
            responce = condition
        }
    }
}




async function theloop(llm_responce,chat_session,sessionDirPath,spawn=require('child_process').spawn,counter,debug = false) {
    const fs = require('fs');
    const path = require('path');
    const {spawn} = require('child_process')
    // talk to gemini
    var code = llm_responce.split('```')

    if (debug){console.log(`split \`\`\` :-\n${code}`)}
    if (debug){console.log(`counter at:-\t ${counter}`)}
    // check if code is divided (if more than 2 ``` then code is divided)

    if (code.length > 3) {// multifile error
        if (!multifile){
            // multifile error
            counter ++
            if (counter > 5){
                if (debug){console.log(`Error:1 expected single got many \n${code}`)}
                throw new Error("Error:1 expected single file of code got many")
            }
            else{
                return "[machine]\nError: expected code to be in a singular file."
            }
        }
    }
    var fileadded = []
    // name and keep files
    for (let i = 0; i < code.length; i=i+2){
        // code[i] -> file name code[i+1] -> file content

        if(debug){console.log(`code[i]=${code[i]}`)};
        
        var filename = code[i].slice(1)//remove '~' char
        var filedata = code[i+1]
        
        // get index of first \ in filedata
        if (filedata){
            var index = filedata.indexOf("\n");
            if(debug){console.log(`index=\t${index}`);}
            if (index){
                // remove 0 to index from filedata. It has the code language
                filedata = filedata.slice(index+1,filedata.length-1);
                if (filename){
                // save file
                fs.writeFileSync(path.join(sessionDirPath, filename), filedata);
                fileadded.push(filename)
                }
                else{
                    if (counter>5){
                    throw new Error("Error:2 failed to extract filename. file not saved")
                    }
                    else{
                    return"[machine]\nError: filename is not properly"
                    }
                }
            }
        }
        
        
        if (debug){console.log(`fileName:-\t ${filename}\nfileData:-\t ${filedata}`)}
        
    }
    // ask which file to run
    if (multifile){
        const {talk} = require('./setup_llm');
        responce = await talk('[machine]\nWhich file to run?\n'+fileadded.join('\n')+'\n just write in original notation (eg. ~main.py)', chat_session)
        if(debug){console.log(`responce:-\t ${responce}`)}
        // find and remove ~ in responce
        var mainfilename = responce.split('~')[1]
        if(debug){console.log(`mainfilename:-\t ${mainfilename}`)}
    }
    else{
        var mainfilename = fileadded[0]
        if(debug){console.log(`mainfilename:-\t ${mainfilename}`)}
    }
    // get test cases from renderer.js
    var testcases = require('..renderer.js').testcases
    // how many cases
    var cases_num = Object.keys(testcases).length
    // loop through cases and try each one out (update status from here)
    for(let i = 1;i<=cases_num;i++){
        //each case
        var caseI = Object.keys(testcases['tab'+i]['inp']).length
        var caseO = Object.keys(testcases['tab'+i]['out']).length
        // get language python/cpp/js/java
        var lang = mainfilename.split('.')[1]
        switch (lang) {
            case 'py':
                var pre = 'python'
            case 'cpp':
                var pre = 'cpp'
            case 'js':
                var pre = 'node'
            case 'java':
                var pre = 'javac'
        }
        //run file
        var codeprocess = spawn(pre,[mainfilename])
        //enter each input
        for(let o = 1;o<=caseI;o++){
            var inpN = testcases[caseI]['inp'][inpN].toString()+'\n'
            codeprocess.stdin.write(inpN)
        }
        //get output
        var out_list;
        codeprocess.stdout.on('data',(data)=>{
            var out = data.toString()
            // show user progress(todo)
            out_list = out.split('\n')
        })
        //manage error
        pythoncode.stderr.on('data',(err)=>{
            counter++
            if (counter>5){
                throw new Error("Error:3 failed to pass testcases")
            }
            return `[machine]\nError:\nError:\nInput given:\n${testcases[caseI]['inp']}\nError recived:\n${err}`
        })
        // compare with outputs
        for(let t = 1;t<=caseO;t++){
            if(out_list[t-1]!=testcases[caseO]['out'][out_list[t-1]]){
                counter++
                if (counter>5){
                    throw new Error("Error:4 failed to pass testcases")
                }
                return `[machine]\nError:\nError:\nInput given:\n${testcases[caseI]['inp']}\nExpected output:\n${testcases[caseO]['out']}\nRecived output:\n${out}`
            }
            else{
                if(debug){console.log(`Testcase ${i} passed`)}
            }
        }
    }
    // all test cases passes
    if(debug){console.log(`all test cases passed\nCases:\n${testcases}`)}
    return 'success';

    
}
// const {AI_preload} = require('./setup_llm');
// start('Make a python code to add two integers, use class maath with "add" method',AI_preload('api removed'),true)
// module.exports = { start, theloop };