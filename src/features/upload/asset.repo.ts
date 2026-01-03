import { prisma } from "../../lib/prisma";

const findAssetsByOwner = async (target: {
  ownerType: "COURSE";
  role: "THUMBNAIL";
  ownerId: string;
}) => {
  const assets = await prisma.assetOwner.findMany({
    where: target,
    omit: {
      assetId: true,
      ownerId: true,
      ownerType: true,
      role: true,
      id: true,
    },
    include: { asset: { select: { id: true, publicId: true } } },
  });

  return assets.map((item) => item.asset);
};

export const assetRepo = {
  findAssetsByOwner,
};
