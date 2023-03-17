# WhatsApp Bot

This is a WhatsApp Group Bot built with the [whatsapp-web.js](https://wwebjs.dev/) library. It provides several useful features that can be used in a WhatsApp group chat.

## Getting Started

1. Clone the repository: `git clone https://github.com/anshulnegii/WhatsApp-Bot.git`
2. Install dependencies: 
```
npm install whatsapp-web.js https google-it qrcode-terminal dotenv
```
3. Set up environment variables: Create a `.env` file with the following contents:
```
/node_modules/
.env
WOLFRAM_API_KEY=
API_KEY=
ORG_KEY=
```
Get `WOLFRAM_API_KEY` key from [here](https://products.wolframalpha.com/api)\
Sign up for OpenAI Account
Get `API_KEY` from [here](https://platform.openai.com/account/api-keys)
Get `ORG_KEY` from [here](https://platform.openai.com/account/org-settings)\
4. Start the bot: `node index.js`\
5. Scan the QR code using your WhatsApp mobile app.\
6. Once the bot is ready, you can use the commands.

## Usage

Type `/help` to check out the commands. 

## Technologies Used

- Node.js
- whatsapp-web.js
- qrcode-terminal
- https
- Wolfram Alpha API
- OpenAI API

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
