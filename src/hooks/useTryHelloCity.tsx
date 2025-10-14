'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { Trans } from '@lingui/react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useLanguage } from '@/contexts/LanguageContext';
import { CustomModal } from '@/compoundComponents/Modals/CustomModal';

export const useTryHelloCity = () => {
  const { user, isLoading } = useUser();
  const { language } = useLanguage();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (user) {
        router.push(`/${language}/assistant`);
      } else {
        setShowLoginModal(true);
      }
    },
    [user, language, router],
  );

  const handleLogin = useCallback(() => {
    window.location.href = '/auth/login';
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const LoginModal = (
    <CustomModal
      open={showLoginModal}
      onClose={handleCloseModal}
      title={<Trans id="login.required.title" message="Login Required" />}
      description={
        <Trans
          id="login.required.description"
          message="Please log in to access HelloCity AI assistant and start your relocation journey."
        />
      }
      textAlignCenter
    >
      <div className="flex justify-center px-6 pb-4 pt-2">
        <Button
          onClick={handleLogin}
          variant="primary"
          sx={{ marginTop: '6px' }}
          className="w-[180px] font-semibold"
        >
          <Trans id="login.button" message="Log In" />
        </Button>
      </div>
    </CustomModal>
  );

  return {
    onClick: handleClick,
    isLoading,
    LoginModal,
    label: <Trans id="NavBar.Try HelloCity" message="Try HelloCity" />,
  };
};
