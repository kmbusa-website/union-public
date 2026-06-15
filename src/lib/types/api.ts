export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  location?: string;
  startAt: string;
  endAt?: string;
  coverImageUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export interface SubjectResult {
  subjectName?: string;
  subjectCode?: string;
  grade?: string;
  marks?: number;
  zScore?: number;
  zscore?: number;
  districtRank?: number;
  islandRank?: number;
}

export interface AlResult {
  studentName: string;
  indexNumber: string;
  examYear: number;
  examSessionName?: string;
  stream?: string;
  district?: string;
  schoolName?: string;
  nicNumber?: string;
  subjectResults: SubjectResult[];
}
