import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="light"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans bg-white text-gray-900 min-h-screen w-full relative selection:bg-gray-100 selection:text-gray-900`}
    >
      {children}
    </div>
  );
}
