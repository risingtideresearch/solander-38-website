"use client";

import { useState } from "react";
import { Drawing } from "./types";
import DrawingsGallery from "./DrawingsGallery";
import { DrawingsArticleDictionary } from "./util";
import { Section } from "@/sanity/sanity.types";
import TableOfContents from "../toc/TableOfContents";

interface DrawingsProps {
  drawings: {
    files: Array<Drawing>;
  };
  defaultUUID?: string;
  drawingsArticleDictionary: DrawingsArticleDictionary;
  sections: Array<Section>;
}

export default function Drawings({
  drawings,
  defaultUUID,
  drawingsArticleDictionary,
  sections,
}: DrawingsProps) {
  const [search, setSearch] = useState("");
  const [focusUUID, setFocusUUID] = useState<string | null>(
    defaultUUID || null,
  );
  
  return (
    <TableOfContents sections={sections} hide={!!focusUUID} showArticles={false}>
      <DrawingsGallery
        drawings={drawings}
        search={search}
        drawingsArticleDictionary={drawingsArticleDictionary}
        defaultUUID={defaultUUID}
        focusUUID={focusUUID}
        setFocusUUID={setFocusUUID}
      />
    </TableOfContents>
  );
}
