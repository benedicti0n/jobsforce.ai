import Homepage from "@/components/Homepage/Homepage";
import ToolsBentoPage from "@/components/ToolsBentoPage/ToolsBentoPage";
import FAQ from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";
// import Navbar2 from "@/components/Navbar/Navbar2";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* <Navbar2 /> */}
      <Homepage />
      <ToolsBentoPage />
      <FAQ />
      <Footer />
    </div>
  );
}
