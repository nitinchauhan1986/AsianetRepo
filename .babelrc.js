// Babel configuration
// https://babeljs.io/docs/usage/api/
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
  ignore: ['node_modules', 'build'],
  plugins: [
    'universal-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],
};
