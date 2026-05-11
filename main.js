const { Client, GatewayIntentBits, EmbedBuilder, ChannelType, PermissionFlagsBits, Partials } = require("discord.js");
const BotSettings = require("./botsettings.json");

// Bot Client mit Intents erstellen
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
});

// Start-Up Event
bot.once("ready", async () => {
    console.log(`\nBot ist online.\nName + Tag: ${bot.user.username}#${bot.user.discriminator}\nPrefix: ${BotSettings.prefix}`);
    bot.user.setStatus("dnd"); // online, idle, dnd, invisible
    bot.user.setActivity(`${BotSettings.prefix}help mit maggi`, {
        type: "Playing", // Playing, Streaming, Listening, Watching
    });
});

// Welcome Message für neue Mitglieder
bot.on("guildMemberAdd", async (member) => {
    if (member.guild.id == `531971237103140879`) {
        const channel = member.guild.channels.cache.get("557921976681758736");
        if (channel) {
            channel.send(`Willkommen ${member} auf dem ${member.guild.name} Server! Lese bitte die <#557922012186804243> durch`);
        }
    }
});

// Message Handler
bot.on("messageCreate", async (message) => {
    // Ignoriere Bot-Nachrichten
    if (message.author.bot) return;

    // Prefix-Check
    if (!message.content.startsWith(BotSettings.prefix)) return;

    // Command und Args extrahieren
    const args = message.content.slice(BotSettings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // SAY Command
    if (command === "say") {
        const sayMessage = args.join(" ");
        if (!sayMessage) return message.reply("Bitte gib etwas ein zum Sagen!");

        await message.delete().catch(() => {});
        message.channel.send(sayMessage);
    }

    // HELP Command
    if (command === "help") {
        const embed = new EmbedBuilder()
            .setColor("#a658e5")
            .setTitle("Hier siehst du alle Befehle des Bots")
            .addFields(
                { name: "Help", value: "Zeigt dir alle Befehle des Bots." },
                { name: "botinfo", value: "Gib dir wichtige Informationen über den Bot." },
                { name: "youtube", value: "Paar YouYuber die ich empfehle" },
                { name: "würfel", value: "Du bekommst eine random Zahl." },
                { name: "kick", value: 'Für diesen Befehl wird ein Channel mit dem Namen "kick" gebraucht\nDamit kannst du Mitglieder kicken.' },
                { name: "ban", value: 'Für diesen Befehl wird ein Channel mit dem Namen "ban" gebraucht\nDamit kannst du Mitglieder bannen.' },
                { name: "join", value: "Bot joined dem Voice Channel" },
                { name: "disconnect", value: "Lässt den Bot disconnecten" },
                { name: "ping", value: "Zeigt den Ping vom Bot an" },
                { name: "pokemon", value: "Hier bekommst du Informationen über Pokemon" },
                { name: "cookie", value: "Hier dein Cookie :cookie:" },
                { name: "avatar", value: "Zeigt deinen Avatar" }
            );

        message.channel.send({ embeds: [embed] });
    }

    // PING Command
    if (command === "ping") {
        message.reply(`Pong! ${Math.round(bot.ws.ping)}ms`);
    }

    // YOUTUBE Command
    if (command === "youtube") {
        const embed = new EmbedBuilder()
            .setColor("#3999")
            .setTitle("Hier sind paar Youtuber")
            .addFields({ name: "Ikarusgaming", value: "[Kanal besuchen](https://www.youtube.com/@ikarusgaming)" });

        message.channel.send({ embeds: [embed] });
    }

    // WÜRFEL Command
    if (command === "würfel") {
        const random = ["1", "2", "3", "4", "5", "6"];
        const chosen = random[Math.floor(Math.random() * random.length)];
        message.channel.send(`🎲 Du hast eine **${chosen}** gewürfelt!`);
    }

    // BOTINFO Command
    if (command === "botinfo") {
        const createdAt = bot.user.createdAt;
        const embed = new EmbedBuilder()
            .setColor("#3999")
            .setTitle(`Infos über ${bot.user.username}`)
            .addFields(
                { name: "Name", value: bot.user.username },
                { name: "Besitzer", value: `<@${BotSettings.OwnerID}>` },
                { name: "Prefix", value: BotSettings.prefix },
                { name: "Geschrieben mit", value: "Javascript (discord.js v14)" },
                { name: "Erstellt am", value: createdAt.toLocaleDateString("de-DE") },
                { name: "Willst du mich adden?", value: "[Dann klick hier](https://discordapp.com/api/oauth2/authorize?client_id=525663532398673950&permissions=1238&scope=bot)" },
                { name: "Sprachen", value: "Deutsch und Englisch" }
            )
            .setThumbnail(bot.user.displayAvatarURL());

        message.channel.send({ embeds: [embed] });
    }

    // EVAL Command (nur für Owner)
    if (command === "eval") {
        if (message.author.id !== BotSettings.OwnerID && message.author.id !== BotSettings.OwnerID2 && message.author.id !== BotSettings.OwnerID3) {
            const evalmsg = await message.channel.send(`Nur der Entwickler darf diesen Befehl nutzen. ${message.author}`);
            setTimeout(async () => {
                await evalmsg.delete().catch(() => {});
            }, 5000);
            return;
        }

        const code = args.join(" ");

        function clean(text) {
            if (typeof text === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }

        try {
            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            message.channel.send("```xl\n" + clean(evaled) + "\n```");
        } catch (err) {
            message.channel.send("`ERROR` ```xl\n" + clean(err) + "\n```");
        }
    }

    // BAN Command
    if (command === "ban") {
        if (message.author.id !== BotSettings.OwnerID && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("Du hast nicht die Berechtigung zum Bannen.");
        }

        const bUser = message.mentions.members.first() || (await message.guild.members.fetch(args[0]).catch(() => null));

        if (!bUser) return message.reply("Ich kann das Mitglied nicht finden! :open_mouth:");

        const bReason = args.slice(1).join(" ") || "Kein Grund angegeben";

        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("Du hast nicht die Berechtigung zum Bannen!");
        }

        if (bUser.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("Ich kann das Mitglied nicht bannen! :sunglasses:");
        }

        const banEmbed = new EmbedBuilder()
            .setDescription("~Ban~")
            .setColor("#FF8300")
            .addFields(
                { name: "Gebannter User", value: `${bUser} mit der ID ${bUser.id}` },
                { name: "Gebannt von", value: `${message.author} mit der ID ${message.author.id}` },
                { name: "Gebannt in Channel", value: `${message.channel}` },
                { name: "Zeit", value: new Date().toLocaleString("de-DE") },
                { name: "Grund", value: bReason }
            );

        const banChannel = message.guild.channels.cache.find((ch) => ch.name === "ban" && ch.type === ChannelType.GuildText);

        if (!banChannel) return message.reply("Ich habe keinen Channel mit dem Namen `ban` gefunden!");

        await bUser.ban({ reason: bReason }).catch((err) => {
            message.reply("Fehler beim Bannen: " + err.message);
        });

        banChannel.send({ embeds: [banEmbed] });
    }

    // KICK Command
    if (command === "kick") {
        if (message.author.id !== BotSettings.OwnerID && !message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply("Du hast nicht die Berechtigung zum Kicken.");
        }

        const kUser = message.mentions.members.first() || (await message.guild.members.fetch(args[0]).catch(() => null));

        if (!kUser) return message.reply("Ich kann das Mitglied nicht finden! :open_mouth:");

        const kReason = args.slice(1).join(" ") || "Kein Grund angegeben";

        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply("Du hast nicht die Berechtigung zum Kicken!");
        }

        if (kUser.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply("Ich kann das Mitglied nicht kicken! :sunglasses:");
        }

        const kickEmbed = new EmbedBuilder()
            .setDescription("~Kick~")
            .setColor("#FF8300")
            .addFields(
                { name: "Gekickter User", value: `${kUser} mit der ID ${kUser.id}` },
                { name: "Gekickt von", value: `${message.author} mit der ID ${message.author.id}` },
                { name: "Gekickt in Channel", value: `${message.channel}` },
                { name: "Zeit", value: new Date().toLocaleString("de-DE") },
                { name: "Grund", value: kReason }
            );

        const kickChannel = message.guild.channels.cache.find((ch) => ch.name === "kick" && ch.type === ChannelType.GuildText);

        if (!kickChannel) return message.reply("Ich habe keinen Channel mit dem Namen `kick` gefunden!");

        await kUser.kick(kReason).catch((err) => {
            message.reply("Fehler beim Kicken: " + err.message);
        });

        kickChannel.send({ embeds: [kickEmbed] });
    }

    // SERVERLISTE Command
    if (command === "serverliste") {
        const serverList = bot.guilds.cache.map((guild) => guild.name).join(", ");
        const embed = new EmbedBuilder()
            .setColor("#80a1ad")
            .setDescription(`Ich bin aktuell auf **${bot.guilds.cache.size}** Servern: \n \n${serverList}`);

        message.channel.send({ embeds: [embed] });
    }

    // LEAVE Command (nur für Owner)
    if (command === "leave") {
        if (message.author.id !== BotSettings.OwnerID && message.author.id !== BotSettings.OwnerID2) {
            return message.reply("Nur der Entwickler kann diesen Befehl nutzen.");
        }

        const guildName = args.join(" ");
        const guild = bot.guilds.cache.find((g) => g.name === guildName);

        if (!guild) return message.reply("Ich konnte diesen Server nicht finden!");

        await guild.leave();
        message.channel.send(`Ich habe den Server **${guildName}** verlassen.`);
    }

    // POKEMON Command
    if (command === "pokemon") {
        message.channel.send("Hier bekommst du Informationen über Pokemon: https://www.pokewiki.de/");
    }

    // COOKIE Command
    if (command === "cookie") {
        await message.delete().catch(() => {});
        message.channel.send(`${message.author} hier dein :cookie:`);
    }

    // DOGGY Command
    if (command === "doggy") {
        await message.delete().catch(() => {});
        const pervers = await message.channel.send(`${message.author} nein Böse :rage:`);
        setTimeout(async () => {
            await pervers.delete().catch(() => {});
        }, 2000);
        await message.author.send(`${message.author}, Du Lustmolch :P`).catch(() => {});
    }

    // HENTAI Command
    if (command === "hentai") {
        await message.delete().catch(() => {});
        const random = [
            "https://giphy.com/gifs/pokemon-E5l7QZaiptXI4",
            "https://giphy.com/gifs/bulbasaur-heracross-omg-no-4dtoB7hISQN9e",
            "https://giphy.com/gifs/pokemon-things-stuff-qLVRVilkeG4Ug",
        ];
        const chosen = random[Math.floor(Math.random() * random.length)];
        message.channel.send(chosen);
    }

    // AVATAR Command
    if (command === "avatar") {
        const user = message.mentions.users.first() || message.author;
        message.channel.send(user.displayAvatarURL({ size: 1024, dynamic: true }));
    }

    // TEST Command
    if (command === "test") {
        await message.delete().catch(() => {});
        message.reply("Test fehlgeschlagen");
    }

    // SHUT UP Command
    if (message.content.toLowerCase().includes(`${BotSettings.prefix}shut up`)) {
        message.channel.send("HALTS MAUL :rage:");
    }

    // SCHOKOLADE Command
    if (command === "schokolade") {
        await message.delete().catch(() => {});
        message.channel.send("Hier deine :chocolate_bar:");
    }

    // HALLO Command
    if (command === "hallo") {
        message.reply("Hallo!");
    }
});

// Bot Login
bot.login(process.env.BOT_TOKEN);
