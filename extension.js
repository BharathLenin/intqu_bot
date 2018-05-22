// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const request = require('request');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension is install');

    context.subscriptions.push(vscode.commands.registerCommand('captureDevInformation.start', () => {
        // Create and show panel
        var panel = vscode.window.createWebviewPanel('catCoding', "Developer Profile", vscode.ViewColumn.One, {enableScripts: true });

        // And set its HTML content
        panel.webview.html = getWebviewContent();


        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, undefined, context.subscriptions);

        // Reset when the current panel is closed
        panel.onDidDispose(() => {
            panel = undefined;
        }, null, context.subscriptions);
    }));

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    // vscode.workspace.openTextDocument('./profile.json').then((document) => {
    //     let text = document.getText();
    //     console.log(text);
    //   }).fail((err)=>{
    //       console.log(err);
    //   });


    vscode.commands.registerCommand('extension.hello', () => {
        console.log('hello extension is executed');

            vscode.window.showInformationMessage('Hello World!');

    });


    let disposable = vscode.commands.registerCommand('extension.activateBot', function () {
        // The code you place here will be executed every time your command is executed

        let editor = vscode.window.activeTextEditor;

        let selection = editor.selection;
        let text = editor.document.getText();

        if (text.indexOf('img') >= 0)
        {
            let position=editor.document.positionAt(text.indexOf('img'));
            let lineNumber=position.line;
            let lineText = editor.document.lineAt(lineNumber).text;            
            // vscode.window.showInformationMessage('you typed img present at line Number : '+(lineNumber+1));
            // vscode.window.showInformationMessage('line Text : '+lineText);
            console.log('lineText: ',lineText);

            //pass this line of code to python program as a callback
            let requestUrl= 'http://localhost:5000/getKnowledgeBase?statement='+lineText;
            console.log('requestUrl: ',requestUrl);
            
            request(requestUrl, function (error, response, body) {
                // console.log('error:', error);
                console.log('statusCode:', response.body);
                // console.log('body:', body);
                vscode.window.showInformationMessage('Line No ' + (lineNumber + 1) + ' : '+ response.body);
                
            })

        } else {
            vscode.window.showInformationMessage('you havent typed v');
        }


    });

    
    vscode.commands.executeCommand('captureDevInformation.start');

    
    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:;script-src https: 'unsafe-inline' vscode-resource:; style-src vscode-resource:;">
    <script>
    function saveData(developerName) {


        var x = document.getElementById("showInformation");
          x.innerText = "Hello " + developerName + ", we saved your information!!";

        // const vscode = acquireVsCodeApi();
        // var developerName  = document.getElementById("devName");
        //vscode.postMessage({command: 'alert',text: '🐛  on line ' + developerName})
        //window.parent.postMessage({type: 'dev-details',devName: developerName});


      }
    </script>
    <style>
.button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}
</style>
    <body>
    
    <h1>Hi there! I am intqu bot.</h1>
    
    <h2>Say something about you...</h2>
    <form>
     Name: <input type="text" id="devName" name="name"> <br> <br>
     Experience (in years): <input type="number" id="devexp" name="experience"><br> <br>
     Technology(comma seperated): <input type="text" id="devTech" name="technology"><br> <br>
    </form>
    
    <br>
    
    <input type="checkbox" name="resposive" value="resposive">Responsive
<br>
<input type="checkbox" name="lingual" value="lingual">Multilingual
    
    
    <br>
    <h3>
    <input type="radio" name="mode" value="learn">Learning mode
    </h3>
        <h3>
    <input type="radio" name="mode" value="expert">Expert mode
  </h3>
    <button type="button" class="button" onclick="saveData(devName.value,devexp.value,devTech.value)">Ok</button>
    <br>
    <h2 id="showInformation">
    </h2>
    </body>
    
    </html>`;
}