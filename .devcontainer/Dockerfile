# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.238.0/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version (use ubuntu-22.04 or ubuntu-18.04 on local arm64/Apple Silicon): ubuntu-22.04, ubuntu-20.04, ubuntu-18.04
ARG VARIANT="ubuntu-18.04"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# need node <10, but npm newer than 3.x to work around
# install newer npm to work https://github.com/npm/cli/issues/681
 RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends npm \
     && npm install -g npm@6 \
     && rm -rf /var/lib/apt/lists/*


