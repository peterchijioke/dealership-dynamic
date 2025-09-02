"use client";
import React from "react";
import { searchClient } from "@/configs/config";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import VdpClient from "./VdpClient";

export default function VDPSearchClient() {
  return (
    // <InstantSearchNext
    //   indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_TONKINWILSON_VDP!}
    //   searchClient={searchClient}
    // >
    <VdpClient />
    // </InstantSearchNext>
  );
}
