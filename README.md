# Close2Art_Open_API
Swagger interface to Close2Art's API

## Dependencies

For linux, it's recommended to create a user named *node* (the name isn't important - just not root) for running the server.

Installing GraphicsMagick

$ sudo apt-get update
$ sudo apt-get install graphicsmagick
	
The remaining instructions don't require *root* so switch to the *node* (or any non-root) user.

#### Package managers
Npm is required for managing the *node.js* libraries which aren't included in the source.

	$ sudo apt-get install npm

### Code repository
The project resides on github and requires *git*.

	$ sudo apt-get install git
	$ mkdir ~/git
	$ cd ~/git
	$ git clone  https://github.com/SebSMK/xxx
	
### Install the required node libraries

	$ cd ~/git/c2a_open_api
	$ npm install
