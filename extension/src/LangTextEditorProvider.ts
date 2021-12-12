import * as vscode from 'vscode';
import { getNonce, LocalStorageService, StorageKey  } from './util';

export class LangTextEditorProvider implements vscode.CustomTextEditorProvider {

	private static readonly viewType = 'jdplang.langText';
    private static newFileId = 1;
    private storageManager: LocalStorageService;
    private _view?: vscode.WebviewPanel;

	constructor(
		private readonly context: vscode.ExtensionContext
	) { 
    	this.storageManager = new LocalStorageService(context.workspaceState);
	}

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
        this._view = webviewPanel;
		
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'setDocument',
				data: document.getText(),
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

		webviewPanel.webview.onDidReceiveMessage(async (msg) => {
			switch (msg.type) {

                case "getLanguage": {
                    const langcode = this.storageManager.getValue<string>(StorageKey.langcode);
                    if (langcode != undefined) {
                        this._view?.webview.postMessage({type: 'setLanguage', data: langcode});
                    }
                    break;
                }

                case "changeLanguage": {
                    if (!msg.data) {
                      return;
                    }
                    const langcode = await vscode.window.showQuickPick(msg.data);
                    if (langcode != undefined) {
                        this.storageManager.setValue<string>(StorageKey.langcode, langcode);
                        this._view?.webview.postMessage({type: 'setLanguage', data: langcode});
                    }
                    break;
                }

                case "changeImeType": {
                    if (!msg.data) {
                      return;
                    }
                    const imeType = await vscode.window.showQuickPick(msg.data);
                    if (imeType != undefined) {
                        //this.storageManager.setValue<string>(StorageKey.imeType, imeType);
                        this._view?.webview.postMessage({type: 'setImeType', data: imeType});
                    }
                    break;
                }

                case "getIme": {
                    if (!msg.data) {
                      return;
                    }
					const imeName = msg.data;
					const ime = require(`../media/ime/${imeName}.json`);
                    if (ime != undefined) {
                        this._view?.webview.postMessage({type: 'setIme', data: ime});
                    }
                    break;
                }

                case "getDocument": {
                    this._view?.webview.postMessage({
						type: 'setDocument',
						data: document.getText()
					});
                    break;
                }

				case "updateDocument": {
                    if (!msg.data) {
						vscode.window.showErrorMessage('[Internal error] Editor sent command to update document without data!');
                      	return;
                    }
					this.updateDocument(document, msg.data);
                    break;
                }
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
				<script nonce="${nonce}">
					const vscode = acquireVsCodeApi();
				</script>
                <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	private updateDocument(document: vscode.TextDocument, data: string) {
		const edit = new vscode.WorkspaceEdit();

		// Replace the entire document every time.
		// A better extension should compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			data);
		return vscode.workspace.applyEdit(edit);
	}
}