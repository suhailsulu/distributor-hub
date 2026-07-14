import Sidebar from "../components/Layout/sidebar";
import Topbar from "../components/Layout/topbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="min-h-[calc(100vh-4rem)] flex-1">
        <Topbar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
