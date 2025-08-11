'use client';

import { Typography, Button, Stack } from '@mui/material';

export default function Example() {
  return (
    <Stack spacing={3} sx={{ padding: 4 }}>
      <Typography variant="h1">H1 Cabinet Grotesk</Typography>
      <Typography variant="h2">H2 Cabinet Grotesk</Typography>
      <Typography variant="h3">H3 Cabinet Grotesk</Typography>
      <Typography variant="h4">H4 Cabinet Grotesk</Typography>
      <Typography variant="h5">H5 Cabinet Grotesk</Typography>
      <Typography variant="h6">H6 Cabinet Grotesk</Typography>
      <Typography variant="body1">Body1 IBM Plex Sans</Typography>
      <Typography variant="body2">Body2 IBM Plex Sans</Typography>
      <Typography variant="caption">Caption IBM Plex Sans</Typography>
      <Typography variant="subtitle2">Subtitle2 Inter</Typography>
      <Typography variant="button">Button IBM Plex Sans</Typography>

      <Typography variant="h5">Color configurations</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
        <Button variant="contained" color="info">
          Info
        </Button>
        <Button variant="contained" disabled>
          Disabled
        </Button>
      </Stack>
      <Typography variant="h5">Button configurations</Typography>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center" // or "flex-start"
        sx={{ height: '150px', background: '#404040', borderRadius: '36px' }}
      >
        <Button variant="primary" color="primary">
          <Typography variant="button">Primary</Typography>
        </Button>
        <Button variant="secondary" color="secondary">
          <Typography variant="button">Secondary</Typography>
        </Button>
        <Button variant="tertiary">
          <Typography variant="button">Tertiary</Typography>
        </Button>
      </Stack>
    </Stack>
  );
}
