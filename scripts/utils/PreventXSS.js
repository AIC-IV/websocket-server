const createDOMPurify = require("dompurify"); //Prevent xss
const { JSDOM } = require("jsdom");

class PreventXSS {
    constructor() {
      const window = new JSDOM("").window;
      this.DOMPurify = createDOMPurify(window);
    }

    //Prevent cross site scripting (xss)
    escapeAllContentStrings(content, cnt) {
        if (!cnt) cnt = 0;

        if (typeof content === "string") {
            return this.DOMPurify.sanitize(content);
        }
        for (var i in content) {
            if (typeof content[i] === "string") {
                content[i] = this.DOMPurify.sanitize(content[i]);
            }
            if (typeof content[i] === "object" && cnt < 10) {
                content[i] = this.escapeAllContentStrings(content[i], ++cnt);
            }
        }
        return content;
    }

    //Sanitize strings known to be encoded and decoded
    purifyEncodedStrings(content) {
        if (content.hasOwnProperty("t") && content["t"] === "setTextboxText") {
            return purifyTextboxTextInContent(content);
        }
        return content;
    }

    purifyTextboxTextInContent(content) {
        const raw = content["d"][1];
        const decoded = base64decode(raw);
        const purified = this.DOMPurify.sanitize(decoded, {
            ALLOWED_TAGS: ["div", "br"],
            ALLOWED_ATTR: [],
            ALLOW_DATA_ATTR: false,
        });

        if (purified !== decoded) {
            console.warn("setTextboxText payload needed be DOMpurified");
            console.warn("raw: " + removeControlCharactersForLogs(raw));
            console.warn("decoded: " + removeControlCharactersForLogs(decoded));
            console.warn("purified: " + removeControlCharactersForLogs(purified));
        }

        content["d"][1] = base64encode(purified);
        return content;
    }

    base64encode(s) {
        return Buffer.from(s, "utf8").toString("base64");
    }

    base64decode(s) {
        return Buffer.from(s, "base64").toString("utf8");
    }

    removeControlCharactersForLogs(s) {
        return s.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    }
}

module.exports = { PreventXSS };