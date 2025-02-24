#!/bin/bash

# デプロイ用の変数を設定
export SERVICE_NAME=my-pull-subscriber
export REGION=asia-northeast1
export PROJECT_ID=$(gcloud config get-value project)
export CONTAINER_IMAGE=gcr.io/${PROJECT_ID}/${SERVICE_NAME}

# コンテナイメージのビルドとプッシュ
gcloud builds submit --tag $CONTAINER_IMAGE

# Cloud Run サービスへのデプロイ
gcloud run deploy $SERVICE_NAME \
  --image $CONTAINER_IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --no-cpu-throttling \
  --min-instances 1 \
  --max-instances 5 \
  --concurrency 10 \
  --cpu=1 \
  --memory=512Mi \
  --timeout=30s
