# grunt-t4mvc-statics

> Grunt task to generate a T4MVC C# class to strongly type your static folder(s)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-t4mvc-statics --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-t4mvc-statics');
```

## The "t4mvc_statics" task

### Overview
In your project's Gruntfile, add a section named `t4mvc_statics` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  t4mvc_statics: {
    options: {
      // Task-specific options go here.
    },
    files: {
      'Generated Filepath here' : [ 'Static Folder Here']
    },
  },
})
```
