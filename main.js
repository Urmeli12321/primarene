const Discord = require("discord.js")
const YTDL = require("ytdl-core")
const commando = require("discord.js-commando")
const Manager = new Discord.ShardingManager('./main.js');
const yt = require("ytdl-core")
const bot = new Discord.Client()
const BotSettings = require("./botsettings.json")

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
    //if(member.guild.id == `485534412436406302`) {
    //bot.channels.get("485534412436406304").send(`${member} Willkommen auf dem ${member.guild.name} Server!`)

    //}
    bot.on("guildMemberAdd", async member => { 
    if(member.guild.id == `512666774693609478`) {
    bot.channels.get("512704895929942026").send(` Willkommen ${member} auf dem ${member.guild.name} Server!`)

    }
    });


    bot.on("message", async message => {
    

    //Variablen
    var args = message.content.slice(BotSettings.prefix.length).trim().split(" "),
        command = args.shift(),
        msg = message.content.toLowerCase()
    mention = message.mentions.members.first()





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

            message.channel.send(embed)
        }

        if(message.content == `${BotSettings.prefix}ping`) { message.channel.send(`Pong! ${Math.round(bot.ping)}ms`); }

        if(message.content == `${BotSettings.prefix}youtube`){
            var embed = new Discord.RichEmbed()
                 .setColor(`#3999`)
                 .setTitle(`hier sind paar youtuber`)
                 .addField(`[Ikarusgaming](https://discordapp.com/oauth2/authorize?client_id=476020363730485248&permissions=8&scope=bot)`)
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
                .addField(`Willst du mich adden?`,`[Dann klick hier](https://discordapp.com/api/oauth2/authorize?client_id=525663532398673950&permissions=8&scope=bothttps://discordapp.com/api/oauth2/authorize?client_id=525663532398673950&permissions=8&scope=bothttps://discordapp.com/api/oauth2/authorize?client_id=525663532398673950&permissions=8&scope=botv)`)
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
    if(message.author.id == BotSettings.OwnerID3 || message.member.hasPermission("KICK_MEMBERS")) {
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
    }


    

  
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

if(message.content == `${BotSettings.prefix}join`) {
    return new Promise((resolve, reject) => {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
        voiceChannel.join().then(connection => resolve(connection) + message.reply(`Ich bin ${voiceChannel.name} beigetreten!`)).catch(err => reject(err));

    });
}

if(message.content == `${BotSettings.prefix}play`){
    const voiceChannel = message.member.voiceChannel
    voiceChannel.join()
          .then(connection => {
            const stream = yt({filter : 'audioonly'} );
            broadcast.playStream(stream);
            const dispatcher = connection.playBroadcast();
          })
          .catch(console.error); 
}

if(message.content == `${BotSettings.prefix}dis`){
    return new Promise((resolve, reject) =>{
    const voiceChannel = message.member.voiceChannel
    if(!voiceChannel || voiceChannel.type !== 'voice') return message.reply(`Ich kann nicht disconecten weil du nicht in dem voice channel bist...`);
    voiceChannel.leave().then(connection => resolve(connection)+ massge.reply(`Ich habe ${voiceChannel.name}verlassen`))
    })
    
}
if(message.content == `${BotSettings.prefix}hentai`){
    message.delete()
    let random = [`https://giphy.com/gifs/pokemon-E5l7QZaiptXI4`,`https://giphy.com/gifs/bulbasaur-heracross-omg-no-4dtoB7hISQN9e`]
    let chosen = random[Math.floor(Math.random() * random.length)];

    message.channel.send(chosen)

}
});bot.login(BOT_TOKEN)
