#!/bin/bash

curl -fsSL https://gitea.com/gitea/tea/raw/branch/main/install.sh | sh

tea login add --name=gitea-enterprise --url=https://gitea.spectrumwebco.com --token=${GITEA_TOKEN}

mkdir -p .gitea/workflows/
cp infrastructure/ci-cd/gitea-actions/ci.yml .gitea/workflows/

git add .gitea/workflows/ci.yml
git commit -m "Add Gitea Actions workflow"
git push origin HEAD

echo "Gitea Actions workflow setup complete"

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
