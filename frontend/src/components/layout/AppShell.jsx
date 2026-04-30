import SidebarNav from "../nav/SidebarNav";
import MobileTopBar from "../nav/MobileTopBar";

export default function AppShell({ active, onNavigate, children }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-6">
          <SidebarNav active={active} onNavigate={onNavigate} />

          <div className="flex-1 min-w-0">
            <MobileTopBar active={active} onNavigate={onNavigate} />
            <main className="pt-4">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

