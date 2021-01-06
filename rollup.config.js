import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  // 项目入口文件
  input: './src/index.js',
  // 打包后的文件配置
  output: {
    file: 'dist/umd/vue.js',
    name: 'Vue',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    // 使用babel转换除了node_modules以外的文件
    babel({
      exclude: 'node_modules/**'
    }),
    // 开发环境时，自动打开项目
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/public/index.html',
      port: 3001,
      contentBase: ''
    }) : null
  ]
}
