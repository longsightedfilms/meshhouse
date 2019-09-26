export interface IExtension {
    [properties: string]: {
        title: string,
        icon: any
    }
}
export interface IDatabase {
    title: string,
    color: string,
    view: string,
    url: string,
    path: string | undefined
}
export interface IModel {
    name: string,
    category: string,
    image: string,
    extension: string,
    path: string
}
export interface ILanguage {
    text: string,
    value: string
}