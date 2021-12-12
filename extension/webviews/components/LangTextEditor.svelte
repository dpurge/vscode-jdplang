<script lang="ts">
    import { onMount } from 'svelte';
    import { setIme, onKeyDown, onKeyUp, onKeyPress, Language } from './IME.svelte';

    let langTextEditor: HTMLTextAreaElement;

    let langcode: keyof typeof Language = 'spa';
	let langname: string;
    //let document: string[] = [];
    let style: string = 'latn';
    let imeType = 'none';

    onMount(() => {
        window.addEventListener("message", (event) => {
            const msg = event.data;
            switch (msg.type) {

                case "setLanguage": {
                    langcode = msg.data;
                    break;
                }

                case "setImeType": {
                    imeType = msg.data;
                    break;
                }

                case "setIme": {
                    setIme(langTextEditor, msg.data);
                    break;
                }

                case "setDocument": {
                    langTextEditor.value = msg.data;
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

    function changeImeType() {
        vscode.postMessage({type: 'changeImeType', data: ['none', 'phrase', 'transcription'] });
    }

    function onDocumentChange(event: Event) {
        vscode.postMessage({type: 'updateDocument', data: langTextEditor.value });
    }

    function setupLanguage(code: keyof typeof Language, ime: string) {
        langname = Language[code]?.name;
        style = Language[code].style;
        switch (ime) {
            case "phrase": {
                vscode.postMessage({type: 'getIme', data: Language[code].phraseIME });
                break;
            }
            case "transcription": {
                vscode.postMessage({type: 'getIme', data: Language[code].transcriptionIME });
                break;
            }
            default: {
                if (langTextEditor) {
                    setIme(langTextEditor, []);
                };
            }
        }
    }

    $: setupLanguage(langcode, imeType);
</script>

<div class="container">
    <h1>Language: <span on:click={ changeLanguage }>{ langname }</span>, IME: <span on:click={ changeImeType }>{ imeType }</span></h1>
</div>

<div class="container">
    <textarea bind:this={langTextEditor} class={style} on:input={ onDocumentChange } on:keydown={onKeyDown} on:keyup={onKeyUp} on:keypress={onKeyPress}
        id="langTextEditor"
        name="LangTextEditor"></textarea>
</div>

<style>
    .arab {
        direction: rtl;
        unicode-bidi: embed;
        font-size: 1.8rem;
        font-family: "Amiri", sans-serif;
    }

    .latn {
        font-size: 1.2rem;
    }

    :global(#langTextEditor) {
        height:60em;
        min-height: 10em;
        resize: vertical;
        overflow: auto;
    }
</style>