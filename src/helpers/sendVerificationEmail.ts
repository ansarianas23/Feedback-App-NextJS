import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'True Feedback <onboarding@resend.dev>',
            to: email,
            subject: 'True Feedback | Verification Code',
            react: VerificationEmail({username:username, otp: verifyCode}),
          });
        return{success: true, message: "verification email send successfully"}
    } catch (emailError) {
        console.error("Error Sending Verification email", emailError);
        return{success: false, message: "Failed to send verification email"}
    }
}
