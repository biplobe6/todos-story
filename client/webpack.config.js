const path                      = require('path');
const md5                       = require('md5');
const webpack                   = require('webpack');
const UglifyJsPlugin            = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin         = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin   = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const FileManagerPlugin         = require('filemanager-webpack-plugin');
const { BundleAnalyzerPlugin }  = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin }    = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

/**
 * get fullpath using dirname and relative file name
 * @param {string} pathName relative path. ex: 'new-file.txt'
 */
const fullPath = (pathName) => path.resolve(__dirname, pathName);

const moduleHelper = {
    _name: {},
    getName: (moduleName) => {
        if(moduleHelper._name[moduleName]){
            return moduleHelper._name[moduleName]
        }

        moduleHelper._name[moduleName] = moduleName.replace('@', '')
        if(process.env.NODE_ENV == 'production'){
            moduleHelper._name[moduleName] = md5(moduleHelper._name[moduleName])
        }
        return moduleHelper._name[moduleName]
    }
}

/**
 * create a rendom number from 8500 to 9000
 * @param {number} min minimun number. ex: 8500
 * @param {number} max maximum number. ex: 9000
 */
const getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const PATH = {
    src: 'app',
    dest: 'dist',
    public: 'public',
    staticFiles: 'staticFiles'
}

// /src/app
const srcPath = fullPath(PATH.src);

// /src/dist
const distPath = fullPath(PATH.dest);

// /src/public
const publicPath = fullPath(PATH.public);

// /src/staticFiles
const staticFilesPath = fullPath(PATH.staticFiles);


module.exports = (env) => {
    // /src/app/index.js
    const indexJs = `${srcPath}/index.js`
    const indexDevJs = `${srcPath}/index.dev.js`
    const htmlFileName = 'index.html'

    // /src/public/index.html
    const indexHtml = `${publicPath}/${htmlFileName}`

    const PROD_MODE = env.NODE_ENV == "production";
    const CONFIG_MODE = env.NODE_ENV;
    const STATIC = 'static';
    const STATIC_URL = PROD_MODE ? `/${STATIC}/` : `/${STATIC}/`;
    const DEVELOPMENT_PORT = getRandom(8200, 8300);
    const PUBLIC_PATH = PROD_MODE ? `/${STATIC}/` : (
        `http://localhost:${DEVELOPMENT_PORT}/${STATIC}/`
    )

    const webpackConfig = {
        ...(
            PROD_MODE ? {
                optimization: {
                    namedModules: true,
                    runtimeChunk: 'single',
                    splitChunks: {
                        cacheGroups: {
                            vendor: {
                                test: /[\\/]node_modules[\\/]/,
                                enforce: true,
                                chunks: 'all',
                                name(module) {
                                    const identifier = module.identifier()
                                    const folders = identifier.split('/')
                                    const node_modulesIndex = folders.indexOf("node_modules")
                                    return moduleHelper.getName(folders[node_modulesIndex + 1]);
                                }
                            }
                        }
                    },
                    minimizer: [
                        new UglifyJsPlugin(),
                    ]
                }
            } : {
                devtool: "source-map",
                devServer: {
                    compress: true,
                    historyApiFallback: true,
                    hot: true,
                    port: DEVELOPMENT_PORT,
                    contentBase: distPath,
                    compress: true,
                    headers: {
                        'Access-Control-Allow-Origin': "*"
                    }
                }
            }
        ),
        resolve: {
            alias: {
                ...(PROD_MODE ? {} : {
                    'react-dom': '@hot-loader/react-dom'
                }),
                App: fullPath('app/App'),
                Component: fullPath('app/Component'),
                Controller: fullPath('app/Controller'),
                Constant: fullPath('app/Constant'),
                Redux: fullPath('app/Redux'),
                Styles: fullPath('app/Styles'),
                Static: fullPath('app/Static'),
                Utils: fullPath('app/Utils'),
                Root: fullPath('app'),
            },
            extensions: [
                '.ts',
                '.tsx',
                '.js',
                '.jsx',
                '.css',
                '.scss',
            ]
        },
        entry: {
            vendor: [
                'bootstrap/dist/css/bootstrap.css',
                'font-awesome/css/font-awesome.min.css',
            ],
            main: [
                ...(PROD_MODE ? [] : ['react-hot-loader/patch']),
                indexJs,
                ...(PROD_MODE ? [] : [indexDevJs]),
            ]
        },
        output: {
            path: distPath,
            filename: `[name].[${PROD_MODE ? "chunk" : ""}hash].js`,
            chunkFilename: "[name].[chunkhash].js",
            publicPath: PUBLIC_PATH,
            ...(PROD_MODE ? {} : {
                sourceMapFilename: "[file].map",
            })
        },
        mode: CONFIG_MODE,
        module: {
            rules: [{
                test: /\.(woff|ttf|svg|woff2|eot|png|jpe?g|gif)$/,
                use: [{
                    loader: 'file-loader',
                }]
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            ...(PROD_MODE ? [] : [
                                "react-hot-loader/babel"
                            ]),
                            "@babel/plugin-syntax-dynamic-import",
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-export-namespace-from",
                            "@babel/plugin-proposal-throw-expressions"
                        ]
                    }
                }
            }, {
                test: /\.tsx?$/,
                use: [
                    "ts-loader"
                ]
            }, {
                test: /\.p\.scss/,
                use: [
                    "css-to-string-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }, {
                test: /\.scss$/,
                exclude: /\.p\.scss/,
                use: [
                    (PROD_MODE ? MiniCssExtractPlugin.loader : 'style-loader'),
                    `css-loader${PROD_MODE ? '' : '?sourceMap'}`,
                    `sass-loader${PROD_MODE ? '' : '?sourceMap'}`
                ]
            }, {
                test: /\.css$/,
                exclude: /\.p\.css/,
                use: [
                    (PROD_MODE ? MiniCssExtractPlugin.loader : 'style-loader'),
                    `css-loader${PROD_MODE ? '' : '?sourceMap'}`
                ]
            }]
        },
        plugins: [
            ...(
                PROD_MODE ? [
                    new CleanWebpackPlugin()
                ] : []
            ),
            new HtmlWebpackPlugin({
                template: indexHtml,
                filename: htmlFileName,
                alwaysWriteToDisk: true
            }),
            new HtmlWebpackHarddiskPlugin(),
            new webpack.DefinePlugin({
                ENV_TYPE: JSON.stringify(env.NODE_ENV),
                PROD_MODE: PROD_MODE,
                STATIC_URL: JSON.stringify(STATIC_URL)
            }),
            new FileManagerPlugin({
                onEnd: [{
                    copy: [{
                        source: `${staticFilesPath}/*`,
                        destination: distPath,
                    }]
                }]
            }),
            ...(
                PROD_MODE ? [
                    new OptimizeCssAssetsPlugin(),
                    new MiniCssExtractPlugin({
                        filename: '[name].[chunkhash].css'
                    }),
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'disabled',
                        generateStatsFile: true
                    })
                ] : []
            ),
        ]
    }

    return webpackConfig
}
