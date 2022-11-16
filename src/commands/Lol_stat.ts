import { CommandInteraction, ApplicationCommandType, EmbedBuilder } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
import console from "../Console"
const config = require("../config.json");

export const lol_stat: Command = {
    name: "lol_stat",  
    description: "donne les stats d'un joueur LOL",
    type: ApplicationCommandType.ChatInput,
    dmPermission:true,
    options:[
        {
            "type": 3,
            "name": "user_name",
            "description": "pseudo du joueur (EUW only)",
            "required": true
        }
    ],
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            var user_name = interaction.options.get("user_name").value as string;
					
					const alias_rank = {
						BRONZE:8865323,
						CHALLENGER:16311770,
						DIAMOND:12186367,//"#e4b657"
						GOLD:15844367,
						GRANDMASTER:16533051,
						IRON:2759192,
						MASTER:14298091,
						PLATINUM:3897463,
						SILVER:8427422
					}
					

					var response = await fetch('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+encodeURI(user_name), {
						method: 'get',
						headers: {
							"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
							"Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"Origin": "https://rostro15.fr",
							"X-Riot-Token": config.riot_key
						}
					});
					var user_data = await response.json()
					
					if(user_data.id == undefined){interaction.reply({ephemeral:true,content:"\\💣		nom d'utilisateur non trouvé"}); return;}
					

					var response = await fetch('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+user_data.id, {
						method: 'get',
						headers: {
							"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
							"Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
							"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
							"Origin": "https://rostro15.fr",
							"X-Riot-Token": config.riot_key
						}
					});
					var ranked_data = await response.json()
					console.debug("https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".webp")
					var embeds = []
					for (const i in ranked_data) {
						var win_rate = 100 * (ranked_data[i].wins) /(ranked_data[i].wins+ranked_data[i].losses)
						var myEmbed = new EmbedBuilder()
						.setColor(alias_rank[ranked_data[i].tier])
						.setTitle(ranked_data[i].tier+" "+ranked_data[i].rank)
						.setAuthor({name:ranked_data[i].queueType+" of "+user_data.name , iconURL : "http://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/"+user_data.profileIconId+".png" })
						.setDescription(ranked_data[i].leaguePoints+" LP")
						.setThumbnail("http://media.rostro15.fr/img/"+ranked_data[i].tier+".png")
						.addFields({name:"wins",value:""+ranked_data[i].wins,inline:true})
						.addFields({name:"losses",value:""+ranked_data[i].losses,inline:true})
						.addFields({name:"win rate",value:""+win_rate+"%",inline:true})					
						.setTimestamp()
						//!.setFooter({text:"insane", icon_url:"https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".webp"})
						embeds.push(myEmbed)
					}
					if(embeds[0] == undefined ){interaction.reply({content:"\\💣		cette utilisateur n'as pas de rang classer"}); return;}
					interaction.reply({embeds:embeds})

        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 