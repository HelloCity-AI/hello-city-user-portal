'use client';

import React, { type ReactNode, useEffect, useRef } from 'react';
import { fetchUser } from '@/store/slices/user';
import { useDispatch } from 'react-redux';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // TEMPORARY: Disable auto fetchUser to test if it's causing CORS errors
      // dispatch(fetchUser());
    }
  }, [dispatch]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default ApiProvider;
