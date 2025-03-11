import Homepage from "@/components/Homepage/Homepage";
import ToolsBentoPage from "@/components/ToolsBentoPage/ToolsBentoPage";
import FAQ from "@/components/FAQ/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Homepage />
      <ToolsBentoPage />
      <FAQ />
    </div>
  );
}
