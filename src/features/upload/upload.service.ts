import cloudinary from "../../lib/cloudinary";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { assetRepo } from "./asset.repo";

export type UploadTarget = {
  ownerId: string;
  ownerType: "COURSE";
  assetRole: "THUMBNAIL";
};

const uploadPolicies = {
  COURSE: {
    THUMBNAIL: {
      overwrite: true,
      buildPublicId: (ownerId: string) => `courses/${ownerId}/thumbnail`,
    },
  },
};

const generate = (target: UploadTarget) => {
  const policy = uploadPolicies[target.ownerType]?.[target.assetRole];
  if (!policy) throw new Error("Invalid Upload Target");

  const payload = {
    timestamp: Math.floor(Date.now() / 1000),
    public_id: policy.buildPublicId(target.ownerId),
    overwrite: true,
  };

  const signature = cloudinary.utils.api_sign_request(
    { ...payload },
    config.cloudinary.apiSecret
  );

  return {
    signature,
    ...payload,
    ...target,

    api_key: config.cloudinary.apiKey,
    cloud_name: config.cloudinary.cloudName,
    uploadEndpoint: `https://api.cloudinary.com/v1_1/${
      config.cloudinary.cloudName
    }/${"image"}/upload`,
  };
};

const upsertAsset = async (
  target: { ownerType: "COURSE"; role: "THUMBNAIL"; ownerId: string },
  metadata: { public_id: string }
) => {
  const asset = await prisma.asset.findFirst({
    where: { publicId: metadata.public_id },
  });

  if (!asset) {
    const createdAsset = await prisma.asset.create({
      data: {
        publicId: metadata.public_id,
      },
    });

    if (target.ownerType === "COURSE" && target.role === "THUMBNAIL") {
      // add id directly to the course
      await prisma.courses.update({
        where: { id: target.ownerId },
        data: {
          thumbnailId: createdAsset.id,
        },
      });
    } else {
      // or to junction table as fallback
      await prisma.assetOwner.create({
        data: {
          ...target,
          asset: {
            connect: {
              id: createdAsset.id,
            },
          },
        },
      });
    }
  }

  if (asset) {
    // update asset metadata
    // not yet implemented
    console.warn("Update asset not yet implemented");
  }
};

const getAssets = async ({ assetRole, ownerId, ownerType }: UploadTarget) => {
  const assets = await assetRepo.findAssetsByOwner({
    ownerId,
    ownerType,
    role: assetRole,
  });
  return assets;
};

export const uploadService = {
  generate,
  upsertAsset,
  getAssets,
};
