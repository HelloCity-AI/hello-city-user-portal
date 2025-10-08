'use client';

import React, { useState } from 'react';
import Dropdown from '@/components/Dropdown';
import { TextField, List, ListItemButton, Typography, CircularProgress, Box } from '@mui/material';
import { Trans } from '@lingui/react';

interface SearchChatMenuProps {
  trigger: React.ReactNode;
  onSelect: (conversationId: string) => void;
}

const SearchChatMenu: React.FC<SearchChatMenuProps> = ({ trigger, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/conversations/search?query=${encodeURIComponent(
          value,
        )}`,
        {
          headers: {
            Authorization: 'Bearer dev-local-user',
          },
        },
      );

      if (!res.ok) throw new Error('Failed to fetch search results');
      const data = await res.json();
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dropdown
      anchorElContent={trigger}
      layout="vertical"
      textAlignCenter={false}
      disableIconButton
      disableHover

      customContent={
        <Box className="w-64 p-3">

          <TextField
            placeholder="Search chat history..."
            fullWidth
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
          />

          {loading && (
            <Box className="flex justify-center py-3">
              <CircularProgress size={20} />
            </Box>
          )}

          {!loading && (
            <List className="max-h-64 overflow-y-auto">
              {results.length === 0 && query ? (
                <Typography variant="body2" className="text-gray-500 text-center py-2">
                  <Trans id="chat.search.noResult" message="No results found" />
                </Typography>
              ) : (
                results.map((r) => (
                  <ListItemButton
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className="rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Typography variant="body2" className="truncate text-sm text-gray-800">
                      {r.title}
                    </Typography>
                  </ListItemButton>
                ))
              )}
            </List>
          )}
        </Box>
      }
    />
  );
};

export default SearchChatMenu;
