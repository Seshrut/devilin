
function AI_preload(api){
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
      chat_session = gen_model.startChat(
        history=[
            {
                role:"user",
                parts:["You are a helper AI, user will give you a problem to code and will specify a language (if not use python as default), a machine will run the code and give you response accordingly... \ndo not give responce other than just the code. I DONT WANT ANY EXPLAINATION, just add file name(of your choise) above the soulution {!filename.extension} , to talk to user use {!USER} and don't put code after using it reply to this with a simple 'HI'"]
            },
            {
                role:"model",
                parts:["HI"]
            },
            {
                role:"user",
                parts:["generate a code for adding 2 numbers in python, make sure to use functions and proper comments"]
            },
            {
                role:"model",
                parts:["{!main.py} ```python\ndef add_numbers():\n  num1 = float(input(\"Enter first number: \"))\n  num2 = float(input(\"Enter second number: \"))\n  sum = num1 + num2\n  print(\"The sum of\", num1, \"and\", num2, \"is:\", sum)\n\nadd_numbers()\n```"]
            },
            {
                role:"user",
                parts:["[machine]\nTest Case 1 (mismatch):\n\tinput = 2,3\n\toutput = 5\n\tgot= The sum of2and3is:5.0"]
            },
            {
                role:"model",
                parts:["{!main.py} ```python\ndef add_numbers():\n  num1 = int(input(\"Enter first number: \"))\n  num2 = int(input(\"Enter second number: \"))\n  sum = num1 + num2\n  print(sum)\n\nadd_numbers()\n```"]
            },
            {
                role:"user",
                parts:["[machine]\nCode Successful, user states :- 'Okay thank, It works'"]
            },
            {
                role:"model",
                parts:["{!USER} You're Welcome. would you like me to try something else?"]
            }
        ]
      )
  
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

module.exports = { AI_preload, talk };