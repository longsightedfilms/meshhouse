module.exports = {
    root: true,
    env: {
        // this section will be used to determine which APIs are available to us
        // (i.e are we running in a browser environment or a node.js env)
        node: true,
        browser: true,
        mocha: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: "@typescript-eslint/parser",
        plugins: ["@typescript-eslint"],
        project: "./tsconfig.json",
        extraFileExtensions: [".vue"]
    },
    extends: [
        // use the recommended rule set for typescript, javascript and vue
        "eslint:recommended",
        "plugin:vue/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    rules: {
        // we should always disable console logs and debugging in production
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    }
};