import axios from "axios";

export const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message ?? err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
}
