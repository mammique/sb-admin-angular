"use strict";
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');
const bower = require('gulp-bower');
const typings = require('typings');
const browserSync = require("browser-sync").create();

const tsProject = typescript.createProject('tsconfig.json', {
    sortOutput: true
});

gulp.task('webserver', function () {
    browserSync.init({
        server: {
            baseDir: "app"
        },
        ui: false,
        port: 9001
    });
    gulp.watch([
        'app/**/*.html',
        'app/**/*.json',
        'app/**/*.css'
    ], ()=> {
        browserSync.reload();
    })
});

gulp.task('default', () => {
});
gulp.task('ts', () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./app'))
        .pipe(browserSync.stream())
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