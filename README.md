# 🚀 My Professional Portfolio

Built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**, backed by **Neon Serverless Postgres**, and hosted on **Vercel**. This project showcases my work, skills, and professional journey as a developer.

## 🌐 Live Demo

Check out the live site **[Here](https://jeff-portfolio-web.vercel.app)**

---

## ✨ Features

- **Responsive Design:** Fully optimized for mobile, tablet, and desktop.
- **Dynamic Projects:** Showcasing my latest work with detailed descriptions and links.
- **Easy Addition & Updates:** Data like skills, stack, experience, and education are all fetched from the database and cached (`unstable_cache`) with tag-based revalidation - Making it easy to update and add new data e.g., adding a new experience/skill without a redeploy.
- **Performance:** Optimized images and fast page loads using Next.js `App Router`.
- **Contact Form:** A direct way for tech enthusiasts, recruiters, and collaborators to reach out, powered by Nodemailer/Resend.
- **Animations:** Animations implemented with framer motion.
- **Blogs:** Blog posting, editing, searching, and viewing of blogs, rendered from Markdown.
- **Authentication:** Custom JWT-based auth (access + refresh tokens) protects blog creation/editing, with automatic token refresh on the client.
- **Dark Mode:** System-aware theme toggle via `next-themes`.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router) + [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Neon Serverless Postgres](https://neon.com)
- **Auth:** [jose](https://github.com/panva/jose) (JWT) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Blog Rendering:** [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Email:** [Nodemailer](https://nodemailer.com/) (Gmail OAuth2) + [Resend](https://resend.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Fonts:** DM Sans, DM Mono (via `next/font`)
