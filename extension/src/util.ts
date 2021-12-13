import { Memento } from "vscode";

export function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export enum StorageKey {
	'langcode' = 'jdplang-langcode',
	'imetype' = 'jdplang-imetype'
}

export class LocalStorageService {
    
    constructor(private storage: Memento) { }   
    
    public getValue<T>(key : string) : T | undefined {
        return this.storage.get<T | undefined>(key, undefined);
    }

    public setValue<T>(key : string, value : T) {
        this.storage.update(key, value );
    }
}