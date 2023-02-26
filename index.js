const qrcode = require('qrcode-terminal');
const google = require('google-it')
const https = require('https');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const { Client } = require('whatsapp-web.js');
const MessageMedia = require('whatsapp-web.js/src/structures/MessageMedia');
const client = new Client({
    puppeteer: { 
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
    },
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message', message => {
	if(message.body === '/ping') {
		message.reply('pong');
	}
});

// commands
client.on('message', async message => {
    let chat = await message.getChat();
    if (chat.isGroup) {
        if (message.body.toLowerCase().startsWith("/kick ")) {
            if (checkAdmin(chat.participants, message.author)) {
                let number = message.body.slice(6);
                var numArr =  number.split(' ');
                for(num in numArr){
                    numArr[num] = numArr[num].includes("@c.us") ? numArr[num] : `${numArr[num]}@c.us`;
                    try {
                        let finNumber = numArr[i].slice(1);
                        remArray = [];
                        remArray.push(finNumber);
                        try {
                            chat.removeParticipants(remArray);
                        } catch (e) {
                            message.reply('Invalid User')
                        }
                    } catch (e) {
                        message.reply('Invalid Number')
                    }
                }
            } else {
                message.reply('*INVALID: USER & BOT SHOULD BE AN ADMIN*')
            }
        }
        // tagall***
        else if(message.body.toLowerCase().startsWith('/tagall-h')) {
            if (checkAdmin(chat.participants, message.author)) {
                let tagMsg = message.body.slice(10)
                let mentions = [];
                for(let participant of chat.participants) {
                    const contact = await client.getContactById(participant.id._serialized);       
                    mentions.push(contact);
                }
                await chat.sendMessage(tagMsg, { mentions });
            } else {
                message.reply('*INVALID: USER & BOT SHOULD BE AN ADMIN*')
            }
        }
        //tagall-h***
        else if(message.body.toLowerCase().startsWith('/tagall')) {
            if (checkAdmin(chat.participants, message.author)) {
                let tagMsg = (message.body.slice(8) === "") ? message.body.slice(8) : message.body.slice(8) + "\n\n"
                let mentions = [];
                for(let participant of chat.participants) {
                    const contact = await client.getContactById(participant.id._serialized);
                    mentions.push(contact);
                    tagMsg += `✅ @${participant.id.user} \n`;
                }
                await chat.sendMessage(tagMsg, { mentions });
            } else {
                message.reply('*INVALID: USER & BOT SHOULD BE AN ADMIN*')
            }
        }
        // add participants***
        else if(message.body.toLowerCase().startsWith('/add ')){
            const num = message.body.slice(5).replaceAll(/[ +()-]/g, "") + "@c.us"
            var addArr = []
            addArr.push(num)
            try {
                await chat.addParticipants(addArr);
            } catch (e) {
                message.reply('*Inavlid Number! Please try again*')
            }
        }
        // av @***
        else if (message.body.toLowerCase().includes('/av ')) {
            let user = message.body.slice(5) + "@c.us"
            for (participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);
                if (participant.id._serialized == user) {
                    try {
                        var av = await contact.getProfilePicUrl();
                        let media = await MessageMedia.fromUrl(av)
                        message.reply(media)
                    } catch (e) {
                        message.reply('User Profile Picture not available')
                    }
                }      
            }
        }
        // av***
        else if (message.body.toLowerCase() === '/av') {
            for (participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);
                if (participant.id._serialized == message.author) {
                    try {
                        var av = await contact.getProfilePicUrl();
                        let media = await MessageMedia.fromUrl(av)
                        message.reply(media)
                    } catch (e) {
                        message.reply('User Profile Picture not available')
                    }
                }      
            }
        }
    }
    //av***
    if (message.body.toLowerCase() === '/av') {
        for (participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            if (participant.id._serialized == message.author) {
                try {
                    var av = await contact.getProfilePicUrl();
                    let media = await MessageMedia.fromUrl(av)
                    message.reply(media)
                } catch (e) {
                    message.reply('User Profile Picture not available')
                }
            }      
        }
    }
    // join group***
    if (message.body.toLowerCase().startsWith("/join ")) {
        try {
            const inviteLink = message.body.split('https://chat.whatsapp.com/')[1];
            const inviteCode = message.body.split(' ')[1];
        
            if (message.body.includes('https://chat.whatsapp.com/')){ 
                try {
                    await client.acceptInvite(inviteLink);
                } catch (e) {
                    message.reply('link revoked or the bot is removed from the group');
                }
            } else {
              await client.acceptInvite(inviteCode);
            }
        } catch (e) {
            message.reply('Invalid Group')
        }
    }


    // google***
    else if (message.body.toLowerCase().startsWith('/google ')){
        const googleSearch = message.body.slice(8)
        if (googleSearch == undefined || googleSearch == ' ') 
           return message.reply(`*Result : ${googleSearch}* not found`)
        google({ 'query': googleSearch })
           .then(results => {
           let vars = `_*Result : ${googleSearch}*_\n`
           for (let i = 0; i < results.length; i++) {
               vars +=  `\n------------------------------------------------\n\n*Title* : 
               ${results[i].title}\n\n*Description* : 
               ${results[i].snippet}\n\n*Link* : 
               ${results[i].link}\n\n`
           }
        message.reply(vars);
        }).catch(e => {
            message.reply('Google Error : ' + e);
        })
    }
    // sticker***
    else if(message.body.toLowerCase().startsWith('/sticker')) {
        const desc = message.body.slice(9)
        if (message.hasMedia) {
            const media = await message.downloadMedia()
            chat.sendMessage(media, { sendMediaAsSticker: true, stickerName: desc, stickerAuthor: "😶‍🌫️"});
        } 
        else if (message.hasQuotedMsg) {
            const qmsg = await message.getQuotedMessage()
            const media = qmsg.hasMedia ? await qmsg.downloadMedia() : qmsg.reply('*IMAGE NOT FOUND*')
            try {
                chat.sendMessage(media, { sendMediaAsSticker: true, stickerName: desc, stickerAuthor: "😶‍🌫️"});
            } catch (e) {
                
            }
        } else {
            message.reply('*SEND IMAGE WITH A CAPTION*')
        }
    }
    // wolfram***
    else if (message.body.toLowerCase().startsWith("/wf ")) {
        const query = message.body.slice(3).replaceAll(" ", "+")
        const url = "https://api.wolframalpha.com/v1/result?appid=VG592Y-74K2Q6EH4L&i="+ query +"%3f"
        try{
            https.get(url, (response) => {
                response.on("data", (data) => {
                    message.reply(data.toString('utf8'))
                })
            })
        }
        catch (e){
            let media = MessageMedia.fromUrl('https://i.imgur.com/9fZoAIC.jpeg')
            message.reply(media)
        }
    }
    else if (message.body.toLowerCase().startsWith("/g ")) {
        const query = message.body.slice(2)
        const apikey = process.env.API_KEY;
        const orgkey = process.env.ORG_KEY;
        const configuration = new Configuration({
            organization: orgkey,
            apiKey: apikey,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: query
        })
        
        message.reply(response.data.choices[0].text);
    }
    // darkjoke***
    else if(message.body.toLowerCase().startsWith("/darkjoke")) {
        if (Math.floor(Math.random() * 2) == 0) {
            const url = 'https://v2.jokeapi.dev/joke/Dark?type=twopart'
            try {
                https.get(url, (response) => {
                    response.on("data", (data) => {
                        let text = data.toString("utf8");
                        if (text.codePointAt(0) === 0xFEFF) {
                            text = text.substring(1);
                        }
                        let list = JSON.parse(text)
                        message.reply(list.setup + "\n\n" + list.delivery)    
                    })
                })
            } catch (e) {
                let media = MessageMedia.fromUrl('https://i.imgur.com/9fZoAIC.jpeg')
                message.reply(media)
            }
        } else {
            const url = 'https://v2.jokeapi.dev/joke/Dark?type=single'
            try {
                https.get(url, (response) => {
                    response.on("data", (data) => {
                        let text = data.toString("utf8");
                        if (text.codePointAt(0) === 0xFEFF) {
                            text = text.substring(1);
                        }
                        let list = JSON.parse(text)
                        message.reply(list.joke)
                    })
                })
            } catch (e) {
                let media = MessageMedia.fromUrl('https://i.imgur.com/9fZoAIC.jpeg')
                message.reply(media)
            }
        }
    }
})

