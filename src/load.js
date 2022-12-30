/**
 * Loads templates from Github and modifies
 * them according to project configurations
 */
// saving files
var path = require("path");
// extracting file
const shell = require('shelljs')
// download file
const fs = require('fs');
const download = require('download');

function downloadTemplate(download_url, file_name, callback_done) {
    download(download_url, file_name, { extract: true })
        .then(() => {
            console.log('Download Completed ', file_name);
            callback_done(file_name);
        })
}

function cloneTemplate(template_name, version_name, target_directory = "./tmp", callback_done) {
    const repo_url = `https://github.com/modellers/${template_name}/archive/refs/heads/${version_name}.zip`
    const path_uri = `${target_directory}/${template_name}-${version_name}/`
    downloadTemplate(repo_url, target_directory, function (file_name) {
        console.log('Downloaded to ', path_uri);
        callback_done(path_uri);
    });
}

function randomPortBetween(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

function findAvailablePort(callback) {
    const available_port = 3033; // TODO: find dynamically
    callback(available_port)
}

function mergeConfingWithPackage(directory, config) {
    // check if there is any thing to import
    if (Object.keys(config["imports"]).length > 0) {
        const file_package_path = `${directory}/package.json`
        // TODO: validate that the package file is in root directory
        // read package file and make object
        const package = JSON.parse(fs.readFileSync(file_package_path, 'utf8'));
        package["dependencies"] = Object.assign({}, package["dependencies"], config["imports"]);
        // TODO: remove devDependencies
        // write package file
        fs.writeFileSync(file_package_path, JSON.stringify(package, null, 2));
    }
}

function registerPluginPackages(working_directory, config) {
    const file_plugin_path = `${working_directory}/src/components/Plugins.js`

    let component_plugins_import = "";
    let component_plugins_register = "";

    for (var import_name in config["imports"]) {
        var register_function_name = "register_" + import_name.replace(/-/g, "_").replace(/ /g, "_").trim()
        component_plugins_import = component_plugins_import + "    import { registerComponents as " + register_function_name + " } from '" + import_name.trim() + "';\n"
        component_plugins_register = component_plugins_register + "        " + register_function_name + "(component_manager);\n"
    }

    const plugin_file_content = `

    // Managers and factories
    import ComponentManager from './Layout/Manager'
    
    // Components
${component_plugins_import}
    
    export default function registerPluginComponents(component_manager) {
    
        if (!component_manager) {
            component_manager = ComponentManager.getInstance();
        }
    
        if (component_manager.constructor.name !== 'ComponentManager') {
            throw "Constructor must be component manager";
        }
${component_plugins_register}
    }    
    `
    fs.writeFileSync(file_plugin_path, plugin_file_content);
}

function loadByConfig(config, directory = "./tmp") {

    // TODO: validate configuration cfg
    console.info("========== > clearing < ===========")
    shell.rm('-rf', directory) // if reinstall
    console.info("========== > cloning < ===========")
    cloneTemplate(config["target"]["import"], config["target"]["version"], directory, function (working_directory) {
        // cleanup
        shell.rm('-f', `${working_directory}/yarn.lock`) // if reinstall
        // TODO: configure new server
        mergeConfingWithPackage(working_directory, config)
        registerPluginPackages(working_directory, config)

        // install server
        shell.cd(working_directory)
        shell.env["SKIP_PREFLIGHT_CHECK"] = true
        console.info("========== > install < ===========")
        shell.exec('yarn install')

        // startup server (looking for empty port)
        findAvailablePort(function (available_port) {
            // assign port
            shell.env["PORT"] = available_port
            console.info("========== > running < ===========")
            let process = shell.exec('yarn run dev:react', { async: true })
            setTimeout(() => {
                process.kill('SIGINT');
            }, 900000)
        });

    });
}



module.exports = {
    loadByConfig: loadByConfig
};