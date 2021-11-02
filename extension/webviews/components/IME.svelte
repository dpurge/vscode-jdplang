<script lang='ts' context="module">
    export enum LangName {
        'apc' = '???',
        'arb' = 'Arabic',
        'arz' = '???',
        'bul' = 'Bulgarian',
        'ces' = 'Czech',
        'cmn' = 'Mandarin',
        'deu' = 'German',
        'ell' = 'Greek',
        'fas' = 'Farsi',
        'fra' = 'French',
        'heb' = 'Hebrew',
        'hin' = 'Hindi',
        'hye' = 'Armenian',
        'ind' = 'Indonesian',
        'kaz' = 'Kazakh',
        'lat' = 'Latin',
        'rus' = 'Russian',
        'spa' = 'Spanish',
        'srp' = 'Serbian',
        'tgk' = 'Tajik',
        'tur' = 'Turkish',
        'uig' = 'Uighur',
        'uzb' = 'Uzbek',
        'vie' = 'Vietnamese'
    }

    export enum ImeType {
        'phrase',
        'transcription'
    }

    export enum ImeUrl {
        'buckwalter' = 'https://xxx.example',
        'banan' = 'https://xxx.example',
        'semitic' = 'https://xxx.example'
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
        // elem.onkeydown = onKeyDown;
        // elem.onkeypress = onKeyPress;
        // elem.onkeyup = onKeyUp;
        //vscode.postMessage({type: 'showInfo', data: `setIme = ${ime}`});
    }

    // export function loadIme(
    //     langcode: keyof typeof LangName,
    //     imeType: keyof typeof ImeType
    // ): ImeData {
    //     // var urly = 'media/ime/example.json';
    //     // console.log("Fetching data...")      
    //     // fetch(urly)
    //     //     .then(res => res.json())
    //     //     .then(data => {
    //     //     console.log(data)
    //     //     });
        
    //     const data: ImeData = [['a','A'], ['b','B']];
    //     return data;
    // }
</script>