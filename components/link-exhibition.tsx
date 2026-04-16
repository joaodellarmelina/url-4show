"use client";

import {
  Animation,
  Pin,
  Root,
  useScrollytelling,
} from "@bsmnt/scrollytelling";
import {
  useEffect,
  useEffectEvent,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import type { LinkEntry } from "@/types/link-entry";

import styles from "./link-exhibition.module.css";

type LinkExhibitionProps = {
  links: LinkEntry[];
};

type TimelineUpdatePayload = {
  scrollTrigger?: {
    progress?: number;
  };
};

const MIN_PIN_SPACER_HEIGHT = 320;
const PIN_SPACER_STEP = 56;
const MAX_DISTANCE = 3.2;
const DEFAULT_LINK_ID = "first";
const TITLE = "João Dellarmelina.";

function clampIndex(value: number, itemCount: number) {
  return Math.max(0, Math.min(value, itemCount - 1));
}

function getProgressFromIndex(index: number, maxIndex: number) {
  return maxIndex <= 0 ? 0 : index / maxIndex;
}

function isTextInputTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, button, [contenteditable=""], [contenteditable="true"]'
    )
  );
}

function isTimelineUpdatePayload(
  value: unknown
): value is TimelineUpdatePayload {
  return typeof value === "object" && value !== null;
}

function getDefaultIndex(links: LinkEntry[]) {
  const configuredIndex = links.findIndex((link) => link.id === DEFAULT_LINK_ID);

  return configuredIndex >= 0 ? configuredIndex : 0;
}

