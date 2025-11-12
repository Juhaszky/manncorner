import { Trade } from '../trade.model';

export interface TradeStatusResult {
  status: number;
  error: string;
  trade: Trade;
}
