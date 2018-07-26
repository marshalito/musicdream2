const { Client } = require('discord.js');
const { TOKEN, PREFIX } = require('./config');
const ytdl = require('ytdl-core')

const client = new Client({ disableEveryone: true });

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Estou pronto, chefe!'));

client.on('disconnect', () => console.log('Estou desconectado.'));

client.on('reconnecting', () => console.log('Estou reconectando agora :D'));

client.on('message', msg => {
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;
    const args = msg.content.split(' ');

    if (msg.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Entre em um canal de voz.');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('Não posso entrar neste canal de voz, reajuste minhas permissões :D');

        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('Não consigo falar nesse canal.');
        
        }

        try {
            var connection = await voiceChannel.join();
        } catch (error) {
            console.error(`${error}`)
            return;

        }

        const dispatcher = connection.playStream(ytdl(args[1]));
            .on('end', => {
                console.log('fim da música.');
	        voiceChannel.leave();
            })
            .on('error', error => {
                console.error(error);
            });
        dispatcher.setVolumeLogarithmic(5 / 5);
    }
});

client.login(process.env.BOT_TOKEN);
