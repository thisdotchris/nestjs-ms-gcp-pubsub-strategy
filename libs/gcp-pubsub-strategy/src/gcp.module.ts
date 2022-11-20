import { PubSub, Topic } from "@google-cloud/pubsub";
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { GCPPubSubClient } from "./gcp-client";
import { GCPOptions } from "./gcp-options";

type Options = Omit<GCPOptions, 'subscription'> & { name: string, responseTopic?: string };

@Module({})
export class GCPModule {
    static register(options: Options[]): DynamicModule {
       try {
        const provides = options.map<Provider>(option => ({
            provide: option.name,
            useFactory: () => {
                const client = new GCPPubSubClient({
                    projectId: option.projectId,
                    topic: option.topic,
                    responseTopic: option.responseTopic
                })

                return client;
            }
        }));

        return {
            module: GCPModule,
            providers: [...provides],
            exports: [...provides]
        }
       } catch (error) {
            console.error(error.stack || error);
       }
    }
}