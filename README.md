# Sysinformer

**Sysinformer** is an application that displays the information about your device.

It displays:
+ Basic information
+ CPU data
+ Memory data
+ GPU data
+ Storage information
+ Network data
+ *Killable* processes (task-manager style)
+ Report generation in JSON, CSV or PDF

## Developer information

You may fork the app if you wish. Below are the scripts added (written during v1.0.0, so it may change with newer patches):

+ `npm start` - Starts the application in **development mode**
+ `npm run start:react` - Starts the client in **development mode**
+ `npm run build` - Builds the client for **production mode**
+ `npm run package` - Builds the desktop for **production mode**
+ `npm run serve` - Serves the client build in **production mode**
+ `npm run patch` - Increments the semantic patch section of the version (rightmost part)
+ `npm run major` - Increments the semantic major section of the version (middle part)
+ `npm run minor` - Increments the semantic minor section of the version (leftmost part)
+ `npm run prod` - Builds and packages the entire application