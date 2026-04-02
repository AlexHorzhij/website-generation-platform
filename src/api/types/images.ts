export type ImageFolderType = {
  name: string;
  amount: number;
};

export type ImageType = {
  id: number;
  s3Url: string;
  fileName: string;
  folder: ImageFolderType;
};
