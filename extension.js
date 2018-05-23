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
    let mode = 'learning';

    /************ Developer profile    ***********/
    context.subscriptions.push(vscode.commands.registerCommand('captureDevInformation.start', () => {
        // Create and show panel
        var panel = vscode.window.createWebviewPanel('catCoding', "Developer Profile", vscode.ViewColumn.One, { enableScripts: true });

        // And set its HTML content
        panel.webview.html = getWebviewContent();
        let devDetails = {};


        panel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'dev-details':
                    devDetails = e.devDetails;
                    console.log(devDetails);
                    mode = devDetails.mode;

                    let requestUrl = 'http://localhost:5000/updateUserProfile?';
                    let params = "name=" + devDetails.name +
                        "&experience=" + devDetails.experience +
                        "&technology=" + devDetails.technology +                       
                        "&responsive=" + devDetails.responsive +
                        "&lingual=" + devDetails.lingual +
                        "&mode=" + devDetails.mode;
                    let url = requestUrl + params;

                    console.log(params);

                    request(url, function (error, response, body) {
                        console.log(error);
                        console.log(response);
                    });
                    break;
            }
        }, null, context.subscriptions);

        // Reset when the current panel is closed
        panel.onDidDispose(() => {
            panel = undefined;
        }, null, context.subscriptions);
    }));



    /******** Hello world test notification ********/
    vscode.commands.registerCommand('extension.hello', () => {
        console.log('hello extension is executed');

        vscode.window.showInformationMessage(mode + ' --> new mode !!');

    });


    /******** Main BOT  ********/
    let disposable = vscode.commands.registerCommand('extension.activateBot', function () {
        // The code you place here will be executed every time your command is executed

        let editor = vscode.window.activeTextEditor;
        let selection = editor.selection.active;
        console.log(selection);

        let text = editor.document.getText();

        let lineNumber = selection.line;
        console.log("lineNumber " + lineNumber);
        let lineText = editor.document.lineAt(lineNumber).text;
        let lineTextTrimmed = lineText.trim();
        console.log('lineText: ', lineTextTrimmed);

        //pass this line of code to python program as a callback
        let requestUrl = 'http://localhost:5000/getKnowledgeBase?mode=' + mode + '&statement=' + lineTextTrimmed;
        console.log('requestUrl: ', requestUrl);

        request(requestUrl, function (error, response, body) {
            // console.log('error:', error);
            console.log('statusCode:', response.body);
            if (mode == 'learning') {
                if(response.body.indexOf('No Matching Rules') == 0 && response.body == 'success') { return;}
                vscode.window.showInformationMessage('Line ' + (lineNumber + 1) + ' : ' + response.body);
            }
        })

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
    return `
    <!DOCTYPE html>
    <html>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:;script-src https: 'unsafe-inline' vscode-resource:; style-src vscode-resource:;">
    <script>
      function saveData() {
        var x = document.getElementById("showInformation");
        x.innerText = "Hello " + devName.value + ", we saved your information!!";
    
        const vscode = acquireVsCodeApi();
        var radio;
        var radios = document.getElementsByName('mode');
        for (var i = 0, length = radios.length; i < length; i++) {
          if (radios[i].checked) {
            radio = radios[i].value;
            break;
          }
        }
        vscode.postMessage({
          type: 'dev-details',
          devDetails: {
            "name": devName.value,
            "experience": devexp.value,
            "technology": devTech.value,
            "responsive": resposive.checked,
            "lingual": lingual.checked,
            "mode": radio
          }
        });
      }
    </script>
    
    <body>
      <h1>Hi there! I am IntQu bot.</h1>
      <h2>Say something about you...</h2>
      <form>
        Name:
        <input type="text" id="devName" name="name">
        <br>
        <br> Experience (in years):
        <input type="number" id="devexp" name="experience">
        <br>
        <br> Technology(comma seperated):
        <input type="text" id="devTech" name="technology">
        <br>
        <br>
      </form>
      <br>
      <input type="checkbox" name="resposive" value="resposive" id="resposive">Responsive
      <input type="checkbox" name="lingual" value="lingual" id="lingual">Multilingual
      <br>
      <br>
      <h3>
        <input type="radio" name="mode" value="learning">Learning mode
      </h3>
      <h3>
        <input type="radio" name="mode" value="expert">Expert mode
      </h3>
      <input style="background-color:#4CAF50;font-size: 24px;" value="Save" type="button" onclick="saveData(devName.value,devexp.value,devTech.value)">
      <br>
      <h2 id="showInformation" style="color:red;">
      </h2>
    </body>
    
    </html>
`;
}