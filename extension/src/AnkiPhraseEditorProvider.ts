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
                workspaceFolders[0].uri, 'src', 'data', 'lang',
                `new-${AnkiPhraseEditorProvider.newFileId++}.csv`)
				    .with({ scheme: 'untitled' });

			vscode.commands.executeCommand('vscode.openWith', uri, AnkiPhraseEditorProvider.viewType);
		});

		vscode.commands.registerCommand('jdplang.ankiPhrase.setLanguage', async (langcode) => {
			const { activeTextEditor } = vscode.window;
			if (!activeTextEditor) {
				return;
			}
			console.log("EXEC COMMAND WITH PARAM " + langcode);
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

		webviewPanel.webview.onDidReceiveMessage(async (msg) => {
			switch (msg.type) {

                case "getLanguage": {
                    const langcode = this.storageManager.getValue<string>(StorageKey.langcode);
                    if (langcode != undefined) {
                        this._view?.webview.postMessage({type: 'setLanguage', data: langcode});
                    }
                    break;
                }

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

	/**
	 * Add a new phrase to the current document.
	 */
	// private addNewPhrase(document: vscode.TextDocument) {
	// 	const json = this.getDocumentAsJson(document);
	// 	const character = AnkiPhraseEditorProvider.scratchCharacters[Math.floor(Math.random() * AnkiPhraseEditorProvider.scratchCharacters.length)];
	// 	json.scratches = [
	// 		...(Array.isArray(json.scratches) ? json.scratches : []),
	// 		{
	// 			id: getNonce(),
	// 			text: 'xxx',
	// 			created: Date.now(),
	// 		}
	// 	];

	// 	return this.updateTextDocument(document, json);
	// }

	/**
	 * Delete an existing phrase from a document.
	 */
	// private deletePhrase(document: vscode.TextDocument, id: string) {
	// 	const json = this.getDocumentAsJson(document);
	// 	if (!Array.isArray(json.scratches)) {
	// 		return;
	// 	}

	// 	json.scratches = json.scratches.filter((note: any) => note.id !== id);

	// 	return this.updateTextDocument(document, json);
	// }

	private getDocumentData(document: vscode.TextDocument): AnkiPhrase[] {
		var data:AnkiPhrase[] = [];

		const text = document.getText();
		if (text.trim().length === 0) {
			return data;
		}

		var lines = text.split("\n");

		var headers = lines[0].split("\t");
		if (headers.length != 5) {
			throw new Error('Headers are not valid for anki phrases: ' + lines[0]);
		}
		if (headers[0] != 'Phrase') {
			throw new Error('First field has to be: Phrase');
		}
		if (headers[1] != 'Grammar') {
			throw new Error('Second field has to be: Grammar');
		}

		for (var i = 1; i < lines.length; i++) {
			var fields = lines[i].split("\t");
			if (fields.length != 5) {
				throw new Error('Line is not valid anki phrase: ' + lines[i]);
			}
			var item = {
				phrase: fields[0].trim(),
				grammar: fields[1].trim(),
				transcription: fields[2].trim(),
				translation: fields[3].trim(),
				notes: fields[4].trim()
			}
			data.push(item);
		}

		return data;
	}

	private updateTextDocument(document: vscode.TextDocument, data: any) {
		var buffer = "Phrase\tGrammar\tTranscription\tTranslation\tNotes\n";
		for (let i of data) {
			buffer += i.phrase;
			buffer += "\t";
			buffer += i.grammar;
			buffer += "\t";
			buffer += i.transcription;
			buffer += "\t";
			buffer += i.translation;
			buffer += "\t";
			buffer += i.notes;
			buffer += "\n";
		}

		const edit = new vscode.WorkspaceEdit();

		// Replace the entire document every time.
		// A better extension should compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			buffer);

		return vscode.workspace.applyEdit(edit);
	}
}