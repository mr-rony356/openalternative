import type { Prisma } from "@prisma/client";
import { cache } from "~/lib/cache";
import { adManyPayload, adOnePayload } from "~/server/web/ads/payloads";
import { prisma } from "~/services/prisma";

const mockAdManyPayload = {
  id: true,
  name: true,
  email: true,
  description: true,
  website: true,
  type: true,
  startsAt: true,
  endsAt: true,
};

const mockAdOnePayload = {
  ...mockAdManyPayload,
  faviconUrl: true,
};

export const findAds = cache(
  async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
    return prisma.ad.findMany({
      ...args,
      orderBy: orderBy ?? { startsAt: "desc" },
      select: adManyPayload,
    });
  },
  ["ads"]
);
export const findAd = cache(
  async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
    const mockAd = {
      id: "ad1",
      name: "Tech Innovators",
      email: "contact@techinnovators.com",
      description: "Cutting-edge tech solutions",
      website: "https://techinnovators.com",
      type: "Homepage",
      startsAt: new Date("2024-01-01"),
      endsAt: new Date("2024-12-31"),
      faviconUrl: "https://techinnovators.com/favicon.ico",
    };

    return mockAd;
  },
  ["ad"],
  { revalidate: 60 * 60 }
);
