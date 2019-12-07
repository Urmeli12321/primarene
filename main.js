const Discord = require("discord.js")
const YTDL = require("ytdl-core")
const commando = require("discord.js-commando")
const Manager = new Discord.ShardingManager('./main.js');
const yt = require("ytdl-core")
const bot = new Discord.Client()
const BotSettings = require("./botsettings.json")
exports.GOOGLE_API_KEY = `AlzaSyAXGU4GnO72qxlZrwS9tjBvxBU84co4bj8`;
const youtube = new YouTube(GOOGLE_API_KEY);
const YouTube = require('simple-youtube-api');
const queue = new Map();
        //Start-Up
        bot.on("ready", async () => {

    console.log(`\nBot ist online.\nName + Tag: ${bot.user.username}#${bot.user.discriminator}\nPrefix: ${BotSettings.prefix}`)
    bot.user.setStatus("dnd")//online, idle, dnd, invisible
    bot.user.setActivity(`${BotSettings.prefix}help mit maggi`, {

        type: "PLAYING" //PLAYING, STREAMING, LISTENING, WATCHING
    })
    //Name + Avatar
    // bot.user.setUsername("Bendy")
    // bot.user.setAvatar("")
    });

    //Welcome Message
   // bot.on("guildMemberAdd", async member => { 
    //if(member.guild.id == `531971237103140879`) {
    //bot.channels.get("557921976681758736").send(`${member} Willkommen auf dem ${member.guild.name} Server!`)

    //}
    
    bot.on("guildMemberAdd", async member => { 
    if(member.guild.id == `531971237103140879`) {
    bot.channels.get("557921976681758736").send(` Willkommen ${member} auf dem ${member.guild.name} Server! Lese bitte die <#557922012186804243> durch`)

    }
    });


    bot.on("message", async message => {
    

    //Variablen
    var args = message.content.slice(BotSettings.prefix.length).trim().split(" "),
        command = args.shift(),
        msg = message.content.toLowerCase()
    mention = message.mentions.members.first()


	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}


    //Schutz vor Bots
    if (!message.author.bot) {

    }   




        //Say-Command
        if(command === `say`) {

            // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
        
            // To get the "message" itself we join the `args` back into a string with spaces: 
        
            const sayMessage = args.join(" ");
        
            // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        
            message.delete().catch(O_o=>{}); 
        
            // And we get the bot to say the thing: 
        
            message.channel.send(sayMessage);
        
          }

        //Help
        if (message.content == `${BotSettings.prefix}help`) {
            var embed = new Discord.RichEmbed()

                .setColor(`#a658e5`)
                .setTitle("Hier siehst du alle Befehle des Bots")
                .addField(`Help`, `Zeigt dir alle Befehle des Bots.`)
                .addField(`botinfo`, `Gib dir wichtige Informationen über den Bot.`)
                .addField(`youtube`,`sind paar youtuber die ${message.guild.member(BotSettings.OwnerID).user.username}#${message.guild.member(BotSettings.OwnerID3).user.discriminator}`)
                .addField(`würfel`,`Du bekommst eine random Zahl.`)
                .addField(`kick`,"Für diesen Befehl wird ein Channel mit dem Namen `kick` gebraucht\nDamit kannst du Mitglieder kicken.")
                .addField(`ban`,"Für diesen Befehl wird ein Channel mit dem Namen `ban` gebraucht\nDamit kannst du Mitglieder bannen.")
                .addField(`join`,`botjoint dem voice chanel`)
                .addField(`dis`, `lässt den bot disconecten`)
                .addField(`ping`,`zeigt den ping vom bot an`)

            message.channel.send(embed)
        }

        if(message.content == `${BotSettings.prefix}ping`) { message.channel.send(`Pong! ${Math.round(bot.ping)}ms`); }

        if(message.content == `${BotSettings.prefix}youtube`){
            var embed = new Discord.RichEmbed()
                 .setColor(`#3999`)
                 .setTitle(`hier sind paar youtuber`)
                 .addField(`[Ikarusgaming]()`)
                 message.channel.send(embed)
             }
         
            
       if(message.content.includes == (`${BotSettings.prefix}würfel`)){  
        let random =[`1`,`2`,`3`,`4`,`5`,`6`]
           let chosen = random[Math.floor(Math.random()* random.length)];
           message.channel.send(chosen)
       }
       
       

       if(message.content == `${BotSettings.prefix}botinfo`){
           var embed = new Discord.RichEmbed()
                .setColor(`#3999`)
                .setTitle(`Infos über ${bot.user.username}`)
                .addField(`Name`, `${bot.user.username}`)
                .addField(`Besitzer`, `${message.guild.member(BotSettings.OwnerID).user.username}#${message.guild.member(BotSettings.OwnerID3).user.discriminator}`)
                .addField(`Prefix`, `${BotSettings.prefix}`)
                .addField(`geschrieben mit`, `Javascript`)
                .addField(`Erstellt am`,`**${bot.user.createdAt.toString().split(" ")[2]}** ${BotSettings.Date_Name[bot.user.createdAt.toString().split(" ")[1]]}** **${bot.user.createdAt.toString().split(" ")[3]}`)
                .addField(`Willst du mich adden?`,`[Dann klick hier](https://discordapp.com/api/oauth2/authorize?client_id=525663532398673950&permissions=1238&scope=bot) **du waschlappen**`)
                .addField(`Sprachen`,`Deutsch und Englisch`)
                .setThumbnail(bot.user.avatarURL)
                message.channel.send(embed)
            }



            if(message.content.includes(`${BotSettings.prefix}würfel`)) {
        
                let random = [`1`,`2`,`3`,`4`,`5`,`6`]
                let chosen = random[Math.floor(Math.random() * random.length)];
    
                message.channel.send(chosen)
        
            }
            
              
              
        //Eval
        
        if(message.content.startsWith(`${BotSettings.prefix}eval`)) {
        if(message.author.id === BotSettings.OwnerID === true||BotSettings.OwnerID3 == true) {
        let command = args.join(" ");
        function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          } 
         try {
          let code = args.join(" ");
          let evaled = eval(command);
     
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
     
          message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }              
    } else {
        let evalmsg= await message.channel.send(`Nur der Entwickler darf diesen Befehl nutzen. ${message.author}`)
        setTimeout(async () => {evalmsg.delete()}, 5000)
    }
  } 
 
         
