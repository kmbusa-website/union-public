import { publicApi } from "./client";
import type {
  AlResult,
  ApiResponse,
  Event,
  Executive,
  GalleryPhoto,
  News,
  PageResponse,
  PastPaper,
  SitePage,
} from "../types/api";

export async function getFeaturedNews() {
  const { data } = await publicApi.get<ApiResponse<PageResponse<News>>>("/v1/news/public/featured", {
    params: { size: 6 },
  });
  return data.data.content;
}

export async function getNews(page = 0) {
  const { data } = await publicApi.get<ApiResponse<PageResponse<News>>>("/v1/news/public", {
    params: { page, size: 24 },
  });
  return data.data;
}

export async function getNewsBySlug(slug: string) {
  const { data } = await publicApi.get<ApiResponse<News>>(`/v1/news/public/${slug}`);
  return data.data;
}

export async function getUpcomingEvents(page = 0) {
  const { data } = await publicApi.get<ApiResponse<PageResponse<Event>>>("/v1/events/public", {
    params: { page, size: 24 },
  });
  return data.data;
}

export async function getEventBySlug(slug: string) {
  const { data } = await publicApi.get<ApiResponse<Event>>(`/v1/events/public/${slug}`);
  return data.data;
}

export async function getGalleryPhotos(params?: {
  page?: number;
  size?: number;
  category?: string;
  keyword?: string;
}) {
  const { data } = await publicApi.get<ApiResponse<PageResponse<GalleryPhoto>>>("/v1/gallery/public", {
    params: { page: params?.page ?? 0, size: params?.size ?? 24, category: params?.category, keyword: params?.keyword },
  });
  return data.data;
}

export async function getCommittee() {
  const { data } = await publicApi.get<ApiResponse<Executive[]>>("/v1/executives/public");
  return data.data;
}

export async function getSitePage(slug: string) {
  const { data } = await publicApi.get<ApiResponse<SitePage>>(`/v1/site/public/pages/${slug}`);
  return data.data;
}

export async function searchResults(indexNumber: string, examYear?: number) {
  const { data } = await publicApi.get<ApiResponse<AlResult[]>>("/v1/al-results/public", {
    params: { indexNumber, examYear },
  });
  return data.data;
}

export async function getPastPapers(params: { examYear?: number; medium?: string; page?: number }) {
  const { data } = await publicApi.get<ApiResponse<PageResponse<PastPaper>>>("/v1/past-papers", {
    params: { ...params, size: 50 },
  });
  return data.data;
}

export async function getPastPaperDownloadUrl(id: string) {
  const { data } = await publicApi.get<ApiResponse<{ downloadUrl: string }>>(`/v1/past-papers/${id}/download`);
  return data.data.downloadUrl;
}

export async function submitContact(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  await publicApi.post("/v1/contact", payload);
}
