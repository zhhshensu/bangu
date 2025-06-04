import { createFileRoute } from "@tanstack/react-router";
import ForgetPassword from "@/renderer/components/auth/forget-password";

export const Route = createFileRoute("/forget-password")({
  component: ForgetPassword,
});
