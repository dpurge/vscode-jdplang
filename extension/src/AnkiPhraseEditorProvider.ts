import * as vscode from 'vscode';
import { getNonce, LocalStorageService, StorageKey  } from './util';

export class AnkiPhraseEditorProvider implements vscode.CustomTextEditorProvider {

	private static readonly viewType = 'jdplang.ankiPhrase';
    private static newFileId = 1;
    private storageManager: LocalStorageService;
    private _view?: vscode.WebviewPanel;

	constructor(
		private readonly context: vscode.ExtensionContext
	) { 
    	this.storageManager = new LocalStorageService(context.workspaceState);
	}

	public static register(context: vscode.ExtensionContext): vscode.Disposable {

		vscode.commands.registerCommand('jdplang.ankiPhrase.new', () => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				vscode.window.showErrorMessage("Creating new Anki Phrase files currently requires opening a workspace");
				return;
			}

			const uri = vscode.Uri.joinPath(
                workspaceFolders[0].uri,
                `new-${AnkiPhraseEditorProvider.newFileId++}.csv`)
				    .with({ scheme: 'untitled' });

			vscode.commands.executeCommand('vscode.openWith', uri, AnkiPhraseEditorProvider.viewType);
		});

		const provider = new AnkiPhraseEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(AnkiPhraseEditorProvider.viewType, provider);
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
				type: 'updateData',
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

                case "getIme": {
                    if (!msg.data) {
                      return;
                    }
					const element = msg.data.element;
					const imeName = msg.data.ime;
					const ime = require(`../media/ime/${imeName}.json`);
                    if (ime != undefined) {
                        this._view?.webview.postMessage({type: 'setIme', data: {element: element, ime: ime}});
                    }
                    break;
                }

                case "getGrammaticalCategory": {
                    if (!msg.data) {
                      return;
                    }
					const categoryName = msg.data;
					const grammaticalCategory = require(`../media/ime/${categoryName}.json`);
                    if (grammaticalCategory != undefined) {
                        this._view?.webview.postMessage({type: 'setGrammaticalCategory', data: grammaticalCategory });
                    }
                    break;
                }

				case "changeLine": {
                    if (!msg.data) {
						vscode.window.showErrorMessage('[Internal error] Editor sent command to change line without data!');
                      	return;
                    }
					this.changeDocumentLine(document, msg.data.line, msg.data.text);
                    break;
                }

				case "appendLine": {
                    if (!msg.data) {
						vscode.window.showErrorMessage('[Internal error] Editor sent command to append line without data!');
                      	return;
                    }
					this.appendDocumentLine(document, msg.data);
                    break;
                }

				case "showInfo": {
					if (!msg.data) {
					  return;
					}
					vscode.window.showInformationMessage(msg.data);
                    break;
                }

				case "showError": {
					if (!msg.data) {
					  return;
					}
					vscode.window.showErrorMessage(msg.data);
                    break;
                }

                case "closeEditor": {
					if (msg.data) {
						vscode.window.showErrorMessage(msg.data);
					}
                    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                    break;
                }
			}
		});

		updateWebview();
	}

	private getHtmlForWebview(webview: vscode.Webview): string {

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'out', 'webviews', 'AnkiPhraseEditor.js'));

		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'out', 'webviews', 'AnkiPhraseEditor.css'));

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
				<!-- meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" -->
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

	private appendDocumentLine(document: vscode.TextDocument, text: string) {
		const edit = new vscode.WorkspaceEdit();
		edit.insert(
			document.uri,
			new vscode.Position(document.lineCount, 0),
			text);
		return vscode.workspace.applyEdit(edit);
	}

	private changeDocumentLine(document: vscode.TextDocument, line: number, text: string) {
		if (document.lineCount < line + 1) {
			vscode.window.showErrorMessage(`[Internal error] Document does not have line ${line}`);
		}
		const edit = new vscode.WorkspaceEdit();
		edit.replace(
			document.uri,
			new vscode.Range(
				line, 0,
				line, document.lineAt(line).text.length),
			text);

		return vscode.workspace.applyEdit(edit);
	}

	// private updateTextDocument(document: vscode.TextDocument, data: any) {
	// 	var buffer = "Phrase\tGrammar\tTranscription\tTranslation\tNotes\n";
	// 	for (let i of data) {
	// 		buffer += i.phrase;
	// 		buffer += "\t";
	// 		buffer += i.grammar;
	// 		buffer += "\t";
	// 		buffer += i.transcription;
	// 		buffer += "\t";
	// 		buffer += i.translation;
	// 		buffer += "\t";
	// 		buffer += i.notes;
	// 		buffer += "\n";
	// 	}

	// 	const edit = new vscode.WorkspaceEdit();

	// 	// Replace the entire document every time.
	// 	// A better extension should compute minimal edits instead.
	// 	edit.replace(
	// 		document.uri,
	// 		new vscode.Range(0, 0, document.lineCount, 0),
	// 		buffer);

	// 	return vscode.workspace.applyEdit(edit);
	// }
}