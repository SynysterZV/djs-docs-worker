require('dotenv').config()
const fetch = require('node-fetch');
const id = '829588310158213150';
const guild = '806550877439131660';
const token = process.env.TOKEN;

const uri = `https://discord.com/api/v8/applications/${id}/guilds/${guild}/commands`;

const data = {
    name: 'mdn',
    description: 'Search MDN Docs',
    options: [
        {
            type: 3,
            name: 'query',
            description: 'Search term',
            required: true
        }
    ]
};

( async () => {

    console.log(

        await fetch(uri, { 
            method: 'POST',
            headers: { 
                Authorization: `Bot ${token}`, 
                "Content-Type": "application/json" 
            }, 
            body: JSON.stringify(data) 
            })
                .then(res => res.json())

    )

})()