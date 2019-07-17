module.exports = {
    devServer: {
        proxy: {
            '/resourceUpdate': {
                target: "http://localhost:5000/api/3/action/resource_update",
                changeOrigin: true,
                pathRewrite: {
                    '^/resourceUpdate': ""
                }
            },

            '/resourceCreate': {
                target: "http://localhost:5000/api/3/action/resource_create",
                changeOrigin: true,
                pathRewrite: {
                    '^/resourceCreate': ""
                }
            },

            '/api': {
                target: 'http://localhost:3000/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': "/api"
                }
            }
        }
    },

    configureWebpack: {
        optimization: {
            runtimeChunk: 'multiple',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                maxSize: 1024,
                cacheGroups: {
                    vendor: {
                        test: /\/node_modules\/!(pdfvuer)\//,
                        //test: /\/node_modules\//,
                        name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/\/node_modules\/(.*?)(\/|$)/)[1];

                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `npm.${packageName.replace('@', '')}`;
                        },
                    },
                }
            }
        }
    }
}