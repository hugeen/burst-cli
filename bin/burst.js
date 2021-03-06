#!/usr/bin/env node

'use strict';

var Liftoff = require('liftoff');

var BurstCLI = new Liftoff({
    name: 'burst',
    cwdOpt: 'cwd',
    requireOpt: 'require'
}).on('require', function(name, module) {
    if (name === 'coffee-script') {
        module.register();
    }
}).on('requireFail', function(name, err) {
    console.log('Unable to load:', name, err);
});

BurstCLI.launch(launcher);

function launcher(env) {
    if (env.argv.verbose) {
        console.log('LIFTOFF SETTINGS:', this);
        console.log('CLI OPTIONS:', env.argv);
        console.log('CWD:', env.cwd);
        console.log('LOCAL MODULES PRELOADED:', env.preload);
        console.log('EXTENSIONS RECOGNIZED:', env.validExtensions);
        console.log('SEARCHING FOR:', env.configNameRegex);
        console.log('FOUND CONFIG AT:', env.configPath);
        console.log('CONFIG BASE DIR:', env.configBase);
        console.log('YOUR LOCAL MODULE IS LOCATED:', env.modulePath);
        console.log('LOCAL PACKAGE.JSON:', env.modulePackage);
        console.log('CLI PACKAGE.JSON', require('../package'));
    }

    if (env.configPath) {
        process.chdir(env.configBase);
        require(env.configPath);
    } else {
        console.log('No Burstfile found.');
    }

}
