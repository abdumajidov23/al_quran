import { Context, Telegraf } from 'telegraf';
export declare class BotService {
    private bot;
    constructor(bot: Telegraf<Context>);
    onStart(ctx: Context): Promise<void>;
    callbackQuery(ctx: Context): Promise<void>;
}
