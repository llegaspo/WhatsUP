# 📢 UP Cebu School Announcements System

> **A dynamic, type-safe platform for managing and disseminating school announcements.**

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-%232596BE.svg?style=for-the-badge&logo=trpc&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📖 Overview

Developed as a capstone software engineering project (UP Cebu, Jan 2025 – May 2025), this application modernizes the way school updates are delivered. It replaces static notice boards with a **dynamic, centralized web platform** that prioritizes performance, security, and developer experience.

By applying advanced learnings from industry internships, this project leverages the **T3 Stack** (Next.js, tRPC, Tailwind) to ensure end-to-end type safety, significantly reducing runtime errors and improving data integrity.

## 🚀 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database & Auth:** [Supabase](https://supabase.com/)
* **API Layer:** [tRPC](https://trpc.io/) (for type-safe client-server communication)
* **Validation:** [Zod](https://zod.dev/) (Schema validation)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## ✨ Key Features

* **End-to-End Type Safety:** Utilizing tRPC and Zod to share types between the client and server, ensuring strict contract adherence.
* **Real-time Updates:** Dynamic rendering of announcements as they are posted.
* **Role-Based Access Control:** Secure authentication flow via Supabase to distinguish between administrators (posting rights) and students (view-only).
* **Responsive UI:** A mobile-first interface designed for students on the go.

## 🛠️ Local Development

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/school-announcements.git](https://github.com/yourusername/school-announcements.git)
    cd school-announcements
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up environment variables**
    Create a `.env` file and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

---
*Developed by Albero, Basmayor, Legaspo, Malig*

