// Require the necessary discord.js classes
import { Client, Collection, Intents } from 'discord.js';
import { token } from '../config.json';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';
// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'node:fs';
// Creates a client
const ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: 'gcloud.json' });
const player = createAudioPlayer();
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
// Login to Discord with your client's token
client.login(token);

// When the client is ready, run this code (only once)
client.once('ready', () => {
	try {
		// await playSong();
		console.log('Bot Initialized');
	}
	catch (error) {
		console.error(error);
	}
});