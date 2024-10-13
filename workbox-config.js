module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{html,js,css,jpg,png,svg,json,ico,woff2}", // Adjust patterns to match your folder/files
  ],
  swDest: "build/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 50,
        },
      },
    },
  ],
};