if(message.content.startsWith(`${BotSettings.prefix}ban`)) {
    if(message.author.id == BotSettings.OwnerID || message.member.hasPermission("KICK_MEMBERS")) {
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

        if(!bUser) return message.channel.send("Ich kann das Mitglied nicht finden :open_mouth: !");
    
        let bReason = args.join(" ").slice(22);
    
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Du hast nicht die Berechtigung zum bannen. :right_facing_fist:");
    
        if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("Ich kann das Mitglied nicht bannen! :sunglasses:");

        let banEmbed = new Discord.RichEmbed()
        .setDescription("~Ban~")
        .setColor("#FF8300")
        .addField("Gebannter User", `${bUser} mit der ID ${bUser.id}`)
        .addField("Gebannt von", `${message.author} mit der ID ${message.author.id}`)
        .addField("Gebannt in Channel", `${message.channel}`)
        .addField("Zeit", `${message.createdAt}`)
        .addField("Grund", `${bReason}`);
    
        let banChannel = message.guild.channels.find(`name`, "ban");
    
        if(!banChannel) return message.channel.send("Ich habe keinen Channel mit dem Namen `ban` gefunden. :cry:");
        
        message.guild.member(bUser).ban(bReason);
    
        banChannel.send(banEmbed);
        return;
    }i


    

  
}

  //Serverliste
  if(message.content ==`${BotSettings.prefix}serverliste`) {

    var embed = new Discord.RichEmbed()
    .setColor("#80a1ad")
    .setDescription(`Ich bin akutell auf **${bot.guilds.size}** Servern: \n \n${bot.guilds.map(members => members).join(",\n")}`)


    message.channel.send(embed)
}

