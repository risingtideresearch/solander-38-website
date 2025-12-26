export type Drawing = {
  id: string;
  filename: string;
  clean_filename: string;
  uuid: string;
  rel_path: string;
  source_pdf_full_path: string;
  height: number;
  width: number;
  group: string;
  extracted_text: string;
  date_info: {
    date: string;
    month: number;
    year: number;
  };
};

export type DrawingGroup = {
  drawings: Array<Drawing>;
  label: string;
  key: string;
};
