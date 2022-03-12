// Require the necessary discord.js classes
import { Client, Collection, Intents } from 'discord.js';
import { token } from '../config.json';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';
// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'node:fs';
import { CommandList, Commands } from './commands/Commands';
import { AddUser } from './commands/AddUser';
import { PlaySounds } from './commands/PlaySound';
import { EnableTTS } from './commands/EnableTTS';
import { Help } from './commands/Help';
import { TTS } from './commands/TTS';

// Creates a client
const ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: 'gcloud.json' });
const player = createAudioPlayer();
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
// Add Client Commands
client.commands = new Collection<CommandList, Commands>();
client.commands.set(CommandList.AddUser, new AddUser(client));
client.commands.set(CommandList.EnableTTS, new EnableTTS(client));
client.commands.set(CommandList.Help, new Help(client));
client.commands.set(CommandList.PlaySounds, new PlaySounds(client));
client.commands.set(CommandList.TTS, new TTS(client));

//TODO: Import from saved file
const botSettings = new Settings('-',[],true);

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