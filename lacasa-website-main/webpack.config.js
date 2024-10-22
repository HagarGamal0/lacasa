module.exports = {
  use: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          "file?hash=sha512&digest=hex&name=[hash].[ext]",
          "image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false",
        ],
      },
    ],
    options: {
      presets: ["@babel/preset-env"],
    },
  },

  rules: [
    {
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        {
          loader: "file-loader",
        },
      ],
    },
  ],
  apps: [
    {
      max_memory_restart: "8000M",
    },
  ],
  devServer: {
    contentBase: "./app",
    compress: true,
  },
  resolve: {
    modules: ["node_modules"],
    alias: {
      path: require.resolve("path-browserify"),
    },
  },
};
