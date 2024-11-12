import { Provider, RpcRequest } from 'ox';
import { appFrameHost } from "./appFrameHost";
const emitter = Provider.createEmitter();
const store = RpcRequest.createStore();
export const provider = Provider.from({
    ...emitter,
    async request(args) {
        return await appFrameHost.ethProviderRequest(
        // @ts-expect-error - from ox examples but our FetchFn needs better typing
        store.prepare(args));
    },
});
document.addEventListener("FarcasterAppFrameEvent", (event) => {
    if (event instanceof MessageEvent) {
        console.log("FarcasterAppFrameEvent", event.type, event.data);
        // TODO narrow to EventMap types
        // emitter.emit(event.type as (keyof Provider.EventMap), event.data);
    }
});
//# sourceMappingURL=provider.js.map