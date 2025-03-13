import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";

interface SignupResponse {
    token: string;
    userName: string;
    email: string;
}

interface signUpFormData {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}
interface loginFormData {
    email: string;
    password: string;
}

const useAuth = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignupSuccess = (resp: SignupResponse, type: string) => {
        Cookies.set("token", resp.token);
        Cookies.set("userName", resp.userName);
        Cookies.set("email", resp.email);
        if (type === "google") {
            router.push("/userDetails");
        } else {
            router.push("/signup/otpform");
        }
    };

    const handleSignUp = async (formData: signUpFormData) => {
        setLoading(true);
        const { userName, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast.warning("Passwords do not match", {
                position: "top-right",
            });
            setLoading(false);
            return;
        }

        try {
            const response = await AuthService.register(userName, email, password);
            if (response.token) {
                handleSignupSuccess(response, "email");
            }
            setLoading(false);
            console.log(response);

        } catch (error: any) {
            toast.warning(`${error.message}`, {
                position: "top-right",
            });
            setLoading(false);
            setError(error.message || "Signup failed");
        }
    };

    const handleLoginSuccess = (data) => {
        Cookies.set("token", data.token);
        Cookies.set("email", data.email);
        Cookies.set("userName", data.name);
        Cookies.set("formSubmitted", data.formSubmitted);
        router.push("/");
    };

    const handleLogin = async (formData: loginFormData) => {
        setLoading(true);
        try {
            const data = await AuthService.login(formData.email, formData.password);
            handleLoginSuccess(data);
            setLoading(false);
        } catch (error) {
            toast.warning(`${error.message}`, {
                position: "top-right",
            });
            setError(error.message || "Login failed");
            setLoading(false);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const res = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const userInfo = await res.json();
                const { email, name, picture } = userInfo;

                const response = await AuthService.registerWithGoogle(
                    email,
                    name,
                    picture,
                    userInfo.sub
                );

                if (response.token) {
                    handleSignupSuccess(response, "google");
                }
                setLoading(false);
            } catch (error: any) {
                toast.warning(`${error.message}`, {
                    position: "top-right",
                });
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error("Login Failed:", error);
            setLoading(false);
        },
    });

    return {
        loading,
        error,
        handleSignUp,
        handleSignupSuccess,
        handleLogin,
        handleLoginSuccess,
        googleLogin,
    };
};

export default useAuth; 