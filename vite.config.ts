// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite"

// // https://vite.dev/config/
// export default defineConfig({
//   root: "client",
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       "/api": `http://localhost:${process.env.PORT}`,
//     }
//   }
// })
import { defineConfig, loadEnv } from 'vite' // 1. Import loadEnv
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
// 2. Chuyển export default thành một function nhận tham số { mode }
export default defineConfig(({ mode }) => {
  // 3. Load các biến môi trường
  // Tham số thứ 3 là '' (rỗng) để load TẤT CẢ các biến (bao gồm cả biến không có tiền tố VITE_)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: "client",
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // 4. Sử dụng biến env vừa load được
        "/api": `http://localhost:${env.PORT}`,
      }
    }
  }
})