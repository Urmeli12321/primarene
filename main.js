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
                .setTitle("Hier sehest du alle befele des Bot´s")
                .addField(`help`, `zeigt dir alle befehle`)
                .addField(`bot-info`, `Gib dir wichtige informationen`)
                .addField(`youtube`,`sind paar youtuber die ${message.guild.member(BotSettings.OwnerID3).user.username}#${message.guild.member(BotSettings.OwnerID3).user.discriminator}`)
                .addField(`katja`,`macht das was du denkt`)
                .addField(`Doggy`,`ist böse`)
                .addField(`würfel`,`bekommst eine random zahl`)
        

            message.channel.send(embed)
        }

        if (message.content == `${BotSettings.prefix}invite`) {
            message.channel.send(`Add mich! \nhttps://discordapp.com/api/oauth2/authorize?client_id=476020363730485248&permissions=8&scope=bot`)
        }

        if (message.content.startsWith(BotSettings.prefix + 'ping')) {
            message.channel.sendMessage('Pong! dein ping ist `' + `${Date.now() , message.createdTimestamp}` + ' ms`');
        }

        if (message.content == `${BotSettings.prefix}Dev server`) {
            message.channel.send(`ihr ist der öffntliche developer server https://discord.gg/ewAD8up`)
        }
        if(message.content == `${BotSettings.prefix}youtube`) {
            message.delete()
            message.send(`hier sind paar youtuber 
            Ikarusgaming: https://www.youtube.com/channel/UCXrygbhW6lPDFSs202bl9og`)

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

       if(message.content == `${BotSettings.prefix}katja`){
        message.delete()   
        message.send(`lustmolch`)

       }

       if(message.content == `${BotSettings.prefix}bot-info`){
           var embed = new Discord.RichEmbed()
           .setColor(`#31762c`)
                .setTitle(`infos über ${bot.user.username}`)
                .addField(`Name`, `${bot.user.username}`)
                .addField(`Besitzer`, `${message.guild.member(BotSettings.OwnerID3).user.username}#${message.guild.member(BotSettings.OwnerID3).user.discriminator}`)
                .addField(`prefix`, `${BotSettings.prefix}`)
                .addField(`Geschriben mit`, `discord.js 11.4.2`)
                .addField(`erstellt am`, `01.09.2018`)
                .addField(`willst du mich adden ?`,`https://discordapp.com/oauth2/authorize?client_id=476020363730485248&permissions=8&scope=bot`)
               
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
              

                  
              if(command == "ban") {

                // Most of this command is identical to kick, except that here we'll only let admins do it.
            
                // In the real world mods could ban too, but this is just an example, right? ;)
            
                if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
            
                  return message.reply("Sorry, you don't have permissions to use this!");
            
                
            
                let member = message.mentions.members.first();
            
                if(!member)
            
                  return message.reply("Please mention a valid member of this server");
            
                if(!member.bannable) 
            
                  return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
            
            
            
                let reason = args.slice(1).join(' ');
            
                if(!reason) reason = "No reason provided";
            
                
            
                await member.ban(reason)
            
                  .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
            
                message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
            
              }

});


bot.login(BotSettings.token)