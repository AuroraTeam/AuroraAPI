const path = require('path');

const mode = [{
    mode: 'production',
    filename: 'aurora-api.min.js',
},{
    mode: 'development',
    filename: 'aurora-api.js',
}]

module.exports = mode.map(c => {
    return {
        mode: c.mode,
        devtool: 'source-map',
        target: 'web',
        entry: path.resolve(__dirname, 'src', 'index.ts'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: c.filename,
            library: 'AuroraAPI',
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: [ '.ts' ],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader"
                }
            ]
        }
    }
})