"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDN = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const turndown_1 = __importDefault(require("turndown"));
const td = new turndown_1.default();
const jsoncache = new Map();
const embedcache = new Map();
async function MDN(query) {
    query = query.replace(/#/g, '.');
    if (embedcache.get(query)) {
        return new Response(JSON.stringify({
            data: {
                embeds: [embedcache.get(query)]
            },
            type: 4
        }));
    }
    GetJSON(query).then((body) => {
        body = body.result;
        let desc = '';
        if (body.summary)
            desc = td.turndown(body.summary);
        if (desc.match(/\[(.*?)\]\((.*?)\)/)) {
            for (const matched of desc.matchAll(/\[(.*?)\]\((.*?)\)/g)) {
                desc = desc.replace(matched[2], 'https://developer.mozilla.org' + matched[2]);
            }
        }
        const embed = {
            color: '#2791D3',
            title: body.title,
            url: 'https://developer.mozilla.org' + body.mdn_url,
            author: {
                name: 'MDN',
                icon_url: 'https://assets.stickpng.com/images/58480eb3cef1014c0b5e492a.png',
                url: 'https://developer.mozilla.org/',
            },
            description: desc
        };
        embedcache.set(query, embed);
        return new Response(JSON.stringify({
            data: {
                embeds: [embedcache.get('query')]
            },
            type: 4
        }));
    }).catch(e => {
        return new Response(JSON.stringify({
            data: {
                content: String(e)
            },
            type: 4
        }));
    });
}
exports.MDN = MDN;
async function GetJSON(query) {
    if (jsoncache.get(query)) {
        return { result: jsoncache.get(query) };
    }
    const url = `https://api.duckduckgo.com/?q=%21%20site%3Adeveloper.mozilla.org%20${query}&format=json&pretty=1`;
    const search = await node_fetch_1.default(url, { redirect: 'follow' }).catch(e => console.log(e));
    if (!search || !search.url || search.url.trim() == 'https://developer.mozilla.org/en-US/')
        return { result: null };
    const body = await node_fetch_1.default(`${search.url}/index.json`).then(res => res.json()).catch(e => console.log(e));
    if (!body)
        return { result: null };
    jsoncache.set(query, body.doc);
    return { result: jsoncache.get(query) };
}
//# sourceMappingURL=mdn.js.map