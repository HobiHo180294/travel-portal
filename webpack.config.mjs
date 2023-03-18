import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
console.log("ISDEV: ", isDev);

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: "single",
  };

  if (isProd) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserPlugin()];
  }

  return config;
};

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    "css-loader",
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = (preset) => {
  const opts = {
    presets: ["@babel/preset-env"],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: babelOptions(),
    },
  ];

  return loaders;
};

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/img/content"),
          to: path.resolve(__dirname, "dist/assets/img/content"),
        },
        {
          from: path.resolve(__dirname, "src/assets/img/favicon"),
          to: path.resolve(__dirname, "dist/assets/img/favicon"),
        },
        {
          from: path.resolve(__dirname, "src/assets/img/icons"),
          to: path.resolve(__dirname, "dist/assets/img/icons"),
        },
        {
          from: path.resolve(__dirname, "src/assets/img/logos"),
          to: path.resolve(__dirname, "dist/assets/img/logos"),
        },
      ],
    }),
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

export default {
  context: path.resolve(__dirname, "src"),

  mode: "development",

  target: "web",

  entry: {
    main: ["@babel/polyfill", "./js/main.mjs"],
    index: ["@babel/polyfill", "./js/index.mjs"],
  },

  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@scss": path.resolve(__dirname, "src/scss"),
      "@modules": path.resolve(__dirname, "src/scss/modules"),
    },
  },

  optimization: optimization(),

  devtool: isDev ? "source-map" : "eval",

  devServer: {
    port: 4900,
    hot: isDev,
    open: true,
  },

  plugins: plugins(),

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },

      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: isDev
            ? "assets/img/css-backgrounds/[name].[contenthash][ext]"
            : "assets/img/css-backgrounds/[name][ext]",
        },
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
