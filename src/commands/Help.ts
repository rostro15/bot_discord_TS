import { CommandInteraction, ApplicationCommandType } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
import HelpObj from "../Help.js";
import console from "../Console"

export const Help: Command = {
    name: "help",  
    description: "help command",
    type: ApplicationCommandType.ChatInput,
    dmPermission:true,
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            new HelpObj(client,interaction)
        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 