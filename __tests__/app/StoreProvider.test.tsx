/**
 * Testing library and framework: Jest + @testing-library/react
 * If the repo uses Vitest, these tests are largely compatible (change test runner imports if needed).
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

// We import the component under test relative to the repository structure.
// If the StoreProvider component is located elsewhere, adjust the path accordingly.
import StoreProvider from '../../app/StoreProvider';

// Mock the store import inside StoreProvider so we can control behavior.
// The component imports: import store from '../store/index';
jest.mock('../../app/store/index', () => {
  // Provide a minimal Redux store-like object compatible with react-redux Provider expectations.
  // react-redux Provider expects a Redux store with getState/dispatch/subscribe.
  const listeners: Array<() => void> = [];
  const mockState = { __test__: true };
  return {
    __esModule: true,
    default: {
      getState: () => mockState,
      dispatch: jest.fn(),
      subscribe: (listener: () => void) => {
        listeners.push(listener);
        return () => {
          const idx = listeners.indexOf(listener);
          if (idx >= 0) listeners.splice(idx, 1);
        };
      },
      // Optional, but some versions of react-redux may read replaceReducer
      replaceReducer: jest.fn(),
    },
  };
});

describe('StoreProvider', () => {
  it('renders its children within the Redux Provider (happy path)', () => {
    render(
      <StoreProvider>
        <div data-testid="child">Hello</div>
      </StoreProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('does not crash when rendered without children (edge case)', () => {
    const { container } = render(<StoreProvider>{null}</StoreProvider>);
    // Should render an empty Provider without throwing
    expect(container).toBeTruthy();
  });

  it('renders string child nodes correctly', () => {
    render(<StoreProvider>{'Plain string'}</StoreProvider>);
    expect(screen.getByText('Plain string')).toBeInTheDocument();
  });

  it('supports multiple children', () => {
    render(
      <StoreProvider>
        <>
          <span>One</span>
          <span>Two</span>
        </>
      </StoreProvider>
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  // Optional snapshot - only useful if project uses snapshots
  it('matches snapshot for simple render', () => {
    const { asFragment } = render(
      <StoreProvider>
        <div>Snapshot Child</div>
      </StoreProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});