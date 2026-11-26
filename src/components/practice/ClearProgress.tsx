import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { IconX } from '../icons';

interface ClearProgressProps {
  /** 当前作用域内已作答的题数：0 时按钮禁用（没有可清的东西） */
  done: number;
  /** 确认后的清空动作：调用方按自己的存储作用域实现（本卷 / 本章 / 全部） */
  onClear: () => void;
  /** 确认层说明，必须写明作用范围，避免用户误以为会清掉其它试卷 */
  tip: string;
  /** 按钮与确认层标题文案 */
  label?: string;
}

/**
 * 「清空进度」按钮 + 全站玻璃确认层。
 * 各课程练习页统一用它：作用域由调用方决定（本卷 / 本章 / 本课全部），
 * 样式与交互（Esc / 遮罩 / 关闭钮）只在这里维护一份。
 */
export default function ClearProgress({ done, onClear, tip, label = '清空进度' }: ClearProgressProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  // 确认层打开时支持 Esc 退出
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="btn pq-danger" onClick={() => setOpen(true)} disabled={done === 0}>
        {label}
      </button>
      {/* 弹层挂到 body：进度卡带 backdrop-filter，留在原地会被它变成固定包含块 */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="hub-modal-scrim"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="hub-modal material"
                role="dialog"
                aria-modal="true"
                aria-label={label}
                initial={reduced ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: 6 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="hub-modal-head">
                  <h2>{label}</h2>
                  <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="关闭">
                    <IconX size={16} />
                  </button>
                </div>
                <p className="hub-modal-tip">{tip}</p>
                <div className="hub-modal-actions">
                  <button type="button" className="btn" onClick={() => setOpen(false)}>
                    取消
                  </button>
                  <button
                    type="button"
                    className="btn pq-danger"
                    onClick={() => {
                      setOpen(false);
                      onClear();
                    }}
                  >
                    清空
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
