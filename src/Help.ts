import { ActionRow, ActionRowBuilder, ActionRowComponent, ActionRowData, ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, CommandInteraction, Component, ComponentBuilder, createComponent, EmbedBuilder, InteractionReplyOptions } from "discord.js";
import EventEmitter = require("events");
import customClient from "./Client";
const fs = require('fs');

export default class Help{
	component:any[];
	client:customClient;
	em:EventEmitter;
	id:string;
	messID:string;

	constructor(client:customClient, interaction:CommandInteraction){

		this.component = [new ActionRowBuilder()
		.addComponents(new ButtonBuilder().setCustomId("help_index").setLabel("commandes").setStyle(ButtonStyle.Primary))
		.addComponents(new ButtonBuilder().setCustomId("help_admin").setLabel("admin").setStyle(ButtonStyle.Primary))
		.addComponents(new ButtonBuilder().setURL("https://rostro15.fr").setLabel("site web (Y A R)").setStyle(ButtonStyle.Link))
		]


		
		this.client = client;
		this.em = this.client.myem;

		this.id = interaction.id

		var embed = new EmbedBuilder()
		.setTitle("Commande du bot")
		.setAuthor({name: this.client.user.username, iconURL : this.client.user.avatarURL()})
		.addFields(
			{ name: '/call message max', value: 'cree un appel, 👍 pour vous inscrire, 👎 pour vous désinscrire, 📯 pour faire l\'appel, ❌ pour effacer le message '},
			{ name: '/game jeu', value: 'crée une partie d\'un jeu intégré discord'},
		)
	
		interaction.reply({ephemeral:true, embeds:[embed], components:this.component });

		this.open_listeners();
		this.close()
	}

	open_listeners(){

		var help = this;
		this.em.on(this.id, async function (interaction:ButtonInteraction) {
			var command = interaction.customId;
			switch(command){
				case "help_index":
					help.index(interaction);
				break;
				case "help_admin":
					help.admin(interaction);				

				break;
			}
		})
	}

	async close(){
		await sleep(1200000);
		this.em.removeAllListeners(this.messID);
		
		
		  
		function sleep(ms:number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
		}
	}

	index(interaction:ButtonInteraction){
		var embed = new EmbedBuilder()
		.setTitle("Commande du bot")
		.setAuthor({name: this.client.user.username, iconURL : this.client.user.avatarURL()})
		.addFields(
			{ name: '/call message max', value: 'cree un appel, 👍 pour vous inscrire, 👎 pour vous désinscrire, 📯 pour faire l\'appel, ❌ pour effacer le message '},
			{ name: '/game jeu', value: 'crée une partie d\'un jeu intégré discord'},
		)

		interaction.update({ embeds:[embed], components:this.component  });
	}

	admin(interaction:ButtonInteraction){
		var embed = new EmbedBuilder()
		.setTitle("Commande du bot : admin")
		.setAuthor({name: this.client.user.username, iconURL : this.client.user.avatarURL()})
		.addFields(
			{ name: '/modifycall add/del call_messageID @user', value: 'ajoute au suprime un utilisateur du call'},
		)

		interaction.update({embeds:[embed], components:this.component  });
	}

	gif(interaction:ButtonInteraction){
		var embed = new EmbedBuilder()
		.setTitle("Commande du bot")
		.setAuthor({name: this.client.user.username, iconURL : this.client.user.avatarURL()})

		var rawdata = fs.readFileSync("guild_sto/"+interaction.guild.id+'.json');
		var sto = JSON.parse(rawdata);
	
		for(var key in sto.gif) {
			var value = sto.gif[key];
			embed.addFields({ name: key, value: value})
		}

	
		

		interaction.update({embeds:[embed], components:this.component  });
	}


}
