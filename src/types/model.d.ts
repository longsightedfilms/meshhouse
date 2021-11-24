type Model = {
  id: number;
  remoteId?: number;
  name: string;
  extension: string;
  folderPath?: string;
  path: string;
  category: string | null;
  size?: number;
  image: string;
  images?: string[];
  installed?: boolean;
  favorite?: boolean;
  mature_content?: boolean;
  description?: string;
  downloadLinks?: SFMLabLink[];
  comments?: ModelComment[];
}

type SFMLabModel = {
  id: number;
  title: string;
  author?: string;
  description: string;
  mature_content?: boolean;
  created_at?: number;
  updated_at?: number;
  thumbnail: string;
  images: string[];
  image_thumbs: string[];
  links: SFMLabDownloadLink[];
  extension: string;
  file_size: string;
  tags: string[];
  commentaries: SFMLabModelComment[];
}

type SFMLabDownloadLink = {
  url: string;
  title: string;
  file_size: string;
}

type SFMLabModelComment = {
  name: string;
  avatar: string;
  message: string;
  date: number;
}

type RemoteModel = SFMLabModel & {
  installed?: boolean;
  remoteId?: number;
  size?: number;
  folderPath?: string;
  path?: string;
  favorite?: boolean;
}

type ImageProperties = Model & { imageChanged: boolean }

type Category = {
  id: number;
  parentId: number;
  slug: string;
  name: string;
}

type Download = {
  thumbnail: string;
  title: string;
  path: string;
  totalSize: number;
  downloadedSize: number;
  startedAt: number;
  id: string;
}
