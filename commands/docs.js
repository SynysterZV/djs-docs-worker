require('dotenv').config()
const fetch = require('node-fetch');
const id = '829588310158213150';
const guild = '806550877439131660';
const token = process.env.TOKEN;

const uri = `https://discord.com/api/v8/applications/${id}/guilds/${guild}/commands`;

const data = {
    name: 'docs',
    description: 'Search DJS Docs',
    options: [
        {
            type: 3,
            name: 'query',
            description: 'Class or Class#method combination to search for',
            required: true
        },
        {
            type: 3,
            name: 'source',
            description: "Source repository to use",
            choices: [
                {
                    name: 'collection (util structure)',
                    value: 'collection',
                },
                {
                    name: 'development branch (#master)',
                    value: 'master',
                },
                {
                    name: "stable branch (#stable) (default)",
                    value: "stable",
                }
            ]
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