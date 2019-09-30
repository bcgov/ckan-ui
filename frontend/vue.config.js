var path = require('path');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');



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
        plugins: [
            new VuetifyLoaderPlugin({
              /**
               * This function will be called for every tag used in each vue component
               * It should return an array, the first element will be inserted into the
               * components array, the second should be a corresponding import
               *
               * originalTag - the tag as it was originally used in the template
               * kebabTag    - the tag normalised to kebab-case
               * camelTag    - the tag normalised to PascalCase
               * path        - a relative path to the current .vue file
               * component   - a parsed representation of the current component
               */
              match (originalTag, { kebabTag, camelTag, path, component }) {
                if (kebabTag.startsWith('core-')) {
                  return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
                }
              }
            })
        ],
        optimization: {
            runtimeChunk: 'multiple',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 10000,
                maxSize: 25000,
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
};