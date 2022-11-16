const fs = require('fs');

import console from "./Console"
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, GuildMember, Message, MessageEditOptions, ModalSubmitInteraction, TextChannel } from "discord.js";
import customClient from "./Client";

export default class Call{
	client: customClient;
	mess_relpy: Message;
	messID:string;
	auteur:GuildMember;
	myEmbed:EmbedBuilder;
	activeComponent;
	enableComponent;
	disableComponent;
	max:number;
	cmpt:number;
	sto:string[];
	titre:string;
	closeConfirm=false;


	constructor(...args){
		this.client = args[0];
		if(args[2] == undefined){
			this.CreateFromModal(args[1])
		}else{
			this.CreateFromCache(args[1], args[2])
		}
	}

	async CreateFromCache(channelID:string, messageID:string){
		try {
			var channel = await this.client.channels.fetch(channelID) as TextChannel
			var message:Message = await channel.messages.fetch(messageID)
		} catch (error) {
			if(error = "DiscordAPIError: Unknown Message" || error =="DiscordAPIError: Unknown Channel" || error =="TypeError: Cannot read property 'channel' of undefined"){
				var rawdata = fs.readFileSync("call_sto/call_sto.json");
				var fileData = JSON.parse(rawdata);

				delete fileData[messageID];

				var data = JSON.stringify(fileData);
				fs.writeFileSync("call_sto/call_sto.json", data);
				console.error(error);
				console.warn("call non trouvé");
				return
			}
			console.error(error);
		}
		try {
			this.mess_relpy =  message;
			this.messID =  message.id;
			this.auteur = message.member;
			var embed = message.embeds[0].data;
			this.myEmbed = new EmbedBuilder()
			//.setColor(180255)
			.setTitle(embed.title)
			.setAuthor(embed.author)
			.setDescription(embed.description)
			if(embed.footer != undefined){
				this.myEmbed.setFooter(embed.footer)
			}
			if(this.myEmbed.data.footer == null){
				this.max = 0;
			}else{
				this.max = parseInt(this.myEmbed.data.footer.text.split("/")[1]);
				this.cmpt = parseInt(this.myEmbed.data.footer.text.split("/")[0]);
			}

			this.sto = this.myEmbed.data.description.split("\n");
			console.verbose("call found : " + this.myEmbed.data.title);
			this.open_listeners();
		} catch (error) {
			console.error(error)
			console.warn("erreur inconnu dans la recréation d'un call")
			var rawdata = fs.readFileSync("call_sto/call_sto.json");
			var fileData = JSON.parse(rawdata);

			delete fileData[messageID];

			var data = JSON.stringify(fileData);
			fs.writeFileSync("call_sto/call_sto.json", data);
		}
		
		
	}


	
	async CreateFromModal(interaction:ModalSubmitInteraction){
		const titre_msg = interaction.fields.getTextInputValue('call_name');
		this.titre = titre_msg;
		var maxstr = "";
		if(interaction.fields.getTextInputValue('call_max') != null){maxstr = interaction.fields.getTextInputValue('call_max');} 
		try {
			var max =  parseInt(maxstr);
			if(isNaN(max)){
				max = 0
			}
			if(max < 0 || max > 100){
				max = 0;
			}
		} catch (error) {
			max = 0
		}
		
		var pseudo_auteur = interaction.member.user.username;
		if ((interaction.member as GuildMember).nickname != null) {pseudo_auteur = (interaction.member as GuildMember).nickname;}
		if(interaction.channel.isThread()){
			interaction.reply("\\😢");
			this.client.myem.removeAllListeners(this.messID);
			await this.mess_relpy.delete();
			delete this.client.call_list[this.messID];
			return;
		}

		console.info("call crée par : "+interaction.member.user.username+" | name : "+titre_msg+", nb : "+max);
		var myEmbed = new EmbedBuilder()
		.setColor(180255)
		.setTitle(titre_msg)
		.setAuthor({name: pseudo_auteur, iconURL : "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp"})
		.setDescription("✋")
		.setTimestamp()
		this.enableComponent = [new ActionRowBuilder()
			.addComponents(new ButtonBuilder().setCustomId("join").setEmoji("👍").setStyle(ButtonStyle.Success))
			.addComponents(new ButtonBuilder().setCustomId("bell").setEmoji("📯").setStyle(ButtonStyle.Primary))
			,
			new ActionRowBuilder()
			.addComponents(new ButtonBuilder().setCustomId("leave").setEmoji("👎").setStyle(ButtonStyle.Danger))
			.addComponents(new ButtonBuilder().setCustomId("close").setEmoji("✖️").setStyle(ButtonStyle.Danger))
		]
		this.disableComponent = [new ActionRowBuilder()
			.addComponents(new ButtonBuilder().setCustomId("join").setEmoji("👍").setStyle(ButtonStyle.Success).setDisabled(true))
			.addComponents(new ButtonBuilder().setCustomId("bell").setEmoji("📯").setStyle(ButtonStyle.Primary))
			,
			new ActionRowBuilder()
			.addComponents(new ButtonBuilder().setCustomId("leave").setEmoji("👎").setStyle(ButtonStyle.Danger))
			.addComponents(new ButtonBuilder().setCustomId("close").setEmoji("✖️").setStyle(ButtonStyle.Danger))
		]
		this.activeComponent = this.enableComponent;

		this.auteur = interaction.member as GuildMember;
		this.sto = [];
		this.max = max;
		this.myEmbed = myEmbed;
		var mess_relpy  = await interaction.reply({
			embeds:[myEmbed], 
			components:this.activeComponent,
			fetchReply:true
		})

		this.mess_relpy =  mess_relpy;
		this.mess_relpy.startThread({name:titre_msg, reason: "création d'un call"})
		this.messID = mess_relpy.id;
		this.client.call_list[this.messID] = this;

		if (max!=0) {
			var temp="";
			for (var i = 0; i < max; i++) {
				temp = temp + "\n@XXXXXXX";
			}

			this.cmpt = 0;
			this.myEmbed.setDescription(temp);
			this.myEmbed.setFooter({text:"0/"+max});
			this.update()

			for (var i = 0 ; i <= max - 1; i++) {
				this.sto.push("@XXXXXXX");
			}
		}

		var rawdata = fs.readFileSync("call_sto/call_sto.json");
		var fileData = JSON.parse(rawdata);

		fileData[this.mess_relpy.id] = this.mess_relpy.channel.id;

		var data = JSON.stringify(fileData);
		fs.writeFileSync("call_sto/call_sto.json", data);

		this.open_listeners(interaction);
		
		
	}

