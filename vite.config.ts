import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/DuckRunner/",
});

// for dev
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import basicSsl from "@vitejs/plugin-basic-ssl";

// export default defineConfig({
//   plugins: [react(), basicSsl()],
// });
