'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');

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
      message : 'What is your Taco\'s name?',
      default : this.appname
    },
    {
      type    : 'input',
      name    : 'description',
      message : 'What does your Taco do?',
      default : 'El loco Taco'
    },
    {
      type    : 'input',
      name    : 'clientFolder',
      message : 'How would you like your client folder to be named?',
      default : 'client'
    }];

    this.prompt(prompts, function (answers) {
      this.name = answers.name;
      this.description = answers.description;
      this.clientFolder = answers.clientFolder;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      // Make all the dirs because yeoman can't create an empty bower_components
      var clientFolder = path.join(this.destinationRoot(), this.clientFolder);
      fs.mkdirSync(clientFolder);
      var bowerFolder = path.join(clientFolder, 'bower_components');
      fs.mkdirSync(bowerFolder);

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
        this.templatePath('_nwPackage.json'),
        this.destinationPath(path.join(this.clientFolder,'package.json')),
        { name: this.name,
          description: this.description }
      );
      this.fs.copy(
        this.templatePath('index.html'),
        this.destinationPath(path.join(this.clientFolder,'index.html') )
      );
      this.fs.copy(
        this.templatePath('_app.less'),
        this.destinationPath(path.join(path.join(this.clientFolder, 'app'),'app.less') )
      );
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
    }
  },

  install: function () {
    this.log(yosay('Soon we will install node-webkit, this might take a little while'))
    this.installDependencies();
  }
});
