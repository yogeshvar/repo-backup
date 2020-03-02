const { lstatSync, readdirSync, existsSync } = require('fs');
const { join } = require('path');
const os = require('os');
const { exec } = require('child_process');

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

getRootDirectories = ignoreDotDirectories(os.homedir());

let gitRepos = [];

getRootDirectories.forEach(rootDir => {
  if (!isDirectory(rootDir)) {
    if (isGitRepo(rootDir)) {
      gitRepos.push(rootDir);
    }
  } else {
    const x = ignoreDotDirectories(rootDir);
    x.forEach(dir => {
      if (isGitRepo(dir)) {
        gitRepos.push(dir);
      } else if (isDirectory(dir)) {
        const y = getDirectories(dir);
        y.forEach(directory => {
          if (isGitRepo(directory)) {
            gitRepos.push(directory);
          } else if (isDirectory(directory)) {
            const z = getDirectories(directory);
            z.forEach(dir => {
              if (isGitRepo(dir)) {
                gitRepos.push(dir);
              }
            });
          }
        });
      }
    });
  }
});

gitRepos.forEach(gitRepo => {
  exec(
    `cd ${gitRepo} && git config --get remote.origin.url`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        let gitOrigins = {};
        gitOrigins.gitRepo = gitRepo;
        gitOrigins.url = stdout.replace(/\r?\n|\r/g, '');
      }
    }
  );
});
