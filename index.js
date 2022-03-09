/* TODO
	A lot :)
	Configure to only read from a certain channel
	Add users dynamically
	Host so it is always online
	Try to figure out how to read audioContent buffers into createAudioResource
	More commands
	Limit message length
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
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Creates a client
const ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: 'gcloud.json' });
const http = require('http'); // or 'https' for https:// URLs

const https = require('https');
const fs = require('fs');

const util = require('util');

async function tts(message) {
	console.log('TTS for ' + message);
	const request = {
		input: { text: message },
		voice: { languageCode: 'en-AU', ssmlGender: 'FEMALE', name: 'en-AU-Wavenet-A' },
		audioConfig: { audioEncoding: 'MP3' },
	};
	const [response] = await ttsClient.synthesizeSpeech(request);

	const writeFile = util.promisify(fs.writeFile);
	await writeFile('outputFile.mp3', response.audioContent, 'binary');

	// console.log('Audio content written to file: outputFile.mp3');
	/* const readable = new Readable();
	readable.setEncoding('binary');
	readable._read = () => {} // _read is required but you can noop it
	readable.push(response.audioContent);
	readable.push(null);
	console.log(readable); */
	const resource = createAudioResource('outputFile.mp3', {
		inputType: StreamType.Raw,
	});
	player.play(resource);
	// fs.unlinkSync('outputFile.mp3');
	// console.log('deleted file');z
	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

async function memeTTS(message) {
	console.log('Meme TTS: ' + message);
	// https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=
	const file = fs.createWriteStream('outputFileMeme.mp3');
	https.get('https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=' + message, function(response) {
		response.pipe(file).on('close', () => {
			const resource = createAudioResource('outputFileMeme.mp3', {
				inputType: StreamType.Arbitrary,
			});
			player.play(resource);
		});
		//file.end();

	});

	// fs.unlinkSync('outputFile.mp3');
	// console.log('deleted file');z
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
	'626373916000256010',
];

function playSong() {
	const resource = createAudioResource('sounds/sus.mp3', {
		inputType: StreamType.Arbitrary, inlineVolume: true,
	});
	resource.volume.setVolume(0.25);
	player.play(resource);

	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}
function playHomu() {
	const resource = createAudioResource('sounds/homu.mp3', {
		inputType: StreamType.Arbitrary, inlineVolume: true,
	});
	resource.volume.setVolume(0.25);
	player.play(resource);

	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}
function playQuack() {
	const resource = createAudioResource('sounds/quack.mp3', {
		inputType: StreamType.Arbitrary, inlineVolume: true,
	});
	resource.volume.setVolume(0.25);
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
let ignoreFlag = false;
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
	else if (message.content.includes('-help')) {
		message.reply('-join: joins VC\n-i: Disable TTS\n-enable: Enable TTS\n-sus: ( ͡° ͜ʖ ͡°)');
	}
	else if (message.content.includes('-i')) {
		ignoreFlag = true;
		message.reply('Disabled TTS');
	}
	else if (message.content.includes('-enable')) {
		ignoreFlag = false;
		message.reply('Enabled TTS');
	}
	else if (message.content === '-sus' || message.content.includes('<:TeriVent:950923367735779348>')) {
		playSong();
	}
	else if (message.content.includes('-tts')) {
		tts(message.content.substring(4));
	}
	else if (message.content.includes('-memeTTS')) {
		memeTTS(message.content.substring(8));
	}
	else if (message.content.includes('-homu')) {
		playHomu();
	}
	else if (message.content.includes('-quack')) {
		playQuack();
	}
	else if (userList.includes(message.author.id) && ignoreFlag === false) {
		tts(message.content);
	}
});
// Login to Discord with your client's token
client.login(token);
