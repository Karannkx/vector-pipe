import React, { useLayoutEffect, useRef, useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import styled from 'styled-components';
import { Send, X, Boxes, Cable, Activity, ShieldCheck, AlertCircle, Cpu } from 'lucide-react';
import { gsap } from 'gsap';

// --- THEME ALIGNMENT (Matching index.css & Toolbar) ---
const THEME = {
  bg: 'rgba(5, 5, 5, 0.85)',    // Deep Obsidian Glass
  accent: '#6366f1',           // Precision Indigo
  border: 'rgba(255, 255, 255, 0.06)',
  textMain: '#ffffff',
  textMuted: '#71717a',
};

const SubmitWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: 900; /* Lower than Toolbar to avoid overlap */

  @media (max-width: 768px) {
    position: fixed;
    bottom: max(12px, env(safe-area-inset-bottom));
    right: 12px;
    z-index: 1000;
  }
`;

const ExecuteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  &:hover {
    background: ${THEME.accent};
    color: #fff;
    transform: translateY(-4px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    justify-content: center;
    gap: 0;
    padding: 0;
    border-radius: 12px;
    font-size: 0;
    line-height: 0;
    letter-spacing: 0;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);

    svg {
      width: 18px;
      height: 18px;
      display: block;
      flex-shrink: 0;
      color: #000000;
    }

    &:hover {
      transform: none;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
    }

    .run-label {
      display: none;
    }
  }
`;

// --- FLOATING HUD TERMINAL (Respects Toolbar Space) ---
const HudPanel = styled.div`
  position: fixed;
  top: 100px; /* Leaves gap for the Toolbar at the top */
  right: -420px; /* Initially hidden */
  bottom: 40px; /* Gap from bottom */
  width: 380px;
  background: ${THEME.bg};
  backdrop-filter: blur(32px) saturate(150%);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid ${THEME.border};
  border-radius: 24px;
  z-index: 950; /* Stays above workflow but below any dropdowns */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -20px 40px 80px rgba(0, 0, 0, 0.8);
`;

const TerminalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${THEME.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: ${THEME.accent};
  }
`;

const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &::-webkit-scrollbar { width: 0px; }
`;

const StatBlock = styled.div`
  .label {
    font-size: 9px;
    font-weight: 700;
    color: ${THEME.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 42px;
    font-weight: 500;
    color: ${THEME.textMain};
    line-height: 1;
  }
`;

const ValidationPill = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${THEME.border};
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;

  .info {
    flex: 1;
    h4 { font-size: 12px; margin: 0; color: ${p => p.$ok ? '#10b981' : '#f43f5e'}; }
    p { font-size: 11px; margin: 4px 0 0 0; color: ${THEME.textMuted}; }
  }
`;

const CloseHUD = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover { background: #ff4545; transform: rotate(90deg); }
`;

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [report, setReport] = useState(null);
  const hudRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      setReport(data);
      
      // GSAP: Premium HUD Reveal
      gsap.to(hudRef.current, { 
        right: 32, 
        duration: 1, 
        ease: "expo.out" 
      });
    } catch (error) {
      alert("Pipeline Execution Error");
    }
  };

  const closeHUD = () => {
    gsap.to(hudRef.current, { 
      right: -420, 
      duration: 0.8, 
      ease: "power4.in" 
    });
  };

  return (
    <>
      <SubmitWrapper>
        <ExecuteButton onClick={handleSubmit}>
          <Send size={14} strokeWidth={2.5} />
          <span className="run-label">Run Inference</span>
        </ExecuteButton>
      </SubmitWrapper>

      <HudPanel ref={hudRef}>
        <TerminalHeader>
          <div className="brand">
            <Cpu size={12} />
            Diagnostic Terminal
          </div>
          <CloseHUD onClick={closeHUD}>
            <X size={14} strokeWidth={3} />
          </CloseHUD>
        </TerminalHeader>

        {report && (
          <ContentScroll>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <StatBlock>
                <div className="label"><Boxes size={10} /> Active Modules</div>
                <div className="value">{report.num_nodes}</div>
              </StatBlock>

              <StatBlock>
                <div className="label"><Cable size={10} /> Logical Links</div>
                <div className="value">{report.num_edges}</div>
              </StatBlock>
            </div>

            <ValidationPill $ok={report.is_dag}>
              {report.is_dag ? <ShieldCheck color="#10b981" size={24} /> : <AlertCircle color="#f43f5e" size={24} />}
              <div className="info">
                <h4>{report.is_dag ? 'System Stable' : 'Linkage Failure'}</h4>
                <p>{report.is_dag ? 'Directed Acyclic Graph verified successfully.' : 'Circular dependencies detected in logic.'}</p>
              </div>
            </ValidationPill>

            <div style={{ marginTop: 'auto', opacity: 0.3, fontSize: '9px', fontFamily: 'JetBrains Mono' }}>
              PROTOCOL_VERSION: 1.0.4_LUXURY<br />
              TIMESTAMP: {new Date().toLocaleTimeString()}
            </div>
          </ContentScroll>
        )}
      </HudPanel>
    </>
  );
};