"use client";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <body className={inter.className}>
      {/* {!pathname.includes("/pages/login") && <div> teste</div>} */}
      {children}
    </body>
  );
}
