import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-b from-transparent to-black text-slate-100 p-24 flex flex-col md:flex-row md:justify-between items-center">
      <p>Made with ♥ in Dhaka</p>
      <div className="flex flex-col">
        <a href="/about" className="hover:underline hover:underline-offset-4">
            More info
        </a>
      </div>
    </div>
  );
};

export default Footer;
