"use strict";

function _objectSpread(a) {
    for (var b = 1; b < arguments.length; b++) {
        var c = null == arguments[b] ? {} : arguments[b],
            d = Object.keys(c);
        "function" == typeof Object.getOwnPropertySymbols && (d = d.concat(Object.getOwnPropertySymbols(c).filter(function (a) {
            return Object.getOwnPropertyDescriptor(c, a).enumerable
        }))), d.forEach(function (b) {
            _defineProperty(a, b, c[b])
        })
    }
    return a
}

function _defineProperty(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[b] = c, a
}
class MetingJSElement extends HTMLElement {
    connectedCallback() {
        window.APlayer && window.fetch && (this._init(), this._parse())
    }
    disconnectedCallback() {
        this.lock || this.aplayer.destroy()
    }
    _camelize(a) {
        return a.replace(/^[_.\- ]+/, "").toLowerCase().replace(/[_.\- ]+(\w|$)/g, (a, b) => b.toUpperCase())
    }
    _init() {
        let a = {};
        for (let b = 0; b < this.attributes.length; b += 1) a[this._camelize(this.attributes[b].name)] = this.attributes[b].value;
        let b = ["server", "type", "id", "api", "auth", "auto", "lock", "name", "title", "artist", "author", "url", "cover", "pic", "lyric", "lrc"];
        this.meta = {};
        for (var c = 0; c < b.length; c++) {
            let d = b[c];
            this.meta[d] = a[d], delete a[d]
        }
        this.config = a, this.api = this.meta.api || window.meting_api || "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r", this.meta.auto && this._parse_link()
    }
    _parse_link() {
        let a = [
            ["music.163.com.*song.*id=(\\d+)", "netease", "song"],
            ["music.163.com.*album.*id=(\\d+)", "netease", "album"],
            ["music.163.com.*artist.*id=(\\d+)", "netease", "artist"],
            ["music.163.com.*playlist.*id=(\\d+)", "netease", "playlist"],
            ["music.163.com.*discover/toplist.*id=(\\d+)", "netease", "playlist"],
            ["y.qq.com.*song/(\\w+).html", "tencent", "song"],
            ["y.qq.com.*album/(\\w+).html", "tencent", "album"],
            ["y.qq.com.*singer/(\\w+).html", "tencent", "artist"],
            ["y.qq.com.*playsquare/(\\w+).html", "tencent", "playlist"],
            ["y.qq.com.*playlist/(\\w+).html", "tencent", "playlist"],
            ["xiami.com.*song/(\\w+)", "xiami", "song"],
            ["xiami.com.*album/(\\w+)", "xiami", "album"],
            ["xiami.com.*artist/(\\w+)", "xiami", "artist"],
            ["xiami.com.*collect/(\\w+)", "xiami", "playlist"]
        ];
        for (var b = 0; b < a.length; b++) {
            let c = a[b],
                d = new RegExp(c[0]),
                e = d.exec(this.meta.auto);
            if (null !== e) return this.meta.server = c[1], this.meta.type = c[2], void(this.meta.id = e[1])
        }
    }
    _parse() {
        if (this.meta.url) {
            let a = {
                name: this.meta.name || this.meta.title || "Audio name",
                artist: this.meta.artist || this.meta.author || "Audio artist",
                url: this.meta.url,
                cover: this.meta.cover || this.meta.pic,
                lrc: this.meta.lrc || this.meta.lyric || "",
                type: this.meta.type || "auto"
            };
            return a.lrc || (this.meta.lrcType = 0), this.innerText && (a.lrc = this.innerText, this.meta.lrcType = 2), void this._loadPlayer([a])
        }
        let a = this.api.replace(":server", this.meta.server).replace(":type", this.meta.type).replace(":id", this.meta.id).replace(":auth", this.meta.auth).replace(":r", Math.random());
        fetch(a).then(a => a.json()).then(a => this._loadPlayer(a))
    }
    _loadPlayer(a) {
        let b = {
            audio: a,
            mutex: !0,
            lrcType: this.meta.lrcType || 3,
            storageName: "metingjs"
        };
        if (a.length) {
            let a = _objectSpread({}, b, this.config);
            for (let b in a)("true" === a[b] || "false" === a[b]) && (a[b] = "true" === a[b]);
            let c = document.createElement("div");
            a.container = c, this.appendChild(c), this.aplayer = new APlayer(a)
        }
    }
}
console.log("\n %c MetingJS v2.0.1 %c https://github.com/metowolf/MetingJS \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;"), window.customElements && !window.customElements.get("meting-js") && (window.MetingJSElement = MetingJSElement, window.customElements.define("meting-js", MetingJSElement));