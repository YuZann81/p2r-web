"use client";

import React from "react";
import type { FeedItem } from "@/lib/api/types/feed";
import { InstagramEmbed, TikTokEmbed } from "@/components/SocialEmbed";
import UpdateCard from "@/components/UpdateCard";

type FeedCardProps = {
  feed: FeedItem;
  onSelect?: (feed: FeedItem) => void;
};

export default function FeedCard({ feed, onSelect }: FeedCardProps) {
  const normalizedSource = (feed.source || "").toLowerCase().trim();

  if (normalizedSource === "instagram") {
    return <InstagramEmbed feed={feed} onSelect={onSelect} />;
  }

  if (normalizedSource === "tiktok") {
    return <TikTokEmbed feed={feed} onSelect={onSelect} />;
  }

  return <UpdateCard feed={feed} onSelect={onSelect} />;
}
