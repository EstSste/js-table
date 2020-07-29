const mix = require('laravel-mix');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const notifier = require('node-notifier');

const assetsPath = 'src';
const publicPath = 'public';
const paths = {
    src: {
        vendorCss: [
            'node_modules/normalize.css/normalize.css',
        ],
        appJs: `${assetsPath}/js/app.js`,
        watch: [
            `${assetsPath}/app.min.css`,
            `${assetsPath}/app.min.js`,
            `${assetsPath}/svg.min.svg`
        ],
        scss: `${assetsPath}/scss/import.scss`,
        svg: `${assetsPath}/images/icons/*.svg`
    },

    assets:{
        vendorCss: `${publicPath}/vendor.css`,
        appCss: `${publicPath}/app.min.css`,
        appJs: `${publicPath}/app.min.js`,
        // vendorJs: `${publicPath}/vendor.js`,
        // widgetsJs: `${publicPath}/widgets.js`,
        svgCompiled: `/svg.min.html`
    }
};
const browserSyncOpt = {
    ui: false,
    open: false,
    files: paths.src.watch,
    injectChanges: true,
    // reloadDelay: 1500,
    notify: false,
    proxy: 'http://localhost:3000'
};
const svgOpt = {
    output: {
        filename: paths.assets.svgCompiled,
        svg4everybody: true,
        svgo: {
            removeTitle: true,
            removeDesc: true,
            removeStyleElement: true,
            cleanupNumericValue: true,
            removeDoctype: true,
            removeUselessDefs: true,
            removeMetadata: true,
            removeUselessStrokeAndFill: true,
            removeAttrs: {
                attrs: '.*:(fill|stroke):.*'
            },
            removeDimensions: true,
            removeViewBox: false
        },
    },
    sprite:{
        prefix: 'icon-',
        generate: {
            title: false,
        }
    }
};

mix.options({
        processCssUrls: false,
    })
    .setPublicPath(publicPath)
    .styles(paths.src.vendorCss, paths.assets.vendorCss)
    .sass(paths.src.scss, paths.assets.appCss)
    .js(paths.src.appJs, paths.assets.appJs)
    .copyDirectory('src/fonts', `${publicPath}/fonts`)
    .copy('src/favicon.png', publicPath)
    .extract();

if (!mix.inProduction()){
    mix.sourceMaps()
        .webpackConfig({
            devtool: "inline-source-map",
            devServer: {
                port: 3000
            }
        })
        .browserSync(browserSyncOpt)
        .disableSuccessNotifications();
}

// Set up the spritemap plugin
mix.webpackConfig({
    plugins: [
        new SVGSpritemapPlugin(paths.src.svg, svgOpt)
    ],
    module:{
        rules:[
            // Adapt laravel-mix webpack config to better handle svg images.
            {
                test: /\.(svg)$/,
                include: /assets\/svg/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'svg/[name].[ext]?[hash]',
                            publicPath: Config.resourceRoot
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: Config.imgLoaderOptions
                    }
                ]
            },
        ]
    },
    resolve: {
        alias: {}
    }
});