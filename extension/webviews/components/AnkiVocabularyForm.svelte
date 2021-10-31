<script lang='ts'>
    import { onMount } from 'svelte';

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

    function onKeyDown(this:HTMLInputElement, event: KeyboardEvent) {
        //if (this.ime == null) return;
        const key = event.key;
        switch(key) {
        case 'Shift':
            this.state.shift = true;
            break;
        case 'Control':
            this.state.ctrl = true;
            break;
        case 'Alt':
            this.state.alt = true;
            break;
        //default:
            //console.log(key);
        }
    }

    function onKeyUp(this:HTMLInputElement, event: KeyboardEvent) {
        //if (this.ime == null) return;
        const key = event.key;
        switch(key) {
        case 'Shift':
            this.state.shift = false;
            break;
        case 'Control':
            this.state.ctrl = false;
            break;
        case 'Alt':
            this.state.alt = false;
            break;
        //default:
            // code block
        }
    }

    function onKeyPress(this:HTMLInputElement, event: KeyboardEvent) {
        if (this.ime == null) return;
        event.preventDefault();

        var { key } = event;
        var { selectionStart, selectionEnd }  = this;
            
        let prefix = this.value.substring(0, selectionStart!);
        let suffix = this.value.substring(selectionEnd!, this.value.length);

        for (let i of this.ime) {
            
            if (!i[0].endsWith(key)) continue;
            // if (this.state.alt != i[2]) continue;
            //if (this.state.ctrl != i[3]) continue;
            const context = i[0].slice(0, -1);
            if (!prefix.endsWith(context)) continue;
            
            prefix = prefix.substring(0, prefix.length - context.length);
            key = i[1];
        }
        this.value = prefix + key + suffix;
        this.selectionStart = this.value.length - suffix.length;
        this.selectionEnd = this.selectionStart;
    }

    function setIme(elem: HTMLInputElement, ime: Array<[string, string]>|null) {
        elem.ime = ime;
        elem.state = {shift:false, alt:false, ctrl:false};
        // elem.onkeydown = onKeyDown;
        // elem.onkeypress = onKeyPress;
        // elem.onkeyup = onKeyUp;
    }

    function setLang(code: string) {
        switch (code) {
            case 'arb': {
                style = 'arab';
                setIme(phrase, [['a','A']]);
                setIme(transcription, [['b','B']]);
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
