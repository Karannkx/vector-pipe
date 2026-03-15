import React, { useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

// --- EXECUTIVE HUD THEME (Sync with index.css & Submit.js) ---
const THEME = {
  bg: 'transparent',                // Subtle default state
  bgHover: '#000000',               // Pure Obsidian Black on hover
  border: 'rgba(255, 255, 255, 0.04)', // Almost invisible micro-border
  accent: '#6366f1',                // Precision Indigo
  text: '#71717a',                  // Zinc 400 (Muted)
  textHover: '#ffffff',             // Pure White
};

const DraggableWrapper = styled.div`
  cursor: grab;
  min-width: 84px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  gap: 8px;
  user-select: none;
  
  /* Precision Styling */
  border-radius: 8px;
  background: ${THEME.bg};
  border: 1px solid transparent;
  color: ${THEME.text};
  font-family: 'Inter', sans-serif;
  
  /* Smooth transition for Luxury feel */
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  &:hover {
    background: ${THEME.bgHover};
    border-color: ${THEME.border};
    color: ${THEME.textHover};
    transform: translateY(-2px);
    
    /* Depth without Glow */
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.8);
    
    .node-icon {
      color: ${THEME.accent};
    }
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.94);
    background: #000000;
  }

  /* Mobile: icon-only square button */
  @media (max-width: 768px) {
    min-width: 36px;
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 10px;
    gap: 0;
  }
`;

const Label = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #52525b; /* Zinc 500 */
  transition: color 0.3s ease;
  
  svg {
    width: 13px;
    height: 13px;
    stroke-width: 2.5px; /* High-precision thicker strokes */
  }
`;

let _touchGhost = null;

export const DraggableNode = ({ type, label, icon: Icon }) => {
  const nodeRef = useRef(null);

  const onDragStart = (event, nodeType) => {
    // Haptic UI: Subtle shrink when picked up
    gsap.to(nodeRef.current, { scale: 0.92, duration: 0.1 });
    
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = () => {
    // Premium Elastic snap back
    gsap.to(nodeRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.6)" });
  };

  // --- Touch Support for Mobile ---
  const onTouchStart = (e) => {
    e.stopPropagation();
    window.__touchDragType = type;
    gsap.to(nodeRef.current, { scale: 0.92, duration: 0.1 });

    const touch = e.touches[0];
    _touchGhost = document.createElement('div');
    _touchGhost.textContent = label;
    Object.assign(_touchGhost.style, {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '9999',
      background: 'rgba(99,102,241,0.92)',
      color: '#fff',
      padding: '6px 14px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      transform: 'translate(-50%, -160%)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      left: `${touch.clientX}px`,
      top: `${touch.clientY}px`,
    });
    document.body.appendChild(_touchGhost);
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (_touchGhost) {
      _touchGhost.style.left = `${touch.clientX}px`;
      _touchGhost.style.top = `${touch.clientY}px`;
    }
  };

  const onTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    if (_touchGhost) {
      _touchGhost.remove();
      _touchGhost = null;
    }
    document.dispatchEvent(new CustomEvent('touchNodeDrop', {
      detail: { nodeType: window.__touchDragType, x: touch.clientX, y: touch.clientY },
    }));
    window.__touchDragType = null;
    gsap.to(nodeRef.current, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
  };

  return (
    <DraggableWrapper
      ref={nodeRef}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      draggable
    >
      <IconWrapper className="node-icon">
        {Icon && <Icon />}
      </IconWrapper>
      <Label>{label}</Label>
    </DraggableWrapper>
  );
};