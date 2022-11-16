import { CommandInteraction, ApplicationCommandType, GuildMember } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
import console from "../Console"

export const modifycall: Command = {
    name: "modifycall",  
    description: "modifie un /call",
    type: ApplicationCommandType.ChatInput,
    dmPermission:false,
	options: [
		{
			"type": 3,
			"name": "action",
			"description": "action a realiser",
			"required": true,
			"choices": [
				{
					"name": "add",
					"value": "add"
				},
				{
					"name": "del",
					"value": "del"
				}
			]
		},
		{
			"type": 3,
			"name": "messageid",
			"description": "ID du message call a modifier",
			"required": true,
			"autocomplete": true
		},
		{
			"type": 6,
			"name": "user",
			"description": "utilisateur à add/del",
			"required": true
		}
	],
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            
            var member = interaction.options.getMember("user") as GuildMember;
					var members_ID = member.user.id 
					
					if(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id) == undefined){

						interaction.reply({ephemeral:true,content:"\\💣		ecrivez un message dans n'importe quel salon du serveur visible par le bot puis refaite votre commande"});
						return;
					}

					if(!client.check_perm(client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id))){

						interaction.reply({ephemeral:true,content:"\\⛔		vous n'avez pas les droits pour faire cette commande rip"});
						return;
					};

					var mess_relpy_ID = interaction.options.get("messageid").value as string

					if(client.call_list[mess_relpy_ID] == undefined ){
						interaction.reply({ephemeral:true,content:"\\💣		l'ID de message ne corespond pas a un call"});
						return;
					}


					client.users.fetch(members_ID)
					.then(function(members_a_mod){

						if(interaction.options.get("action").value=="add"){
						
							if (client.call_list[mess_relpy_ID].max == 0){
								client.myem.emit(mess_relpy_ID, "join", members_a_mod )
							}else{
								client.myem.emit(mess_relpy_ID, "join", members_a_mod )								
							}
						}else{
							if (client.call_list[mess_relpy_ID].max == 0){
								client.myem.emit(mess_relpy_ID, "leave", members_a_mod )	
							}else{
								client.myem.emit(mess_relpy_ID, "leave", members_a_mod )	
							}
			
						}

					});

					
					interaction.reply({ephemeral:true,content:"\\✅		call bien modifier (nrml)"});


        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 