import React, { useEffect, useState } from "react";
import { data } from "../../geoSentiments";

type GeoData = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  {
    name: string;
    sentiment: "positive" | "neutral" | "negative";
    score?: number;
  }
>;

interface Props {
  geoData: GeoData;
}

const WorldMap = () => {
  // Combine the array of FeatureCollections into one
  const geoData: GeoData = {
    type: "FeatureCollection",
    features: data.flatMap((collection) => collection.features),
  };

  const [MapComponent, setMapComponent] = useState<React.FC<Props> | null>(
    null
  );

  useEffect(() => {
    import("./WorldMapClient").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) return null;

  return <MapComponent geoData={geoData} />;
};

export default WorldMap;