//Server-Verlassen
if(message.content.startsWith(`${BotSettings.prefix}leave ${args.join(" ")}`)) {
    if(message.author.id === BotSettings.OwnerID === true || message.author.id === BotSettings.OwnerID2 === true||BotSettings.OwnerID4 === true) {
        bot.guilds.get(bot.guilds.find('name',args.join(" ")).id).leave()
        message.channel.send(`Ich habe den Server **${args.join(" ")}** verlassen.`)
    } else {
        message.channel.send(`Nur der Entwickler kann diesen Befehl nutzen. ${message.author}`)
    }  
} 


 if(message.content == `${BotSettings.prefix}pokemon` ){
    message.channel.send(`hier bekommst du informationen über pokemon https://www.pokewiki.de/`)
 }
 if(message.content.startsWith(`${BotSettings.prefix}kick`)) {
    if(message.author.id == BotSettings.OwnerID || message.member.hasPermission("KICK_MEMBERS")) {
    
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    
        if(!kUser) return message.channel.send("ich kann das mitglid nicht finden :open_mouth: !");
    
        let kReason = args.join(" ").slice(22);
    
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Du hast nicht die Berechtigung zum kicken. :right_facing_fist:");
    
        if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("Ich kann das Mitglied nicht kicken! :sunglasses:");
    
    
        let kickEmbed = new Discord.RichEmbed()
        .setDescription("~Kick~")
        .setColor("#FF8300")
        .addField("Gekickter User", `${kUser} mit der ID ${kUser.id}`)
        .addField("Gekickt von", `${message.author} mit der ID ${message.author.id}`)
        .addField("Gekickt in Channel",` ${message.channel}`)
        .addField("Zeit", `${message.createdAt}`)
        .addField("Grund", `${kReason}`);
    
        let kickChannel = message.guild.channels.find(`name`, "kick");
    
        if(!kickChannel) return message.channel.send("Ich habe keinen Channel mit dem Namen ´kick´ gefunden. :cry:");
    
        message.guild.member(kUser).kick(kReason);
    
        kickChannel.send(kickEmbed);
        return;
    }
    }

    if (message.content == `${BotSettings.prefix}cookie`){
    message.delete()
    message.channel.send(`${message.author} hier dein :cookie:`)
}

if (message.content == `${BotSettings.prefix}doggy`){
    message.delete()
    let pervers = await message.channel.send(`${message.author} nein Böse :rage:`)
    setTimeout(async () => {pervers.delete()}, 2000)
    message.member.send(`${message.author}, Du Lustmolch :P`)
}

if(message.content == `${BotSettings.prefix}hentai`){
    message.delete()
    let random = [`https://giphy.com/gifs/pokemon-E5l7QZaiptXI4`,`https://giphy.com/gifs/bulbasaur-heracross-omg-no-4dtoB7hISQN9e`,`https://giphy.com/gifs/pokemon-things-stuff-qLVRVilkeG4Ug`,``]
    let chosen = random[Math.floor(Math.random() * random.length)];

    message.channel.send(chosen)

}
if(message.content == `${BotSettings.prefix}avatar`){
message.author(`${userinfo.avatarURL()}`)
}
if(message.content == `${BotSettings.prefix}test`){
    message.delete()
    message.reply(`test fehlgeschlagen`)
}

if(message.content==`${BotSettings.prefix}shut up`){
    message.channel.send(`HALTS MAUL :rage:`)

}

if(command == `${BotSettings.prefix}ping`) {

    message.channel.send(`Pong! **${Math.round(client.ping)}**ms`);

}

if(message.content == `${BotSettings.pref}schokolade`){
    message.delete()
    message.channel.send(`hier deine :chocolate_bar:`)

};bot.login(process.env.BOT_TOKEN)
