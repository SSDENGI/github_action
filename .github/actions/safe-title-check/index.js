const core = require('@actions/core');


async function run(){
    try{
        const title = core.getInput('pr-title');
        if (title.startsWith('feat:')){
            core.info('PR is feature');
        }
        else{
            core.info("PR is not feature");
        }
    }
    catch(error){
        core.info(`Error in safe-title-check action: ${error.message}`);

    }
}

run();
