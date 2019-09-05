const { task, src, series, parallel } = require('gulp');
const typedoc = require('gulp-typedoc');
const clean = require('gulp-clean');
const lernaConfig = require('./lerna');

const OUT_DIR_ROOT = 'package';
const PACKAGES = [
  {
    name: 'core',
    deps: []
  },
  {
    name: 'assert',
    deps: ['core']
  },
  {
    name: 'date',
    deps: ['core']
  },
  {
    name: 'store',
    deps: ['core']
  },
  {
    name: 'logger',
    deps: ['core', 'store']
  },
  {
    name: 'uri',
    deps: ['core']
  },
  {
    name: 'version',
    deps: ['core']
  }
];

task('docs:clean', function() {
  return src([`./${OUT_DIR_ROOT}`], {
    allowEmpty: true,
    read: false
  }).pipe(clean());
});

task(
  'docs',
  series(
    'docs:clean',
    parallel.apply(
      null,
      [
        ...PACKAGES.map(pkg => {
          return () => {
            return src([`packages/${pkg.name}/index.ts`]).pipe(
              typedoc({
                name: `@monument/${pkg.name}`,
                mode: 'file',
                exclude: pkg.deps.length > 0 ? `**/packages/+(${pkg.deps.join('|')})/**` : undefined,
                out: `${OUT_DIR_ROOT}/${pkg.name}/latest`,
                readme: `packages/${pkg.name}/README.md`,
                excludePrivate: true,
                excludeNotExported: true,
                gaID: 'UA-129068725-1',
                tsconfig: './tsconfig.json'
              })
            );
          };
        }),
        ...PACKAGES.map(pkg => {
          return () => {
            return src([`packages/${pkg.name}/index.ts`]).pipe(
              typedoc({
                name: `@monument/${pkg.name}`,
                mode: 'file',
                exclude: pkg.deps.length > 0 ? `**/packages/+(${pkg.deps.join('|')})/**` : undefined,
                out: `${OUT_DIR_ROOT}/${pkg.name}/${lernaConfig.version}`,
                readme: `packages/${pkg.name}/README.md`,
                excludePrivate: true,
                excludeNotExported: true,
                gaID: 'UA-129068725-1',
                tsconfig: './tsconfig.json'
              })
            );
          };
        })
      ]
    )
  )
);
