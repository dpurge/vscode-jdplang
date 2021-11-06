<script lang='ts' context="module">
   
    export const Language = {
        'apc': {
            name: 'North Levantine Arabic',
            style: 'arab',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'arb': {
            name: 'Arabic',
            style: 'arab',
            showTranscription: true,
            showGrammar: true,
            phraseIME: 'arb-phrase',
            transcriptionIME: 'arb-transcription',
            grammaticalCategory: 'arb-grammar'
        },
        'arz': {
            name: 'Egyptian Arabic',
            style: 'arab',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'bul':{
            name: 'Bulgarian',
            style: 'cyrl',
            showTranscription: true,
            showGrammar: true,
            phraseIME: 'bul-phrase',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'ces':{
            name: 'Czech',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'cmn':{
            name: 'Mandarin',
            style: 'hans',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'dan':{
            name: 'Danish',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: 'dan-phrase',
            transcriptionIME: '',
            grammaticalCategory: 'dan-grammar'
        },
        'deu':{
            name: 'German',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'ell':{
            name: 'Greek',
            style: 'grek',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'fas':{
            name: 'Farsi',
            style: 'arab',
            showTranscription: true,
            showGrammar: true,
            phraseIME: 'fas-phrase',
            transcriptionIME: 'fas-transcription',
            grammaticalCategory: 'fas-grammar'
        },
        'fra':{
            name: 'French',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'heb':{
            name: 'Hebrew',
            style: 'hebr',
            showTranscription: true,
            showGrammar: true,
            phraseIME: 'heb-phrase',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'hin':{
            name: 'Hindi',
            style: 'deva',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'hun':{
            name: 'Hungarian',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: 'hun-phrase',
            transcriptionIME: null,
            grammaticalCategory: ''
        },
        'hye':{
            name: 'Armenian',
            style: 'armn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'ind':{
            name: 'Indonesian',
            style: 'latn',
            showTranscription: false,
            showGrammar: true,
            phraseIME: null,
            transcriptionIME: null,
            grammaticalCategory: ''
        },
        'kaz':{
            name: 'Kazakh',
            style: 'cyrl',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'lat':{
            name: 'Latin',
            style: 'latn',
            showTranscription: false,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'rus':{
            name: 'Russian',
            style: 'cyrl',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'spa':{
            name: 'Spanish',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'srp':{
            name: 'Serbian',
            style: 'cyrl',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'tgk':{
            name: 'Tajik',
            style: 'cyrl',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'tur':{
            name: 'Turkish',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'uig':{
            name: 'Uighur',
            style: 'arab',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'uzb':{
            name: 'Uzbek',
            style: 'latn',
            showTranscription: true,
            showGrammar: true,
            phraseIME: '',
            transcriptionIME: '',
            grammaticalCategory: ''
        },
        'vie':{
            name: 'Vietnamese',
            style: 'latn',
            showTranscription: false,
            showGrammar: false,
            phraseIME: 'vie-phrase',
            transcriptionIME: null,
            grammaticalCategory: ''
        }
    }

    export function onKeyDown(this:HTMLInputElement, event: KeyboardEvent) {
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

    export function onKeyUp(this:HTMLInputElement, event: KeyboardEvent) {
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

    export function onKeyPress(this:HTMLInputElement, event: KeyboardEvent) {
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

    export function setIme(elem: HTMLInputElement, ime: ImeData) {
        elem.ime = ime;
        elem.state = {shift:false, alt:false, ctrl:false};
    }
</script>