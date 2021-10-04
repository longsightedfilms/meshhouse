type DownloadItem = {
  thumbnail: string;
  title: string;
  integration: string;
  path: string;
  totalSize: number;
  downloadedSize: number;
  startedAt: number;
  completedAt: number;
  projectId: string;
  id: string;
}

type DownloadRequest = {
  id: string;
  request: any;
}
