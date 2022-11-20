import { Message, PubSub, Topic } from "@google-cloud/pubsub";
import { ClientProxy, ReadPacket, WritePacket } from "@nestjs/microservices";
import { v4 as uuid } from 'uuid';
import { GCPOptions } from "./gcp-options";

type Options = Omit<GCPOptions, "subscription"> & { responseTopic?: string };

export class GCPPubSubClient extends ClientProxy {
    responseTopicSubName = 'topic-response-handler';
    pubsub: PubSub;
    topic: Topic;
    queueCallback = new Map();

    private async init() {
        this.pubsub = this.pubsub ?? new PubSub({ projectId: this.options.projectId });
        this.topic = this.topic ?? await this.pubsub.topic(this.options.topic);

        if (this.options?.responseTopic) {
            const responseTopic = await this.pubsub.topic(this.options?.responseTopic);
            const responseTopicSub = responseTopic.subscription(this.responseTopicSubName);
            const [exists] = await responseTopicSub.exists();

            if (!exists) await responseTopicSub.create();

            responseTopicSub.on('message', async (message: Message) => {
                const id = message.attributes?.id;
                const handler: (packet: WritePacket<any>) => void = this.queueCallback.get(id);

                if (typeof handler !== 'function') return;

                await handler({ response: message.data.toString() });

                this.queueCallback.delete(id);
                message.ack();
            });
        }
    }

    constructor(private readonly options: Options) {
        super();
        this.init();
    }

    async connect(): Promise<any> { }

    close() {
        if (this.pubsub) this.pubsub.close();
    }

    protected publish(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): () => void {
        const { cmd, data } = this.getPayload(packet);
        const id = uuid();
        const responseTopic = this.options?.responseTopic;

        this.topic.publish(data, { cmd, id, responseTopic });
        this.queueCallback.set(id, callback);

        return;
    }

    protected dispatchEvent<T = any>(packet: ReadPacket<any>): Promise<T> {
        const { cmd, data } = this.getPayload(packet);
        this.topic.publish(data, { cmd });
        return;
    }

    private getPayload(packet: ReadPacket<any>) {
        const cmd: string = packet.pattern?.cmd || packet.pattern;
        const data: Buffer = Buffer.from(JSON.stringify(packet.data));

        return { cmd, data }
    }
}