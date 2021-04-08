import { djsDocs } from './interactions/discordjsDocs'
import { verifyKey } from 'discord-interactions'

let dev

export default async function (request: Request) {
  try {

    if (!dev) {
      if(!await isValidReq(request)) return new Response('Bad request signature', { status: 401 })
    }

    const body = dev ? { data: { name: 'ping', options: [] }, type: 2, id: '744603004493365330' } : await request.clone().json();
    const { data: { name, options } } = body

    if (body.type === 2) {
      if (options?.length) {
        const args = Object.fromEntries(options.map(({ name, value }: { name: string, value: string}) => [name, value]))

        if (name === 'docs') {
          return djsDocs(args.source || 'stable', args.query);
        }
        
      }

      if (name === 'ping') {
        return new Response(JSON.stringify({
          data: {
            content: `Pong! Latency is **${Date.now() - deconstruct(body.id).timestamp}ms**`,
            allowed_mentions: { parse: [] }
          },
          type: 4
        }))
      }

    }

    return ack()
  } catch (e) {
    console.log(e)
    return ack()
  }
}



function ack() {
  return new Response(JSON.stringify({
    type: 1
  }), { status: 200});
}

function deconstruct(snowflake) {
  const BINARY = idToBinary(snowflake).toString().padStart(64, '0')
  return {
    timestamp: parseInt(BINARY.substring(0, 42), 2) + 1420070400000
  }
}

async function isValidReq(req: Request): Promise<boolean> {
  const signature = req.headers.get('X-Signature-Ed25519')
  const timestamp = req.headers.get('X-Signature-Timestamp')
  if(!signature || !timestamp || !req.body) {
    return false;
  }
  const rawBody = await req.clone().arrayBuffer();
  return verifyKey(rawBody, signature, timestamp, await DISCORD.get('PUBLIC'))
}

function idToBinary(num) {
  let bin = '';
  let high = parseInt(num.slice(0, -10)) || 0;
  let low = parseInt(num.slice(-10));
  while (low > 0 || high > 0) {
    bin = String(low & 1) + bin
    low = Math.floor(low / 2);
    if(high > 0) {
      low += 5000000000 * (high % 2);
      high = Math.floor(high / 2);
    }
  }
  return bin;
}