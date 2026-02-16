const core = require('@actions/core');
const exec = require('@actions/exec');

const validateBranchName = ({branchName}) => /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);
const validateDirectoryName = ({dirName}) => /^[a-zA-Z0-9_\-\/]+$/.test(dirName);
 
async function run() { 
  core.info('I am a custom JS action');
  const baseBranch = core.getInput('base-branch');
  const targetBranch = core.getInput('target-branch');
  const ghToken = core.getInput('gh-token');
  const workingDirectory = core.getInput('working-directory');
  const debug = core.getInput('debug');
  core.setSecret(ghToken);

if ( !validateBranchName({branchName: baseBranch})) {
    core.setFailed(" Invalid baser branch name. Only letters, numbers, underscores, hyphens, dots and slashes are allowed.")
    return;
}
if( !validateBranchName({branchName: targetBranch})) {
    core.setFailed(" Invalid target branch name. Only letters, numbers, underscores, hyphens, dots and slashes are allowed.")
    return;
}
if( !validateDirectoryName({dirName: workingDirectory})) {
    core.setFailed(" Invalid working directory name. Only letters, numbers, underscores, hyphens and slashes are allowed.")
    return;
}
core.info('[js-dependency update] : base branch is ${baseBranch}');
core.info ('[js-dependency update] : target branch is ${targetBranch}');
core.info ('[js-dependency update] : working directory is ${workingDirectory}');

await exec.exec('npm-update',[],{cwd: workingDirectory});

const gitStatus = await exec.getExecOutput('git status -s package*.json',[],{cwd: workingDirectory});

if (gitStatus.stdout.length > 0){
 core.info('there are update availble')
}else {
  core.info('there are no update availble')
}
}

run();
