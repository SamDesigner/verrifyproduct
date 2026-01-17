import Image from "next/image";
import showcaseImage from "@/public/images/showcaseImage.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary flex justify-center lg:p-10">
      <div className=" w-full lg:w-[80%]  p-6 bg-alternate rounded-xl shadow-lg relative flex">
        <div className="flex-1 hidden md:flex">
          <Image
            className="absolute left-[-10%] w-[40%]  h-screen lg:h-[105%] top-[-2%] rounded-xl object-cover"
            src={showcaseImage}
            alt="showcase Image"
          />
        </div>

        <div className="md:flex-2">
          <div>
            {/* Login or Signup page will load here */}

            {children}
          </div>
          <div className="flex gap-2 justify-center py-3">
            <p className="text-gray-200 text-center">
              Take a moment to check out our{" "}
              <a
                target="_blank"
                className="font-semibold text-white"
                href="https://www.verrify.io/privacypolicy"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                target="_blank"
                className="font-semibold text-white"
                href="https://www.verrify.io/termsofservice"
              >
                Terms & Conditions.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
