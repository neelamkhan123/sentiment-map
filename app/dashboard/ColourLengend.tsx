import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const ColourLegend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = new (L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "legend");
        div.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); width: 300px; height: 70px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; text-align: center;">Sentiment Scale</h4>
            <div style="display: flex; justify-content: space-evenly; align-items: center">
             <div style="display: flex; align-items: center; margin-bottom: 4px;">
               <div style="width: 12px; height: 12px; background: #4caf50;  border-radius: 50%; margin-right: 8px;"></div>
               <span style="font-size: 12px;">Positive</span>
             </div>
             <div style="display: flex; align-items: center; margin-bottom: 4px;">
               <div style="width: 12px; height: 12px; background: #ffeb3b;  border-radius: 50%; margin-right: 8px;"></div>
               <span style="font-size: 12px;">Neutral</span>
             </div>
             <div style="display: flex; align-items: center;">
               <div style="width: 12px; height: 12px; background: #f44336;  border-radius: 50%; margin-right: 8px;"></div>
               <span style="font-size: 12px;">Negative</span>
             </div>
           </div>
          </div>
        `;
        return div;
      },
    }))({ position: "topright" });

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

export default ColourLegend;
