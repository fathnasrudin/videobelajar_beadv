import cloudinary from "../../lib/cloudinary";
import { config } from "../../config";

type UploadTarget = {
  owner: "course";
  asset: "thumbnail";
};

const uploadPolicies = {
  course: {
    thumbnail: {
      overwrite: true,
      buildPublicId: (ownerId: string) => `courses/${ownerId}/thumbnail`,
    },
  },
};

const generate = (target: UploadTarget, ownerId: string) => {
  const policy = uploadPolicies[target.owner]?.[target.asset];
  if (!policy) throw new Error("Invalid Upload Target");

  const payload = {
    timestamp: Math.floor(Date.now() / 1000),
    public_id: policy.buildPublicId(ownerId),
    overwrite: true,
  };

  const signature = cloudinary.utils.api_sign_request(
    { ...payload },
    config.cloudinary.apiSecret
  );

  return {
    signature,
    ...payload,

    api_key: config.cloudinary.apiKey,
    cloud_name: config.cloudinary.cloudName,
    uploadEndpoint: `https://api.cloudinary.com/v1_1/${
      config.cloudinary.cloudName
    }/${"image"}/upload`,
  };
};

export const uploadService = {
  generate,
};
