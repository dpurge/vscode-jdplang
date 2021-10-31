<script lang="ts">
    import { onMount } from 'svelte';

    export let langcode: string;
    export let data: AnkiPhrase[] = [];

    let style: string = 'arab';

	onMount(() => {
        setLang(langcode);
    });

    function setLang(code: string) {
        switch (code) {
            case 'arb': {
                style = 'arab';
                break;
            }

            default: {
                style = 'latn';
                break;
            }
        }
    }
</script>


<dl>
{#each data as item}
    <dt class={style}>{item.phrase}</dt>
    <dd>
        <span class="latn">&#x7B;{item.grammar}&#x7D;</span>
        <span class="latn">[{item.transcription}]</span>
        <span class="latn">{item.translation}</span>
        <span class="latn">({item.notes})</span>
    </dd>
{/each}
</dl>

<style>
    .arab {
        direction: rtl;
        unicode-bidi: embed;
        font-size: 1.3rem;
        font-family: "Amiri", sans-serif;
        text-align: left;
    }
    .latn {
        font-size: 1.2rem;
    }
</style>