# ui-plugin-examples
Example Extensions for the Rancher Dashboard UI.

This repository contains the following example extensions in the `pkg` folder.

|Name|Description|Rancher Version|
|----|-----------|---------------|
|clock|Adds a new feature to the top-level menu that shows a full-page clock|v2.7.0|
|extension-crd|Adds support for the Rancher Extensions CRD to Rancher Manager|v2.7.0|
|homepage|Example extension that changes the landing home page|v2.7.0|
|uk-locale|Adds a new UK localisation|v2.7.0|
|extensions-api-demo|Adds some examples of implementation of the new Extensions API|v2.7.2|
|top-level-product|Adds an example of a Top Level Product as an Extension|v2.7.2|
|node-driver|Example that allows for custom node drivers to support additional node provisioners in Rancher|v2.7.5|

To use these example in Rancher Manager, add this repository as a Helm Repository - to do this:

- Go to the local cluster, to 'Apps' and 'Repositories'
- Click 'Create' and enter a name, e.g. 'example-extensions'
- Choose Target 'Git repository containing Helm chart or cluster template definitions'
- Enter `https://github.com/rancher/ui-plugin-examples.git` for the 'Git Repo URL'
- Enter `main` for the Git Branch
- Click `Create`

The extensions should then appear on the 'Extenssions' page in Rancher Manager.

## Building and running locally

You can build and run the extensions locally, to do so:

- Run `yarn install`
- Set the API environment variable to point to a Rancher backend
- Run Rancher in development mode with `yarn dev`
- Open a web browser to `https://127.0.0.1:8005`

Once you login, you should see Rancher load with the extensions automatically loaded. You can edit the code for the extensions
and then should hot-reload within the browser.

### Bugs & Issues
Please submit bugs and issues to [rancher/dashboard](//github.com/rancher/dashboard/issues).

Or just [click here](//github.com/rancher/dashboard/issues/new) to create a new issue.

License
=======
Copyright (c) 2014-2022 [Rancher Labs, Inc.](http://rancher.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
