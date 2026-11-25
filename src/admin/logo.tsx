import logo from "@/assets/hangool-logo.png";

export function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="Hangool Construction & Real Estate" className={className} />;
}
