export interface AllItems {
  assets: [],
  descriptions: [],
  total_inventory_count: number;
  success: number;
  rwgrsn: number;
}
export interface Asset {    
  appid: number,
  contextid: string,
  assetid: string,
  classid: string,
  instanceid: string,
  amount: string
}