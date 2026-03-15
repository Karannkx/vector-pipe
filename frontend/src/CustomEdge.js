import React, { useState, useLayoutEffect, useRef } from 'react';
import { getSmoothStepPath, useReactFlow } from 'reactflow';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { gsap } from 'gsap';

// --- THEME ALIGNMENT ---
const THEME = {
  edgeBase: '#18181b',      // Zinc 900 (Deep Stealth)
  edgeHover: '#6366f1',     // Technical Indigo
  edgeSelected: '#ffffff',  // High-Contrast White
  deleteRed: '#f43f5e',     // Error/Delete Rose
  glassBg: 'rgba(10, 10, 12, 0.9)',
  border: 'rgba(255, 255, 255, 0.08)',
};

const HUDButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: all;
`;

const HUDDeleteButton = styled.button`
  width: 22px;
  height: 22px;
  background: #f43f5e;
  border: none;
  color: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: #e11d48;
    transform: scale(1.15);
  }
`;

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}) => {
  const [hovered, setHovered] = useState(false);
  const { setEdges } = useReactFlow();
  const buttonRef = useRef(null);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16, /* Ultra-smooth logic curves */
  });

  const onDelete = (e) => {
    e.stopPropagation();
    gsap.to(buttonRef.current, { 
      scale: 0, opacity: 0, duration: 0.2, 
      onComplete: () => setEdges((edges) => edges.filter((edge) => edge.id !== id)) 
    });
  };

  // GSAP: High-End HUD reveal
  useLayoutEffect(() => {
    if (hovered || selected) {
      gsap.fromTo(buttonRef.current, 
        { scale: 0.8, opacity: 0, y: 5 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }
      );
    }
  }, [hovered, selected]);

  const activeColor = selected 
    ? THEME.edgeSelected 
    : hovered 
      ? THEME.edgeHover 
      : (style.stroke || THEME.edgeBase);

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="nowheel"
    >
      {/* 1. INTERACTION SHIELD (Invisible fat path for precise UX) */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />

      {/* 2. PRIMARY DATA LINK (The visible edge) */}
      <path
        d={edgePath}
        fill="none"
        stroke={activeColor}
        strokeWidth={selected ? 2.5 : hovered ? 2.5 : 1.5}
        markerEnd={markerEnd}
        style={{
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
          ...style,
        }}
      />

      {/* 3. TECHNICAL DATA STREAM (Animated overlay on hover) */}
      {hovered && !selected && (
        <path
          d={edgePath}
          fill="none"
          stroke={THEME.edgeHover}
          strokeWidth={2}
          strokeDasharray="10 8"
          style={{
            animation: 'dataStream 1s linear infinite',
            opacity: 0.6
          }}
        />
      )}

      {/* 4. TERMINATION HUD (Delete Button) */}
      {(hovered || selected) && (
        <foreignObject
          x={labelX - 11}
          y={labelY - 11}
          width={22}
          height={22}
          requiredExtensions="http://www.w3.org/1999/xhtml"
          style={{ overflow: 'visible', pointerEvents: 'all' }}
        >
          <HUDButtonContainer ref={buttonRef}>
            <HUDDeleteButton onClick={onDelete} title="Terminate Data Link">
              <X size={12} strokeWidth={3} />
            </HUDDeleteButton>
          </HUDButtonContainer>
        </foreignObject>
      )}

      <style>{`
        @keyframes dataStream {
          from { stroke-dashoffset: 18; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </g>
  );
};