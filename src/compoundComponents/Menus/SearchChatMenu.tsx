'use client';
import React, { useState, useRef } from 'react';
import {
  TextField,
  List,
  ListItemButton,
  Typography,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Dropdown from '@/components/Dropdown';

interface SearchChatMenuProps {
  trigger: React.ReactNode;
  conversations: any[];
  onSearch: (value: string) => void;
  onSelect: (conversationId: string) => void;
}

const SearchChatMenu: React.FC<SearchChatMenuProps> = ({
  trigger,
  conversations,
  onSearch,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      onSearch(value.trim().toLowerCase());
    }, 200);
  };

  return (
    <Dropdown trigger={trigger}>
      <div className="p-3 w-[300px]">

        <TextField
          fullWidth
          size="small"
          variant="outlined"
          autoFocus
          placeholder="Search chat history..."
          value={query}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

  
        <List className="mt-2 max-h-[250px] overflow-y-auto">
          {query.trim() === '' ? (
            <Typography
              variant="body2"
              className="text-gray-500 mt-2 text-center"
            >
              Type to search your chats
            </Typography>
          ) : conversations.length > 0 ? (
            conversations.map((c) => (
              <ListItemButton key={c.id} onClick={() => onSelect(c.id)}>
                <Typography noWrap>
                  {c.title || 'Untitled conversation'}
                </Typography>
              </ListItemButton>
            ))
          ) : (
            <Typography
              variant="body2"
              className="text-gray-500 mt-2 text-center"
            >
              No results found
            </Typography>
          )}
        </List>
      </div>
    </Dropdown>
  );
};

export default SearchChatMenu;
