import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    // Connecting to DB
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        console.log(username, email, password);
        // if user found by username in DB and also verified
        const existingUserVerifiedByUsername= await UserModel.findOne({
            username,
            isVerified: true
        });

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{status: 400})
        }

        // if user found in DB by email
        const existingUserByEmail =  await UserModel.findOne({email})
        
        // Generating Random OTP
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            // we are checking if the existing found user is also verfied
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {status: 400}) 
            }else{
                // if user is found but not verified its password will be updated and new user is saved
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }
        }else{
            // if no user was found we are creating new user
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate  = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        // send verifivation email
        const emailResponse =  await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message

            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User Registerd Successfully. Please Verify your email"
        }, {status: 201})

    } catch (error) {
        console.error("Error resistering user", error)
        return Response.json(
            {
            success: false,
            message: "Error resistering user"
        },
        {
            status: 500
        }
    );
    }
}