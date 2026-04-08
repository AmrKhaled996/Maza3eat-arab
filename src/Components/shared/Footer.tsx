import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import X from "../../assets/images/icons/X";
import FacebookIcon from "../../assets/images/icons/Facebook";
import InstagramIcon from "../../assets/images/icons/Instagram";
import LinkedinIcon from "../../assets/images/icons/LinkedIn";
import { Link } from "react-router-dom";

function Footer() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-screen overflow-hidden ">
      {!loaded && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover blur-sm"
        >
          <source src="/FooterSmall.mp4" type="video/mp4" />
        </video>
      )}

      {/* High quality */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setLoaded(true)}
        className={`absolute w-full h-full object-cover transition-opacity duration-700  ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/Footer.mp4" type="video/mp4" />
      </video>
      <footer className="absolute object-cover bottom-0 z-20 w-full  text-gray-200 px-8 py-8">
        <div className="bg-transparent text-slate-800 py-6 text-center z-10  h-full p-auto w-full my-30">
          <p className="text-5xl text-white font-bold">
            لأن كل مسافر لديه حكاية تستحق ان تقال.
          </p>
          <p className="text-2xl text-white/80 mt-8">
            شارك رحلاتك وتجاربك مع مجتمع مزاعيط العرب.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              تواصل معنا
            </h2>
            <p className="mb-2 hover:text-white transition " >amrXXXXXXXX.com</p>
            <p className="hover:text-white transition">0XXXXXXXXX</p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              صفحنا
            </h2>
            <ul className="flex flex-col gap-2 text-gray-300">

            <Link
            to="/featured"
            className="hover:text-white transition"
            >
            منشورات مميزة
          </Link>
          <Link
            to="/cummunity"
            className="hover:text-white transition"
            >
            المجتمع
          </Link>
          <Link
            to="q&a"
            className="hover:text-white transition"
          >
            سؤال و جواب
          </Link>
          <Link
            to="/about"
            className="hover:text-white transition "
          >
            حول
          </Link>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">تابعنا</h2>
            <div className="flex gap-4 text-2xl">
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40">
                <FacebookIcon />
              </span>
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40">
                <InstagramIcon />
              </span>
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40">
                <X />
              </span>
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40 ">
                <LinkedinIcon />
              </span>
            </div>
          </div>
        </div>

        {/* bottom line */}
        <div className="border-t border-gray-700 mb-2 mt-10 text-center text-sm text-gray-400"></div>
        <div className=" text-slate-800 py-2 text-center   w-full">
          <p>&copy; مزاعيط العرب - جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
