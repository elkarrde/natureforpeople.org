#! /bin/bash

set -e;

DEPLOY_USER=root
DEPLOY_HOST=natureforpeople.org
GIT_REPO_LOCATION=data/staging/source

echo ""
echo "---|> Connecting to server"
echo ""

ssh $DEPLOY_USER@$DEPLOY_HOST << HERE
  echo ""
  echo "---|> Reseting repository"
  echo ""

  git -C $GIT_REPO_LOCATION checkout .

  echo ""
  echo "---|> Pulling new code"
  echo ""

  git -C $GIT_REPO_LOCATION pull --force
HERE

echo ""
echo "---|> DONE"
echo ""
