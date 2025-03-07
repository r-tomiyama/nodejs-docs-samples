import { PubSub } from '@google-cloud/pubsub';
import 'dotenv/config'

// Google Cloud プロジェクト ID とトピック名を設定
const projectId = process.env.PROJECT_ID;
const topicName = process.env.TOPIC_NAME;

// PubSub クライアントのインスタンスを作成
const pubSubClient = new PubSub({ projectId });

async function publishMessages() {
    const publishPromises = [];

    for (let i = 0; i < 2; i++) {
        const dataBuffer = Buffer.from(`メッセージ ${i + 1}`);
        const orderingKey = undefined;

        const publishPromise = pubSubClient
            .topic(topicName)
            .publishMessage({ data: dataBuffer, orderingKey })
            // .then(result => {
            //     console.log(`メッセージ(${result})をパブリッシュしました。`);
            // })
            .catch(error => {
                console.error(`メッセージのパブリッシュ中にエラーが発生しました: ${error.message}`);
            });

        publishPromises.push(publishPromise);
    }

    await Promise.all(publishPromises);
    console.log(`全てのメッセージをパブリッシュしました。`);
}

publishMessages();
