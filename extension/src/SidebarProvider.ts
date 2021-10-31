import * as vscode from "vscode";
import { getNonce } from "./util";

export class SidebarProvider implements vscode.WebviewViewProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new SidebarProvider(context);
		const providerRegistration = vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, provider);
		return providerRegistration;
    }

	private static readonly viewType = 'jdplang.sidebar';
    private _view?: vscode.WebviewView;
    //private _doc?: vscode.TextDocument;

	constructor(
		private readonly context: vscode.ExtensionContext
        //private readonly _extensionUri: vscode.Uri
	) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this.context.extensionUri
            ],
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (msg) => {
            switch (msg.type) {
                case "onInfo": {
                    if (!msg.value) {
                      return;
                    }
                    vscode.window.showInformationMessage(msg.value);
                    break;
                }
                case "onError": {
                    if (!msg.value) {
                      return;
                    }
                    vscode.window.showErrorMessage(msg.value);
                    break;
                }
            }
        });
    }

    private getHtmlForWebview(webview: vscode.Webview): string {

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'out', 'webviews', 'LangSidebar.js'));

		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'out', 'webviews', 'LangSidebar.css'));

		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'reset.css'));

		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'vscode.css'));

		const nonce = getNonce();

		return /* html */`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet" />
				<link href="${styleVSCodeUri}" rel="stylesheet" />
				<link nonce="${nonce}" href="${styleUri}" rel="stylesheet">

				<title>Anki Phrase</title>
			</head>
			<body>
                <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}