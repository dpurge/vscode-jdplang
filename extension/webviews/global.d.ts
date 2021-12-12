/// <reference types="svelte" />
import * as _vscode from "vscode";

declare global {
    type AnkiPhrase = {
        phrase: string;
        grammar: string;
        transcription: string;
        translation: string;
        notes: string;
    }

    type ImeData = Array<[string, string]> | null;

    interface HTMLInputElement {
        ime : ImeData;
        state : {shift:boolean, alt:boolean, ctrl:boolean};
    }

    interface HTMLTextAreaElement {
        ime : ImeData;
        state : {shift:boolean, alt:boolean, ctrl:boolean};
    }

    const vscode: {
        postMessage: ({type: string, data: any}) => void
    };
}