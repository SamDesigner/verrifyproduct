import Button from "@/app/components/(FormComponents)/Button";
import Link from 'next/link'
const settingsData = [
  {
    id: 1,
    title: "Update Password",
    description:
      "This helps keep your account secure, especially if you believe your password may have been exposed or you want to improve your account safety.",
    actionText: "Change Password",
    location: "/update-password"
  },
  {
    id: 2,
    title: "Update Profile",
    description:
      "Update Profile lets you update your personal details so your account always reflects the latest information.",
    actionText: "Update Profile",
    location: "/update-profile"

  },
];
const page = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="border-b pb-5 border-gray-600">
        <h2 className="text-[40px] font-bold text-white ">Profile Settings</h2>
      </div>
      <div className="text-white">
        <div className="flex flex-col gap-5">
          {settingsData.map((setting) => (
            <div
              className="bg_glass_glow flex flex-col gap-2 "
              key={setting.id}
            >
              <div className="gap-2">
                <h3 className="text-[25px] font-bold">{setting.title}</h3>
                <p className="text-[14px]">{setting.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                {setting.actionText === "Change Password" ? (
                  <p className="font-bold flex items-center gap-2">
                    <span>Password:</span>
                    <span>*********</span>
                  </p>
                ) : null}

             
                <Link  href={setting.location} className="w-[200px]">
                  <Button text={setting.actionText} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
