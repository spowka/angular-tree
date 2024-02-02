export interface TreeViewInput {
    uid: string;
    name: string;
    parentNode?: string;
    childrens?: TreeViewInput[];
}

export interface TreeViewOutput {
    uid: string;
    name: string;
    parentNode: string;
}

export class TreeViewFlatInput {
    uid: string;
    name: string;
    level: number;
    expandable: boolean;
}