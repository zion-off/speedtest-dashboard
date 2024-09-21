import React from "react";
import Image from "next/image";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex font-semibold text-3xl">{title}</div>
      {children}
    </div>
  );
};

const page = () => {
  return (
    <div className="text-slate-100 p-10 md:p-20 flex flex-col gap-20 md:w-1/2">
      <Section title="Can't find your ISP?">
        <p>
          I've had to manually source ISP names from here and there, and it's
          hard to find an up to date or comprehensive list. But no worries, if you want to contribute, email me at{" "}
          <a href="mailto:zion@nyu.edu" className="underline underline-offset-4">zion@nyu.edu</a> and I'll add your ISP
          to the list.
        </p>
      </Section>
      <Section title="Privacy Policy">
        
        <p>
          No identifying information is collected. The only data that is collected is what you  volunteer: your ISP name, location, and speed data. Here's a sneak peek of the backend:
        </p>
        <div >
        <Image
            src="/firebase.png"
            alt="Firebase"
            width={600}
            height={300}
          />
        </div>
      </Section>
    </div>
  );
};

export default page;
