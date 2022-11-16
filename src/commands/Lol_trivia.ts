import { CommandInteraction, ApplicationCommandType } from "discord.js";
import customClient from "../Client";
import { Command } from "../Command";
import console from "../Console"
const config = require("../config.json");

export const lol_trivia: Command = {
    name: "lol_trivia",  
    description: "Donne des infos esentiels sur la dernière game",
    type: ApplicationCommandType.ChatInput,
    dmPermission:true,
    options:[{
        "type": 3,
        "name": "user_name",
        "description": "pseudo (only euw)",
        "required": true
    }],
    run: async (client: customClient, interaction: CommandInteraction) => {
        try {
            var user_name = interaction.options.get("user_name").value as string;
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
            // dMAznnH7CeZkeLzXyoIw6u547EYwt1fHBbzeZaPIXcuth99GPpSb7UURYa2zWbYcZvfudvy7Fkl5TA
            var response = await fetch('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/'+user_data.puuid+'/ids?start=0&count=1', {
                method: 'get',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
                    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Origin": "https://rostro15.fr",
                    "X-Riot-Token": config.riot_key
                }
            });
            var match_id = await response.json()
            var response = await fetch('https://europe.api.riotgames.com/lol/match/v5/matches/'+match_id[0], {
                method: 'get',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
                    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Origin": "https://rostro15.fr",
                    "X-Riot-Token": config.riot_key
                }
            });
            var match_data = await response.json()





        } catch (error) {
            console.error(error);
            interaction.reply({ephemeral:true,content:"\\💣		une erreur inconnue a eu lieu"});
        }
        
    }
}; 