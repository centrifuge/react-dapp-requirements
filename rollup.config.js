import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';

export default {
    input: 'src/index.js',
    external:["react","react-dom","prop-types"],
    output: [
        {
            exports:"named",
            file: 'dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            exports:"named",
            file: 'dist/index.esm.js',
            format: 'es',
            sourcemap: true,
        },
    ],
    plugins: [
        progress(),
        nodeResolve({
            browser: true,
        }),

        babel({
            babelrc: false,
            presets: [['env', { modules: false }],  'react'],
            plugins: ['external-helpers', 'transform-object-rest-spread', "transform-class-properties"],
        }),

        filesize()
    ],
};
