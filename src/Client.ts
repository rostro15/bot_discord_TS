import { Client, GatewayIntentBits, Guild, GuildMember, PermissionFlagsBits } from "discord.js";
import EventEmitter = require("events");
const events = require('events');
import Call from './Call';

const config = require("./config.json");

class customClient extends Client {
    myem:EventEmitter;
    call_list:{};
    guilds_list:{};

	constructor(){
        
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
        //super();
        this.myem = new events.EventEmitter();
        this.call_list = {}
	}

    create_call(...args){
        
        if(args[2] == undefined){
			return new Call(this, args[1])
		}else{
			return new Call(this, args[1], args[2])
		}
	}
    
    ///////////////////////////////////////////////// fonctions generale /////////////////////////////////////////////////
    check_perm(member:GuildMember):boolean{
        if (member.permissions.any(PermissionFlagsBits.ManageChannels,true)) {
            return true;
        }
        if (config.admin_ID.includes(member.id)) {
            return true;
        }
        return false;
    }


    check_all_in(keys, msg):boolean{
        for(var i in keys ){
            if (!msg.includes(keys[i])) {
                return false;
        }
        return true;
        }
    }




}
export default customClient;