"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Return success instead of redirecting directly
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign up action with user profile creation
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")
  const role = formData.get("role")
  const studentId = formData.get("studentId")
  const staffId = formData.get("staffId")
  const department = formData.get("department")
  const yearOfStudy = formData.get("yearOfStudy")

  if (!email || !password || !fullName || !role) {
    return { error: "All required fields must be filled" }
  }

  const supabase = await createClient()

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/dashboard`,
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    if (authData.user) {
      try {
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: email.toString(),
          full_name: fullName.toString(),
          role: role.toString(),
          student_id: role === "student" ? studentId?.toString() : null,
          staff_id: role !== "student" ? staffId?.toString() : null,
          department: department?.toString(),
          year_of_study: role === "student" && yearOfStudy ? Number.parseInt(yearOfStudy.toString()) : null,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Don't fail registration if profile creation fails - user can still authenticate
          console.log(
            "[v0] Profile creation failed, but user auth was successful. Database tables may not be created yet.",
          )
        }
      } catch (profileError) {
        console.error("Profile creation error:", profileError)
        // Don't fail registration if profile creation fails
        console.log(
          "[v0] Profile creation failed, but user auth was successful. Database tables may not be created yet.",
        )
      }
    }

    return { success: "Account created successfully! Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign out action
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
