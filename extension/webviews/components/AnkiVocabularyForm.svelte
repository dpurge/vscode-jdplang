<script lang='ts'>
    import { onMount } from 'svelte';
    import { setIme, loadIme, onKeyDown, onKeyUp, onKeyPress } from './IME.svelte';

    export let langcode: string;
    export let data: AnkiPhrase[] = [];

    let phrase: HTMLInputElement;
    let grammar: HTMLInputElement;
    let transcription: HTMLInputElement;
    let translation: HTMLInputElement;
    let notes: HTMLTextAreaElement;

    let style: string = 'latn';

	onMount(() => {
        setLang(langcode);
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
        
        data = [...data, item];
        clearForm();
    }

    function onUndo(event: Event)
    {
        event.preventDefault();
        clearForm();
    }

    function setLang(code: string) {
        switch (code) {
            case 'arb': {
                style = 'arab';
                setIme(phrase, loadIme(code, 'phrase'));
                setIme(transcription, loadIme(code, 'transcription'));
                break;
            }

            case 'vie': {
                style = 'latn';                
                setIme(phrase, loadIme(code, 'phrase'));
                setIme(transcription, loadIme(code, 'transcription'));
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
