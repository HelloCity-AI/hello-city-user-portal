'use client';

import { Provider } from 'react-redux';
import store from '../store/index';

export default function ProviderRedux({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
