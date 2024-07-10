// import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";

export default async function AuthenticationPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col h-screen ">
      <Navbar />
      {children}
      {/* <Footer /> */}
    </main>
  );
}
