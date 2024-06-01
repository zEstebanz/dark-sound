const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const sodium = require('libsodium-wrappers');
require('dotenv').config();

(async () => {
    try {
        await sodium.ready; // Espera a que libsodium esté listo

        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        const token = process.env.TOKEN;

        client.once('ready', () => {
            console.log('  ♪DarkSound♪  ');
            console.log('by Esteban Oller ̤̮');
        });

        client.on('messageCreate', async message => {
            try {
                if (message.content.startsWith('!play')) {
                    const args = message.content.split(' ');

                    if (!args[1]) {
                        message.channel.send('No seas boludo te falta la url de YouTube (｡- .•)');
                        return;
                    }

                    if (message.member.voice.channel) {
                        const connection = joinVoiceChannel({
                            channelId: message.member.voice.channel.id,
                            guildId: message.guild.id,
                            adapterCreator: message.guild.voiceAdapterCreator,
                        });

                        const stream = ytdl(args[1], { filter: 'audioonly' });
                        const resource = createAudioResource(stream, {
                            inputType: 'arbitrary',
                        });

                        const player = createAudioPlayer();
                        connection.subscribe(player);
                        player.play(resource);

                        player.on('idle', () => connection.destroy());

                        await message.reply(`Reproduciendo: ${args[1]}`);
                    } else {
                        message.reply('Che bobina tenes que estar en un canal de voz para poder reproducir la weabada esa \n ☜(ﾟヮﾟ☜)');
                        
                    }
                }
            } catch (error) {
                console.error('Error handling message:', error);
                message.reply('Hubo un error al intentar reproducir la música.');
            }
        });

        client.login(token).catch(error => {
            console.error('Error logging in:', error);
        });
    } catch (error) {
        console.error('Error initializing bot:', error);
    }
})();