const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github')

const validateBranchName = ({branchName}) => /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);
const validateDirectoryName = ({dirName}) => /^[a-zA-Z0-9_\-\/]+$/.test(dirName);
 
async function run() { 
  core.info('I am a custom JS action');
  const baseBranch = core.getInput('base-branch');
  const targetBranch = core.getInput('target-branch');
  const ghToken = core.getInput('gh-token');
  const workingDirectory = core.getInput('working-directory');
  const debug = core.getBooleanInput('debug');
  const commonExecOpts = {cwd: workingDirectory};
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
core.info(`[js-dependency-update] : base branch is ${baseBranch}`);
core.info(`[js-dependency-update] : target branch is ${targetBranch}`);
core.info(`[js-dependency-update] : working directory is ${workingDirectory}`);

await exec.exec('npm', ['install'], { cwd: workingDirectory });

await exec.exec('npm', ['update'], { cwd: workingDirectory });

// await exec.exec('npm',[],{cwd: workingDirectory});

const gitStatus = await exec.getExecOutput('git status -s package*.json',[],{...commonExecOpts,});

const displayOutput = await exec.getExecOutput("pwd",[],{...commonExecOpts,});
core.info(`current working directory is --------------- ${displayOutput.stdout}`);
const listFiles = await exec.getExecOutput('ls -la',[],{...commonExecOpts,});
core.info(`list of files in the current working directory is --------------- ${listFiles.stdout}`);

let updatesAvailable = false;
if (gitStatus.stdout.length > 0){
 core.info('there are update availble');
 updatesAvailable = true;
 await exec.exec(`git config --global user.name "gh-actions"`);
 await exec.exec(`git config --global user.email "gh-actions@users.noreply.github.com"`);
 await exec.exec(`git checkout -b ${targetBranch}`,[],{...commonExecOpts,});
 await exec.exec(`git add package.json package-lock.json`,[],{...commonExecOpts,});
 await exec.exec(`git commit -m "chore: update dependencies"`,[],{...commonExecOpts,});
 await exec.exec(`git push -u origin ${targetBranch} --force`,[],{...commonExecOpts,});
 const octokit = github.getOctokit(ghToken);
 try{
  await octokit.rest.pulls.create({
  owner: github.context.repo.owner,
  repo: github.context.repo.repo,
  title: `Update dependencies from ${baseBranch}`,
  body: `this pull request update the dependencies `,
  base: baseBranch,
  head: targetBranch,
 })
}
catch(e){
  core.warning(`Failed to create pull request: ${e.message}`);
  core.setFailed(e.messages)
}
 

}else {
  core.info('there are no update availble')
}
core.setOutput('updates-available', updatesAvailable);
}

run();
