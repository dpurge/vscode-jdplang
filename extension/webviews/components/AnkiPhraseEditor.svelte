<script lang="ts">
    import { onMount } from 'svelte';
    import { Language } from './IME.svelte';

    import AnkiVocabularyForm from './AnkiVocabularyForm.svelte'
    import AnkiVocabularyList from './AnkiVocabularyList.svelte'

    let langcode: keyof typeof Language = 'spa';
    let data: AnkiPhrase[] = [];
	let langname: string;

    onMount(() => {
        window.addEventListener("message", (event) => {
            const msg = event.data;
            switch (msg.type) {
                case "setLanguage": {
                    langcode = msg.data;
                    break;
                }

                case "setDocument": {
                    data = getDocumentData(msg.data);
                    break;
                }
            }
        });

		vscode.postMessage({type: 'getDocument', data: null});
        vscode.postMessage({type: 'getLanguage', data: null});
    });

    function changeLanguage() {
        vscode.postMessage({type: 'changeLanguage', data: Object.keys(Language) });
    }

    

	function getDocumentData(text: string): AnkiPhrase[] {
		var data:AnkiPhrase[] = [];

		if (text.trim().length === 0) {
            vscode.postMessage({type: 'appendLine', data: "Phrase\tGrammar\tTranscription\tTranslation\tNotes\n"});
			return data;
		}

		var lines = text.split("\n");

		var headers = lines[0].trim().split("\t");
		if (headers.length != 5) {
            vscode.postMessage({type: 'closeEditor', data: 'Wrong number of headers for Anki phrases: ' + lines[0] });
		}
		if (headers[0] != 'Phrase') {
			vscode.postMessage({type: 'closeEditor', data: 'First field has to be: Phrase'});
		}
		if (headers[1] != 'Grammar') {
			vscode.postMessage({type: 'closeEditor', data: 'Second field has to be: Grammar'});
		}
		if (headers[2] != 'Transcription') {
			vscode.postMessage({type: 'closeEditor', data: 'Third field has to be: Transcription'});
		}
		if (headers[3] != 'Translation') {
			vscode.postMessage({type: 'closeEditor', data: 'Fourth field has to be: Translation'});
		}
		if (headers[4] != 'Notes') {
			vscode.postMessage({type: 'closeEditor', data: 'Fifth field has to be: Notes'});
		}

		for (var i = 1; i < lines.length; i++) {
            if (lines[i].trim().length === 0) {
                continue;
            }
			var fields = lines[i].split("\t");
			if (fields.length != 5) {
				vscode.postMessage({type: 'closeEditor', data: 'Line is not valid Anki phrase: ' + lines[i]});
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

	$: langname = Language[langcode]?.name;
</script>

<h1>Add anki phrase: <span on:click={ changeLanguage }>{ langname }</span></h1>

<div class="container">
    <AnkiVocabularyForm bind:data={data} bind:langcode={langcode} />
</div>

<h2>Phrase list:</h2>

<div class="container">
    <AnkiVocabularyList bind:data={data} bind:langcode={langcode} />
</div>