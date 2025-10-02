// app/conversation-history/page.tsx

'use client';

import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const ConversationHistoryPage: React.FC = () => {
  // mock 数据
  const history = [
    {
      id: '1',
      date: '2025-09-30',
      text: 'How can I track my package?',
    },
    {
      id: '2',
      date: '2025-09-28',
      text: 'Refund request chat',
    },
  ];

  return (
    <Container maxWidth="md" className="py-10">
      <Typography variant="h4" gutterBottom>
        Conversation History
      </Typography>
      <Paper>
        <List>
          {history.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText primary={item.text} secondary={item.date} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ConversationHistoryPage;
