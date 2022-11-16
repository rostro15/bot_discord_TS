import { CommandInteraction, ApplicationCommandType } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
const fs = require('fs');
import console from "../Console"


//! OLD
//! marche pas
export const gifmanager: Command = {
    name: "gifmangaer",  
    description: "ajoute ou modifie les gif",
    type: ApplicationCommandType.ChatInput,
    dmPermission:false,
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            if(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id) == undefined){
                interaction.reply({ephemeral:true,content:"\\💣		ecrivez un message dans n'importe quel salon du serveur visible par le bot puis refaite votre commande"});
                return;
            }

            if(client.check_perm(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id))){

                var rawdata = fs.readFileSync("guild_sto/"+interaction.guild.id+'.json');
                var sto = JSON.parse(rawdata);
                var mot_clef = interaction.options[1].value.toLowerCase()
                switch (interaction.options[0].value){
                case "add":

                sto.gif[mot_clef] = interaction.options[2].value;
                
                interaction.reply({ephemeral:true,content:"\\✅		gif bien ajouté"});

                break;
                case "del":
                    delete sto.gif[mot_clef];
                    
                    interaction.reply({ephemeral:true,content:"\\✅		gif bien suprimer"});
                break;
                }
                var data = JSON.stringify(sto);
                fs.writeFileSync("guild_sto/"+interaction.guild.id+'.json', data);

            }else{
                interaction.reply({ephemeral:true,content:"\\⛔		vous n'avez pas les droits pour faire cette commande rip"});
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 