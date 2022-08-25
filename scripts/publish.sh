#!/usr/bin/env bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BASE_DIR="$( cd $SCRIPT_DIR && cd .. & pwd)"

echo "Publishing UI Plugins"

# Check GitHub release - use the package.json file for the version

pushd ${BASE_DIR} > /dev/null

VERSION=$(jq -r .version package.json)

echo "Version: $VERSION"

which gh
if [ $? -ne 0 ]; then
  echo "You need to install the GitHub CLI tool (gh) and ensure it is on the path"
  exit 1
fi

# Need GH_TOKEN to be set as well
if [ -z "$GH_TOKEN" ]; then
  echo "You need to set the GH_TOKEN environment varibale for the GitHub CLI tool (gh)"
  exit 1
fi

REPO=$(git config --get remote.origin.url | sed -e 's/^git@.*:\([[:graph:]]*\).git/\1/')

echo "GitHub Repository: ${REPO}"

# Check that release does not already exist

gh release view -R ${REPO} ${VERSION} > /dev/null
if [ $? -eq 0 ]; then
  echo "Release already exists on GitHub; update package.json to change the version number"
  exit 1
fi

for d in pkg/*/ ; do
  pkg=$(basename $d)
  echo "Building plugin: $pkg"
  yarn build-pkg $pkg

  # Tar gzip each of the plugins
  PKG_VERSION=$(jq -r .version ./pkg/${pkg}/package.json)
  echo "Package version: ${PKG_VERSION}"

  PKG_NAME="${pkg}-${PKG_VERSION}"

  echo "Package version: ${PKG_VERSION}"
  echo "Package folder:  ${PKG_NAME}"

  pushd ./dist-pkg > /dev/null
  rm -f ${PKG_NAME}.tgz
  tar --exclude=report.html -czvf ${PKG_NAME}.tgz ./${PKG_NAME}/
  popd > /dev/null

done

echo "Creating GitHub Release"

gh release create -R ${REPO} ${VERSION} --generate-notes -t "Release ${VERSION}" ./dist-pkg/*.tgz

popd > /dev/null