// commands***
client.on('message', message => {
    if (message.body === "/help"){
        const commands = "*COMMANDS LIST*\n\n/sticker cute cat\n*Usage*: Reply or send an image, gif or video with this caption to make its sticker. Description is optional\n\n/tagall Special Announcement\n*Usage*: Tags everyone in the group. Tag Message is optional [Requires user to be an admin]\n\n/tagall-h\n*Usage*: Same as above but the tags are hidden. Tag Message is optional [Requires user to be an admin]\n\n/kick @user1 @user2 ...\n*Usage*: Kicks mention users [Requires both user and bot to be an admin]\n\n/add 919999988888\n*Usage*: Adds number to the group [Requires both user and bot to be an admin]\n\n/google GitHub\n*Usage*: Returns search results from google\n\n/wf integrate 5sinx/8x^2\n*Usage*: Get quick result from wolfram search engine (May take more time for complex queries)\n\n /av _and_ /av @user\n*Usage*: Returns your profile picture and if mentioned a user returns profile picture of mentioned user\n\n/darkjoke \n*Usage*: Returns cursed dark jokes"
        message.reply(commands)
    }
})

var checkAdmin = (part, auth) => {
    for(participant of part) {
        if (participant.id._serialized == auth && participant.isAdmin) {
            return true
        }
    }
    return false
}

client.on('group_join', async grp => {
    let chat = await grp.getChat()
    var media = await MessageMedia.fromUrl('https://i.imgur.com/wiiVudk_d.webp?maxwidth=760&fidelity=grand')
    chat.sendMessage(media, {caption: `Welcome to ${chat.name}.\n\n Hope you have a great time here\n\nType /help to check out my commands `})
})


