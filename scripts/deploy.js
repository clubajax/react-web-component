const path = require('path');
const files = require('./node-file-managment');

console.log('PWD', __dirname);
const deployDir = './build';
files.mkdir(deployDir);

files.copyFile('./index.js', path.resolve(deployDir, 'index.js'));
updateVersion();

function updateVersion() {
    const buildPackage = files.readJson('./scripts/package.json');
    const mainPackage = files.readJson('./package.json');
    
        if (mainPackage.version !== buildPackage.version) {
            // has been manually updated
        } else {
            // increment main version
            const version = mainPackage.version.split('.');
            version[2] = parseInt(version[2], 10) + 1;
            mainPackage.version = version.join('.');
            console.log('package.version changed to:', mainPackage.version);
        }
    buildPackage.version = mainPackage.version;
    if (mainPackage.dependencies) {
        // copy over updated dependencies
        buildPackage.dependencies = mainPackage.dependencies;
    }

    files.writeJson('./scripts/package.json', buildPackage);
    files.writeJson('./package.json', mainPackage);
    files.copyFile('./scripts/package.json', './build/package.json');
}