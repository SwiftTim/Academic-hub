# University Management System

This is a full-stack web application for a university management system, built with Next.js and Supabase. It provides features for students and lecturers, including user authentication, course enrollment, assignment submissions, assessments, and real-time chat groups.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcodetims-projects%2Fv0-build-this&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20environment%20variables)

## Features

*   **User Authentication**: Secure sign-up and sign-in for students and lecturers using Supabase Auth.
*   **Course Management**: Students can enroll in units (courses), and lecturers can manage their assigned units.
*   **Assignments**: Lecturers can create assignments, and students can submit their work.
*   **Assessments**: Create and take timed assessments (CATs) with multiple-choice, true/false, and short answer questions.
*   **Real-time Chat**: WhatsApp-style chat groups for each unit, allowing students and lecturers to communicate in real-time.
*   **Role-Based Access Control (RBAC)**: The application uses Supabase's Row Level Security (RLS) to ensure that users can only access the data they are permitted to see.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Backend**: [Supabase](https://supabase.io/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
*   **Package Manager**: [pnpm](https://pnpm.io/)

## Local Development Setup

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/codetims-projects/v0-build-this
cd v0-build-this
```

### 2. Set up your Supabase project

1.  Go to [supabase.com](https://supabase.com) and create a new project.
2.  Once your project is created, navigate to the **Project Settings** > **API** section.
3.  You will find your **Project URL** and **Project API keys**. You will need the `URL` and the `anon` `public` key.

### 3. Configure environment variables

1.  Create a `.env.local` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env.local
    ```

2.  Open the `.env.local` file and add your Supabase Project URL and Anon Key:

    ```
    NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL="http://localhost:3000/dashboard"
    ```

### 4. Set up the database and storage

1.  In your Supabase project, go to the **SQL Editor**.
2.  Run the SQL scripts from the `scripts` directory in the following order:
    1.  `01-create-tables.sql`
    2.  `05-update-learning-resources.sql`
4.  (Optional) You can also run the other SQL scripts in the `scripts` directory to seed your database with sample data (`02-seed-sample-data.sql`, `03-seed-assessments.sql`, etc.).
5.  Go to the **Storage** section in your Supabase project and create a new bucket named `learning_resources`. Make it a public bucket.

### 5. Install dependencies and run the application

1.  Install the project dependencies using `pnpm`:

    ```bash
    pnpm install
    ```

2.  Run the development server:

    ```bash
    pnpm dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Deployment

This project is configured for easy deployment to [Vercel](https://vercel.com/).

### Deploy with the Vercel Button

Click the "Deploy to Vercel" button at the top of this README to deploy your own instance of this project. You will be prompted to enter your Supabase environment variables during the deployment process.

### Manual Deployment

1.  Push your code to a Git repository (e.g., on GitHub).
2.  Go to [vercel.com](https://vercel.com/) and create a new project.
3.  Import your Git repository.
4.  Vercel will automatically detect that this is a Next.js project and configure the build settings.
5.  Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.
6.  Deploy the project.
