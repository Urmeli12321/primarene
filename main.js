const Discord = require("discord.js"),
    bot = new Discord.Client(),
    BotSettings = require("./botsettings.json")

        //Start-Up
        bot.on("ready", async () => {

    console.log(`\nBot ist online.\nName + Tag: ${bot.user.username}#${bot.user.discriminator}\nPrefix: ${BotSettings.prefix}`)
    bot.user.setStatus("dnd")//online, idle, dnd, invisible
    bot.user.setActivity(`${BotSettings.prefix}help mit magi`, {

        type: "PLAYING" //PLAYING, STREAMING, LISTENING, WATCHING
    })
    //Name + Avatar
    // bot.user.setUsername("Bendy")
    // bot.user.setAvatar("")
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
        if (command == "say") {
            if (message.author.id == BotSettings.OwnerID || BotSettings.OwnerID2 || BotSettings.OwnerID3) {
                var Say = args.join(" ")
                if (Say) {
                    message.channel.send(Say)
                } else {
                    message.channel.send(`Was soll ich bitte sagen? ${message.author}`)
                }
            } else {
                message.channel.send(`Nur der Bot-Owner kann diesen Command nutzen. ${message.author}`)


             message.delete()
            }
        
        }

        //Help
        if (message.content == `${BotSettings.prefix}help`) {
            var embed = new Discord.RichEmbed()

                .setColor(`#a658e5 `)
                .setTitle("Hier siehst du alle Befehle des Bots")
                .addField(`Help`, `Zeigt dir alle Befehle des Bots.`)
                .addField(`botinfo`, `Gib dir wichtige Informationen über den Bot.`)
                .addField(`youtube`,`sind paar youtuber die ${message.guild.member(BotSettings.OwnerID3).user.username}#${message.guild.member(BotSettings.OwnerID3).user.discriminator}`)
                .addField(`Doggy`,`Ist böse`)
                .addField(`würfel`,`Du bekommst eine random Zahl.`)
                .addField(`kick`,"Für diesen Befehl wird ein Channel mit dem Namen `kick` gebraucht\nDamit kannst du Mitglieder kicken.")
                .addField(`ban`,"Für diesen Befehl wird ein Channel mit dem Namen `ban` gebraucht\nDamit kannst du Mitglieder bannen.")

        

            message.channel.send(embed)
        }

        if (message.content.startsWith(BotSettings.prefix + 'ping')) {
            message.channel.sendMessage('Pong! dein ping ist `' + `${Date.now() , message.createdTimestamp}` + ' ms`');
        }

        
        if(message.content == `${BotSettings.prefix}youtube`) {
            message.delete()
            message.send(`Hier sind ein paar Youtuber: \nIkarusgaming: https://www.youtube.com/channel/UCXrygbhW6lPDFSs202bl9og`)

        }
         
            
       if(message.content.includes == (`${BotSettings.prefix}würfel`)){
           let random =[`1`,`2`,`3`,`4`,`5`,`6`]
           let chosen = random[Math.floor(Math.random()* random.length)];
           message.channel.send(chosen)
       }
       
       if(message.content == `${BotSettings.prefix}doggy`){
           message.delete()
           message.send(`nein Böse :rage:`)

       }

       if(message.content == `${BotSettings.prefix}botinfo`){
           var embed = new Discord.RichEmbed()
           .setColor(`#31762c`)
                .setTitle(`Infos über ${bot.user.username}`)
                .addField(`Name`, `${bot.user.username}`)
                .addField(`Besitzer`, `${message.guild.member(BotSettings.OwnerID3).user.username}#${message.guild.member(BotSettings.OwnerID3).user.discriminator}`)
                .addField(`Prefix`, `${BotSettings.prefix}`)
                .addField(`Geschrieben mit`, `discord.js 11.4.2`)
                .addField(`Erstellt am`,`${bot.user.createdAt}`)
                .addField(`Willst du mich adden?`,`Nutze diesen Link: \nhttps://discordapp.com/oauth2/authorize?client_id=476020363730485248&permissions=8&scope=bot`)
               .addField(`Sprachen`,`Deutsch und Englisch`)
                message.channel.send(embed)
            }

            if(command === `${BotSettings.prefix}ping`) {

                // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            
                // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            
                const m = await message.channel.send(`Ping`);
            
                m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
            }

            if(message.content.includes(`${BotSettings.prefix}würfel`)) {
        
                let random = [`1`,`2`,`3`,`4`,`5`,`6`]
                let chosen = random[Math.floor(Math.random() * random.length)];
    
                message.channel.send(chosen)
        
            }
            
              
              
    //Eval
    if(message.content.startsWith(`${BotSettings.prefix}eval`)) {
     if(message.author.id === BotSettings.OwnerID === true || message.author.id === BotSettings.OwnerID3 === true) {
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
    .addField("Gekickt in Channel", message.channel)
    .addField("Zeit", message.createdAt)
    .addField("Grund", kReason);

    let kickChannel = message.guild.channels.find(`name`, "kick");

    if(!kickChannel) return message.channel.send("Ich habe keinen Channel mit dem Namen ´kick´ gefunden. :cry:");

    message.guild.member(kUser).kick(kReason);

    kickChannel.send(kickEmbed);
    return;

}
          
if(message.content.startsWith(`${BotSettings.prefix}ban`)) {


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
    .addField("Gebannt in Channel", message.channel)
    .addField("Zeit", message.createdAt)
    .addField("Grund", bReason);

    let banChannel = message.guild.channels.find(`name`, "ban");

    if(!banChannel) return message.channel.send("Ich habe keinen Channel mit dem Namen `ban` gefunden. :cry:");

    message.guild.member(bUser).ban(bReason);

    banChannel.send(banEmbed);
    return;

}



});


bot.login(process.env.BOT_TOKEN)
