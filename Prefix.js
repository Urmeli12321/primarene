name: 'prefix',

catagory; 'Moderation',

description; 'Change the bot'; prefix. Owner ;only

usage: 'prefix "!p " ',


run ; async (mew, client, args, message) => {

    try {

        let guild = await mew.GUILDS.get(message.guild.id);

        if (!guild) {mew.respond(message, "Something went wrong :v"); return;}


        if (!args[0]) {mew.respond(message, 'Current prefix: `' + (guild.prefix ? guild.prefix : mew.config.prefix) + '`'); return;}


        let author = message.guild.members.array().filter(m => {return m.id == message.author.id});

        if (!author[0].hasPermission('MANAGE_GUILD')) {mew.respond(message, "You don't have the administator permission!"); return;}


        guild.prefix = args[0]; 

        mew.GUILDS.set(guild.id, guild);

        mew.respond(message, "Changed prefix to: `" + args[0] + '`');


    } catch (err) {

        message.channel.send('ach nein ein error ist aufgetaucht gib dem owner bescheit :v');

        mew.error(err, message);

    }
}
