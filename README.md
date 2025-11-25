# 简洁账本（zhangben）

一个基于 **React + TypeScript + TailwindCSS + Recharts** 的极简个人记账 Web 应用，支持 LocalStorage 持久化、筛选、编辑、CSV 导出、暗色模式以及 PWA 离线访问。

## ✨ 功能亮点
- 📥 添加 / 编辑 / 删除账单，自动保存至 LocalStorage  
- 🔍 多条件筛选（日期范围、分类、金额区间、备注关键词）  
- 📊 分类饼图 & 日常趋势折线图，直观洞察本月消费  
- 📤 一键导出 CSV，方便备份或分享  
- 🌗 暗色模式，记忆用户偏好  
- 📱 支持 PWA：可添加到手机主屏，离线可用  

## 🛠 技术栈
- [React 18 + TypeScript](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/en-US/)
- LocalStorage + Service Worker

## 🚀 本地启动
```bash
git clone https://github.com/lispkaka/zhangben.git
cd zhangben
npm install
npm run dev -- --host
```
然后在浏览器访问 `http://localhost:5173`（或终端显示的 Network 地址）。

## 📦 构建生产版
```bash
npm run build
npm run preview
```
`dist/` 目录即为可部署的静态资源，上传到任意静态托管（Vercel、Netlify、OSS 等）即可。

## 📄 许可
[MIT License](./LICENSE)

欢迎提交 Issue / PR，一起完善这款轻量级账本应用！


