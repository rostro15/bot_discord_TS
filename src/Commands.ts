import { Command } from "./Command";
import { Help } from "./commands/Help";
import { Call } from "./commands/CreateCall";
import { add_call_button } from "./commands/CreateCallButton";
import { lol_stat } from "./commands/Lol_stat";
import { lol_trivia } from "./commands/Lol_trivia";
import { modifycall } from "./commands/ModifyCall";
import { Brotransform } from "./commands/guild/Brotransform";



export const GlobalCommands: Command[] = [Help,Call, add_call_button, lol_stat, lol_trivia, modifycall];

export const GuildCommands: Command[] = [Brotransform];

export const Commands: Command[] = GlobalCommands.concat(GuildCommands);
