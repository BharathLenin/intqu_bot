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
        var panel = vscode.window.createWebviewPanel('catCoding', "Developer Profile", vscode.ViewColumn.One, { });

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
            let requestUrl= 'http://localhost:5000/getKnowlegdeBase/'+lineText;
            console.log('requestUrl: ',requestUrl);
            
            request(requestUrl, function (error, response, body) {
                // console.log('error:', error);
                console.log('statusCode:', response.body);
                // console.log('body:', body);
                vscode.window.showInformationMessage('line Text : '+ response.body);
                
            })

        } else {
            vscode.window.showInformationMessage('you havent typed v');
        }


    });

    
    // vscode.commands.executeCommand('extension.hello');

    
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src vscode-resource:; style-src vscode-resource:;">
    <script src="demo_script_src.js">
    </script>
    <body>
    
    <h1>Hi there! I am intqu bot.</h1>
    
    <h2>Say something about you...</h2>
    <form>
     Name: <input type="text" id="devName" name="name"> <br> <br>
     Experience (in years): <input type="number" name="experience"><br> <br>
     Technology(comma seperated): <input type="text" name="technology"><br> <br>
    </form>
    
    <br> <br>
    <input type="checkbox" name="design" value="Responsive">Is your design Responsive<br> <br>
    <input type="checkbox" name="design" value="Responsive">Are you going to teach me?<br>
    <br>
    <button onclick="alert('hi me')">Ok</button>
    </body>
    
    </html>`;
}