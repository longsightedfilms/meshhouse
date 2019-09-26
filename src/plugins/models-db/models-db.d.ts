import Vue from 'vue'

declare module 'vue/types/vue' {
    interface Vue {
        $settingsGet: any,
        $settingsSet: void,
        $dccSet: void,
        $dccGetConfig: object,
        $dccSetConfig: void,
        $stringToSlug: string,
        $addDatabase: void,
        $indexFolderRecursive: void,
        $openItem: void,
        $openFolder: void
    }
}