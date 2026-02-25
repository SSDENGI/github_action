const core = require('@actions/core');

title = core.getInput('pr-title')

if (title.startsWith('feat:')){
  core.inro('PR is feature')
}
else{
    core.info("PR is not feature")
}
