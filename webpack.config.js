"use strict";

/* requiring the modules */
const webpack = require("webpack");
const path = require("path");

/* defining the source and distribution paths */
const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

const DEVELOPMENT = process.env.NODE_ENV === "development";
const PRODUCTION = process.env.NODE_ENV === "production";
// const PRODUCTION = !!process.argv.find((element) => element === '--production');
// const DEVELOPMENT = !!process.argv.find((element) => element === '--development');


/* defining the entries*/
const productionEntries = {
    react: SRC_DIR + "/index.js",
};
const developmentEntries = Object.assign({}, productionEntries, {webpackDevServer: ["webpack/hot/dev-server", "webpack-dev-server/client?http://localhost:8080"]});
const entries = PRODUCTION ? productionEntries : developmentEntries;


/* defining the output */
const output = {
    filename: "[name].js",
    path: DIST_DIR,
    publicPath: "/dist/",
    pathinfo: true,
    library: "MyLibraryName"
};


/* defining the plugins */
const plugins = PRODUCTION
    ? [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
    ]
    :  [
        new webpack.HotModuleReplacementPlugin(),
    ];

plugins.push(
    new config.optimization.splitChunks({name: "vendor.bundle", minChunks: 2}),
    new webpack.DefinePlugin({
        PRODUCTION: PRODUCTION,
        DEVELOPMENT: DEVELOPMENT,
    })
);


/* defining the modules -> rules -> loaders */
const modules = {
    rules:
        [
            {
                test: /\.(js|jsx)$/,
                include: SRC_DIR,
                exclude: /node_modules/,
                loader: "babel-loader",
                options:
                    {
                        presets: ["react", ["es2015", {modules: false}], "stage-2"]
                    }
            }
        ]
};



/* building the webpack config object */
const config = {
    entry: entries,
    output: output,
    module: modules,
    plugins: plugins,
    devtool: "source-map",
    target: "web",
    stats: "verbose"
};

/* exporting the webpack config */
module.exports = config;