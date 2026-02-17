export type itemId = string | number;

export interface TreeItem {
  id: itemId;
  parent: itemId | null;
  label: string;
  [key: string]: any;
}
