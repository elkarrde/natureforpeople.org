# natureforpeople.org
WWF Adria PA-BAT website

## How to run locally
`lektor server -f webpack`

Don't forget to build a site before deploying:
`lektor build`

## Deploy

Run the following:

```Bash
./deploy-staging.sh
```

__BE AWARE THAT THIS WILL DELETE ALL CHANGES MADE ON THE SERVER AND DEPLOY
WHATEVER IS CURRENTLY ON MASTER__

## Pull code

Run the following:

```Bash
./pull-staging.sh
```


See it live on [**staging** server](https://staging.natureforpeople.org/).