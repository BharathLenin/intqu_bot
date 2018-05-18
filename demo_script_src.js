const vscode = require('vscode');


function saveData(developerName) {
    // var developerName  = document.getElementById("devName");
    vscode.postMessage({command: 'alert',text: '🐛  on line ' + developerName})
  }