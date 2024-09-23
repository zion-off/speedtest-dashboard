import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-b from-transparent to-black text-slate-100 p-24 flex flex-col md:flex-row md:justify-between items-center">
      <div className="flex flex-col">
        <p>Made with ♥ in Dhaka</p>
        <a
          href="https://github.com/zion-off/speedtest-dashboard"
          className="hover:underline hover:underline-offset-4"
        >
          Contribute on GitHub
        </a>
      </div>

      <a href="/about" className="hover:underline hover:underline-offset-4">
        More info
      </a>
    </div>
  );
};

export default Footer;
