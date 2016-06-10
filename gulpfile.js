"use strict";
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');
const server = require('gulp-server-livereload');
const bower = require('gulp-bower');
const typings = require('typings');

const tsProject = typescript.createProject('tsconfig.json', {
    sortOutput: true
});

gulp.task('webserver', function () {
    gulp.src([
        'app',
        '!./**/*.ts'
    ])
        .pipe(server({
            livereload: true,
            fallback: 'index.html',
            open: true,
            port: 9001
        }));
});

gulp.task('default', () => {
});
gulp.task('ts', () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./app'));
});

gulp.task('watch.dev', ['ts'], () => {
    gulp.watch('app/**/*.ts', ['ts']);
});

gulp.task('serve.dev', ['watch.dev', 'webserver']);

gulp.task('install', ['install.typings', 'install.bower'])

gulp.task('install.typings', () => {
    return typings.install({
        ambient: true,
        cwd: process.cwd(),
        save: false
    });
})

gulp.task('install.bower', () => {
    return bower();
})