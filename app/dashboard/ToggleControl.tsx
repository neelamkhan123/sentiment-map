// Filter Controls Component
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

const ToggleControl = ({
  activeFilter,
  onFilterChange,
  counts,
}: {
  activeFilter: SentimentFilter;
  onFilterChange: (filter: SentimentFilter) => void;
  counts: {
    positive: number;
    neutral: number;
    negative: number;
    total: number;
  };
}) => {
  const map = useMap();

  useEffect(() => {
    const filterControl = new (L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "filter-controls");
        div.innerHTML = `
          <div id="filter-container" style="background: white; padding: 12px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); width: 200px;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-align: center;">Filter by Sentiment</h4>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <button id="filter-all" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 3px; background: white; cursor: pointer; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                <span>All</span>
                <span style="color: #666;">(${counts.total})</span>
              </button>
              <button id="filter-positive" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 3px; background: white; cursor: pointer; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 8px; height: 8px; background: #4caf50; border-radius: 50%; margin-right: 6px;"></div>
                  <span>Positive</span>
                </div>
                <span style="color: #666;">(${counts.positive})</span>
              </button>
              <button id="filter-neutral" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 3px; background: white; cursor: pointer; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 8px; height: 8px; background: #ffeb3b; border-radius: 50%; margin-right: 6px;"></div>
                  <span>Neutral</span>
                </div>
                <span style="color: #666;">(${counts.neutral})</span>
              </button>
              <button id="filter-negative" style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 3px; background: white; cursor: pointer; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 8px; height: 8px; background: #f44336; border-radius: 50%; margin-right: 6px;"></div>
                  <span>Negative</span>
                </div>
                <span style="color: #666;">(${counts.negative})</span>
              </button>
            </div>
          </div>
        `;

        // Add event listeners
        const updateButtonStyles = (active: string) => {
          ["all", "positive", "neutral", "negative"].forEach((filter) => {
            const btn = div.querySelector(`#filter-${filter}`) as HTMLElement;
            if (btn) {
              btn.style.background = filter === active ? "#e3f2fd" : "white";
              btn.style.borderColor = filter === active ? "#2196f3" : "#ddd";
            }
          });
        };

        div.querySelector("#filter-all")?.addEventListener("click", () => {
          onFilterChange("all");
          updateButtonStyles("all");
        });
        div.querySelector("#filter-positive")?.addEventListener("click", () => {
          onFilterChange("positive");
          updateButtonStyles("positive");
        });
        div.querySelector("#filter-neutral")?.addEventListener("click", () => {
          onFilterChange("neutral");
          updateButtonStyles("neutral");
        });
        div.querySelector("#filter-negative")?.addEventListener("click", () => {
          onFilterChange("negative");
          updateButtonStyles("negative");
        });

        // Set initial active state
        updateButtonStyles(activeFilter);

        return div;
      },
    }))({ position: "topleft" });

    filterControl.addTo(map);

    return () => {
      filterControl.remove();
    };
  }, [map, activeFilter, onFilterChange, counts]);

  return null;
};

export default ToggleControl;
