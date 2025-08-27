import { AuthProvider } from "@/action/auth";
import { HeroSection1 } from "./hero-section1";

export function HeroSection() {
  return (
    <AuthProvider>
      <HeroSection1 />
    </AuthProvider>
  );
}
