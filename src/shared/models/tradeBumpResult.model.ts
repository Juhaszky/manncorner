import { Trade } from "./trade.model";

export interface TradeBumpResult
{
    status: number;
    error:string
    trade: Trade
}
