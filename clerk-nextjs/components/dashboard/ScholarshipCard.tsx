"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookmarkSimple, ShareNetwork, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScholarshipWithMatch } from "@/types/scholarship";

interface ScholarshipCardProps {
  scholarship: ScholarshipWithMatch;
  isPreview?: boolean;
  onSave?: (id: string) => void;
  isSaved?: boolean;
  delay?: number;
}

const getFallbackGradient = (seed: string) => {
  const gradients = [
    'linear-gradient(135deg, #1a3a4a, #2d5a6e)',  // ocean
    'linear-gradient(135deg, #2d1b69, #5f6f52)',  // twilight
    'linear-gradient(135deg, #1a2a1a, #3d5a2e)',  // forest
    'linear-gradient(135deg, #4a1a1a, #6e3a2d)',  // terracotta
    'linear-gradient(135deg, #1a1a3a, #2d3a6e)',  // midnight
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getDeterministicImage = (seed: string) => {
  const imageIds = [
    '1773332598451-8a0a59941912', '1606761568499-6d2451b23c66', '1523240795612-9a054b0db644', '1541339907198-e08756dedf3f',
    '1773332611612-ffdaa753afb1', '1571260899304-425eee4c7efc', '1627556704302-624286467c65', '1522202176988-66273c2fd55f',
    '1519452575417-564c1401ecc0', '1773332611476-6ec2ba68049f', '1607013407627-6ee814329547', '1568792923760-d70635a89fdc',
    '1524178232363-1fb2b075b655', '1477281765962-ef34e8bb0967', '1779698762134-c34ef2d8820e', '1696395050055-eb7a315bb1cb',
    '1497633762265-9d179a990aa6', '1722963220475-979db2dbf216', '1503676260728-1c00da094a0b', '1734542380831-1b843c852c5e',
    '1524995997946-a1c2e315a42f', '1509062522246-3755977927d7', '1532012197267-da84d127e765', '1434030216411-0b793f4b4173',
    '1546410531-bb4caa6b424d', '1523580846011-d3a5bc25702b', '1580582932707-520aed937b7b', '1491841550275-ad7854e35ca6',
    '1773332585956-2d0e8ac80cb6', '1562774053-701939374585', '1773332611514-238856b76198', '1498243691581-b145c3f54a5a',
    '1773332585815-f106a5d6ed6c', '1591123120675-6f7f1aae0e5b', '1543269865-cbf427effbad', '1779379019024-260f764253f3',
    '1521587760476-6c12a4b040da', '1568667256549-094345857637', '1588580000645-4562a6d2c839', '1481627834876-b7833e8f5570',
    '1535905557558-afc4877a26fc', '1580537659466-0a9bfa916a54', '1457369804613-52c61a468e7d', '1614849963640-9cc74b2a826f',
    '1505664194779-8beaceb93744', '1604866830893-c13cafa515d5', '1544640808-32ca72ac7f37', '1521920592574-49e0b121c964',
    '1485322551133-3a4c27a9d925', '1771463268644-73df02c4c23a'
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % imageIds.length;
  return `https://images.unsplash.com/photo-${imageIds[index]}?w=600&q=80&auto=format&fit=crop`;
};

const DeadlineBadge = ({ deadline }: { deadline: string | null | undefined }) => {
  if (!deadline) return null;
  const now = new Date();
  const d = new Date(deadline);
  const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days < 0) return <span className="bg-surface-hover text-ink-tertiary border border-border font-ui text-[11px] font-medium px-2 py-0.5 rounded-full">Closed</span>;
  if (days <= 7) return <span className="bg-[#fee2e2] text-[#b91c1c] font-ui text-[11px] font-medium px-2 py-0.5 rounded-full">Closes in {days}d</span>;
  if (days <= 30) return <span className="bg-[#fef3c7] text-[#b45309] font-ui text-[11px] font-medium px-2 py-0.5 rounded-full">Closes in {days}d</span>;
  return <span suppressHydrationWarning className="bg-surface-hover text-ink-secondary border border-border font-ui text-[11px] font-medium px-2 py-0.5 rounded-full">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>;
};

const MatchBar = ({ score }: { score: number }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(score * 100), 200);
    return () => clearTimeout(timer);
  }, [score]);
  
  return (
    <div className="flex items-center gap-2">
      <span className="font-ui text-[11px] text-ink-tertiary shrink-0">Match</span>
      <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
        <div 
          className="h-full bg-moss rounded-full" 
          style={{ width: `${width}%`, transition: 'width 800ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </div>
      <span className="font-ui text-[12px] font-semibold text-moss shrink-0">
        {Math.round(score * 100)}%
      </span>
    </div>
  );
};

export function ScholarshipCard({ scholarship, isPreview = false, onSave, isSaved = false }: ScholarshipCardProps) {
  const router = useRouter();

  if (!scholarship) return null;

  const bgGradient = getFallbackGradient(scholarship.provider || scholarship.title);
  const displayImageUrl = (scholarship as any).imageUrl || getDeterministicImage(scholarship.id);
  
  // Extract eligibility
  const breakdown = scholarship.matchBreakdown || {};
  // map Object entries to include the criterion key if needed, or just use pass and label
  const criteria = Object.entries(breakdown).map(([key, val]: [string, any]) => ({
    criterion: key,
    pass: val.pass,
    label: val.label
  }));
  const failed = criteria.filter(c => !c.pass);
  const passed = criteria.filter(c => c.pass);
  const signals = [...failed, ...passed].slice(0, 3); // Max 3, failures first

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: scholarship.title,
          url: `${window.location.origin}/scholarship/${scholarship.id}`,
        });
      } catch (err) {}
    }
  };

  const cardReveal = {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const CardWrapper = isPreview ? 'div' : motion.div;
  
  const motionProps = !isPreview ? {
    variants: cardReveal as any,
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-40px" }
  } : {};

  return (
    <CardWrapper 
      {...motionProps}
      className={cn(
        "bg-surface border border-border rounded-[24px] overflow-hidden cursor-pointer relative transition-all duration-200 group scholarship-card flex flex-col h-full",
        !isPreview && "hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(22,21,20,0.04),0_20px_48px_rgba(22,21,20,0.10)] hover:border-border-strong",
        !scholarship.isActive && "opacity-60 grayscale"
      )}
      onClick={() => { if (!isPreview) router.push(`/scholarship/${scholarship.id}`); }}
    >
      {/* Image Area */}
      <div className="h-[160px] relative overflow-hidden card-image shrink-0 bg-surface">
        <div className="absolute inset-0" style={{ background: bgGradient }} />
        <img 
          src={displayImageUrl} 
          alt={scholarship.title} 
          onError={(e) => {
            const fallback = getDeterministicImage(scholarship.id);
            if (e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            }
          }}
          className="w-full h-full object-cover relative z-0 transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#161514]/40 pointer-events-none z-10" />
        
        {/* Country Flag */}
        {(scholarship as any).countryOfStudy && (
          <div className="absolute bottom-2.5 left-3 z-10 bg-black/40 backdrop-blur-sm text-white font-ui text-[12px] font-medium px-2 py-1 rounded-md shadow-sm">
            {(scholarship as any).countryOfStudy}
          </div>
        )}
        
        {/* Save Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); if (onSave) onSave(scholarship.id); }}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-md",
            isSaved ? "bg-moss border-moss scale-100" : "bg-white/15 border-white/25 hover:bg-white/25 hover:scale-105 active:scale-95"
          )}
        >
          <BookmarkSimple size={16} weight={isSaved ? "fill" : "regular"} className="text-white" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 pt-4 pb-4.5 flex-1 flex flex-col">
        <h3 className="font-editorial text-[17px] font-normal text-ink leading-[1.3] line-clamp-2 mb-1">
          {scholarship.title}
        </h3>
        <p className="font-ui text-[13px] text-ink-secondary mb-3 truncate">
          {scholarship.provider} {(scholarship as any).countryOfStudy ? `· ${(scholarship as any).countryOfStudy}` : ""}
        </p>

        {/* Pills Row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {scholarship.amount && (
            <span className="bg-moss-light text-moss font-ui text-[11px] font-medium px-2 py-0.5 rounded-full">
              {scholarship.currency || '$'}{scholarship.amount.toLocaleString()}
            </span>
          )}
          {!scholarship.amount && (
            <span className="bg-moss-light text-moss font-ui text-[11px] font-medium px-2 py-0.5 rounded-full">
              Funded
            </span>
          )}
          {scholarship.eligibleDegrees?.length > 0 && (
            <span className="bg-surface-hover text-ink-secondary border border-border font-ui text-[11px] font-medium px-2 py-0.5 rounded-full capitalize">
              {scholarship.eligibleDegrees[0].toLowerCase()}
            </span>
          )}
          <DeadlineBadge deadline={scholarship.deadline} />
        </div>

        {/* Match Bar */}
        <div className="mb-2 mt-auto">
          <MatchBar score={scholarship.matchScore || 0} />
        </div>

        {/* Eligibility Signals */}
        <div className="flex flex-col gap-1 mt-2 mb-3">
          {signals.map((sig, i) => (
            <div key={i} className="flex items-center gap-1.5 opacity-85">
              {sig.pass ? (
                <CheckCircle size={13} weight="fill" className="text-success shrink-0" />
              ) : (
                <XCircle size={13} weight="fill" className="text-urgent shrink-0" />
              )}
              <span className="font-ui text-[11px] text-ink-secondary truncate">
                {sig.label || 'Check requirement'}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Row */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-border">
          <span className="font-ui text-[13px] font-medium text-moss">View details →</span>
          <button 
            onClick={handleShare}
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full text-ink-secondary hover:bg-moss-light hover:text-moss transition-colors"
          >
            <ShareNetwork size={14} />
          </button>
        </div>
      </div>
    </CardWrapper>
  );
}
