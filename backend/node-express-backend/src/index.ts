// Local dev and Workers deploy both use worker.ts via `wrangler dev`.
// This file re-exports for backward compatibility.
export {default} from './worker'
