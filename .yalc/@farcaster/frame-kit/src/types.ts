import type { EventEmitter } from 'eventemitter3'
import type { RpcTransport } from "ox";

declare global {
  interface Window {
    // Exposed by react-native-webview
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}

/** Combines members of an intersection into a readable type. */
// https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
export type Compute<type> = { [key in keyof type]: type[key] } & unknown

export type EventMap = {
  primaryButtonClicked: () => void
}

export type Emitter = Compute<EventEmitter<EventMap>>

export type SetPrimaryButton = (
	options: { 
    text: string; 
    loading?: boolean;
    disabled?: boolean;
    hidden?: boolean;
	}
) => Promise<void>;

export type AppFrameHost = {
  untrustedUser: {
    fid: number;
  };
  close: () => void;
  hideSplashScreen: () => void;
  openUrl: (url: string) => void;
  setPrimaryButton: SetPrimaryButton;
  ethProviderRequest: RpcTransport.RequestFn;
}

export type AppFrameSDK = {
  untrustedUser: Promise<{
    fid: number;
  }>;
  close: () => Promise<void>;
  hideSplashScreen: () => Promise<void>;
  openUrl: (url: string) => Promise<void>;
  setPrimaryButton: SetPrimaryButton;
} & Emitter;
