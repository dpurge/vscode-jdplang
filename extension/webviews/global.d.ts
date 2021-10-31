/// <reference types="svelte" />

interface AnkiPhrase {
    phrase: string;
    grammar: string;
    transcription: string;
    translation: string;
    notes: string;
}

interface HTMLInputElement {
    ime : Array<[string, string]> | null;
    state : {shift:boolean, alt:boolean, ctrl:boolean};
}
