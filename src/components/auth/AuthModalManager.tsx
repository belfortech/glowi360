// components/auth/AuthModalManager.tsx
import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

interface AuthModalManagerProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onCloseLogin: () => void;
  onCloseRegister: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

const AuthModalManager: React.FC<AuthModalManagerProps> = ({
  isLoginOpen,
  isRegisterOpen,
  onCloseLogin,
  onCloseRegister,
  onOpenLogin,
  onOpenRegister
}) => {
  const handleSwitchToRegister = () => {
    onCloseLogin();
    onOpenRegister();
  };

  const handleSwitchToLogin = () => {
    onCloseRegister();
    onOpenLogin();
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={onCloseLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={onCloseRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default AuthModalManager;