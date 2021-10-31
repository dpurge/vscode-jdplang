<script lang="ts">
    import { onMount } from 'svelte';
    import { LangName } from './IME.svelte';

    let langcode: keyof typeof LangName;

    onMount(() => {
        window.addEventListener("message", (event) => {
            const msg = event.data;
            switch (msg.type) {
                case "setLanguage": {
                    langcode = msg.data;
                    break;
                }
            }
        });

        vscode.postMessage({type: 'getLanguage', data: null});
    })

    function changeLanguage() {
        vscode.postMessage({type: 'changeLanguage', data: Object.keys(LangName) });
    }

    function newAnkiPhrase() {
        vscode.postMessage({type: 'newAnkiPhrase', data: null });
    }

    function newLangText() {
        vscode.postMessage({type: 'newLangText', data: null });
    }
</script>

<h1>{ LangName[langcode] }</h1>

<button on:click={ changeLanguage }>Change language</button>

<button on:click={ newAnkiPhrase }>New AnkiPhrase</button>

<button on:click={ newLangText }>New LangText</button>

<style>
    
</style>