const apiKey = '58b7c0ceea864f009a5a0bd13e979654';
const audio = document.getElementById('audio');
const button = document.getElementById('button');




// VoiceRSS Javascript SDK
const VoiceRSS = {
    speech: function (e) {
        this._validate(e), this._request(e)
    },

    _validate: function (e) {
        if (!e) throw "The settings are undefined";
        if (!e.key) throw "The API key is undefined";
        if (!e.src) throw "The text is undefined";
        if (!e.hl) throw "The language is undefined";
        if (e.c && "auto" != e.c.toLowerCase()) {
            var a = !1;
            switch (e.c.toLowerCase()) {
                case "mp3":
                    a = (new Audio).canPlayType("audio/mpeg").replace("no", "");
                    break;
                case "wav":
                    a = (new Audio).canPlayType("audio/wav").replace("no", "");
                    break;
                case "aac":
                    a = (new Audio).canPlayType("audio/aac").replace("no", "");
                    break;
                case "ogg":
                    a = (new Audio).canPlayType("audio/ogg").replace("no", "");
                    break;
                case "caf":
                    a = (new Audio).canPlayType("audio/x-caf").replace("no", "")
            }
            if (!a) throw "The browser does not support the audio codec " + e.c
        }
    },
    _request: function (e) {
        var a = this._buildRequest(e),
            t = this._getXHR();
        t.onreadystatechange = function () {
            if (4 == t.readyState && 200 == t.status) {
                if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
                // targets my html audi0 and passes text to the element to play
                audio.src = t.responseText, audio.play()
            }
        }, t.open("POST", "https://api.voicerss.org/", !0), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), t.send(a)
    },
    _buildRequest: function (e) {
        var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
        return "key=" + (e.key || "") + "&src=" + (e.src || "") + "&hl=" + (e.hl || "") + "&r=" + (e.r || "") + "&c=" + (a || "") + "&f=" + (e.f || "") + "&ssml=" + (e.ssml || "") + "&b64=true"
    },
    _detectCodec: function () {
        var e = new Audio;
        return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" : e.canPlayType("audio/wav").replace("no", "") ? "wav" : e.canPlayType("audio/aac").replace("no", "") ? "aac" : e.canPlayType("audio/ogg").replace("no", "") ? "ogg" : e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : ""
    },
    _getXHR: function () {
        try {
            return new XMLHttpRequest
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml3.XMLHTTP")
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0")
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0")
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {}
        try {
            return new ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
        throw "The browser does not support HTTP request"
    }
};




// passing joke to voice api

function tellMeAJoke(joke) {
    // will take the joke variable in getJoke function and pass it as an argument to the api which then will be called in the fetch 
    VoiceRSS.speech({
        key: apiKey,
        src: joke,
        hl: 'en-us',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

// get jokes from joke api

async function getJoke() {
    let joke = '';
    const apiUrl = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,racist,explicit';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`;
        } else {
            joke = data.joke;
        };
        // checks to see if audio is playing. which disables the button. preventing skipping jokes
        if (audio.play) {
            button.disabled = true;
        };
        // checks to see if audio is finished to then make button active so user can listen to new joke.
        audio.addEventListener("ended", () => {
            button.disabled = false;
        });


        tellMeAJoke(joke)


    } catch (error) {
        console.log('fetch failed', error)
    }
}




    button.addEventListener("click", getJoke);
   
