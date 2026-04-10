const path = require('path')
const webpack = require('webpack')

// env — contains environment variables passed from the CLI (e.g. development, production flags).
// argv — contains command-line arguments used to run webpack (e.g. mode, flags, options).
const config = (env, argv) => {
  console.log('argv', argv.mode)

  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes' // dev
    : 'http://localhost:3001/notes'         // prod

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    // server config
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    // map bundled code back to original source files,
    // making debugging easier by showing real file names and line
    // numbers instead of compiled code.
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,            // which files to match
          exclude: /node_modules/,  // ignore external libraries
          loader: 'babel-loader',   // how to process files
          options: {
            presets: [
              '@babel/preset-env',   // modern JS → old JS (ex. const → var)
              '@babel/preset-react'  // JSX → JS
            ]
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // reads CSS
            'css-loader'    // inserts it into the browser
          ],
        },
      ],
    },

    // minification - is the process of removing unnecessary characters from
    // code (spaces, line breaks, comments, long variable names) to make the
    // file smaller and faster to load, without changing its behavior.

    // wp v4+ doesn’t require any configuration (minification)

    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]
  }
}

module.exports = config