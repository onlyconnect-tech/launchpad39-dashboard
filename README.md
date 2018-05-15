# cloud_station

## PREINSTLLATION

Install browserify:

> `npm install browserify -g`

Install http-server for development/testing

> `npm install http-server -g`

Install gulp:

> `npm install gulp-cli -g`

## INSTALLATION

> `npm install`

## RUNNING

> `http-server`

or

> `gulp connect`

## DEPLOY

Before create a `.env` file with proper configurations for mqtt and authentication/authorization. See `.env_template` for example. See https://github.com/dwyl/env2 for general explanation on env2 library.

During `gulp configure` thask .env variable values are substitutes in js files, for proper configuration. 

> `gulp`

## DEVELOPMENT

> `gulp dev`

## GENERATE DISTRIBUTION

> `gulp && gulp zip`

## GENERATE DOC

> `jsdoc -c .\conf.json`

## RESOURCES

[Reading files in JavaScript using the File APIs](https://www.html5rocks.com/en/tutorials/file/dndfiles/)

[Styling & Customizing File Inputs the Smart Way](https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/) (NO MORE USED). Now used .env mechanism.





