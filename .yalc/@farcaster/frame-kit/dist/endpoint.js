var _a;
import { windowEndpoint } from "comlink";
const webViewEndpoint = {
  postMessage: (data) => {
    console.debug("[webview:req]", data);
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  },
  addEventListener: (_, listener, ...args) => {
    document.addEventListener("FarcasterAppFrameCallback", listener, ...args);
  },
  removeEventListener: (_, listener) => {
    document.removeEventListener("FarcasterAppFrameCallback", listener);
  },
};
export const endpoint = (
  window === null || window === void 0 ? void 0 : window.ReactNativeWebView
)
  ? webViewEndpoint
  : // TODO fallback cleanly when not in iFrame or webview
    windowEndpoint(
      (_a = window === null || window === void 0 ? void 0 : window.parent) !==
        null && _a !== void 0
        ? _a
        : window,
    );
//# sourceMappingURL=endpoint.js.map
