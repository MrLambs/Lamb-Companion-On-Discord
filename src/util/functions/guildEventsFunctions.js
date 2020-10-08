const fetchOsrsRoles = async message => {
    let roles;
    //generic roles
    const a = message.guild.roles.cache.get('709459016635383868'); //Pkers
    const b = message.guild.roles.cache.get('711824063550586930') //Raiders
    const c = message.guild.roles.cache.get('709459260576366653'); //Revs
    const d = message.guild.roles.cache.get('709459309041418372'); //Bossing Teams
    const e = message.guild.roles.cache.get('709459360174178385'); //Bossing FFA
    const f = message.guild.roles.cache.get('709460624366764102'); //Live Streams
    const g = message.guild.roles.cache.get('709459452969091102'); //Nubs   
    //specific roles
    const arma = message.guild.roles.cache.get('717826926215168062'); //Armadyl
    const bandos = message.guild.roles.cache.get('717827078757548184') //Bandos
    const sara = message.guild.roles.cache.get('717827172735123539'); //Saradomin
    const zammy = message.guild.roles.cache.get('717827276489883748'); //Zamorak
    const callisto = message.guild.roles.cache.get('717827509609037876'); //Callisto
    const kbd = message.guild.roles.cache.get('717827595948916808'); //King Black Dragon
    const venenatis = message.guild.roles.cache.get('717827674734592140'); //Venenatis
    const vetion = message.guild.roles.cache.get('717827758293778492'); //Vetion 
    const wintertodt = message.guild.roles.cache.get('717827884533678201'); //Wintertodt 
    const zalcano = message.guild.roles.cache.get('717827966419075206'); //Zalcano  
    const dks = message.guild.roles.cache.get('717828045171326977'); //Dagannoth Kings   
    const scorpia = message.guild.roles.cache.get('717828131968516137'); //Scorpia  
    const chaosFan = message.guild.roles.cache.get('717828300386467941'); //Chaos Fanatic  
    const kq = message.guild.roles.cache.get('717828374420258926'); //Kalphite Queen 
    const mole = message.guild.roles.cache.get('717828472717967470'); //Giant Mole
    const corp = message.guild.roles.cache.get('717828569467977728'); //Corporeal Beast 

    return roles = {
        genericRoles: {
            pkers: a,
            raiders: b,
            revs: c,
            bossingTeams: d,
            bossingFFA: e,
            liveStreams: f,
            nubs: g
        },
        specificRoles: {
            arma,
            bandos,
            sara,
            zammy,
            callisto,
            kbd,
            venenatis,
            vetion,
            wintertodt,
            zalcano,
            dks,
            scorpia,
            chaosFan,
            kq,
            mole,
            corp
        }
    }
};

const determineRoleToAdd = (member, message, emoji, roles) => {
    if (message.id === '711827068559818782') {
        switch (emoji) {
            case '🇦':
                member.then(async mem => {
                    await mem.roles.add(roles.genericRoles.a);
                    message.channel.send(`${mem}, you have been added to the **${roles.genericRoles.a.name}** role!`).then(m => m.delete({ timeout: 5000 }))
                })
                break;
            case '🇧':
                member.then(async mem => {
                    await mem.roles.add(roles.genericRoles.b);
                    message.channel.send(`${mem}, you have been added to the **${roles.genericRoles.b.name}** role!`).then(m => m.delete({ timeout: 5000 }))
                })
                break;
            case '🇨':
                member.then(async mem => {
                    await mem.roles.add(roles.genericRoles.c);
                    message.channel.send(`${mem}, you have been added to the **${roles.genericRoles.c.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case '🇩':
                member.then(async mem => {
                    await mem.roles.add(roles.genericRoles.d);
                    message.channel.send(`${mem}, you have been added to the **${roles.genericRoles.d.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case '🇪':
                member.then(async mem => {
                    await mem.roles.add(roles.genericRoles.e);
                    message.channel.send(`${mem}, you have been added to the **${roles.genericRoles.e.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case '🇫':
                member.then(async mem => {
                    await mem.roles.add(roles.genericRoles.f);
                    message.channel.send(`${mem}, you have been added to the **${roles.genericRoles.f.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case '🇬':
                member.then(async mem => {
                    await mem.roles.add(roles.genericRoles.g);
                    message.channel.send(`${mem}, you have been added to the **${roles.genericRoles.g.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
        }
    } else if (message.id === '717853329656643584') {
        switch (emoji) {
            case 'Kreearra':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.arma);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.arma.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'GeneralGraardor':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.bandos);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.bandos.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'CommanderZilyana':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.sara);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.sara.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'KrilTsutsaroth':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.zammy);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.zammy.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'Callisto':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.callisto);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.callisto.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'KingBlackDragon':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.kbd);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.kbd.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'Venenatis':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.venenatis);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.venenatis.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'Vetion':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.vetion);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.vetion.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'Wintertodt':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.wintertodt);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.wintertodt.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'Zalcano':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.zalcano);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.zalcano.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'DagannothSupreme':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.dks);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.dks.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'Scorpia':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.scorpia);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.scorpia.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'ChaosFanatic':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.chaosFan);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.chaosFan.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'KalphiteQueen':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.kq);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.kq.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'GiantMole':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.mole);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.mole.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
            case 'CorporealBeast':
                member.then(async mem => {
                    await mem.roles.add(roles.specificRoles.corp);
                    message.channel.send(`${mem}, you have been added to the **${roles.specificRoles.corp.name}** role!`).then(m => m.delete({ timeout: 5000 })
                    )
                })
                break;
        }
    }
}

export {
    fetchOsrsRoles,
    determineRoleToAdd
}