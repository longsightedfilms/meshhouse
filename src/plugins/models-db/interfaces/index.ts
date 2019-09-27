export interface Extension {
    [properties: string]: {
        title: string;
        icon: any;
    };
}
export interface Database {
    title: string;
    color: string;
    view: string;
    url: string;
    path: string | undefined;
}
export interface Model {
    name: string;
    category: string;
    image: string;
    extension: string;
    path: string;
}
export interface Language {
    text: string;
    value: string;
}