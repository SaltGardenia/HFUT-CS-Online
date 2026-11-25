/** SF Symbols 风格的内联图标（stroke 风格，随 currentColor 着色） */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: P) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest,
  };
}

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
  </svg>
);

export const IconSun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </svg>
);

export const IconMoon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.8 6.8 0 0 0 9.5 9.5Z" />
  </svg>
);

export const IconPlay = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M8 5.8v12.4c0 .8.9 1.3 1.6.9l9.6-6.2c.6-.4.6-1.3 0-1.7L9.6 4.9c-.7-.4-1.6.1-1.6.9Z" />
  </svg>
);

export const IconPause = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <rect x="6" y="5" width="4" height="14" rx="1.4" />
    <rect x="14" y="5" width="4" height="14" rx="1.4" />
  </svg>
);

export const IconPrev = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 6 9.2 11.1a1.2 1.2 0 0 0 0 1.8L15 18" />
  </svg>
);

export const IconNext = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 6 5.8 5.1a1.2 1.2 0 0 1 0 1.8L9 18" />
  </svg>
);

export const IconReset = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 5.5v4h4" />
    <path d="M4.8 9.4a8 8 0 1 1-.6 4.4" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

export const IconArrowLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </svg>
);

export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
  </svg>
);

export const IconCode = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 6l-5 6 5 6" />
    <path d="M16 6l5 6-5 6" />
  </svg>
);

export const IconFileText = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h8l4 4v14H6V3Z" />
    <path d="M9 11h6M9 15h6" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" />
  </svg>
);

export const IconQuiz = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.3A2.5 2.5 0 0 1 14.5 10c0 1.5-2.2 1.8-2.5 3" />
    <circle cx="12" cy="16.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export const IconExpand = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </svg>
);

export const IconChevronUp = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 14 7-7 7 7" />
  </svg>
);

export const IconChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 10 7 7 7-7" />
  </svg>
);

/** 书签（阅读进度指示） */
export const IconBookmark = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.6 4h10.8a.6.6 0 0 1 .6.6V20l-6-3.8L6 20V4.6a.6.6 0 0 1 .6-.6Z" />
  </svg>
);

/** GitHub 标识（填充风格，链接到仓库 Issue 区用） */
export const IconGitHub = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.9-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

/** 星标（收藏）：描边轮廓，收藏态由 CSS 填充 currentColor */
export const IconStar = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3.4 2.54 5.36 5.86.79-4.28 4.05 1.09 5.83L12 16.62l-5.21 2.81 1.09-5.83-4.28-4.05 5.86-.79L12 3.4Z" />
  </svg>
);

/** 账号（用户轮廓） */
export const IconUser = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.2" r="3.6" />
    <path d="M4.8 20c.6-3.6 3.5-5.6 7.2-5.6s6.6 2 7.2 5.6" />
  </svg>
);

/** 铅笔（勘误 / 编辑） */
export const IconPencil = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20h4L18.4 9.6a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="m13.9 7.1 3 3" />
  </svg>
);
