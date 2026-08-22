import Image from "next/image";
import type { Investor } from "@/lib/content";

type InvestorLogoProps = {
  investor: Investor;
};

export default function InvestorLogo({ investor }: InvestorLogoProps) {
  return (
    <li className="flex items-center justify-center">
      <Image
        src={investor.logo || "/placeholder.svg"}
        alt={investor.logoAlt}
        width={200}
        height={120}
        className="h-24 w-auto object-contain"
      />
    </li>
  );
}
