export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  categoryName?: string;
  featured: boolean;
  publishedAt?: string;
}

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

export interface Executive {
  id: string;
  memberName: string;
  positionTitle: string;
  bio?: string;
  photoUrl?: string;
}

export interface SitePage {
  slug: string;
  title: string;
  content: string;
}

export interface PastPaper {
  id: string;
  title: string;
  subjectName: string;
  examYear: number;
  medium: string;
  paperType: string;
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
