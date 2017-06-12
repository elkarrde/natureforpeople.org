#! /bin/bash

set -e;

DEPLOY_USER=root
DEPLOY_HOST=natureforpeople.org
GIT_REPO_LOCATION=data/staging/source
BRANCH_INSTANCE="date-$(date +%s000)"
BRANCH_NAME="staging-merge/$BRANCH_INSTANCE"
TAR_NAME="$BRANCH_INSTANCE.tar.gz"
LOCAL_TAR_STORE=/tmp/$TAR_NAME

echo ""
echo "---|> Packing code"
echo ""

ssh $DEPLOY_USER@$DEPLOY_HOST << HERE
  cp -r $GIT_REPO_LOCATION $BRANCH_INSTANCE
  cd $BRANCH_INSTANCE
  tar -czf $TAR_NAME *
  mv $TAR_NAME ~/$TAR_NAME
HERE

echo ""
echo "---|> Stashing code in working tree"
echo ""

git stash

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

echo ""
echo "---|> Commiting changes"
echo ""

git add --all
git commit -m "Pulled changes from $DEPLOY_HOST at $(date)"

echo ""
echo "---|> Cleaning server"
echo ""

ssh $DEPLOY_USER@$DEPLOY_HOST << HERE
  rm -rf $BRANCH_INSTANCE
  rm $TAR_NAME
HERE

echo ""
echo "---|> DONE"
echo ""
echo "Remember to use 'git stash pop' to get your uncommited changes back!"
echo ""
