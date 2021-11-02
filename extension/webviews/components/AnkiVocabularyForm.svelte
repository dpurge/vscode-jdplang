<script lang='ts'>
    import { onMount } from 'svelte';
    import { setIme, onKeyDown, onKeyUp, onKeyPress, LangName } from './IME.svelte';

    export let langcode: keyof typeof LangName;
    export let data: AnkiPhrase[] = [];

    let phrase: HTMLInputElement;
    let grammar: HTMLInputElement;
    let transcription: HTMLInputElement;
    let translation: HTMLInputElement;
    let notes: HTMLTextAreaElement;

    let style: string = 'latn';

	onMount(() => {
        setupLanguage();

        window.addEventListener("message", (event) => {
            const msg = event.data;
            switch (msg.type) {
                case "setIme": {
                    const element: string = msg.data.element;
                    switch (element) {
                        case 'phrase': {
                            setIme(phrase, msg.data.ime);
                        }
                        case 'transcription': {
                            setIme(transcription, msg.data.ime);
                        }
                    }
                    break;
                }
            }
        });
    });

    function clearForm()
    {
        phrase.value = "";
        grammar.value = "";
        transcription.value = "";
        translation.value = "";
        notes.value = "";

        phrase.focus();
    }

    function onAdd(event: Event)
    {
        event.preventDefault();
        var item = {
            phrase: phrase.value,
            grammar: grammar.value,
            transcription: transcription.value,
            translation: translation.value,
            notes: notes.value
        }
        appendDocumentItem(item);
        data = [...data, item];
        clearForm();
    }

    function onUndo(event: Event)
    {
        event.preventDefault();
        clearForm();
    }

    function setupLanguage() {
        if (langcode != undefined) {
            switch (langcode) {
                case 'arb': {
                    style = 'arab';
                    vscode.postMessage({type: 'getIme', data: {element: "phrase", ime: "arb-phrase"}});
                    vscode.postMessage({type: 'getIme', data: {element: "transcription", ime: "arb-transcription"}});
                    break;
                }

                case 'vie': {
                    style = 'latn';
                    vscode.postMessage({type: 'getIme', data: {element: "phrase", ime: "example"}});
                    vscode.postMessage({type: 'getIme', data: {element: "transcription", ime: "example"}}); 
                    break;
                }

                default: {
                    style = 'latn';
                    setIme(phrase, null);
                    setIme(transcription, null);
                    break;
                }
            }
        }
    }

    function appendDocumentItem(item:AnkiPhrase) {
		var line = `${item.phrase}\t${item.grammar}\t${item.transcription}\t${item.translation}\t${item.notes}\n`;
        vscode.postMessage({type: 'appendLine', data: line});
    }

    $: {
        console.log(`langcode = ${langcode}`);
        setupLanguage();
    }
</script>

<form>

<!-- label for="phrase">Phrase</label -->
<input bind:this={phrase} class={style} on:keydown={onKeyDown} on:keyup={onKeyUp} on:keypress={onKeyPress}
    type="text"
    id="phrase"
    name="Phrase"
    placeholder="Phrase...">

<!-- label for="grammar">Grammar</label -->
<input bind:this={grammar} class="latn"
    list="grammaticalCategory"
    type="text"
    id="grammar"
    name="Grammar"
    placeholder="Part of speech...">
<datalist id="grammaticalCategory">
    <option value="Internet Explorer">
    <option value="Firefox">
    <option value="Google Chrome">
    <option value="Opera">
    <option value="Safari">
</datalist>


<!-- label for="transcription">Transcription</label -->
<input bind:this={transcription} class="latn" on:keydown={onKeyDown} on:keyup={onKeyUp} on:keypress={onKeyPress}
    type="text"
    id="transcription"
    name="Transcription"
    placeholder="Transcription...">


<!-- label for="translation">Translation</label -->
<input bind:this={translation} class="latn"
    type="text"
    id="translation"
    name="Translation"
    placeholder="Translation...">


<!-- label for="notes">Notes</label -->
<textarea bind:this={notes} class="latn"
    id="notes" name="Notes" placeholder="Notes..." style="height:64px"></textarea>


<button on:click={onAdd}>Add</button>
<button on:click={onUndo}>Undo</button>
</form>

<style>
    .arab {
        direction: rtl;
        unicode-bidi: embed;
        font-size: 1.6rem;
        font-family: "Amiri", sans-serif;
        text-align: center;
    }

    .latn {
        font-size: 1.3rem;
        text-align: center;
    }
</style>
