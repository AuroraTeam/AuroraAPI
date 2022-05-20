const path = require("path")

// Web
let mode = [
    {
        mode: "production",
        devtool: "source-map",
        filename: "aurora-api.min.js",
    },
    {
        mode: "development",
        devtool: "inline-source-map",
        filename: "aurora-api.js",
    },
]

mode = mode.map((c) => {
    return {
        experiments: {
            outputModule: true,
        },
        mode: c.mode,
        devtool: c.devtool,
        target: "web",
        entry: path.resolve(__dirname, "src", "index.ts"),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: c.filename,
            // library: "AuroraAPISocket",
            libraryExport: "AuroraAPISocket",
            libraryTarget: "module",
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                },
            ],
        },
    }
})

// Node
mode.push({
    mode: "development",
    devtool: "source-map",
    target: "node",
    entry: path.resolve(__dirname, "src", "index.ts"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "aurora-api.node.js",
        libraryTarget: "commonjs",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ],
    },
})

module.exports = mode
