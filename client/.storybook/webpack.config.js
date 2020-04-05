const path = require('path');


const REPO = path.resolve(__dirname, '..')
const fullPath = (relativePath, base=REPO) => path.resolve(base, relativePath)


module.exports = async ({ config }) => {
    config.output.publicPath = "/"

    config.resolve.alias["App"] = fullPath('app/App')
    config.resolve.alias["Component"] = fullPath('app/Component')
    config.resolve.alias["Controller"] = fullPath('app/Controller')
    config.resolve.alias["Constant"] = fullPath('app/Constant')
    config.resolve.alias["locals"] = fullPath('app/locals')
    config.resolve.alias["Redux"] = fullPath('app/Redux')
    config.resolve.alias["Styles"] = fullPath('app/Styles')
    config.resolve.alias["Utils"] = fullPath('app/Utils')
    config.resolve.alias["Root"] = fullPath('app')
    config.resolve.alias["JsonServer"] = fullPath('jsonServer')
    config.resolve.alias["Repo"] = fullPath('.')

    config.entry.push('./app/index.dev-story.js')

    config.resolve.extensions.push('.ts')
    config.resolve.extensions.push('.tsx')
    config.resolve.extensions.push('.css')
    config.resolve.extensions.push('.scss')
    config.resolve.extensions.push('.md')
    config.resolve.extensions.push('.mdx')


    // MDX Support
    mdRegex = /\.md$/

    mdRules = config.module.rules.find(rule => {
        return rule.test.toString() == mdRegex.toString()
    })

    mdRules.test = /\.mdx?$/
    mdRules.use = [{
        loader: 'babel-loader',
        options: {
            presets: [
                "@babel/preset-env",
                "@babel/preset-react"
            ],
            plugins: [
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-export-namespace-from",
                "@babel/plugin-proposal-throw-expressions"
            ]
        }
    }, {
        loader: "@mdx-js/loader"
    }]

    config.module.rules.push({
        test: /\.tsx?$/,
        use: [
            "ts-loader"
        ]
    })

    config.module.rules.push({
        test: /\.p\.scss/,
        use: [
            "css-to-string-loader",
            "css-loader",
            "sass-loader"
        ]
    })

    config.module.rules.push({
        test: /\.scss$/,
        exclude: /\.p\.scss/,
        use: [
            'style-loader?sourceMap',
            'css-loader?sourceMap',
            'sass-loader?sourceMap'
        ]
    })

    return config
}
