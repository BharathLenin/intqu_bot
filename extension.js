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

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        let editor = vscode.window.activeTextEditor;

        let selection = editor.selection;
        let text = editor.document.getText();

        if (text.indexOf('img') >= 0)
        {
            let position=editor.document.positionAt(text.indexOf('img'));
            let lineNumber=position.line;
            let lineText = editor.document.lineAt(lineNumber).text;            
            vscode.window.showInformationMessage('you typed img present at line Number : '+(lineNumber+1));
            vscode.window.showInformationMessage('line Text : '+lineText);

            //pass this line of code to python program as a callback
            let requestUrl= 'http://localhost:5000/getKnowlegdeBase/' + lineText
            request(requestUrl, function (error, response, body) {
                console.log('error:', error);
                console.log('statusCode:', response.body);
                console.log('body:', body);
            })

        } else {
            vscode.window.showInformationMessage('you havent typed v');
        }


        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World! From IntQu bot');

        // vscode.window.showInformationMessage('Selected characters: ' + text.length);

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;