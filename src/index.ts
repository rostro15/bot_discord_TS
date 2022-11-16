//*------------------------------------------*//
//*             BOT DISCORD v6.0             *//
//*       du typescript et des fichier       *//
//*   author : Theo "rostro15" RUSINOWITCH   *//
//*         discord : rostro15#9153          *//
//*        mail : teo.rusi@hotmail.fr        *//
//*                 16/11/22                 *//
//*------------------------------------------*//

import console from "./Console"
import { ActionRowBuilder, ActivityType, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
const fs = require('fs');
import events = require('events');

var cmdArgument = process.argv

console.info("Starting...");


// importation des classe
import customClient  from "./Client.js";
import Call from "./Call.js";

import { Commands, GlobalCommands } from "./Commands.js";

import { Brotransform } from "./commands/guild/Brotransform.js";

const Media_api = require("./Media_api.js");
var media_api = new Media_api()

const config = require("./config.json");
const client = new customClient();
const em = new events.EventEmitter();




var guilds = {}


client.on('ready', async () => {
	client.user.setActivity('/help', { type: ActivityType.Playing })

	if(cmdArgument.includes("reload")){
		console.verbose("💽 reload des commandes")
		await client.application.commands.set(GlobalCommands);
		try {
			await client.application.commands.create(Brotransform,"1042069064845119489")
		} catch (error) {
			console.error("une command de guild n'a pas pu etre crée")
		}
	}
	
	console.warn("🚀 I am ready!  📡 Connecter en tant que : "+client.user.tag+"\n");

    //recrée les calls
	var rawdata = fs.readFileSync("call_sto/call_sto.json");
	var fileData = JSON.parse(rawdata);
	for(var key in fileData) {
		try {
			var value = fileData[key];
			new Call(client, value, key);
		} catch (error) {
			var rawdata = fs.readFileSync("call_sto/call_sto.json");
				var fileData = JSON.parse(rawdata);

				delete fileData[key];

				var data = JSON.stringify(fileData);
				fs.writeFileSync("call_sto/call_sto.json", data);
				console.error(error);
				console.warn("erreur dans la recup d'un call");
				return
		}
	}

	client.guilds.cache.each(guild => { //liste des guilds dans lequelles il y a le bot
		console.data(guild.name);
		guilds[guild.id] = guild
	})
	client.guilds_list = guilds
});


client.on('interactionCreate', async interaction => {
	
	switch(interaction.type){
		case InteractionType.MessageComponent: //commande issue des component
			console.dir(`[interaction] id : ${interaction.customId} | type : MessageComponent | user : ${interaction.user.tag} | guild : ${interaction.guild.name} | channel : ${interaction.channel.name}`);
			if(interaction.customId == "create_call_button"){
				const modal = new ModalBuilder().setTitle("creation call").setCustomId("oskoyr");
		
				const modalTextInput = new TextInputBuilder().setCustomId("call_name").setLabel("Nom du call").setStyle(TextInputStyle.Short);
				const modalTextInput_max = new TextInputBuilder().setCustomId("call_max").setLabel("Nombre de place").setStyle(TextInputStyle.Short).setRequired(false).setValue("5");
			
			
				const rows = new ActionRowBuilder().addComponents(modalTextInput) as ActionRowBuilder<TextInputBuilder>;
				modal.addComponents(rows)
			
				const rows_max = new ActionRowBuilder().addComponents(modalTextInput_max) as ActionRowBuilder<TextInputBuilder>;
				modal.addComponents(rows_max)
			
				await interaction.showModal(modal);
				return;
			}
			if(!client.myem.emit(interaction.message.id, interaction)){
				
				if(interaction.message.interaction != null){
					if(!client.myem.emit(interaction.message.interaction.id, interaction)){
						interaction.deferUpdate()
					}
				}else{
					interaction.deferUpdate()
				}
				
			}
		break;
		case InteractionType.ApplicationCommand: //commande issue des commandes slash
		console.dir(`[interaction] id : ${interaction.commandName} | type : ApplicationCommand | user : ${interaction.user.tag} | guild : ${interaction.guild.name} | channel : ${interaction.channel.name}`);

			const slashCommand = Commands.find(c => c.name === interaction.commandName);
			if (!slashCommand) {
				interaction.followUp({ content: "An error has occurred" });
				return;
			}
		
			//await interaction.deferReply();
		
			slashCommand.run(client, interaction);
		break;
		case InteractionType.ApplicationCommandAutocomplete:
			console.dir(`[interaction] id : ${interaction.commandName} | type : ApplicationCommandAutocomplete | user : ${interaction.user.tag} | guild : ${interaction.guild.name} | channel : ${interaction.channel.name}`);
			switch(interaction.commandName){
			case "modifycall":
				var listcall = new Array()
				Object.keys(client.call_list).forEach(callID => {
					listcall.push({
						name:client.call_list[callID].titre,
						value:callID
					})
				});
				interaction.respond(listcall)

			break;
			}
		break;
		case InteractionType.ModalSubmit:
			client.create_call(em, interaction);
		break;
		default:
			console.error("étrange");
		break;
	}
});


client.login(config.BOT_TOKEN);
