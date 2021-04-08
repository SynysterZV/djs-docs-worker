const path = require('path')

const mode = process.env.NODE_ENV?.trim() || 'production'

module.exports = {
    target: 'webworker',
    output: {
        filename: `worker.${mode}.js`,
        path: path.join(__dirname, 'dist'),
    },
    mode: 'production',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        plugins: [],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    }
}