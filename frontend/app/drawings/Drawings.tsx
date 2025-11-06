"use client";

import { useEffect, useState } from "react";
import { Drawing } from "./types";
import DrawingsGallery from "./DrawingsGallery";
import { DrawingsArticleDictionary } from "./util";
import { Section } from "@/sanity/sanity.types";
import TableOfContents from "../toc/TableOfContents";
import { LiaArrowLeftSolid } from "react-icons/lia";

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
    <TableOfContents sections={sections} hide={focusUUID}>
      {focusUUID ? (
        <button
          style={{
            position: "fixed",
            top: "3.5rem",
            display: "inline-flex",
            gap: "0.5rem",
            left: "0.5rem",
            backdropFilter: "none",
          }}
          onClick={() => setFocusUUID(null)}
        >
          <LiaArrowLeftSolid />
          All drawings
        </button>
      ) : (
        <input
          type="text"
          placeholder="search"
          value={search}
          style={{
            border: "1px solid",
            position: "fixed",
            top: "3.25rem",
            left: "0.5rem",
            width: "15rem",
          }}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
          }}
        />
      )}

      <DrawingsGallery
        drawings={drawings}
        search={search}
        drawingsArticleDictionary={drawingsArticleDictionary}
        focusUUID={focusUUID}
        setFocusUUID={setFocusUUID}
      />
    </TableOfContents>
  );
}
