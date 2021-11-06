<script lang="ts">
    import { onMount } from 'svelte';
    import { Language } from './IME.svelte';

    export let langcode: keyof typeof Language;
    export let data: AnkiPhrase[] = [];

    let style: string;
    let showTranscription: boolean;
    let showGrammar: boolean;

	onMount(() => {
        // setupLanguage(langcode);
    });

    function setupLanguage(code: keyof typeof Language) {
        style = Language[code].style;
        showTranscription = Language[code].showTranscription;
        showGrammar = Language[code].showGrammar;
    }

    $: setupLanguage(langcode);
</script>


<dl>
{#each data as item}
    <dt>
        <span id="phrase" class={style}>{item.phrase}</span>
        <span id="grammar"
            style="display:{ showGrammar ? 'inline' : 'none' };">{item.grammar}</span>
    </dt>
    <dd>
        <div id="transcription"
            style="display:{ showTranscription ? 'block' : 'none' };">
            {item.transcription}
        </div>
        <div>
            <span id="translation">{item.translation}</span>
            <span id="notes">{item.notes}</span>
        </div>
    </dd>
{/each}
</dl>

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

    #phrase {
        color: orange;
        text-align: left;
    }

    #grammar {
        color: gray;
        font-size: 1.2rem;
        float: right;
    }

    #transcription {
        color: lightgreen;
        font-size: 1.2rem;
    }

    #translation {
        font-size: 1.2rem;
    }

    #notes {
        font-size: 1.2rem;
        font-style: italic;
        float: right;
    }
</style>