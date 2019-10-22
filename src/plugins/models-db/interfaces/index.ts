export interface DatatableHeader {
    text: string;
    align?: string;
    width?: string | number;
    value: string;
}
export interface Database {
    title: string;
    color: string;
    view: string;
    url: string;
    path: string | undefined;
}
export interface Extension {
    [properties: string]: {
        title: string;
        icon: '*.svg';
    };
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
export interface EditProperties {
    category: string;
    extension: string;
    name: string;
    image: string;
    imageChanged: boolean;
    path: string;
}