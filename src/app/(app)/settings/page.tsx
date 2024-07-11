import SettingsTabs from "@/components/internal/settings/SettingsTabs";
import { getUser } from "@/lib/lucia";

const SettingsPage = async () => {
  const dbUser = await getUser();
  return (
    <section className="pt-6 px-3">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-gray-500 text-sm">Manage your preferences here.</p>
        <hr className="h-[1px] bg-gray-100 my-5" />
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <SettingsTabs user={dbUser} />
      </div>
    </section>
  );
};

export default SettingsPage;
