"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.djsDocs = void 0;
const discord_js_docs_1 = __importDefault(require("discord.js-docs"));
async function djsDocs(src, q) {
    try {
        const doc = await discord_js_docs_1.default.fetch(src, { force: true });
        const element = doc.get(...q.split(/\.|#/));
        if (element) {
            return new Response(JSON.stringify({
                data: {
                    content: resolveElementString(element, doc),
                    allowed_mentions: { parse: [] },
                },
                type: 4
            }));
        }
        return new Response(JSON.stringify({
            data: {
                content: 'No Match.',
                flags: 64,
                allowed_mentions: { parse: [] },
            },
            type: 4
        }));
    }
    catch (e) {
        console.log(e);
        return new Response(JSON.stringify({ type: 1 }), { status: 200 });
    }
}
exports.djsDocs = djsDocs;
function resolveElementString(element, doc) {
    var _a, _b, _c;
    const parts = [];
    if ((element === null || element === void 0 ? void 0 : element.docType) === 'event')
        parts.push('**(event)** ');
    if (element === null || element === void 0 ? void 0 : element.static)
        parts.push('**(static)** ');
    parts.push(`__**${escapeMDLinks((_a = element === null || element === void 0 ? void 0 : element.link) !== null && _a !== void 0 ? _a : '')}**__`);
    if (element === null || element === void 0 ? void 0 : element.extends)
        parts.push(formatInheritance('extends', element.extends, doc));
    if (element === null || element === void 0 ? void 0 : element.implements)
        parts.push(formatInheritance('implements', element.implements, doc));
    if ((element === null || element === void 0 ? void 0 : element.access) === 'private')
        parts.push(' **PRIVATE**');
    if (element === null || element === void 0 ? void 0 : element.depreceated)
        parts.push(' **DEPRECEATED** ');
    const s = ((_b = element === null || element === void 0 ? void 0 : element.description) !== null && _b !== void 0 ? _b : '').split('\n');
    const description = s.length > 1 ? `${s[0]} [(more...)](<${(_c = element === null || element === void 0 ? void 0 : element.url) !== null && _c !== void 0 ? _c : ''}>)` : s[0];
    return `${parts.join('')}\n${description}`;
}
function formatInheritance(prefix, inherits, doc) {
    const res = inherits.map(element => element.flat(5));
    return ` (${prefix} ${res.map(element => escapeMDLinks(doc.formatType(element))).join(' and')})`;
}
function escapeMDLinks(s) {
    return s.replace(/\[(.+?)\]\((.+?)\)/g, '[$1](<$2>)');
}
//# sourceMappingURL=discordjsDocs.js.map