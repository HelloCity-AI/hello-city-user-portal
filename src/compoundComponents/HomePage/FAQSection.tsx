'use client';

import React, { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Trans, useLingui } from '@lingui/react';

const DEFAULT_FAQ_KEY = 'faq1';

const FAQSection: React.FC = () => {
  const { i18n } = useLingui();
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<string | false>(DEFAULT_FAQ_KEY);
  const [isComposing, setIsComposing] = useState(false);

  const faqs = [
    {
      key: 'faq1',
      question: <Trans id="contact.faq.q1">What is HelloCity?</Trans>,
      answer: (
        <Trans id="contact.faq.a1">
          HelloCity is your AI companion for relocation, providing step-by-step checklists and
          timelines to simplify moving to a new city.
        </Trans>
      ),
    },
    {
      key: 'faq2',
      question: <Trans id="contact.faq.q2">Is HelloCity free to use?</Trans>,
      answer: (
        <Trans id="contact.faq.a2">
          You can start for free. Premium options are available for more personalized guidance and
          advanced features.
        </Trans>
      ),
    },
    {
      key: 'faq3',
      question: <Trans id="contact.faq.q3">Which cities are supported?</Trans>,
      answer: (
        <Trans id="contact.faq.a3">
          We cover major global cities and expand regularly. Check inside the product for the latest
          supported locations.
        </Trans>
      ),
    },
    {
      key: 'faq4',
      question: <Trans id="contact.faq.q4">Do I need an account to get started?</Trans>,
      answer: (
        <Trans id="contact.faq.a4">
          No account is required for basic browsing. Creating an account unlocks saved progress,
          reminders, and tailored timelines.
        </Trans>
      ),
    },
    {
      key: 'faq5',
      question: <Trans id="contact.faq.q5">Does HelloCity work well on mobile?</Trans>,
      answer: (
        <Trans id="contact.faq.a5">
          Yes. HelloCity is responsive and works smoothly on desktop, tablet, and mobile screens.
        </Trans>
      ),
    },
  ];

  // 搜索逻辑：输入时匹配，没输入只显示默认
  const filtered = useMemo(() => {
    if (isComposing) return faqs.filter((f) => f.key === DEFAULT_FAQ_KEY);

    const kw = (q ?? '').trim().toLowerCase();
    if (!kw) return faqs.filter((f) => f.key === DEFAULT_FAQ_KEY);

    return [
      faqs.find((f) => f.key === DEFAULT_FAQ_KEY)!,
      ...faqs.filter(
        (f) =>
          f.key !== DEFAULT_FAQ_KEY &&
          (i18n
            ._((f.question as any).props.id)
            .toLowerCase()
            .includes(kw) ||
            i18n
              ._((f.answer as any).props.id)
              .toLowerCase()
              .includes(kw)),
      ),
    ];
  }, [q, isComposing, i18n]);

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
            <Trans id="contact.faq.title">Frequently Asked Questions</Trans>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            className="mx-auto w-full max-w-[800px] text-center"
          >
            <Trans id="contact.faq.subtitle">
              Find quick answers to the most common questions about HelloCity.
            </Trans>
          </Typography>

          {/* Search box */}
          <TextField
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
          />

          {/* Result count */}
          <Typography variant="caption" color="text.secondary" className="mx-auto mt-1">
            {filtered.length}{' '}
            <Trans id="contact.faq.results">result{filtered.length === 1 ? '' : 's'}</Trans>
          </Typography>

          {/* FAQ 列表 */}
          <div className="mx-auto mt-2 flex w-full max-w-3xl flex-col gap-2">
            {filtered.map((faq) => (
              <Accordion
                key={faq.key}
                expanded={expanded === faq.key}
                onChange={(_, isExpanded) => setExpanded(isExpanded ? faq.key : false)}
                disableGutters
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  '&:before': { display: 'none' },
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