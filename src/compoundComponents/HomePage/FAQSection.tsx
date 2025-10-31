'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchIcon from '@mui/icons-material/Search';
import { Trans } from '@lingui/react';
// import { Trans, useLingui } from '@lingui/react';

const DEFAULT_FAQ_KEY = 'faq1';

const FAQSection: React.FC = () => {
  // const { i18n } = useLingui();
  // const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<string | false>(DEFAULT_FAQ_KEY);
  // const [isComposing, setIsComposing] = useState(false);

  const faqs = [
    {
      key: 'faq1',
      question: <Trans id="contact.faq.q1" message="What is HelloCity?" />,
      answer: (
        <Trans
          id="contact.faq.a1"
          message="HelloCity is your AI companion for relocation, providing step-by-step plans and timelines to simplify moving to a new city."
        />
      ),
    },
    {
      key: 'faq2',
      question: <Trans id="contact.faq.q2" message="Which cities are currently supported?" />,
      answer: (
        <Trans
          id="contact.faq.a2"
          message="HelloCity supports all major cities worldwide. We have enhanced coverage and specialized training for 48+ cities including Sydney, Melbourne, Toronto, New York, London, Tokyo, Singapore, Dubai, and major destinations across Australia, North America, Europe, and Asia."
        />
      ),
    },
    {
      key: 'faq3',
      question: <Trans id="contact.faq.q3" message="Do I need an account to get started?" />,
      answer: (
        <Trans
          id="contact.faq.a3"
          message="Yes, an account is required to save your progress and access personalized plans. Registration is free and takes less than a minute."
        />
      ),
    },
    {
      key: 'faq4',
      question: (
        <Trans id="contact.faq.q4" message="How accurate are the AI-generated plans?" />
      ),
      answer: (
        <Trans
          id="contact.faq.a4"
          message="Our AI is trained on real relocation data from thousands of moves. You can customize any item, and we continuously improve based on user feedback."
        />
      ),
    },
    {
      key: 'faq5',
      question: <Trans id="contact.faq.q5" message="Is HelloCity easy to use?" />,
      answer: (
        <Trans
          id="contact.faq.a5"
          message="Yes. HelloCity features an intuitive interface that works seamlessly on desktop and mobile devices. Simply chat with our AI assistant, and it will guide you through every step of your relocation journey."
        />
      ),
    },
  ];

  // 搜索逻辑：输入时匹配，没输入只显示默认
  // const filtered = useMemo(() => {
  //   if (isComposing) return faqs.filter((f) => f.key === DEFAULT_FAQ_KEY);
  //
  //   const kw = (q ?? '').trim().toLowerCase();
  //   if (!kw) return faqs.filter((f) => f.key === DEFAULT_FAQ_KEY);
  //
  //   return [
  //     faqs.find((f) => f.key === DEFAULT_FAQ_KEY)!,
  //     ...faqs.filter(
  //       (f) =>
  //         f.key !== DEFAULT_FAQ_KEY &&
  //         (i18n
  //           ._((f.question as any).props.id)
  //           .toLowerCase()
  //           .includes(kw) ||
  //           i18n
  //             ._((f.answer as any).props.id)
  //             .toLowerCase()
  //             .includes(kw)),
  //     ),
  //   ];
  // }, [q, isComposing, i18n]);

  return (
    <SectionBackground additionalWrapperClassName="bg-white">
      <SectionContent>
        <SectionContentArea additionalClassName="flex-col gap-6">
          <Typography
            component="h3"
            variant="h4"
            className="w-full text-center"
            color="secondary.contrastText"
          >
            <Trans id="contact.faq.title" message="Frequently Asked Questions" />
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            className="mx-auto w-full max-w-[800px] text-center"
          >
            <Trans
              id="contact.faq.subtitle"
              message="Find quick answers to the most common questions about HelloCity."
            />
          </Typography>

          {/* Search box - Commented out for now */}
          {/* <TextField
            placeholder={i18n._('contact.faq.searchPlaceholder', {
              default: 'Please write your own question...',
            })}
            variant="outlined"
            fullWidth
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              setQ(e.currentTarget.value);
            }}
            className="mx-auto max-w-2xl"
            InputProps={{
              className: 'rounded-2xl',
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="action" className="cursor-pointer" />
                </InputAdornment>
              ),
            }}
          /> */}

          {/* Result count - Commented out for now */}
          {/* <Typography variant="caption" color="text.secondary" className="mx-auto mt-1">
            {filtered.length}{' '}
            <Trans id="contact.faq.results">result{filtered.length === 1 ? '' : 's'}</Trans>
          </Typography> */}

          {/* FAQ 列表 */}
          <div className="mx-auto mt-2 flex w-full max-w-3xl flex-col gap-2">
            {faqs.map((faq) => (
              <Accordion
                key={faq.key}
                expanded={expanded === faq.key}
                onChange={(_, isExpanded) => setExpanded(isExpanded ? faq.key : false)}
                disableGutters
                elevation={0}
                square={false}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                    borderRadius: '12px !important',
                  },
                  '&:first-of-type': {
                    borderRadius: '12px !important',
                  },
                  '&:last-of-type': {
                    borderRadius: '12px !important',
                  },
                  '& .MuiAccordionSummary-root': {
                    borderRadius: 'inherit',
                  },
                  '& .MuiAccordionDetails-root': {
                    borderRadius: 'inherit',
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" className="font-semibold">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </SectionContentArea>
      </SectionContent>
    </SectionBackground>
  );
};

export default FAQSection;
