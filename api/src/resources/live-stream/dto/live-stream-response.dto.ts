export interface LiveStreamResponseDto {
  id: string;
  title: string;
  videoId: string;
  previewKey: string | null;
  startsAt: string;
  active: boolean;
}
