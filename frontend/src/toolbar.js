import React, { useEffect, useRef } from 'react';
import { DraggableNode } from './draggableNode';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { 
  Download, 
  Cpu, 
  Upload, 
  Type, 
  Filter, 
  GitMerge, 
  Globe, 
  StickyNote, 
  Timer
} from 'lucide-react';

// --- THEME ALIGNMENT (Sync with index.css & Submit.js) ---
const THEME = {
  bg: 'rgba(10, 10, 12, 0.85)',      // Deep Obsidian Glass
  border: 'rgba(255, 255, 255, 0.06)', 
  accent: '#6366f1',                // Precision Indigo
  surface: '#050505',
};

const DockWrapper = styled.div`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  
  /* MacBook Dock Aesthetic */
  background: ${THEME.bg};
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 18px;
  border: 1px solid ${THEME.border};
  
  /* Deep Diffusion Shadow (Ultra Luxury) */
  box-shadow: 
    0 0 0 1px rgba(0,0,0,0.8),
    0 30px 60px -15px rgba(0, 0, 0, 0.7);

  @media (max-width: 1100px) {
    width: 92%;
    top: 12px;
    padding: 6px 12px;
    gap: 8px;
  }

  /* Mobile: Vertical sidebar on the left */
  @media (max-width: 768px) {
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    flex-direction: column;
    padding: 12px 8px;
    gap: 6px;
    width: auto;
    border-radius: 16px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  padding-right: 16px;
  border-right: 1px solid ${THEME.border};
  height: 32px;
  cursor: pointer;
  flex-shrink: 0;

  .logo-box {
    height: 28px;
    width: auto;
    filter: brightness(1.2);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  span {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  &:hover .logo-box {
    transform: scale(1.05);
    filter: brightness(1.5);
  }

  @media (max-width: 768px) {
    padding-right: 0;
    padding-bottom: 10px;
    border-right: none;
    border-bottom: 1px solid ${THEME.border};
    height: auto;
    width: 100%;
    justify-content: center;
    span { display: none; }
  }
`;

const DesktopLogo = styled.img`
  height: 22px;
  display: block;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileFavicon = styled.img`
  display: none;
  @media (max-width: 768px) {
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    object-fit: contain;
    filter: brightness(1.2);
  }
`;

const NodeGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 4px; /* Tight industrial spacing */
  
  @media (min-width: 769px) and (max-width: 1100px) {
    overflow-x: auto;
    width: 100%;
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    max-height: calc(100vh - 140px);
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2px;
  }
`;

const Separator = styled.div`
  width: 1px;
  height: 16px;
  background: ${THEME.border};
  margin: 0 6px;
  opacity: 0.6;

  @media (max-width: 768px) {
    width: 20px;
    height: 1px;
    margin: 2px 0;
  }
`;

export const PipelineToolbar = () => {
    const dockRef = useRef(null);

    useEffect(() => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        // 1. Initial Dock Pop-in (mobile: slide from left, desktop: drop from top)
        if (isMobile) {
            tl.fromTo(dockRef.current,
                { x: -80, opacity: 0, scale: 0.9 },
                { x: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.3 }
            );
        } else {
            tl.fromTo(dockRef.current, 
                { y: -60, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.3 }
            );
        }

        // 2. Staggered reveal for internal nodes (Studio Signature)
        tl.fromTo(".dock-item", 
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
            "-=0.8"
        );
    }, []);

    return (
        <DockWrapper ref={dockRef}>
            <BrandSection onClick={() => window.location.reload()}>
                <div className="logo-box">
                    <DesktopLogo src="/logo.png" alt="VP" />
                    <MobileFavicon src="/favicon.ico" alt="VP" />
                </div>
            </BrandSection>
            
            <NodeGrid>
                {/* Inputs Group */}
                <Group className="dock-item">
                    <DraggableNode type='customInput' label='Input' icon={Download} />
                    <DraggableNode type='customOutput' label='Output' icon={Upload} />
                </Group>
                
                <Separator className="dock-item" />

                {/* Processing Group */}
                <Group className="dock-item">
                    <DraggableNode type='llm' label='llm' icon={Cpu} />
                    <DraggableNode type='text' label='text' icon={Type} />
                </Group>
                
                <Separator className="dock-item" />

                {/* Logic Group */}
                <Group className="dock-item">
                    <DraggableNode type='filter' label='Filter' icon={Filter} />
                    <DraggableNode type='merge' label='Merge' icon={GitMerge} />
                </Group>
                
                <Separator className="dock-item" />

                {/* Utilities Group */}
                <Group className="dock-item">
                    <DraggableNode type='api' label='API' icon={Globe} />
                    <DraggableNode type='note' label='Note' icon={StickyNote} />
                    <DraggableNode type='timer' label='Timer' icon={Timer} />
                </Group>
            </NodeGrid>
        </DockWrapper>
    );
};