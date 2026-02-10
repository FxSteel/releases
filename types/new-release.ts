export interface NewRelease {
  id: string;
  title: string;
  lang: string;
  month_label: string | null;
  month_date: string | null;
  size: "sm" | "md" | "lg";
  image_path: string;
  bullets: string[];
  kb_url: string | null;
  order_index: number;
  published: boolean;
}
