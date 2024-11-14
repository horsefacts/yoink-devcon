import { EventEmitter } from 'eventemitter3';
import { appFrameHost } from './appFrameHost';
export function createEmitter() {
    const emitter = new EventEmitter();
    return {
        get eventNames() {
            return emitter.eventNames.bind(emitter);
        },
        get listenerCount() {
            return emitter.listenerCount.bind(emitter);
        },
        get listeners() {
            return emitter.listeners.bind(emitter);
        },
        addListener: emitter.addListener.bind(emitter),
        emit: emitter.emit.bind(emitter),
        off: emitter.off.bind(emitter),
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        removeAllListeners: emitter.removeAllListeners.bind(emitter),
        removeListener: emitter.removeListener.bind(emitter),
    };
}
const emitter = createEmitter();
export const sdk = {
    ...emitter,
    untrustedUser: appFrameHost.untrustedUser,
    setPrimaryButton: appFrameHost.setPrimaryButton.bind(appFrameHost),
    hideSplashScreen: appFrameHost.hideSplashScreen.bind(appFrameHost),
    followChannel: appFrameHost.followChannel.bind(appFrameHost),
    close: appFrameHost.close.bind(appFrameHost),
    openUrl: appFrameHost.openUrl.bind(appFrameHost)
};
document.addEventListener("FarcasterAppFrameEvent", (event) => {
    if (event instanceof MessageEvent) {
        if (event.data.type === 'primaryButtonClicked') {
            emitter.emit('primaryButtonClicked');
        }
    }
});
//# sourceMappingURL=sdk.js.map