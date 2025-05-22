// WorldMapClient.tsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { GeoJSONProps } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import { useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import ColourLegend from "./ColourLengend";
import ToggleControl from "./ToggleControl";
import type { SentimentFilter } from "./ToggleControl";

interface FeatureProperties {
  name: string;
  sentiment: "positive" | "neutral" | "negative";
  score?: number;
}

export type GeoData = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  FeatureProperties
>;

interface Props {
  geoData: GeoData;
}

const position: [number, number] = [20, 0];

const WorldMapClient = ({ geoData }: Props) => {
  const [activeFilter, setActiveFilter] = useState<SentimentFilter>("all");

  // Calculate counts for each sentiment type
  const counts = useMemo(() => {
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0, total: 0 };

    geoData.features.forEach((feature) => {
      const sentiment = feature.properties?.sentiment;
      if (sentiment) {
        sentimentCounts[sentiment]++;
        sentimentCounts.total++;
      }
    });

    return sentimentCounts;
  }, [geoData]);

  // Filter the data based on active filter
  const filteredGeoData: GeoData = useMemo(() => {
    if (activeFilter === "all") {
      return geoData;
    }

    return {
      ...geoData,
      features: geoData.features.filter(
        (feature) => feature.properties?.sentiment === activeFilter
      ),
    };
  }, [geoData, activeFilter]);

  const onEachFeature: GeoJSONProps["onEachFeature"] = (feature, layer) => {
    const props = feature.properties as FeatureProperties;
    const content = `${props.name} has a sentiment score of ${props.score}, making it ${props.sentiment} territory. This score reflects the overall emotional tone and public perception based on recent data analysis. Areas with higher scores typically indicate more positive sentiment patterns, while lower scores suggest more negative or cautious attitudes. The sentiment analysis takes into account various factors including social media mentions, news coverage, and public discourse to provide this comprehensive assessment.`;
    const color =
      props.sentiment === "positive"
        ? "#4caf50"
        : props.sentiment === "negative"
        ? "#f44336"
        : "#ffeb3b";

    layer.on("mouseover", (e: LeafletMouseEvent) => {
      layer
        .bindPopup(
          `<div style="display: flex; flex-direction: column;">
            <strong style="margin-bottom: 5px">${props.name}</strong>
            <div style="display: flex; align-items: center">
             <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; margin-right: 4px;"></div>
             <span>${props.sentiment}</span>
            </div>
          </div>`
        )
        .openPopup();
    });

    layer.on("click", (e: LeafletMouseEvent) => {
      layer
        .bindPopup(
          `<div style="display: flex; flex-direction: column;">
            <strong style="margin-bottom: 5px">${props.name}</strong>
            <div style="display: flex; align-items: center">
             <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; margin-right: 4px;"></div>
             <span>${props.sentiment}</span>
            </div>
            <p>${content}</p>
          </div>`
        )
        .openPopup();
    });
  };

  const pointToLayer: GeoJSONProps["pointToLayer"] = (feature, latlng) => {
    const props = feature.properties as FeatureProperties;
    const color =
      props.sentiment === "positive"
        ? "#4caf50"
        : props.sentiment === "negative"
        ? "#f44336"
        : "#ffeb3b";

    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: color,
      color: color,
      weight: 2,
      opacity: 1,
      fillOpacity: 1,
    });
  };

  return (
    <MapContainer
      center={position}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GeoJSON
        key={activeFilter} // Force re-render when filter changes
        data={filteredGeoData}
        onEachFeature={onEachFeature}
        pointToLayer={pointToLayer}
      />
      <ColourLegend />
      <ToggleControl
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />
    </MapContainer>
  );
};

export default WorldMapClient;
