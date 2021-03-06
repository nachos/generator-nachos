'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the praiseworthy ' + chalk.yellow('Nachos') + ' generator!'
    ));

    var prompts = [{
      type    : 'input',
      name    : 'name',
      message : 'What is your Dip\'s name?',
      default : this.appname
    },
    {
      type    : 'input',
      name    : 'description',
      message : 'What does your Dip do?',
      default : 'Dipping like crazy'
    },
    {
      type    : 'input',
      name    : 'clientFolder',
      message : 'How would you like your client folder to be named?',
      default : 'client'
    },
    {
      type    : 'confirm',
      name    : 'isMaterial',
      message : 'Would you like angular-material to be a part of your dip?',
      default : true
    }];

    this.prompt(prompts, function (answers) {
      this.name = answers.name;
      this.description = answers.description;
      this.clientFolder = answers.clientFolder;
      this.isMaterial = answers.isMaterial;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { name: this.name,
          description: this.description }
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        { name: this.name}
      );
      this.fs.copyTpl(
        this.templatePath('_.bowerrc'),
        this.destinationPath('.bowerrc'),
        { clientFolder: this.clientFolder }
      );
      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        { clientFolder: this.clientFolder  }
      );
      this.fs.copyTpl(
        this.templatePath('_nachos.json'),
        this.destinationPath('nachos.json'),
        { name: this.name,
          clientFolder: this.clientFolder }
      );
      this.fs.copyTpl(
        this.templatePath('_nwPackage.json'),
        this.destinationPath(path.join(this.clientFolder,'package.json')),
        { name: this.name,
          description: this.description }
      );

      if(!this.isMaterial) {
        this.fs.copy(
          this.templatePath('index.html'),
          this.destinationPath(path.join(this.clientFolder, 'index.html'))
        );
      }
      this.fs.copy(
        this.templatePath('_app.less'),
        this.destinationPath(path.join(path.join(this.clientFolder, 'app'),'app.less') )
      );


      // Create the bower folder empty so that wiredep wont go crazy
      var bowerFolder = path.join(path.join(this.destinationRoot(), this.clientFolder), 'bower_components');
      mkdirp(bowerFolder, function(err){
        if (err)
          console.log(err);
      });
    },
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    },
    angularMaterial: function() {
      if(this.isMaterial)
      {
        var appPath = path.join(this.clientFolder, 'app');

        this.fs.copyTpl(
          this.templatePath('angular-material/app.js'),
          this.destinationPath(path.join(appPath, 'app.js')),
          { name: this.name}
        );

        this.fs.copyTpl(
          this.templatePath('angular-material/index.html'),
          this.destinationPath(path.join(this.clientFolder, 'index.html')),
          { name: this.name}
        );
        this.fs.copyTpl(
          this.templatePath('angular-material/index.html'),
          this.destinationPath(path.join(this.clientFolder, 'index.html')),
          { name: this.name}
        );

        var settingsFolder = path.join(this.clientFolder, 'global-settings');
        this.fs.copyTpl(
          this.templatePath('angular-material/global-settings/app.js'),
          this.destinationPath(path.join(settingsFolder, 'app.js')),
          { name: this.name}
        );
        this.fs.copyTpl(
          this.templatePath('angular-material/global-settings/global-settings.contorller.js'),
          this.destinationPath(path.join(settingsFolder, 'global-settings.contorller.js')),
          { name: this.name}
        );
        this.fs.copyTpl(
          this.templatePath('angular-material/global-settings/global-settings.html'),
          this.destinationPath(path.join(settingsFolder, 'global-settings.html')),
          { name: this.name}
        );
      }
    }
  },

  install: function () {
    this.log(yosay('Installing dependencies, this might take a while'))
    this.npmInstall(['del','gulp','gulp-inject','gulp-jshint','gulp-less','gulp-livereload',
                     'gulp-util','jshint-stylish','lazypipe','run-sequence','wiredep'], { 'saveDev': true })

    if(this.isMaterial)
      this.bowerInstall(['angular','angular-material','mdi','angular-ui-router'], { 'save': true });
  }
});
