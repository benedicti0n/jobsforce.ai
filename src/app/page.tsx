import Landingpage from "@/components/Landingpage/Landingpage";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Navbar className="border-2 rounded-full" />
      <Landingpage />
    </div>
  );
}
