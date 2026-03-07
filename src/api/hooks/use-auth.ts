import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/api/services/auth.service";
import { LoginData, RegisterData } from "@/api/types/auth";
import { useRouter } from "@/components/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (data) => {
      Cookies.set("go_market_token", data.sessionId, { expires: 7, path: "/" });
      toast.success("Successfully logged in");
      router.push("/");
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
      Cookies.set("go_market_token", data.sessionId, { expires: 7, path: "/" });
      toast.success("Registration successful");
      router.push("/");
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
    queryFn: async () => {
      // TODO: Remove this mock when the backend endpoint is ready
      return {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "ADMIN",
        createdAt: new Date().toISOString(),
        site: "Go Market",
      };
    },
    retry: false,
    enabled: true,
  });
};
