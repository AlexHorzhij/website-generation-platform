import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginData, RegisterData } from "@/types/auth";
import { useRouter } from "@/components/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Successfully logged in");
      router.push("/dashboard/analytics");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Registration successful");
      router.push("/dashboard/analytics");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  return { logout };
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.getMe,
    retry: false,
    enabled: !!(typeof window !== "undefined" && localStorage.getItem("token")),
  });
};