	open_listeners(...args:any){

		var call = this;
		this.client.myem.on(this.mess_relpy.id, async function (interaction:ButtonInteraction) {
			var command:string;
			var member:GuildMember;
			if(args[1] != undefined ){
				command = args[0]
				member = args[1]
			}else{
				command = interaction.customId;
				member = await call.client.guilds.cache.get(interaction.guild.id).members.fetch(interaction.member.user.id)
			}
			
			switch(command){
				case "join":
					call.add(member)
					if(args[1] == undefined ){interaction.deferUpdate()}
				break;
				case "leave":
					call.remove(member)
					if(args[1] == undefined ){interaction.deferUpdate()}				

				break;
				case "bell":
					await call.bell(member, interaction);
				break;
				case "close":
					call.del(member, interaction);
				break;
			}
		})
	}

	

	async update(){
		this.mess_relpy.edit({
			embeds:[this.myEmbed], 
			components:this.activeComponent,
			fetchReply:true
		}as MessageEditOptions)
	}

	async delete(){	
		try {
			try {await this.mess_relpy.thread.setArchived(true,"call fini")}catch{}
			this.client.myem.removeAllListeners(this.messID);
			await this.mess_relpy.delete();
			delete this.client.call_list[this.messID];
		} catch (error) {console.error(error)}
		
	}

	add(user:GuildMember){
		try {this.mess_relpy.thread.members.add(user);}catch{}
		if(this.max == 0){
			this.add_non_max(user)
		}else{
			this.add_max(user)
		}
	}

	remove(user:GuildMember){
		if(this.max == 0){
			this.remove_non_max(user)
		}else{
			this.remove_max(user)
		}
	}


