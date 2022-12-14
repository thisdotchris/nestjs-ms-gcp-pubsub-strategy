import { PubSub, Subscription, Topic, Message } from "@google-cloud/pubsub";
import { CustomTransportStrategy, Server, Transport } from "@nestjs/microservices";
import { GCPOptions } from "./gcp-options";

export class GCPPubSubServer extends Server implements CustomTransportStrategy {
    transportId?: symbol | Transport;
    pubsub: PubSub;

    constructor(private readonly options: GCPOptions) {
        super();
    }

    private async _init(): Promise<void> {
        let subscription: Subscription, topic: Topic;

        if (!this.pubsub) return;

        topic = await this.pubsub.topic(this.options.topic);
        subscription = await topic.subscription(this.options.subscription);

        const [isSubscriptionExists] = await subscription.exists();

        if (!isSubscriptionExists) {
            const [createdSubscription] = await subscription.create();
            subscription = createdSubscription;
        }

        subscription.on('message', async (message: Message) => {
            const cmd = message.attributes?.cmd;
            const handler = this.messageHandlers.get(cmd) || this.messageHandlers.get(JSON.stringify({ cmd }));

            if (typeof handler !== 'function') return;

            const res = await handler(message);

            if (handler.isEventHandler || !message.attributes?.id || !message.attributes.responseTopic) return;
            
            /**
             * Publish response to response topic where the sender subscribed
             */            
            const data = Buffer.from(JSON.stringify(res || ''));
            const responseTopic = await this.pubsub.topic(message.attributes.responseTopic);

            await responseTopic.publish(data, { id: message.attributes?.id });
        });
    }

    listen(callback: (...optionalParams: unknown[]) => any) {
        this.pubsub = this.pubsub ?? new PubSub({ projectId: this.options.projectId });

        this._init()
            .then(callback)
            .catch(this.logger.error.bind(this.logger));
    }

    close() {
        if (this.pubsub) this.pubsub.close();
    }
}