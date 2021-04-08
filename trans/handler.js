"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discordjsDocs_1 = require("./interactions/discordjsDocs");
const mdn_1 = require("./interactions/mdn");
const discord_interactions_1 = require("discord-interactions");
let dev = true;
async function default_1(request) {
    try {
        if (!dev) {
            if (!await isValidReq(request))
                return new Response('Bad request signature', { status: 401 });
        }
        const body = dev ? { data: { name: 'mdn', options: [{ name: 'query', value: 'string' }] }, type: 2, id: '744603004493365330' } : await request.clone().json();
        const { data: { name, options } } = body;
        if (body.type === 2) {
            if (options === null || options === void 0 ? void 0 : options.length) {
                const args = Object.fromEntries(options.map(({ name, value }) => [name, value]));
                if (name === 'docs') {
                    return discordjsDocs_1.djsDocs(args.source || 'stable', args.query);
                }
                if (name === 'mdn') {
                    try {
                        mdn_1.MDN(args.query);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            if (name === 'ping') {
                return new Response(JSON.stringify({
                    data: {
                        content: `Pong! Latency is **${Date.now() - deconstruct(body.id).timestamp}ms**`,
                        allowed_mentions: { parse: [] }
                    },
                    type: 4
                }));
            }
        }
        return ack();
    }
    catch (e) {
        console.log(e);
        return ack();
    }
}
exports.default = default_1;
function ack() {
    return new Response(JSON.stringify({
        type: 1
    }), { status: 200 });
}
function deconstruct(snowflake) {
    const BINARY = idToBinary(snowflake).toString().padStart(64, '0');
    return {
        timestamp: parseInt(BINARY.substring(0, 42), 2) + 1420070400000
    };
}
async function isValidReq(req) {
    const signature = req.headers.get('X-Signature-Ed25519');
    const timestamp = req.headers.get('X-Signature-Timestamp');
    if (!signature || !timestamp || !req.body) {
        return false;
    }
    const rawBody = await req.clone().arrayBuffer();
    return discord_interactions_1.verifyKey(rawBody, signature, timestamp, await DISCORD.get('PUBLIC'));
}
function idToBinary(num) {
    let bin = '';
    let high = parseInt(num.slice(0, -10)) || 0;
    let low = parseInt(num.slice(-10));
    while (low > 0 || high > 0) {
        bin = String(low & 1) + bin;
        low = Math.floor(low / 2);
        if (high > 0) {
            low += 5000000000 * (high % 2);
            high = Math.floor(high / 2);
        }
    }
    return bin;
}
//# sourceMappingURL=handler.js.map