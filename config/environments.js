// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.
export default {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // NOTE: In development, we use an explicit public path when the assets
  // are served webpack by to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development: (config) => ({
    compiler_public_path: `http://${config.server_host}:${config.server_port}/`,
    proxy: {
      enabled: false,
      options: {
        host: 'http://localhost:8000',
        match: /^\/api\/.*/
      }
    },
    globals: {
      ...config.globals,
      API_URL: JSON.stringify('http://localdev.emondo.com.au:8000'),
      //FRONTEND_ROOT: JSON.stringify(`http://${config.server_host}:${config.server_port}`)
      FRONTEND_ROOT: JSON.stringify(`http://localhost:${config.server_port}`),
      GOOGLE_MAP_API_KEY: JSON.stringify('AIzaSyCtwNDvDLxw-JSB8RBvtdMuW2Qjh5AypEk')
    }
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: (config) => ({
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: null,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    },
    globals: {
      ...config.globals,
      API_URL: JSON.stringify('https://api.emondo.com.au'),
      FRONTEND_ROOT: JSON.stringify('http://new.emondo.com.au'),
      GOOGLE_MAP_API_KEY: JSON.stringify('AIzaSyCtwNDvDLxw-JSB8RBvtdMuW2Qjh5AypEk')
    }
  })
}
