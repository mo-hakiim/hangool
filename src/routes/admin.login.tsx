import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

// /admin/login: the /admin layout shows the sign-in form to anyone not signed in, so
// this page only forwards a signed-in admin to the dashboard.
export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/admin", replace: true });
  }, [navigate]);
  return null;
}
