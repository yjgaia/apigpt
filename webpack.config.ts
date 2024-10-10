import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";

const config: webpack.Configuration = {
  entry: {
    "bundle": "./src/client.ts",
    __less: "./public/style/main.less",
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: "css-loader",
          options: {
            url: false,
          },
        }, "less-loader"],
      },
      {
        test: /\.ya?ml$/,
        use: "yaml-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".less"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve("public"),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
  ],
};

export default config;
