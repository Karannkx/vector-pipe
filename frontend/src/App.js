import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import styled from 'styled-components';
import { Github, Linkedin } from 'lucide-react';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f172a;
  overflow: hidden;
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
`;

const SocialLinks = styled.div`
  position: fixed;
  top: 24px;
  right: 18px;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 1100px) {
    top: 12px;
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    gap: 6px;
  }
`;

const SocialAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 10px;
  text-decoration: none;
  background: rgba(10, 10, 12, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(99, 102, 241, 0.6);
    background: rgba(25, 25, 30, 0.9);
  }

  @media (max-width: 768px) {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }
`;

function App() {
  return (
    <AppWrapper>
      <SocialLinks>
        <SocialAnchor href="https://github.com/karannkx" target="_blank" rel="noreferrer" aria-label="GitHub karannkx">
          <Github size={15} />
        </SocialAnchor>
        <SocialAnchor href="https://linkedin.com/in/karannkx" target="_blank" rel="noreferrer" aria-label="LinkedIn karannkx">
          <Linkedin size={15} />
        </SocialAnchor>
      </SocialLinks>
      <PipelineToolbar />
      <CanvasArea>
        <PipelineUI />
      </CanvasArea>
      <SubmitButton />
    </AppWrapper>
  );
}

export default App;
