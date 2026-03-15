import React, { useRef, useState } from 'react';
import { Handle } from 'reactflow';
import styled, { keyframes, css } from 'styled-components';
import { useStore } from '../store';
import { X, Check } from 'lucide-react';
import { gsap } from 'gsap';

// --- STUDIO HUD THEME (EXACT AS PROVIDED) ---
const THEME = {
  bg: '#050505',
  surface: '#0d0d0d',
  headerBg: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.08)',
  accent: '#6366f1',
  textMain: '#ffffff',
  textMuted: '#52525b',
  success: '#10b981',
};

const holoShineAnim = keyframes`
  0% { background-position: 200% 200%; }
  100% { background-position: -200% -200%; }
`;

const NodeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const NodeWrapper = styled.div`
  /* Dual Size Logic */
  min-width: ${({ $isExpanded, $minWidth }) => ($isExpanded ? ($minWidth || 320) : 76)}px;
  min-height: ${({ $isExpanded }) => ($isExpanded ? 140 : 76)}px;
  width: ${({ $isExpanded, $width }) => ($isExpanded ? ($width ? `${$width}px` : 'auto') : '76px')};

  background: ${THEME.bg};
  border-radius: ${({ $isExpanded }) => ($isExpanded ? '16px' : '20px')};
  border: 1px solid ${THEME.border};
  position: relative;
  cursor: pointer;
  z-index: 1;
  transition: border-color 0.4s ease, border-radius 0.4s ease, width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7);

  &.selected {
    border-color: ${THEME.accent};
    box-shadow: 0 0 0 1px ${THEME.accent}, 0 15px 40px -10px rgba(99, 102, 241, 0.3);
  }

  /* GLASS EFFECT & SHINE: Only for compact icons */
  ${({ $isExpanded }) => !$isExpanded && css`
    backdrop-filter: blur(20px) saturate(180%);
    
    &::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: linear-gradient(135deg, transparent 40%, rgba(99, 102, 241, 0.4) 50%, transparent 60%);
      background-size: 200% 200%;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
      pointer-events: none;
    }

    /* Desktop Hover Shine */
    &:hover::after {
      opacity: 1;
      animation: ${holoShineAnim} 2s linear infinite;
    }

    /* Mobile Auto-Shine (Always running because no hover) */
    @media (hover: none) {
      &::after {
        opacity: 0.6;
        animation: ${holoShineAnim} 3s linear infinite;
      }
    }
  `}

  @media (max-width: 768px) {
    min-width: ${({ $isExpanded }) => ($isExpanded ? '88vw' : '72px')};
  }
`;

const IconView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 76px;
  width: 100%;
  padding: 8px;
  text-align: center;
  z-index: 2;

  .icon-wrap {
    color: ${THEME.accent};
    margin-bottom: 4px; /* Space between icon and text */
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const CompactLabel = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 8px; /* Slightly smaller for precision */
  font-weight: 700;
  color: ${THEME.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: 100%;
  line-height: 1.2;
  /* Text Wrapping logic to prevent overlap */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FormView = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 2;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center; 
  justify-content: space-between;
  padding: 0 16px;
  background: ${THEME.headerBg};
  border-bottom: 1px solid ${THEME.border};
  height: 48px;
`;

const ActionBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${THEME.border};
  color: ${THEME.textMuted};
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    background: ${({ $type }) => ($type === 'delete' ? '#f43f5e' : THEME.success)};
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const StyledHandle = styled(Handle)`
  width: 10px !important;
  height: 10px !important;
  background: #000 !important;
  border: 2px solid ${THEME.accent} !important;
  transform: rotate(45deg) translate(-50%, -50%) !important;
  z-index: 100;
  transition: all 0.3s ease;
  
  &.react-flow__handle-left { left: -5px !important; }
  &.react-flow__handle-right { right: -5px !important; }

  &:hover {
    background: ${THEME.accent} !important;
    border-color: #fff !important;
    transform: rotate(45deg) scale(1.3) translate(-50%, -50%) !important;
  }
`;

// --- EXPORTS PRESERVATION ---
export const NodeField = styled.div` display: flex; flex-direction: column; gap: 6px; padding: 16px; `;
export const FieldLabel = styled.label` font-size: 10px; font-weight: 700; color: ${THEME.textMuted}; text-transform: uppercase; letter-spacing: 0.1em; font-family: 'Poppins', sans-serif; `;
const baseInput = `padding: 10px 12px; background: #000; border: 1px solid ${THEME.border}; border-radius: 8px; font-size: 12px; color: #fff; width: 100%; transition: all 0.3s ease; &:focus { outline: none; border-color: ${THEME.accent}; }`;
export const FieldInput = styled.input`${baseInput}`;
export const FieldSelect = styled.select`${baseInput} cursor: pointer;`;
export const FieldTextarea = styled.textarea`${baseInput} resize: vertical; min-height: 60px;`;

export const BaseNode = ({ id, title, icon, handles = [], children, minWidth, width, selected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const wrapperRef = useRef(null);

  // --- MAGNETIC 3D TILT PHYSICS (DESKTOP) ---
  const handleMouseMove = (e) => {
    if (isExpanded || window.innerWidth < 768) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - rect.left - 38; 
    const dy = e.clientY - rect.top - 38;

    gsap.to(el, {
      rotateX: -dy / 3,
      rotateY: dx / 3,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(wrapperRef.current, {
      rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <NodeContainer>
      <NodeWrapper
        ref={wrapperRef}
        $isExpanded={isExpanded}
        $minWidth={minWidth}
        $width={width}
        className={selected ? 'selected' : ''}
        onClick={() => !isExpanded && setIsExpanded(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {!isExpanded ? (
          <IconView>
            <div className="icon-wrap">
              {React.cloneElement(icon, { size: 28, strokeWidth: 1.5 })}
            </div>
            <CompactLabel title={title}>{title}</CompactLabel>
          </IconView>
        ) : (
          <FormView className="nowheel">
            <HeaderBar>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ color: THEME.accent }}>{React.cloneElement(icon, { size: 16 })}</div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
              </div>
              <ActionBtn $type="delete" onClick={(e) => { e.stopPropagation(); onNodesChange([{ type: 'remove', id }]); }}>
                <X size={14} />
              </ActionBtn>
            </HeaderBar>

            {children}

            <div style={{ padding: '0 16px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <ActionBtn onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} style={{ padding: '6px 16px', borderRadius: '10px' }}>
                <Check size={14} strokeWidth={3} color={THEME.success} />
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff', marginLeft: '6px', textTransform: 'uppercase' }}>Apply</span>
              </ActionBtn>
            </div>
          </FormView>
        )}

        {/* HANDLES Always On Top and on Edge */}
        {handles.map((h) => {
          const sameSide = handles.filter((x) => x.position === h.position);
          const index = sameSide.indexOf(h);
          const topVal = sameSide.length > 1 ? `${((index + 1) / (sameSide.length + 1)) * 100}%` : '50%';
          return (
            <StyledHandle
              key={h.id}
              type={h.type}
              position={h.position}
              id={h.id}
              isConnectable={true}
              style={{ top: topVal, ...h.style }}
            />
          );
        })}
      </NodeWrapper>
    </NodeContainer>
  );
};