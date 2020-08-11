export interface PhotoObj {
  date: string;
  copyright: string;
  explanation: string;
  hd_url: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export interface PhotoState {
  loading: boolean;
  photo: PhotoObj;
  errors: string;
  description: string;
  additionalMsg: string;
  selectedDate: string;
  favorites: Array<PhotoObj>;
  photosInDb: Array<PhotoObj>;
}
