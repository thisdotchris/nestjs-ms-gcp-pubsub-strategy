import { DynamicModule, Module, Provider } from "@nestjs/common";
import { GCPPubSubClient } from "./gcp-client";
import { GCPOptions } from "./gcp-options";

type Options = Omit<GCPOptions, 'subscription'> & { name: string };

@Module({})
export class GCPModule {
    static register( options: Options[]): DynamicModule {
        const provides = options.map<Provider>(option => ({
            provide: option.name,
            useValue: new GCPPubSubClient({
                projectId: option.projectId,
                topic: option.topic
            })
        }));

        return {
            module: GCPModule,
            providers: [...provides],
            exports: [...provides]
        }
    }
}