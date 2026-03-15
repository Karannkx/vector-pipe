import React from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import styled from 'styled-components';
import { Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';

// --- LUXURY SYSTEM THEME ---
const THEME = {
  accent: '#6366f1',
  success: '#10b981',
  textMuted: '#71717a',
  border: 'rgba(255, 255, 255, 0.06)',
};

// 1. DEDICATED CONTENT SHIELD (Pushing content away from handles)
const ContentShield = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* SAFE ZONE: 50px margins ensure Handle Labels have their own space */
  margin: 0 45px; 
  padding: 10px 0 20px 0;
  
  @media (max-width: 500px) {
    margin: 0 35px;
  }
`;

const HeaderStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: 1px solid ${THEME.border};
  padding-bottom: 12px;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  span {
    font-family: 'Poppins', sans-serif;
    font-size: 10px;
    font-weight: 800;
    color: ${THEME.success};
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
`;

const NodeID = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: ${THEME.textMuted};
  letter-spacing: 0.05em;
`;

const DescriptionBox = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${THEME.border};
  border-radius: 8px;
  padding: 12px;
  position: relative;
  
  /* Precision Accent Line */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 2px;
    background: ${THEME.accent};
    border-radius: 0 2px 2px 0;
  }
`;

const MainText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #d1d5db;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
`;

const TechnicalFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 700;
  color: ${THEME.textMuted};
  text-transform: uppercase;
`;

export const LLMNode = ({ id, data }) => {
  // --- PRECISION HANDLES CONFIG ---
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-system`,
      label: 'SYSTEM',
      style: { top: '35%', background: '#000', borderColor: THEME.accent, width: 8, height: 8 }
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-prompt`,
      label: 'PROMPT',
      style: { top: '65%', background: '#000', borderColor: THEME.accent, width: 8, height: 8 }
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`,
      label: 'OUTPUT',
      style: { top: '50%', background: '#000', borderColor: THEME.success, width: 8, height: 8 }
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Neural Engine"
      icon={<Cpu size={14} strokeWidth={2.5} />}
      handles={handles}
      minWidth={360} // Wider for professional distribution
    >
      <ContentShield>

        {/* TOP: Identification & Status */}
        <HeaderStack>
          <StatusBadge>
            <ShieldCheck size={12} color={THEME.success} strokeWidth={3} />
            <span>Operational</span>
          </StatusBadge>
          <NodeID>CORE_INSTANCE // 0x-44029</NodeID>
        </HeaderStack>

        {/* MIDDLE: Intelligence Description */}
        <DescriptionBox>
          <MainText>
            High-density <strong>neural synthesis</strong> active.
            Resolving logical tokens through multi-layered weight matrices
            to produce verified inference packets.
          </MainText>
        </DescriptionBox>

        {/* BOTTOM: Hardware Specs */}
        <TechnicalFooter>
          <FooterItem>
            <Zap size={10} color={THEME.accent} />
            <span>Latency: 12ms</span>
          </FooterItem>
          <FooterItem>
            <span>v2.0.4</span>
          </FooterItem>
        </TechnicalFooter>

      </ContentShield>
    </BaseNode>
  );
};