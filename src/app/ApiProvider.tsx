'use client';

import React, { type ReactNode, useEffect } from 'react';
import { fetchUser } from '@/store/slices/user';
import { useDispatch } from 'react-redux';

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default ApiProvider;
