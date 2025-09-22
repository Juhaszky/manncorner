import { Trade } from '../trade.model';

export interface TradeDeleteResult {
  status: number;
  error: string;
  trade: Trade;
}
