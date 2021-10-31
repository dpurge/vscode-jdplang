<script lang="ts">
    //import SvelteTable from "svelte-table";
    import AnkiVocabularyForm from './AnkiVocabularyForm.svelte'
    import AnkiVocabularyList from './AnkiVocabularyList.svelte'

    export let langcode: string;
    let data: AnkiPhrase[] = [];

    
</script>

<h1>Add anki phrase: {langcode}</h1>

<div class="container">
    <AnkiVocabularyForm bind:data={data} langcode={langcode} />
</div>

<h2>Phrase list:</h2>

<div class="container">
    <AnkiVocabularyList data={data} langcode={langcode} />
</div>