#!/bin/bash

# デプロイ用の変数を設定
export SERVICE_NAME=helloworld
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
  --min-instances 0 \
  --max-instances 100 \
  --concurrency 210 \
  --cpu=1 \
  --memory=512Mi \
  --timeout=3s
