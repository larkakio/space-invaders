/** Webpack resolves these to `@wagmi/connectors` implementation files (see next.config.mjs). */
declare module "@space-wagmi/baseAccount" {
  export { baseAccount } from "@wagmi/connectors";
}

declare module "@space-wagmi/walletConnect" {
  export { walletConnect } from "@wagmi/connectors";
}
