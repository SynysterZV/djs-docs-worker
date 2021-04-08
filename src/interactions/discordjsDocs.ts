import Doc from 'discord.js-docs'

export async function djsDocs(src: string, q: string) {
    try {
  
      const doc = await Doc.fetch(src, { force: true });
      const element = doc.get(...q.split(/\.|#/));
  
      if(element) {
        return new Response(JSON.stringify({
          data: {
            content: resolveElementString(element, doc),
            allowed_mentions: { parse: [] },
          },
          type: 4
        }))
      }
  
      return new Response(JSON.stringify({
        data: {
          content: 'No Match.',
          flags: 64,
          allowed_mentions: { parse: [] },
        },
        type: 4
      }))
  
    } catch (e) {
        console.log(e)
        return new Response(JSON.stringify({ type: 1 }), { status: 200 });
    }
  }
  
  function resolveElementString(element, doc) {
    const parts = [];
    if(element?.docType === 'event') parts.push('**(event)** ');
    if(element?.static) parts.push('**(static)** ');
    parts.push(`__**${escapeMDLinks(element?.link ?? '')}**__`);
    if(element?.extends) parts.push(formatInheritance('extends', element.extends, doc))
    if(element?.implements) parts.push(formatInheritance('implements', element.implements, doc))
    if(element?.access === 'private') parts.push(' **PRIVATE**');
    if(element?.depreceated) parts.push(' **DEPRECEATED** ');
  
    const s = (element?.description ?? '').split('\n');
    const description = s.length > 1 ? `${s[0]} [(more...)](<${element?.url ?? ''}>)` : s[0];
    return `${parts.join('')}\n${description}`
  }
  
  function formatInheritance(prefix, inherits, doc) {
    const res = inherits.map(element => element.flat(5));
    return ` (${prefix} ${res.map(element => escapeMDLinks(doc.formatType(element))).join(' and')})`;
  }
  
  function escapeMDLinks(s) {
    return s.replace(/\[(.+?)\]\((.+?)\)/g, '[$1](<$2>)')
  }