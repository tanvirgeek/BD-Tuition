import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma?.user.findUnique({
        where: { email }
    })

    if (!user) {
        return NextResponse.json({ error: "No user found with this email." }, { status: 404 });
    }

    await sendPasswordResetEmail(auth, email);

    return NextResponse.json(
      { message: "Password reset link sent successfully in your email" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send reset email" },
      { status: 500 }
    );
  }
}
