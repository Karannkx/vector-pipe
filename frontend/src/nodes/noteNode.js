

import React, { useState } from 'react';
import { BaseNode, FieldTextarea } from './BaseNode';
import { useStore } from '../store';
import { StickyNote, AlignLeft, Hash, Clock } from 'lucide-react';
import styled from 'styled-components';

// --- THEME ALIGNMENT ---
const THEME = {
  bg: '#050505',
  surface: '#0d0d0d',
  accentGold: '#fbbf24', // Luxury Amber
  textMuted: '#52525b',
  border: 'rgba(255, 255, 255, 0.06)',
};

// 1. DEDICATED NOTE SHIELD (Consistent with Studio Layout)
const NoteShield = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Since NoteNode has no handles, we use standard luxury padding */
  padding: 8px 12px 20px 12px;
  width: 100%;
`;

const NoteContainer = styled.div`
  position: relative;
  background: rgba(251, 191, 36, 0.02); /* Extremely subtle amber tint */
  border: 1px dashed rgba(251, 191, 36, 0.15); /* Industrial Dashed Border */
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus-within {
    background: rgba(251, 191, 36, 0.04);
    border-style: solid;
    border-color: ${THEME.accentGold};
    transform: translateY(-2px);
  }
`;

const StyledNoteEditor = styled(FieldTextarea)`
  font-family: 'Inter', sans-serif !important;
  font-size: 13px !important;
  font-style: italic;
  line-height: 1.7 !important;
  color: #e2e8f0 !important;
  padding: 16px !important;
  background: transparent !important;
  border: none !important;
  min-height: 100px;
  resize: vertical;
  
  &::placeholder {
    color: #3f3f46;
    font-style: normal;
  }
`;

const LogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid ${THEME.border};
`;

const LogItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 700;
  color: ${THEME.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [note, setNote] = useState(data?.note || '');

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNote(val);
    updateNodeField(id, 'note', val);
  };

  return (
    <BaseNode
      id={id}
      title="Observation Log"
      icon={<StickyNote size={14} strokeWidth={2.5} color={THEME.accentGold} />}
      handles={[]} // Zero handles for clean annotation
      minWidth={300}
    >
      <NoteShield>

        {/* Alignment Corrected Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlignLeft size={12} color={THEME.textMuted} />
            <span style={{
              fontFamily: 'Poppins', fontSize: '10px', fontWeight: 700,
              color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em'
            }}>
              Technical Brief
            </span>
          </div>
          <Hash size={12} color={THEME.textMuted} />
        </div>

        <NoteContainer>
          <StyledNoteEditor
            placeholder="Document architecture insights or workflow constraints..."
            value={note}
            onChange={handleNoteChange}
          />

          <LogFooter>
            <LogItem>
              <Clock size={10} />
              <span>Timestamp_Logged</span>
            </LogItem>
            <LogItem>
              <span>V1.0.4 // SHA-256</span>
            </LogItem>
          </LogFooter>
        </NoteContainer>

        <div style={{ opacity: 0.2, fontSize: '8px', textAlign: 'center', fontWeight: 900, letterSpacing: '0.4em' }}>
          INTERNAL_USE_ONLY
        </div>

      </NoteShield>
    </BaseNode>
  );
};