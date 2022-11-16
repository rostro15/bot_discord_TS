import { CommandInteraction, ApplicationCommandType } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
import console from "../Console"

export const add_call_button: Command = {
    name: "add_call_button",  
    description: "crée un boutton pour faire des calls dans le channel",
    type: ApplicationCommandType.ChatInput,
    dmPermission:false,
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {


            if(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id) == undefined){
                interaction.reply({ephemeral:true,content:"\\💣		ecrivez un message dans n'importe quel salon du serveur visible par le bot puis refaite votre commande"});
                return;
            }

            if(!client.check_perm(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id))){
                interaction.reply({ephemeral:true,content:"\\⛔		vous n'avez pas les droits pour faire cette commande rip"});
            }
            await interaction.reply({
                content:"pour creer un call cliquer sur le bouton",
                components:[{
                    "type": 1,
                    
                    "components":[{
                        "type": 2,
                        "style": 3,
                        "label":"CALL",
                        "emoji":{
                            "id": null,
                            "name":"👍"
                        },
                        "custom_id": "create_call_button"
                    },
                    ],
                }],
                fetchReply:true
            })


        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 