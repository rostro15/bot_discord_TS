import { CommandInteraction, ApplicationCommandType, GuildMember } from "discord.js";
import customClient from "../../Client";
import { Command } from "../../Command";
import console from "../../Console"

export const Brotransform: Command = {
    name: "brotransform",
    description: "Transforme le membre en un véritable bro",
    type: ApplicationCommandType.ChatInput,
    dmPermission:true,
    options:[{
            "type": 6,
            "name": "bro",
            "description": "le nouveau bro",
            "required": true
        }],
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            var member = interaction.options.getMember("bro") as GuildMember
            var role = await interaction.guild.roles.fetch("1042070248758722570");
            if(role == null){
                interaction.reply({ephemeral:true,content:"\\💣		une erreur a eu lieu"}); 
                return;
            } 
            member.roles.add(role)
            interaction.reply({ephemeral:false, content: member.toString()+" est maintenant un turbo bro"});
        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 