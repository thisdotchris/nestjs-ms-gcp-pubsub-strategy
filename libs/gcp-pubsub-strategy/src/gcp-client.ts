import { PubSub, Topic } from "@google-cloud/pubsub";
import { ClientProxy, ReadPacket, WritePacket } from "@nestjs/microservices";
import { GCPOptions } from "./gcp-options";

type Options = Omit<GCPOptions, "subscription">;

export class GCPPubSubClient extends ClientProxy {
    pubsub: PubSub;
    topic: Topic;

    constructor(private readonly options: Options) {
        super();
    }

    async connect(): Promise<any> {
        this.pubsub = this.pubsub ?? new PubSub({ projectId: this.options.projectId });
        this.topic = this.topic ?? await this.pubsub.topic(this.options.topic);
        return;
    }

    close() {
        if (this.pubsub) this.pubsub.close();
    }

    protected publish(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): () => void {
        return () => {};
    }

    protected dispatchEvent<T = any>(packet: ReadPacket<any>): Promise<T> {
        const cmd = packet.pattern?.cmd || packet.pattern;
        const data = Buffer.from(JSON.stringify(packet.data));
        this.topic.publish(data, { cmd });
        return;
    }
}