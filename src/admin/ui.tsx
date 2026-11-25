// Shared building blocks for the admin dashboard. The dashboard is for the
// owner and staff only, so its copy is English and lives here rather than in src/i18n.
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  ExternalLink,
  HardHat,
  Images,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Logo } from "@/admin/logo";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./account";

export const inputClass =
  "h-11 w-full rounded-sm border border-input bg-card px-3.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";
export const textareaClass =
  "min-h-24 w-full rounded-sm border border-input bg-card px-3.5 py-2.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm";

const sections = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/requests", label: "Requests", icon: Inbox },
  { to: "/admin/projects", label: "Projects", icon: HardHat },
  { to: "/admin/properties", label: "Properties", icon: KeyRound },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/careers", label: "Careers", icon: Briefcase },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminHeader() {
  const nav =
    "inline-flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted";
  const active = "bg-muted text-primary";
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/admin" className="flex items-center gap-2">
          <Logo className="h-9 w-auto" />
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Admin
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={import.meta.env.BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={nav}
          >
            <ExternalLink className="size-4" /> <span className="hidden sm:inline">View site</span>
          </a>
          <AccountMenu />
        </div>
      </div>
      <nav
        className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2"
        aria-label="Dashboard sections"
      >
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            activeOptions={{ exact: "exact" in s }}
            className={nav}
            activeProps={{ className: active }}
          >
            <s.icon className="size-4" /> {s.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Panel({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-sm border bg-card p-4 shadow-sm sm:p-6", className)}>
      {title && (
        <h2 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary",
        className,
      )}
    />
  );
}

export function ConfirmDelete({
  title,
  description,
  onConfirm,
  children,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  children: ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function errorMessage(e: unknown) {
  if (e instanceof Error) {
    if (/check constraint|23514/.test(e.message))
      return "One of the values isn't allowed (too long, or not in the list). Check the form and try again.";
    if (/not-null|23502/.test(e.message)) return "Please fill in all required fields.";
    return e.message;
  }
  return "Something went wrong.";
}

/**
 * Shrinks a photo before upload (phone pictures are often 5+ MB): max 1600 px on the
 * long side, saved as WebP. Falls back to the original file if the browser can't.
 */
export async function prepareImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    if (blob && blob.type === "image/webp") return blob;
  } catch {
    /* fall through */
  }
  return file;
}

/**
 * Plain-language message for sign-in and password errors from Supabase Auth.
 * Falls back to errorMessage() for anything else.
 */
export function authMessage(e: unknown): string {
  const status =
    typeof e === "object" && e && "status" in e ? Number((e as { status: unknown }).status) : -1;
  const code =
    typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "";
  const text = `${code} ${e instanceof Error ? e.message : ""}`;
  if (status === 0)
    return "Can't reach the website database right now. Check your internet connection and try again.";
  if (/wrong_current_password/.test(text)) return "Your current password is not correct.";
  if (/invalid_credentials|invalid login/i.test(text))
    return "Wrong email or password. Check both and try again — passwords are case-sensitive.";
  if (/email_not_confirmed|not confirmed/i.test(text))
    return "This account's email hasn't been confirmed yet. Confirm the user in Supabase → Authentication → Users, then try again.";
  if (/same_password|should be different/i.test(text))
    return "The new password must be different from the current one.";
  if (/weak_password|password should be|at least/i.test(text))
    return "That password is too weak. Use at least 8 characters with letters and numbers.";
  if (/otp_expired|expired|invalid.*link|access_denied/i.test(text))
    return "This reset link has expired or was already used. Request a new one from the sign-in page.";
  if (status === 429 || /rate_limit|too many/i.test(text))
    return "Too many attempts. Please wait a few minutes and try again.";
  if (/user_banned/.test(text)) return "This account has been disabled.";
  return errorMessage(e);
}

export function PasswordRules() {
  return (
    <p className="text-xs text-muted-foreground">
      At least 8 characters, with letters and numbers.
    </p>
  );
}

/** Returns a message if the new password isn't acceptable, otherwise null. */
export function checkNewPassword(next: string, confirm: string): string | null {
  if (next.length < 8) return "The new password must be at least 8 characters.";
  if (!/[a-z]/i.test(next) || !/\d/.test(next))
    return "Use both letters and numbers in the new password.";
  if (next !== confirm) return "The two new passwords don't match.";
  return null;
}

export function ErrorBox({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}

export function Centered({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center px-4 py-10">{children}</div>;
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-sm rounded-sm border bg-card p-6 shadow-lg sm:p-8">{children}</div>
  );
}
