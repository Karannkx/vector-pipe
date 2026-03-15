
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Position } from 'reactflow';
import { BaseNode, FieldTextarea } from './BaseNode';
import { useStore } from '../store';
import { Variable, Code2, Cpu } from 'lucide-react';
import styled from 'styled-components';

// --- THEME ALIGNMENT ---
const THEME = {
  bg: '#050505',
  accent: '#6366f1',
  textMuted: '#71717a',
  border: 'rgba(255, 255, 255, 0.06)',
  editorBg: 'rgba(0, 0, 0, 0.4)',
};

// 1. SAFE ZONE WRAPPER (Prevents Handle Label Overlap)
const EditorShield = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* DEDICATED GUTTER: 48px margins create a protected corridor for handle labels */
  margin: 0 48px;
  padding: 8px 0 20px 0;

  @media (max-width: 500px) {
    margin: 0 38px;
  }
`;

const TechnicalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid ${THEME.border};
  padding-bottom: 10px;
`;

const StatusTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  span {
    font-family: 'Poppins', sans-serif;
    font-size: 9px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
`;

const EditorContainer = styled.div`
  position: relative;
  background: ${THEME.editorBg};
  border: 1px solid ${THEME.border};
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${THEME.accent};
    background: #000;
  }
`;

const StyledEditorTextarea = styled(FieldTextarea)`
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  line-height: 1.6 !important;
  font-size: 12px !important;
  color: #e2e8f0 !important;
  padding: 14px !important;
  background: transparent !important;
  border: none !important;
  min-height: 60px;
  
  &::placeholder {
    color: #3f3f46;
  }
`;

const VariableStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(99, 102, 241, 0.03);
  border-top: 1px solid ${THEME.border};
`;

const VariableChip = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 4px;
  
  span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    color: #818cf8;
  }
`;

// --- LOGIC HELPERS (Unchanged) ---
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const matches = [];
  let match;
  const regex = new RegExp(VARIABLE_REGEX);
  while ((match = regex.exec(text)) !== null) {
    if (!matches.includes(match[1])) matches.push(match[1]);
  }
  return matches;
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const textareaRef = useRef(null);
  const [dim, setDim] = useState({ width: 320 });

  // Auto-resize logic with luxury spacing
  useEffect(() => {
    if (textareaRef.current) {
      const ta = textareaRef.current;
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;

      const lines = currText.split('\n');
      const longestLine = Math.max(...lines.map((l) => l.length));
      // Wider default for luxury feel + handle label safety
      const newWidth = Math.max(340, Math.min(580, longestLine * 8 + 120));
      setDim({ width: newWidth });
    }
  }, [currText]);

  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    setCurrText(newText);
    const newVars = extractVariables(newText);
    setVariables(newVars);
    updateNodeField(id, 'text', newText);
    updateNodeField(id, 'variables', newVars);
  }, [id, updateNodeField]);

  // High-precision handles with Obsidian styling
  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
      label: 'RESULT',
      style: { background: '#000', borderColor: '#fff' }
    },
    ...variables.map((v) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${v}`,
      label: v.toUpperCase(),
      style: { background: '#000', borderColor: THEME.accent }
    })),
  ];

  return (
    <BaseNode
      id={id}
      title="Prompt Buffer"
      icon={<Code2 size={14} strokeWidth={2.5} />}
      handles={handles}
      minWidth={dim.width}
      width={dim.width}
    >
      <EditorShield>

        <TechnicalHeader>
          <StatusTag>
            <Cpu size={12} color={THEME.accent} strokeWidth={3} />
            <span>IO_STR_STREAM</span>
          </StatusTag>
          <div style={{ fontSize: '9px', fontFamily: 'JetBrains Mono', color: THEME.textMuted }}>
            0x_BUFF
          </div>
        </TechnicalHeader>

        <EditorContainer>
          <StyledEditorTextarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder='Type text... Use {{variable}}'
          />

          {variables.length > 0 && (
            <VariableStrip>
              {variables.map((v) => (
                <VariableChip key={v}>
                  <Variable size={10} color="#818cf8" />
                  <span>{v}</span>
                </VariableChip>
              ))}
            </VariableStrip>
          )}
        </EditorContainer>

        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.4 }}>
          <span style={{ fontSize: '8px', fontWeight: 900, color: THEME.textMuted }}>UTF-8_READY</span>
          <span style={{ fontSize: '8px', fontWeight: 900, color: THEME.textMuted }}>LNS: {currText.split('\n').length}</span>
        </div>

      </EditorShield>
    </BaseNode>
  );
};