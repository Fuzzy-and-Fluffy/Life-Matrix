import { useMemo } from 'react';
import { calculateLevel, getProgress } from '../utils/algorithms';

const RadarChart = ({ dimensions, scores, onLabelClick, size = 400 }) => {
  const activeDims = useMemo(() => 
    (dimensions || []).filter(d => d.active),
    [dimensions]
  );
  
  if (activeDims.length < 3) return null;

  const padding = 50;
  const viewBoxSize = size + padding * 2;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = 125;
  const baseLabelDist = 155;

  const getPos = (i, total, r, isLabel = false) => {
    const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
    const sin = Math.sin(angle);
    
    let adjustedR = r;
    if (isLabel && sin < -0.5) {
      adjustedR = r + Math.abs(sin) * 15;
    }
    
    return { 
      x: centerX + adjustedR * Math.cos(angle), 
      y: centerY + adjustedR * Math.sin(angle), 
      angle 
    };
  };

  const polyPoints = activeDims.map((dim, i) => {
    const idx = dimensions.findIndex(d => d.id === dim.id);
    const s = (scores && scores[idx]) ? scores[idx] : 0;
    const level = calculateLevel(s);
    const r = Math.min(radius, (level / 15) * radius + 25);
    return getPos(i, activeDims.length, r);
  });

  return (
    <div className="w-full flex justify-center items-center overflow-visible">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
        className="overflow-visible select-none max-w-[460px]"
      >
        {/* Background circles */}
        {[1, 0.75, 0.5, 0.25].map(s => (
          <circle 
            key={s} 
            cx={centerX} 
            cy={centerY} 
            r={radius * s} 
            fill="none" 
            stroke="#f1f5f9" 
            strokeWidth={s === 1 ? "2.5" : "1.5"} 
          />
        ))}

        {/* Dimension labels and axes */}
        {activeDims.map((dim, i) => {
          const axisPos = getPos(i, activeDims.length, radius);
          const labelPos = getPos(i, activeDims.length, baseLabelDist, true);
          
          const idx = dimensions.findIndex(d => d.id === dim.id);
          const score = (scores && scores[idx]) ? scores[idx] : 0;
          const level = calculateLevel(score);
          const progress = getProgress(score);
          
          const cos = Math.cos(labelPos.angle);
          let blockXOffset = 0;
          if (cos < -0.3) blockXOffset = -85;
          else if (Math.abs(cos) <= 0.3) blockXOffset = -42;

          return (
            <g 
              key={dim.id}
              className="group cursor-pointer active:opacity-60 transition-all"
              onClick={() => onLabelClick(idx)}
              transform={`translate(${labelPos.x + blockXOffset}, ${labelPos.y})`}
            >
              {/* Axis line */}
              <line 
                x1={centerX - (labelPos.x + blockXOffset)} 
                y1={centerY - labelPos.y} 
                x2={axisPos.x - (labelPos.x + blockXOffset)} 
                y2={axisPos.y - labelPos.y} 
                stroke="#f1f5f9" 
                strokeWidth="2.5" 
              />
              
              {/* Axis point */}
              <circle 
                cx={axisPos.x - (labelPos.x + blockXOffset)} 
                cy={axisPos.y - labelPos.y} 
                r="4.5" 
                fill="#cbd5e1" 
                stroke="white" 
                strokeWidth="2" 
              />

              {/* Dimension name */}
              <text 
                x="0" 
                y="-10" 
                textAnchor="start" 
                className="text-[16px] font-black fill-slate-800 uppercase tracking-tight"
              >
                {dim.name}
              </text>

              {/* Level and progress bar */}
              <g transform="translate(0, 12)">
                <text 
                  x="0" 
                  y="0" 
                  textAnchor="start" 
                  className="text-[12px] font-bold fill-sky-500"
                >
                  Lv.{level}
                </text>
                <g transform={`translate(42, -4)`}>
                  <rect width="32" height="4.5" fill="#f1f5f9" rx="2.25" />
                  <rect 
                    width={32 * (progress / 100)} 
                    height="4.5" 
                    fill="#0ea5e9" 
                    rx="2.25" 
                    className="transition-all duration-1000 ease-out" 
                  />
                </g>
              </g>
              
              {/* Click area */}
              <rect x="-15" y="-35" width="120" height="70" fill="transparent" />
            </g>
          );
        })}

        {/* Filled polygon */}
        {polyPoints.length > 2 && (
          <polygon
            points={polyPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="rgba(14, 165, 233, 0.18)"
            stroke="#0ea5e9"
            strokeWidth="6"
            strokeLinejoin="miter"
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>
    </div>
  );
};

export default RadarChart;
