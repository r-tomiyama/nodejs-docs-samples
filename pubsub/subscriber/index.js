// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START cloudrun_helloworld_service]
import express from 'express';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { createLogger } from "winston";
import { PubSub } from '@google-cloud/pubsub';

const app = express();

const port = process.env.PORT || 8080;
const pubSubClient = new PubSub();
const subscriptionName = process.env.SUBSCRIPTION_NAME || 'test-peko-hello-pull';

app.use(express.json()); // JSONボディを解析するミドルウェア

const logger = createLogger({
  transports: [
    new LoggingWinston({
      // これにより Cloud Logging API ではなく標準出力にログを記録するようになる
      redirectToStdout: true,

      // デフォルト値は true で logger に与えられたデータをオブジェクトでラップして書き込む
      // 例: { "message": { /* log data */ } }
      // false にするとログデータをそのまま標準出力に書き込んでくれるようになる
      useMessageField: false,
    }),
  ],
});

// ヘルスチェック用エンドポイント
app.get('/', (req, res) => res.send('Service is running'));

// サービス起動時に pull を開始
function startPulling() {
  const subscription = pubSubClient.subscription(subscriptionName);
  subscription.on('message', async message => {
    const messageData = message.data.toString();
    const messageLog = {
      id: message.id,
      ackId: message.ackId,
      parentSpan: message.parentSpan,
      orderingKey: message.orderingKey,
      publishTime: message.publishTime,
      deliveryAttempt: message.deliveryAttempt,
      attributes: message.attributes,
      messageData,
    };

    logger.info(`pull ${messageData}`, messageLog);

    logger.info("10 seconds wait", messageLog);
    await new Promise(resolve => setTimeout(resolve, 10000));

    logger.info("ack", messageLog);
    message.ack();
  });
}


// サーバー起動と pull の開始
app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
  // startPulling();
});



// Exports for testing purposes.
export default app;
