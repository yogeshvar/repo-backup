const fsHelper = require('./helpers/fs.js');
const { exec } = require('child_process');

getRootDirectories = fsHelper.ignoreDotDirectories('/Users/mags/Work');

let gitRepos = [];

getRootDirectories.forEach(rootDir => {
  if (!fsHelper.isDirectory(rootDir)) {
    if (fsHelper.isGitRepo(rootDir)) {
      gitRepos.push(rootDir);
    }
  } else {
    const x = fsHelper.ignoreDotDirectories(rootDir);
    x.forEach(dir => {
      if (fsHelper.isGitRepo(dir)) {
        gitRepos.push(dir);
      } else if (fsHelper.isDirectory(dir)) {
        const y = fsHelper.getDirectories(dir);
        y.forEach(directory => {
          if (fsHelper.isGitRepo(directory)) {
            gitRepos.push(directory);
          } else if (fsHelper.isDirectory(directory)) {
            const z = fsHelper.getDirectories(directory);
            z.forEach(dir => {
              if (fsHelper.isGitRepo(dir)) {
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
        console.log(gitOrigins);
      }
    }
  );
});

console.log(gitRepos);
