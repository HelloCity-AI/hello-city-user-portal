/**
 * Tests for RootLayout (app/layout.tsx)
 * Framework/Libraries: React Testing Library + Jest (or Vitest compatible)
 * - Mocks next/font/google and @mui/material-nextjs/v15-appRouter to avoid SSR-specific hooks in tests.
 * - Verifies metadata export and layout rendering with child content, theming, and className application.
 */

import React from 'react'
import type { ReactNode } from 'react'

// These imports mirror the module under test.
// We import after setting up jest/vitest-compatible mocks below.
import { render, screen } from '@testing-library/react'

/**
 * Mocks
 * - next/font/google: return stable className
 * - @mui/material-nextjs/v15-appRouter: provide a passthrough provider for tests
 */
jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({ className: 'inter-mock' })),
}))

jest.mock('@mui/material-nextjs/v15-appRouter', () => ({
  AppRouterCacheProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

// Now import the module under test
// We attempt common canonical location; the repository may use baseUrl and alias so try both.
// Prefer the path that exists at build time for tests; adjust if needed per repo config.
let RootLayout: any
let metadata: any
try {
  // Typical Next.js app directory structure
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../../app/layout.tsx')
  RootLayout = mod.default
  metadata = mod.metadata
} catch {
  // Fallback: sometimes app/layout.tsx is at project root app/
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../../app/layout')
  RootLayout = mod.default
  metadata = mod.metadata
}

describe('RootLayout metadata', () => {
  test('exports expected title and description', () => {
    expect(metadata).toBeDefined()
    expect(metadata.title).toBe('HelloCity - Landing Assistant for new cities')
    expect(metadata.description).toContain('HelloCity is an AI-powered landing assistant')
  })

  test('exports expected icons configuration', () => {
    expect(metadata.icons).toBeDefined()
    expect(metadata.icons.icon).toBe('/icon.png')
    expect(metadata.icons.shortcut).toBe('/icon.png')
    expect(metadata.icons.apple).toBe('/icon.png')
  })
})

describe('RootLayout rendering', () => {
  test('wraps children within html/body with lang and Inter className on body (happy path)', async () => {
    const Child = () => <div data-testid="child">child-content</div>
    // RootLayout is async; await its element before render
    const element = await RootLayout({ children: <Child /> })
    render(element)

    const html = document.documentElement
    expect(html).toBeTruthy()
    // lang attribute on <html>
    expect(html.getAttribute('lang')).toBe('en')

    // body should have Inter class name from mocked font
    const body = document.body
    expect(body.className).toContain('inter-mock')

    // child should be rendered
    expect(screen.getByTestId('child')).toHaveTextContent('child-content')
  })

  test('renders CssBaseline and themed container structure (smoke test)', async () => {
    const element = await RootLayout({ children: <div>content</div> })
    const { container } = render(element)

    // CssBaseline injects global styles; not directly testable via DOM nodes reliably.
    // Instead, assert presence of wrapping structure:
    // Expect a single top-level div with class "relative" wrapping the children
    const relativeDiv = container.querySelector('div.relative')
    expect(relativeDiv).not.toBeNull()
    expect(relativeDiv).toHaveTextContent('content')
  })

  test('is resilient with null/empty children (edge case)', async () => {
    const element = await RootLayout({ children: null as unknown as React.ReactNode })
    const { container } = render(element)
    // Should still render html/body; no throw
    expect(document.documentElement.tagName.toLowerCase()).toBe('html')
    // relative wrapper should still exist; empty content inside
    const relativeDiv = container.querySelector('div.relative')
    expect(relativeDiv).not.toBeNull()
    expect(relativeDiv?.textContent).toBe('')
  })

  test('accepts a text node as children (edge case)', async () => {
    const element = await RootLayout({ children: 'plain-text' as unknown as React.ReactNode })
    const { container } = render(element)
    const relativeDiv = container.querySelector('div.relative')
    expect(relativeDiv).not.toBeNull()
    expect(relativeDiv).toHaveTextContent('plain-text')
  })
})


// ------- Additional coverage for RootLayout --------
describe('RootLayout additional coverage', () => {
  test('body receives Inter class from next/font/google mock', async () => {
    // dynamic import within try-catch section above may already have executed;
    // ensure RootLayout reference exists
    const mod = (() => {
      try { return require('../../app/layout.tsx') } catch { return require('../../app/layout') }
    })()
    const RL = mod.default
    const element = await RL({ children: <div /> })
    render(element)
    expect(document.body.className).toContain('inter-mock')
  })

  test('metadata object shape contains icons with all expected keys', () => {
    const mod = (() => {
      try { return require('../../app/layout.tsx') } catch { return require('../../app/layout') }
    })()
    const md = mod.metadata
    expect(md).toBeDefined()
    const keys = Object.keys(md.icons || {})
    expect(keys).toEqual(expect.arrayContaining(['icon', 'shortcut', 'apple']))
  })
})