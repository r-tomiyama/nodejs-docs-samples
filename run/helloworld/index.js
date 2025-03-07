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

const app = express();

app.use(express.json()); // JSONボディを解析するミドルウェア

const apiTimeout = 1000;
app.use((req, res, next) => {
  //  const decodedData = req.body.message?.data ? Buffer.from(req.body.message.data, 'base64').toString() : null;
  //  const customTimeout = decodedData === "メッセージ 1" ? 10000 : apiTimeout;


  res.setTimeout(apiTimeout, () => {
    logger.info("2秒経過");
    // return res.status(503).send('Service Unavailable');

        // let err = new Error('Service Unavailable');
        // err.status = 503;
        // logger.info("Service Unavailable", { err });

        // throw err;
    });
    next();
});

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

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

app.post('/', async (req, res) => {
  const decodedData = req.body.message?.data ? Buffer.from(req.body.message.data, 'base64').toString() : null;
  const requestLog = { ...req.body, decodedData };
  logger.info("request", { requestLog });


  logger.info("5 seconds wait", { requestLog });
  await new Promise(resolve => setTimeout(resolve, 5000));

  const name = req.body.message?.attributes?.name || decodedData || null;
  if (!name) {
    return res.status(400).send('Name is required');
  }

  const result = `Hello ${name}!`;
  logger.info("response", { requestLog, result });
  return res.send(result);
});

const port = parseInt(process.env.PORT) || 8080;
const server = app.listen(port, () => {
  logger.info(`helloworld: listening on port ${port}`);
});
// [END cloudrun_helloworld_service]

server.timeout = apiTimeout;

server.on('timeout', (socket) => {
  logger.info("タイムアウトしました", { ...socket });
  // socket.end('リクエストがタイムアウトしました。');
});


// Exports for testing purposes.
export default app;
