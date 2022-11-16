import { CommandInteraction, ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
import console from "../Console"

export const Call: Command = {
    name: "call",  
    description: "commande pour crée un appelle",
    type: ApplicationCommandType.ChatInput,
    dmPermission:false,
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            const modal = new ModalBuilder().setTitle("test").setCustomId("oskoyr");

            const modalTextInput = new TextInputBuilder().setCustomId("call_name").setLabel("Nom du call").setStyle(TextInputStyle.Short);
            const modalTextInput_max = new TextInputBuilder().setCustomId("call_max").setLabel("Nombre de place").setStyle(TextInputStyle.Short).setRequired(false).setValue("5");
        
        
            const rows = new ActionRowBuilder().addComponents(modalTextInput) as ActionRowBuilder<TextInputBuilder>;
            modal.addComponents(rows)
            const rows_max = new ActionRowBuilder().addComponents(modalTextInput_max) as ActionRowBuilder<TextInputBuilder>;
            modal.addComponents(rows_max)
            
            await interaction.showModal(modal);
        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 