import createNextIntlPlugin from "next-intl/plugin";
import {PHASE_DEVELOPMENT_SERVER} from "next/constants";

export default function config(phase: string) {
  return createNextIntlPlugin()({
    // Keep production builds from overwriting a running development server's chunks.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next"
  });
}
