#! /bin/bash

set -e;

DEPLOY_USER=root
DEPLOY_HOST=natureforpeople.org
GIT_REPO_LOCATION=/root/data/staging/source
BRANCH_NAME="staging-merge/date-$(date +%s000)"
TAR_NAME="$BRANCH_NAME.tar.gz"
LOCAL_TAR_STORE=/tmp/$TAR_NAME

ssh $DEPLOY_USER@$DEPLOY_HOST << HERE
  echo ""
  echo "---|> Packing code"
  echo ""

  tar -czf $TAR_NAME $GIT_REPO_LOCATION
HERE

echo ""
echo "---|> Moving to empty branch '$BRANCH_NAME'"
echo ""

git branch $BRANCH_NAME \
  && git checkout $BRANCH_NAME \
  && rm -r $(ls)

echo ""
echo "---|> Pulling code"
echo ""

scp $DEPLOY_USER@$DEPLOY_HOST:$TAR_NAME $LOCAL_TAR_STORE

echo ""
echo "---|> Unpacking code"
echo ""

tar -xzf $LOCAL_TAR_STORE \
  && rm -rf $LOCAL_TAR_STORE

ssh $DEPLOY_USER@$DEPLOY_HOST << HERE
  echo ""
  echo "---|> Cleaning server"
  echo ""

  rm $TAR_NAME
HERE

echo ""
echo "---|> DONE"
echo ""
