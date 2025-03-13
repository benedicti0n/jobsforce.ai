import Homepage from "@/components/Homepage/Homepage";
import ToolsBentoPage from "@/components/ToolsBentoPage/ToolsBentoPage";
import FAQ from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";
import ProcessPage from "@/components/ProcessPage/ProcessPage";
import { Navbar1 } from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Navbar1 />
      <Homepage />
      <ToolsBentoPage />
      <ProcessPage />
      <FAQ />
      <Footer />
    </div>
  );
}
