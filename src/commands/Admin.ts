import { CommandInteraction, ApplicationCommandType } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
import console from "../Console"
const fs = require('fs');


//! OLD
//! marche plu
export const admin: Command = {
    name: "admin",  
    description: "help command",
    type: ApplicationCommandType.ChatInput,
    dmPermission:true,
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            if(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id) == undefined){
                interaction.reply({ephemeral:true,content:"\\💣		ecrivez un message dans n'importe quel salon du serveur visible par le bot puis refaite votre commande"});
                return;
            }

            if(client.check_perm(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id))){
                var msg = "\\💣		une erreur inconnu est survenue (sad \\😢)"
                var member = client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id);
                switch (interaction.options[0].name){
                case "init":
                    var salon_role = {
                        vocal_role:{},
                        gif:{"test":"https://media.discordapp.net/attachments/374326170826833937/852145291683692595/1280px-Philips_PM5544.png?width=935&height=701"}
                    };
                    var data = JSON.stringify(salon_role);
                    fs.writeFileSync("guild_sto/"+interaction.guild.id+'.json', data);
                    msg = "\\✅		bot initialiser sur le serveur (nrml)"

                break;
                case "link":
                    var salonID =  member.voice.channelId;
                    if (salonID == null) { msg ='\\⛔		vous devez etre dans un salon vocal';
                    }else{
                        switch (interaction.options[0].options[0].name){
                        case "add":
                                var roleID = Object.keys(interaction.options.get(""))[0];

                                var rawdata = fs.readFileSync("guild_sto/"+interaction.guild.id+'.json');
                                var guild_sto = JSON.parse(rawdata);

                                guild_sto.vocal_role[salonID] = roleID;

                                var data = JSON.stringify(guild_sto);
                                
                                fs.writeFileSync("guild_sto/"+interaction.guild.id+'.json', data);
                                msg = '\\✅		salon link avec le role (nrml)';

                        break;
                        case "del":
                            var rawdata = fs.readFileSync("guild_sto/"+interaction.guild.id+'.json');
                            var guild_sto = JSON.parse(rawdata);

                            member.roles.remove(guild_sto.vocal_role[salonID]);
                            delete guild_sto.guild_sto[salonID]

                            var data = JSON.stringify(guild_sto);
                            fs.writeFileSync("guild_sto/"+interaction.guild.id+'.json', data);
                            msg = '\\✅		salon unllink (nrml)';

                        break;
                        }
                    }

                break;
                case "globallink":
                    switch(interaction.options[0].options[0].name){
                        case "add":
                            var roleID = Object.keys(interaction.options.get(""))[0];
                            var rawdata = fs.readFileSync("guild_sto/"+interaction.guild.id+'.json');
                            var guild_sto = JSON.parse(rawdata);

                            guild_sto.vocal_role["global"] = roleID;

                            var data = JSON.stringify(guild_sto);
                            fs.writeFileSync("guild_sto/"+interaction.guild.id+'.json', data);
                            msg = '\\✅		role global link (nrml)';
                        break;
                        case "del":
                            var rawdata = fs.readFileSync("guild_sto/"+interaction.guild.id+'.json');
                            var guild_sto = JSON.parse(rawdata);

                            guild_sto.vocal_role["global"] = undefined;

                            var data = JSON.stringify(guild_sto);
                            fs.writeFileSync("guild_sto/"+interaction.guild.id+'.json', data);
                            msg = '\\✅		role global unlink (nrml)';
                        break;
                    }
                break;
                }
                interaction.reply({ephemeral:true,content:msg});
            }else{
                interaction.reply({ephemeral:true,content:"\\⛔		vous n'avez pas les droits pour faire cette commande rip"});
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 