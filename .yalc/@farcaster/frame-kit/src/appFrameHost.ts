import { wrap } from "comlink";
import { endpoint } from "./endpoint"
import { AppFrameHost } from "./types";

export const appFrameHost = wrap<AppFrameHost>(endpoint);
