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
import IconButton from '@mui/material/IconButton';



type FAQ = { key: string; question: string; answer: string };

const FAQSection: React.FC = () => {
    // Local search state
    const [q, setQ] = useState('');

    // Static FAQs (kept in HTML for SEO)
    const faqs: FAQ[] = [
        {
            key: 'faq1',
            question: 'What is HelloCity?',
            answer:
                'HelloCity is your AI companion for relocation, providing step-by-step checklists and timelines to simplify moving to a new city.',
        },
        {
            key: 'faq2',
            question: 'Is HelloCity free to use?',
            answer:
                'You can start for free. Premium options are available for more personalized guidance and advanced features.',
        },
        {
            key: 'faq3',
            question: 'Which cities are supported?',
            answer:
                'We cover major global cities and expand regularly. Check inside the product for the latest supported locations.',
        },
        {
            key: 'faq4',
            question: 'Do I need an account to get started?',
            answer:
                'No account is required for basic browsing. Creating an account unlocks saved progress, reminders, and tailored timelines.',
        },
        {
            key: 'faq5',
            question: 'Does HelloCity work well on mobile?',
            answer:
                'Yes. HelloCity is responsive and works smoothly on desktop, tablet, and mobile screens.',
        },
    ];

    // Filter by keyword (question or answer)
    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase();
        if (!kw) return faqs;
        return faqs.filter(
            (f) =>
                f.question.toLowerCase().includes(kw) ||
                f.answer.toLowerCase().includes(kw),
        );
    }, [q, faqs]);

    // Expand first when only one result
    const singleOpenKey = filtered.length === 1 ? filtered[0].key : null;

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
                        Frequently Asked Questions
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        className="mx-auto w-full max-w-[800px] text-center"
                    >
                        Find quick answers to the most common questions about HelloCity.
                    </Typography>

                    {/* Search box */}
                    <TextField
                        placeholder="Ask a question..."
                        variant="outlined"
                        fullWidth
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="max-w-2xl mx-auto"
                        InputProps={{
                            className: 'rounded-2xl',
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => console.log('Search clicked:', q)}
                                        edge="end"
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <SearchIcon color="action" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />



                    {/* Result count (optional) */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        className="mx-auto mt-1"
                    >
                        {filtered.length} result{filtered.length === 1 ? '' : 's'}
                    </Typography>

                    {/* FAQ list */}
                    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 mt-2">
                        {filtered.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" className="text-center">
                                No matching questions. Try another keyword.
                            </Typography>
                        ) : (
                            filtered.map((faq) => (
                                <Accordion
                                    key={faq.key}
                                    className="rounded-xl shadow-sm border border-gray-200"
                                    defaultExpanded={singleOpenKey === faq.key}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`${faq.key}-content`}
                                        id={`${faq.key}-header`}
                                    >
                                        <Typography variant="subtitle1" className="font-semibold">
                                            {faq.question}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2" color="text.secondary">
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        )}
                    </div>
                </SectionContentArea>
            </SectionContent>
        </SectionBackground>
    );
};

export default FAQSection;
