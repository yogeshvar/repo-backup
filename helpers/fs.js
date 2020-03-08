const { lstatSync, readdirSync, existsSync } = require('fs');
const { join } = require('path');
const isFile = source => lstatSync(source).isFile();

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const isDotDirectory = path => /(^|\/)\.[^\/\.]/g.test(path);

const getDirectoryNames = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(directory => directory.isDirectory())
    .map(directory => directory.name);

const getFiles = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isFile);

const ignoreDotDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(file => {
      if (isDotDirectory(file)) {
        return null;
      } else {
        return file;
      }
    });
const isGitRepo = directory => existsSync(join(directory, '.git'));

module.exports = {
  isFile,
  isDirectory,
  getDirectories,
  isDotDirectory,
  getDirectoryNames,
  getFiles,
  ignoreDotDirectories,
  isGitRepo
};
