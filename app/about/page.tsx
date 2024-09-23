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
      <Section title="Want to contribute?">
        <p>
          See the source code, or contribute on{" "}
          <a
            href="https://github.com/zion-off/speedtest-dashboard"
            className="underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </Section>
      <Section title="How does the speed test work?">
        <div className="flex flex-col gap-5">
          <p>
            Speed tests done on sites such as{" "}
            <a href="https://fast.com" className="underline underline-offset-4">
              fast.com
            </a>{" "}
            or{" "}
            <a
              href="https://speedtest.net"
              className="underline underline-offset-4"
            >
              speedtest.net
            </a>{" "}
            are great, but they might show higher speeds that what you're
            actually getting. This is because ISPs can prioritize traffic to
            these sites, making it seem like you're getting faster speeds than
            you actually are. These sites also pick the closest server to you,
            which you might not be requesting in your day-to-day browsing.
          </p>
          <p>
            This site uses clever engineering to measure your speed more
            accurately. It downloads a randomly generated 30MB file from a
            GitHub server in the US (you can see the location when you start the
            speed test) and measures the time it takes to download. It then
            uplaods the same file to the Cloudflare edge network, and measures
            the time it takes to upload. This gives you a more accurate
            representation of your speed.
          </p>
        </div>
      </Section>
      <Section title="Can't find your ISP?">
        <p>
          I've had to manually source ISP names from here and there, and it's
          hard to find an up to date or comprehensive list. But no worries, if
          you want to contribute, email me at{" "}
          <a
            href="mailto:zion@nyu.edu"
            className="underline underline-offset-4"
          >
            zion@nyu.edu
          </a>{" "}
          and I'll add your ISP to the list.
        </p>
      </Section>
      <Section title="Privacy Policy">
        <p>
          No identifying information is collected. The only data that is
          collected is what you volunteer: your ISP name, location, and speed
          data. Here's a sneak peek of the backend:
        </p>
        <div>
          <Image src="/firebase.png" alt="Firebase" width={600} height={300} />
        </div>
      </Section>
    </div>
  );
};

export default page;
