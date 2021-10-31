import App from "../components/AnkiPhraseEditor.svelte";

const app = new App({
    target: document.body,
    props: {
        langcode: 'arb'
    }
});

export default app;