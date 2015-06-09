'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    this.log(yosay('Hello brave coder! There is no default scaffold, you can either use ' + chalk.yellow('nachos:taco') + ' or ' + chalk.yellow('nachos:dip') + ', good luck!'));
  }
});

