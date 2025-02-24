import { PubSub } from '@google-cloud/pubsub';
import 'dotenv/config'

// Google Cloud プロジェクト ID とトピック名を設定
const projectId = process.env.PROJECT_ID;
const topicName = process.env.TOPIC_NAME;

// PubSub クライアントのインスタンスを作成
const pubSubClient = new PubSub({ projectId });

async function publishMessages() {
    for (let i = 0; i < 7; i++) {
        // const buffers = Array.from({ length: 3 }, (_, j) => Buffer.from(`メッセージ ${i + 1}-${j + 1}`));
        const dataBuffer = Buffer.from(`メッセージ ${i + 1}`);
        const orderingKey = i % 2 === 0 ? "test-peko" : undefined;

        try {
            const result = await pubSubClient
                .topic(topicName)
                // .publishMessages(buffers);
                // .publishMessage({ data: dataBuffer });
                .publishMessage({ data: dataBuffer, orderingKey });
            console.log(`メッセージ(${result})をパブリッシュしました。`);
        } catch (error) {
            console.error(`メッセージのパブリッシュ中にエラーが発生しました: ${error.message}`);
        }
    }
}

publishMessages();
