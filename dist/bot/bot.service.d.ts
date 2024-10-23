import { Context, Telegraf } from 'telegraf';
import { HadislarService } from '../hadislar/hadislar.service';
export declare class BotService {
    private bot;
    private hadislarService;
    private currentPage;
    private currentView;
    private currentMessageId;
    constructor(bot: Telegraf<Context>, hadislarService: HadislarService);
    onStart(ctx: Context): Promise<void>;
    callbackQuery(ctx: Context): Promise<void>;
    showHadislar(ctx: Context): Promise<void>;
    private updateMessage;
    private getInlineKeyboard;
    private getMainKeyboard;
    private getNamozVaqtlarini;
    private getIsmlar;
}
