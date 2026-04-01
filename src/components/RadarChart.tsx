/**
 * RadarChart 雷达图组件
 * @module components/RadarChart
 * @description 可视化展示各维度发展状况的蜘蛛网图
 */

import { useMemo } from 'react';
import { CONFIG } from '@/config';
import { calculateLevel, getProgress } from '@/utils';
import type { RadarChartProps, Dimension } from '@/types';

/**
 * 计算点在雷达图上的位置
 *
 * @param index - 维度索引
 * @param total - 总维度数
 * @param radius - 半径
 * @param centerX - 中心点 X 坐标
 * @param centerY - 中心点 Y 坐标
 * @param isLabel - 是否为标签位置（需要额外偏移）
 * @returns 位置坐标和角度
 */
const getPosition = (
  index: number,
  total: number,
  radius: number,
  centerX: number,
  centerY: number,
  isLabel: boolean = false
): { x: number; y: number; angle: number } => {
  const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
  const sin = Math.sin(angle);

  // 标签位置调整：顶部标签需要更多距离，底部标签需要更少距离
  let adjustedR = radius;
  if (isLabel && sin < -0.5) {
    adjustedR = radius + Math.abs(sin) * 15;
  }

  return {
    x: centerX + adjustedR * Math.cos(angle),
    y: centerY + adjustedR * Math.sin(angle),
    angle,
  };
};

/**
 * RadarChart 雷达图组件
 *
 * @description 展示用户各维度的等级和进度
 * - 支持 3-12 个维度
 * - 每个维度显示等级和升级进度
 * - 点击维度标签可触发回调
 *
 * @param {RadarChartProps} props - 组件属性
 *
 * @example
 * <RadarChart
 *   dimensions={dimensions}
 *   scores={scores}
 *   onLabelClick={(index) => setSelectedDim(index)}
 *   size={400}
 * />
 */
export const RadarChart: React.FC<RadarChartProps> = ({
  dimensions,
  scores,
  onLabelClick,
  size = CONFIG.RADAR.DEFAULT_SIZE,
}) => {
  // 筛选激活的维度
  const activeDims = useMemo(
    () => (dimensions || []).filter((d) => d.active),
    [dimensions]
  );

  // 少于 3 个维度无法形成雷达图
  if (activeDims.length < CONFIG.LIMITS.MIN_DIMENSIONS) {
    return null;
  }

  // 计算画布参数
  const padding = CONFIG.RADAR.PADDING;
  const viewBoxSize = size + padding * 2;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = CONFIG.RADAR.RADIUS;
  const baseLabelDist = CONFIG.RADAR.LABEL_DISTANCE;

  // 计算各维度数据点
  const polyPoints = useMemo(() => {
    return activeDims.map((dim, i) => {
      const idx = dimensions.findIndex((d) => d.id === dim.id);
      const s = scores?.[idx] ?? 0;
      const level = calculateLevel(s);
      const r = Math.min(radius, (level / 15) * radius + 25);
      return getPosition(i, activeDims.length, r, centerX, centerY);
    });
  }, [activeDims, dimensions, scores, centerX, centerY, radius]);

  // 同心圆刻度
  const gridCircles = [1, 0.75, 0.5, 0.25];

  return (
    <div className="w-full flex justify-center items-center overflow-visible">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="overflow-visible select-none max-w-[460px]"
      >
        {/* 同心圆网格 */}
        {gridCircles.map((scale) => (
          <circle
            key={scale}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={scale === 1 ? '2.5' : '1.5'}
          />
        ))}

        {/* 维度轴和标签 */}
        {activeDims.map((dim, i) => {
          const axisPos = getPosition(i, activeDims.length, radius, centerX, centerY);
          const labelPos = getPosition(i, activeDims.length, baseLabelDist, centerX, centerY, true);

          const idx = dimensions.findIndex((d) => d.id === dim.id);
          const score = scores?.[idx] ?? 0;
          const level = calculateLevel(score);
          const progress = getProgress(score);

          // 根据角度计算标签水平偏移
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
              {/* 轴线 */}
              <line
                x1={centerX - (labelPos.x + blockXOffset)}
                y1={centerY - labelPos.y}
                x2={axisPos.x - (labelPos.x + blockXOffset)}
                y2={axisPos.y - labelPos.y}
                stroke="#f1f5f9"
                strokeWidth="2.5"
              />
              {/* 轴端点 */}
              <circle
                cx={axisPos.x - (labelPos.x + blockXOffset)}
                cy={axisPos.y - labelPos.y}
                r="4.5"
                fill="#cbd5e1"
                stroke="white"
                strokeWidth="2"
              />

              {/* 维度名称 */}
              <text
                x="0"
                y="-10"
                textAnchor="start"
                className="text-[16px] font-black fill-slate-800 uppercase tracking-tight"
              >
                {dim.name}
              </text>

              {/* 等级和进度条 */}
              <g transform="translate(0, 12)">
                <text
                  x="0"
                  y="0"
                  textAnchor="start"
                  className="text-[12px] font-bold fill-sky-500"
                >
                  Lv.{level}
                </text>
                <g transform="translate(42, -4)">
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

              {/* 扩大点击区域 */}
              <rect x="-15" y="-35" width="120" height="70" fill="transparent" />
            </g>
          );
        })}

        {/* 数据多边形 */}
        {polyPoints.length > 2 && (
          <polygon
            points={polyPoints.map((p) => `${p.x},${p.y}`).join(' ')}
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
