# ui-plugin-examples
Example Extensions for the Rancher Dashboard UI.

This repository contains the following example extensions in the `pkg` folder.

Developers should consider the extensions included in this repository primarily as code examples to follow. These extensions should be compliant with the latest version of Rancher.
If you are interested in the publishing process, we recommend following our official documentation about [publishing an extension](https://extensions.rancher.io/extensions/next/publishing).

|Name|Description|Rancher Version|
|----|-----------|---------------|
|clock|Adds a new feature to the top-level menu that shows a full-page clock|v2.10.0|
|extension-crd|Adds support for the Rancher Extensions CRD to Rancher Manager|v2.10.0|
|homepage|Example extension that changes the landing home page|v2.10.0|
|uk-locale|Adds a new UK localisation|v2.10.0|
|extensions-api-demo|Adds some examples of implementation of the new Extensions API|v2.10.0|
|top-level-product|Adds an example of a Top Level Product as an Extension|v2.10.0|
|node-driver|Example that allows for custom node drivers to support additional node provisioners in Rancher|v2.10.0|
|large-extension|for internal testing purposes only (caching mechanism)|v2.10.0|


To use these examples in Rancher Manager, add this repository as a Helm Repository - to do this:

- Go to the local cluster, to 'Apps' and 'Repositories'
- Click 'Create' and enter a name, e.g. 'example-extensions'
- Choose Target 'Git repository containing Helm chart or cluster template definitions'
- Enter `https://github.com/rancher/ui-plugin-examples.git` for the 'Git Repo URL'
- Enter `main` for the Git Branch
- Click `Create`

The extensions should then appear on the 'Extensions' page in Rancher Manager.

## Building and running locally

You can build and run the extensions locally, to do so:

- Run `yarn install`
- Set the API environment variable to point to a Rancher backend
- Run Rancher in development mode with `yarn dev`
- Open a web browser to `https://127.0.0.1:8005`

Once you login, you should see Rancher load with the extensions automatically loaded. You can edit the code for the extensions
and then should hot-reload within the browser.

## Releasing an extension

In order to publish an extension, just create a [tagged release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) with the following format:

```
"EXT-NAME-IN-PKG-PACKAGEJON"-"VERSION-NUMBER"
```

Example for publishing the `extensions-api-demo` extension version `0.2.3`:

```
extensions-api-demo-0.2.3
```

This will create a PR with all the assets needed for the publish. Check the contents of the PR and if all is looking good, approve and merge to officially publish it. 

### Bugs & Issues
Please submit bugs and issues to [rancher/dashboard](//github.com/rancher/dashboard/issues). Assign the label `area/extensions`

Or just [click here](//github.com/rancher/dashboard/issues/new) to create a new issue. Assign the label `area/extensions`.

License
=======
Copyright (c) 2014-2025 [SUSE](https://www.suse.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
