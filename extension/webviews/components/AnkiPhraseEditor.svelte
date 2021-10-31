<script lang="ts">
    import { onMount } from 'svelte';
    import { LangName } from './IME.svelte';

    import AnkiVocabularyForm from './AnkiVocabularyForm.svelte'
    import AnkiVocabularyList from './AnkiVocabularyList.svelte'

    let langcode: keyof typeof LangName;
    let data: AnkiPhrase[] = [];

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
    });

    
</script>

<h1>Add anki phrase: { LangName[langcode] }</h1>

<div class="container">
    <AnkiVocabularyForm bind:data={data} langcode={langcode} />
</div>

<h2>Phrase list:</h2>

<div class="container">
    <AnkiVocabularyList data={data} langcode={langcode} />
</div>