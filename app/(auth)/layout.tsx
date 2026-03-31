// import showcaseImage from "@/public/images/showcaseImage.png";
// import Image from "next/image";
import Link from "next/link";
// import authLogo from "@/public/images/authLogo.png";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:flex bg-[#080c14] ">
      <div className="hidden lg:flex flex-1 flex-col justify-end p-12 relative overflow-hidden bg-[#080c14]">

        {/* Blueprint grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 80% 80% at 40% 60%, black 30%, transparent 100%)",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }}
        />

        {/* Coordinate watermark */}
        <div className="absolute top-8 right-8 text-right text-[10px] text-slate-700 leading-loose tracking-widest font-mono">
          6.5244° N<br />3.3792° E<br />REF·VRF·2024
        </div>

        {/* Dot matrix */}
        <div
          className="absolute top-28 right-20 grid gap-1.5 opacity-30"
          style={{ gridTemplateColumns: "repeat(5, 6px)" }}
        >
          {Array.from({ length: 25 }).map((_, i) => (
            <span key={i} className="w-[3px] h-[3px] rounded-full bg-indigo-400 block" />
          ))}
        </div>

        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-5 h-5 border-t border-l border-indigo-500/40 rounded-tl" />
        <div className="absolute bottom-8 right-8 w-5 h-5 border-b border-r border-indigo-500/40 rounded-br" />

        {/* Main content */}
        <div className="relative h-full  flex flex-col justify-center  z-10">

          {/* Tag line */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="w-6 h-px bg-indigo-400" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-indigo-400">
              Property Verification Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl font-bold text-slate-100 leading-[1.05] tracking-tight mb-5">
            Trust the land<br />
            you{" "}
            <span className="text-indigo-400 italic font-serif">own.</span>
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-10">
            Verrify gives you verified, tamper-proof records of property ownership — before you buy, sell, or build.
          </p>

          {/* Decorative verified property card */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl max-w-sm mb-12"
            style={{
              background: "rgba(15,21,38,0.85)",
              border: "1px solid rgba(99,102,241,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-indigo-400"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">
                Latest verification
              </div>
              <div className="text-sm font-semibold text-slate-200 truncate">
                Plot 14B, Maitama District
              </div>
            </div>

            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-emerald-400 shrink-0"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Verified
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-16 h-screen  overflow-y-auto "
        style={{
          background: "#0c111d",
          borderLeft: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="w-full flex justify-center">
          {children}

        </div>
        <div className="w-full max-w-sm flex flex-col">

          {/* Logo */}
          {/* <div className="flex items-center gap-2.5 mb-10">
            <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.7)]" />
            <Image src={authLogo} alt="Verrify Logo" height={26} style={{ objectFit: "contain" }} />
          </div> */}
          {/* Divider */}

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-slate-600 tracking-wider font-medium">
              New to Verrify?
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          {/* Sign up row */}
          <div className="flex justify-center items-center gap-1.5 text-sm">
            <p className="text-slate-500">Don&apos;t have an account?</p>
            <Link
              href="/signup"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors duration-150"
            >
              Create one →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