function ExhibitionStage({ links }: LinkExhibitionProps) {
  const { events, rootRef, timeline } = useScrollytelling();
  const initialIndex = clampIndex(getDefaultIndex(links), links.length);

  const progressDriverRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const activeIndexRef = useRef(initialIndex);
  const hasInitializedScrollRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [reducedMotion, setReducedMotion] = useState(false);

  const linkCount = links.length;
  const maxIndex = linkCount - 1;
  const activeLink = links[activeIndex] ?? links[0];

  const applyItemStyles = useEffectEvent((position: number) => {
    const step = Math.min(window.innerHeight * 0.135, 118);

    itemRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      const distance = index - position;
      const absoluteDistance = Math.min(Math.abs(distance), MAX_DISTANCE);
      const emphasis = 1 - absoluteDistance / MAX_DISTANCE;

      const scale = reducedMotion
        ? index === activeIndexRef.current
          ? 1
          : 0.7
        : 0.6 + emphasis * 0.52;
      const opacity = reducedMotion
        ? index === activeIndexRef.current
          ? 1
          : 0.28
        : 0.12 + emphasis * 0.88;
      const blur = reducedMotion ? 0 : absoluteDistance * 1.25;
      const weight = Math.round(150 + emphasis * 200);
      const yOffset = distance * step;
      const titleAlpha = 0.12 + emphasis * 0.88;
      const subtitleAlpha = 0.08 + emphasis * 0.82;
      const zIndex = Math.round((MAX_DISTANCE - absoluteDistance) * 10 + 10);

      item.style.setProperty("--item-offset", `${yOffset.toFixed(2)}px`);
      item.style.setProperty("--item-scale", scale.toFixed(3));
      item.style.setProperty("--item-opacity", opacity.toFixed(3));
      item.style.setProperty("--item-blur", `${blur.toFixed(2)}px`);
      item.style.setProperty("--item-weight", `${weight}`);
      item.style.setProperty(
        "--item-title-color",
        `rgba(20, 17, 15, ${titleAlpha.toFixed(3)})`
      );
      item.style.setProperty(
        "--item-subtitle-color",
        `rgba(20, 17, 15, ${subtitleAlpha.toFixed(3)})`
      );
      item.style.setProperty("--item-z", `${zIndex}`);
    });
  });

  const syncFromProgress = useEffectEvent((progress: number) => {
    const boundedProgress = Math.max(0, Math.min(progress, 1));
    const floatingPosition = boundedProgress * maxIndex;
    const snappedPosition = reducedMotion
      ? Math.round(floatingPosition)
      : floatingPosition;
    const nextActiveIndex = clampIndex(Math.round(floatingPosition), linkCount);

    applyItemStyles(snappedPosition);

    if (nextActiveIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextActiveIndex;
      setActiveIndex(nextActiveIndex);
    }
  });

  const getCurrentProgress = useCallback(() => {
    return timeline?.scrollTrigger?.progress ?? 0;
  }, [timeline]);

  const openActiveLink = useCallback(() => {
    const currentLink = links[activeIndexRef.current];

    if (!currentLink) {
      return;
    }

    window.open(currentLink.href, "_blank", "noopener,noreferrer");
  }, [links]);

  const scrollToIndex = useCallback(
    (
      requestedIndex: number,
      behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth"
    ) => {
      const rootElement = rootRef.current;

      if (!rootElement) {
        return;
      }

      const nextIndex = clampIndex(requestedIndex, linkCount);
      const scrollSpan = Math.max(
        rootElement.offsetHeight - window.innerHeight,
        0
      );
      const rootTop = rootElement.getBoundingClientRect().top + window.scrollY;
      const targetProgress = maxIndex === 0 ? 0 : nextIndex / maxIndex;

      window.scrollTo({
        top: rootTop + scrollSpan * targetProgress,
        behavior,
      });
    },
    [linkCount, maxIndex, reducedMotion, rootRef]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    applyPreference();
    mediaQuery.addEventListener("change", applyPreference);

    return () => {
      mediaQuery.removeEventListener("change", applyPreference);
    };
  }, []);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current || hasInitializedScrollRef.current) {
      return;
    }

    activeIndexRef.current = initialIndex;
    syncFromProgress(getProgressFromIndex(initialIndex, maxIndex));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToIndex(initialIndex, "auto");
        hasInitializedScrollRef.current = true;
      });
    });
  }, [initialIndex, maxIndex, rootRef, scrollToIndex]);

  useEffect(() => {
    if (!hasInitializedScrollRef.current) {
      return;
    }

    syncFromProgress(getCurrentProgress());
  }, [getCurrentProgress, initialIndex, reducedMotion]);

  useEffect(() => {
    const unsubscribe = events.on("timeline:update", (...payload) => {
      if (!hasInitializedScrollRef.current) {
        return;
      }

      const nextTimeline = payload[0];

      if (isTimelineUpdatePayload(nextTimeline)) {
        const progress = nextTimeline.scrollTrigger?.progress ?? 0;

        syncFromProgress(progress);
      }
    });

    const handleResize = () => {
      if (!hasInitializedScrollRef.current) {
        return;
      }

      syncFromProgress(getCurrentProgress());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [events, getCurrentProgress]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextInputTarget(event.target)) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        scrollToIndex(activeIndexRef.current + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        scrollToIndex(activeIndexRef.current - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        scrollToIndex(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        scrollToIndex(maxIndex);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        openActiveLink();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [maxIndex, openActiveLink, scrollToIndex]);

  const handleStageKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      openActiveLink();
    }
  };
  return (
    <section
      className={styles.stage}
      aria-label="Exibição principal de links"
      onKeyDown={handleStageKeyDown}
    >
      <Animation
        tween={{
          start: 0,
          end: 100,
          target: progressDriverRef,
          to: { x: 0.001 },
        }}
      />
      <span ref={progressDriverRef} className={styles.progressDriver} aria-hidden />

      <div className={styles.grain} aria-hidden />

      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>{TITLE}</h1>
        </div>
      </header>

      <div className={styles.viewport}>
        <div className={styles.indicatorRail} aria-hidden />

        <ol className={styles.list}>
          {links.map((link, index) => {
            const isActive = index === activeIndex;
            const cardClassName = `${styles.itemCard} ${
              isActive ? styles.itemCardActive : ""
            }`;

            return (
              <li
                key={link.id}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={styles.item}
                aria-current={isActive ? "true" : undefined}
              >
                {isActive ? (
                  <a
                    className={cardClassName}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.itemTitle}>{link.title}</span>
                    <span className={styles.itemSubtitle}>{link.subtitle}</span>
                  </a>
                ) : (
                  <div className={styles.itemCard} aria-hidden="true">
                    <span className={styles.itemTitle}>{link.title}</span>
                    <span className={styles.itemSubtitle}>{link.subtitle}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className={styles.controls} aria-label="Controles de navegação">
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Ir para o link anterior"
          >
            ↑
          </button>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === maxIndex}
            aria-label="Ir para o próximo link"
          >
            ↓
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.activeMeta}>
          <p className={styles.activeValue}>
            {activeLink.href}
          </p>
        </div>
      </footer>

      <span className={styles.srOnly} aria-live="polite">
        Link ativo: {activeLink.title}
      </span>
    </section>
  );
}

export function LinkExhibition({ links }: LinkExhibitionProps) {
  const pinSpacerHeight = `${Math.max(
    links.length * PIN_SPACER_STEP,
    MIN_PIN_SPACER_HEIGHT
  )}svh`;

  return (
    <main className={styles.page}>
      <Root>
        <Pin
          childHeight="100svh"
          pinSpacerHeight={pinSpacerHeight}
          childClassName={styles.pinChild}
          pinSpacerClassName={styles.pinSpacer}
        >
          <ExhibitionStage links={links} />
        </Pin>
      </Root>
    </main>
  );
}