	add_non_max(user:GuildMember){
		var k = true;
		for( var i = 0; i < this.sto.length; i++){    
			if (this.sto[i] == user.toString()){
				var k = false;
			}
		}
		if(k){
			this.sto.push(user.toString());
			this.myEmbed.setDescription(this.myEmbed.data.description+"\n"+user.toString());
			this.update();

			console.info("call : add "+user.displayName);
		}
	}
	remove_non_max(user:GuildMember){
		
		this.myEmbed.setDescription(this.myEmbed.data.description.replace("\n"+user.toString(),""));
		this.myEmbed.setDescription(this.myEmbed.data.description.replace(user.toString(),""));
		this.update();
		//enleve le user du sto
		for( var i = 0; i < this.sto.length; i++){        
			if (this.sto[i] === user.toString()) { 
				this.sto.splice(i, 1); 
				i--;
				console.info("call : remove "+user.displayName);
			}
		}
	}

	add_max(user:GuildMember){
		var k = true;
		for( var i = 0; i < this.sto.length; i++){    
			if (this.sto[i] == user.toString()){
				var k = false;
			}
		}	
		if(k){
			for (var i = 0 ; i <= this.sto.length - 1; i++) {
				if (this.sto[i]=="@XXXXXXX"){
					this.sto[i] = user.toString();
					this.cmpt++;

					var sto = "";
					for (var i = 0;	this.sto.length - 1 >=i; i++) {
						sto = sto+"\n"+this.sto[i];
					}

					this.myEmbed.setFooter({text : this.cmpt+"/"+this.max});
					this.myEmbed.setDescription(sto);
					if(this.cmpt == this.max){
						this.myEmbed.setColor(12583426)
						this.activeComponent = this.disableComponent
					}
					this.update();
					console.info("call : add "+user.displayName);
					break;
				}
			}
		}
		
	}
	remove_max(user:GuildMember){

		this.myEmbed.setDescription(this.myEmbed.data.description.replace(user.toString(),"@XXXXXXX"));
		for( var i = 0; i < this.sto.length; i++){        
			if (this.sto[i] == user.toString()) { 
				this.sto[i] = "@XXXXXXX";
				this.cmpt--;
				console.info("call : remove "+user.displayName);
			}
		}
		if(this.cmpt != this.max){
			this.myEmbed.setColor(180255)
			this.activeComponent = this.enableComponent;
		}
		
		this.myEmbed.setFooter({text : this.cmpt+"/"+this.max});
		this.update();
	}

	async bell(member:GuildMember, interaction:ButtonInteraction){
		if(this.auteur.user.id == member.user.id || this.client.check_perm(member)){
			var sto = "";
			var msg1 = await this.mess_relpy.channel.send(":bellhop::bellhop::bellhop::bellhop:")
			for(var key in this.sto) {
				if (this.sto[key] != "@XXXXXXX") {

					sto = sto + this.sto[key];
					sto = sto + "\n";
				}
			}
			if(sto==""){
				sto = "\\😥";
			}

			var msg2 = await this.mess_relpy.channel.send(sto);

			var msg3 = await this.mess_relpy.channel.send(":bellhop::bellhop::bellhop::bellhop:")

			var rawdata = fs.readFileSync("call_sto/call_sto.json");
			var fileData = JSON.parse(rawdata);

			delete fileData[this.mess_relpy.id];

			var data = JSON.stringify(fileData);
			fs.writeFileSync("call_sto/call_sto.json", data);

			setTimeout(function(msg1,msg2,msg3){
				msg1.delete();
				msg2.delete();
				msg3.delete();
				
			}, 5 *1000 * 60 ,  msg1, msg2, msg3); 

			this.delete();
			
			interaction.deferUpdate()
		}else{
			interaction.reply({ephemeral:true,content:"\\⛔		vous n'avez pas les droits pour faire cela rip"});
		}
	}

	del(member:GuildMember, interaction:ButtonInteraction){
		if(this.auteur.user.id == member.user.id || this.client.check_perm(member)){

			if(!this.closeConfirm){
				this.closeConfirm = true;
				interaction.reply({ephemeral:true,content:"\\⚠️		Confirmez en recliquant sur le bouton"})
				return;
			}

			console.info("call close par : "+interaction.member.user.username);

			var rawdata = fs.readFileSync("call_sto/call_sto.json");
			var fileData = JSON.parse(rawdata);

			delete fileData[this.mess_relpy.id];

			var data = JSON.stringify(fileData);
			fs.writeFileSync("call_sto/call_sto.json", data);


			this.delete();
			interaction.deferUpdate()
		}else{
			interaction.reply({ephemeral:true,content:"\\⛔		vous n'avez pas les droits pour faire cela rip"});
		}
	}
}