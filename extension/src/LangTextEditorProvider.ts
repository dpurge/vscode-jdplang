import * as vscode from 'vscode';
import { getNonce } from './util';

export class LangTextEditorProvider implements vscode.CustomTextEditorProvider {

    private static newFileId = 1;

	private static readonly viewType = 'jdplang.langText';

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

    public static register(context: vscode.ExtensionContext): vscode.Disposable {

		vscode.commands.registerCommand('jdplang.langText.new', () => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				vscode.window.showErrorMessage("Creating new LangText file requires opening a workspace");
				return;
			}

			const uri = vscode.Uri.joinPath(
                workspaceFolders[0].uri, 'src', 'txt', 'lang',
                `new-${LangTextEditorProvider.newFileId++}.md`)
				    .with({ scheme: 'untitled' });

			vscode.commands.executeCommand('vscode.openWith', uri, LangTextEditorProvider.viewType);
		});

        const provider = new LangTextEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(LangTextEditorProvider.viewType, provider);
		return providerRegistration;
    }

    public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
				// case 'add':
				// 	this.addNewPhrase(document);
				// 	return;

				// case 'delete':
				// 	this.deletePhrase(document, e.id);
				// 	return;
			}
		});

		updateWebview();
    }

	private getHtmlForWebview(webview: vscode.Webview): string {

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'out', 'webviews', 'LangTextEditor.js'));

		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'out', 'webviews', 'LangTextEditor.css'));

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