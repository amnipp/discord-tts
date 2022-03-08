/* TODO
	A lot :)
	Configure to only read from a certain channel
	Add users dynamically
	Host so it is always online
	Try to figure out how to read audioContent buffers into createAudioResource
	More commands
*/
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus } = require('@discordjs/voice');
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Creates a client
const ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: 'gcloud.json' });
const fs = require('fs');
const util = require('util');

async function tts(message) {
	console.log('TTS for ' + message);
	const request = {
		input: { text: message },
		voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
		audioConfig: { audioEncoding: 'MP3' },
	};
	const [response] = await ttsClient.synthesizeSpeech(request);
	const writeFile = util.promisify(fs.writeFile);
	await writeFile('outputFile.mp3', response.audioContent, 'binary');

	console.log('Audio content written to file: outputFile.mp3');
	const resource = createAudioResource('outputFile.mp3', {
		inputType: StreamType.Arbitrary,
	});
	player.play(resource);
	//fs.unlinkSync('outputFile.mp3');
	//console.log('deleted file');
	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

/* async function quickStart() {
	// The text to synthesize
	const text = 'hello, world!';
	// Construct the request
	const request = {
		input: { text: text },
		// Select the language and SSML voice gender (optional)
		voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
		// select the type of audio encoding
		audioConfig: { audioEncoding: 'MP3' },
	};
	// Performs the text-to-speech request
	const [response] = await ttsClient.synthesizeSpeech(request);
	// Write the binary audio content to a local file
	const writeFile = util.promisify(fs.writeFile);
	await writeFile('output.mp3', response.audioContent, 'binary');
	console.log('Audio content written to file: output.mp3');
}
quickStart(); */

const player = createAudioPlayer();
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const userList = [
	'164948299265081344',
	'626373916000256010',
	'395464025326223370',
];

function playSong() {
	const resource = createAudioResource('sounds/sus.mp3', {
		inputType: StreamType.Arbitrary,
	});

	player.play(resource);

	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

async function connectToChannel(channel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	}
	catch (error) {
		connection.destroy();
		throw error;
	}
}
// When the client is ready, run this code (only once)
client.once('ready', async () => {
	console.log('Ready!');
	try {
		//await playSong();
		console.log('Song is ready to play!');
	}
	catch (error) {
		console.error(error);
	}
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	}
	else if (commandName === 'server') {
		await interaction.reply('Server info.');
	}
	else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
	else if (commandName == 'chase') {
		await interaction.reply('Chilli\'s date <@126145127973519360>?');
	}
});
client.on('voiceStateUpdate', async (oldState, newState) => {
	if (oldState.member.user.bot) return;
	if (userList.includes(newState.member.user.id)) {
		const channel = newState.member?.voice.channel;
		if (channel) {
			try {
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
			}
			catch (error) {
				console.error(error);
			}
		}
		playSong();
	}
	// if (newState.channelId === null) {//left
	//	console.log(newState.member.user.id + ' left channel', oldState.channelId);
	// }
	// else if (oldState.channelId === null) {// joined
	// console.log(newState.member.user.id + ' joined channel', newState.channelId);
	// }
	// else { // moved
	// console.log(newState.member.user.id + ' moved channels', oldState.channelId, newState.channelId);
	// }
});
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	/* if (userList.includes(message.author.id)) {
		await message.channel.send('Hello, <@' + message.author + '>');
	} */
	if (message.content === '-join') {
		const channel = message.member?.voice.channel;

		if (channel) {
			try {
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
				message.reply('Playing now!');
			}
			catch (error) {
				console.error(error);
			}
		}
		else {
			message.reply('Join a voice channel then try again!');
		}
	}
	else if (message.content === '-sus') {
		playSong();
	}
	else if (message.content.includes('-tts')) {
		tts(message.content.substring(4));
	}
	else if (userList.includes(message.author.id)) {
		tts(message.content);
	}
});
// Login to Discord with your client's token
client.login(token);