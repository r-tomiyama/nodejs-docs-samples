# Google Cloud Platform Node.js Samples

Node.js samples for [Google Cloud Platform products][cloud].

See [cloud.google.com/nodejs][cloud_nodejs] to get up and running with Node.js
on Google Cloud Platform.

To browse documentation pages that use the samples found in this repository,
visit the [Google Cloud Samples][cloud_samples] page.

[cloud]: https://cloud.google.com/
[cloud_nodejs]: https://cloud.google.com/nodejs/
[cloud_samples]: https://cloud.google.com/docs/samples?language=nodejs%2Ctypescript

## Setup

1. Install [Node.js version 14 or greater][node]
1. Install the [Google Cloud CLI (gcloud)][gcloud]
1. Clone this repository
2. Obtain authentication credentials.

    Create local credentials by running the following command and following the
    oauth2 flow (read more about the command [here][auth_command]):

        gcloud auth application-default login

    Read more about [Google Cloud Platform Authentication][gcp_auth].

[node]: https://nodejs.org/
[gcloud]: https://cloud.google.com/sdk/docs/install
[auth_command]: https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login
[gcp_auth]: https://cloud.google.com/docs/authentication#projects_and_resources

## 検証

### Cloud Run のデプロイ

1. プロジェクトを選択する

```
gcloud config set project xxx
gcloud config get-value project
```

### デプロイを実行する

```
cd run/helloworld
npm install
./deploy.sh
```

## PubSub

```
gcloud auth application-default login
```

```
cd pubsub/publish
npm install
npm start
```
