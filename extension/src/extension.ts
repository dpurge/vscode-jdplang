import * as vscode from 'vscode';

import { AnkiPhraseEditorProvider } from './AnkiPhraseEditorProvider';
import { LangTextEditorProvider } from './LangTextEditorProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(AnkiPhraseEditorProvider.register(context));
	context.subscriptions.push(LangTextEditorProvider.register(context));
}


export function deactivate() {}
