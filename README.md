# Modeller CLI

Create / Maintain modeller apps

Inspired by https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs

## Install / uninstall

##### To install

    npm install -g modeller-cli

##### To uninstall

    npm uninstall -g modeller-cli


# Usage

To run server execute 

    modeller dev <PROJECT-ID> (<TARGET-ID> (<VERSION-ID>))

# Plugin development

Prerequisite include 
    - Git installed
    - Yarn installed globaly

#### Local

Create a plugin by running

    modeller plugin create <PLUGIN-NAME>

Then commit you work to a git repository that is accessible by modeller-cli
Through the UI add the plugin to your project (making sure it is available to all team members).
To add the plugin simply import plugin entering the full URI to your git repo.
This should add a new plugin to your development UI.

To validate the plugin run

    modeller plugin test <PLUGIN-NAME>

This will validate that the following conditions are met
  - can be loaded
    - has a dist folder that exports correctly and exports correctly main / module / source
    - package name matches the repo name
    - imported dependencies in the files are not local (example: ../modelui-core-runtime)
    - uses rollup command

#### Global

Follow same steps as local development. To publish to your store execute

    modeller plugin deploy <PLUGIN-NAME>

To publish to global store enter

    modeller plugin publish <PLUGIN-NAME>