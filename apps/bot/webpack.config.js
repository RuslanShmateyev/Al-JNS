const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (options, webpack) => {
    const config = {
        ...options,
        // Mark all node_modules as external - this preserves require.resolve() behavior
        externals: [
            nodeExternals({
                allowlist: [], // Bundle nothing from node_modules
            }),
        ],
        plugins: [
            ...options.plugins,
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../../packages/contracts/src/grpc/protos'),
                        to: 'protos',
                        noErrorOnMissing: true,
                    },
                    {
                        from: path.resolve(__dirname, '../../packages/new_contracts/src/grpc/protos'),
                        to: 'protos',
                        noErrorOnMissing: true,
                    },
                ],
            }),
        ],
        node: {
            __dirname: false,
            __filename: false,
        },
    };

    return config;
};
