import React from 'react';
import styled from 'styled-components';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const MessageContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
`;

const Message = styled.div`
  background: ${props => {
    switch(props.type) {
      case 'success': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'error': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'warning': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'info': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const MessageIcon = styled.div`
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const MessageText = styled.div`
  font-size: 13px;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const MessageBox = ({ message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch(message.type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      case 'info': return <Info size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <MessageContainer>
      <Message type={message.type}>
        <MessageIcon>
          {getIcon()}
        </MessageIcon>
        <MessageContent>
          <MessageTitle>{message.title}</MessageTitle>
          <MessageText>{message.text}</MessageText>
        </MessageContent>
        <CloseButton onClick={onClose}>
          <X size={16} />
        </CloseButton>
      </Message>
    </MessageContainer>
  );
};

export default MessageBox;
