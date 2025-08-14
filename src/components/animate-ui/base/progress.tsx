'use client';

import * as React from 'react';
import { Progress as ProgressPrimitives } from '@base-ui-components/react/progress';
import { motion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';
import {
  CountingNumber,
  type CountingNumberProps,
} from '@/components/animate-ui/text/counting-number';

type ProgressContextType = {
  value: number | null;
};

const ProgressContext = React.createContext<ProgressContextType | undefined>(
  undefined,
);

const useProgress = (): ProgressContextType => {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a Progress');
  }
  return context;
};

type ProgressProps = React.ComponentProps<typeof ProgressPrimitives.Root>;

const Progress = ({ value, ...props }: ProgressProps) => {
  return (
    <ProgressContext.Provider value={{ value }}>
      <ProgressPrimitives.Root data-slot="progress" value={value} {...props}>
        {props.children}
      </ProgressPrimitives.Root>
    </ProgressContext.Provider>
  );
};

const MotionProgressIndicator = motion.create(ProgressPrimitives.Indicator);

function GlassFilter() {
  const filterId = React.useId();

  return (
    <svg className="hidden">
      <defs>
        <filter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur
            in="turbulence"
            stdDeviation="2"
            result="blurredNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur
            in="displaced"
            stdDeviation="4"
            result="finalBlur"
          />
          <feComposite
            in="finalBlur"
            in2="finalBlur"
            operator="over"
          />
        </filter>
      </defs>
    </svg>
  );
}

type ProgressTrackProps = React.ComponentProps<
  typeof ProgressPrimitives.Track
> & {
  transition?: Transition;
  color?: string;
  glassEffect?: boolean;
};

function ProgressTrack({
  className,
  transition = { type: 'spring', stiffness: 100, damping: 30 },
  color = 'bg-primary',
  glassEffect = true,
  ...props
}: ProgressTrackProps) {
  const { value } = useProgress();
  const filterId = React.useId();

  return (
    <>
      <ProgressPrimitives.Track
        data-slot="progress-track"
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-secondary/20 backdrop-blur-[2px]',
          className,
        )}
        {...props}
      >
        <div
          className="absolute inset-0 z-0 h-full w-full rounded-full 
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
          transition-all 
          dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
        />

        {glassEffect && (
          <div
            className="absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-full"
            style={{ backdropFilter: `url("#${filterId}")` }}
          />
        )}

        <MotionProgressIndicator
          data-slot="progress-indicator"
          className={cn(
            "relative z-10 h-full w-full flex-1 rounded-full transition-all duration-200 ease-out",
            color
          )}
          animate={{ width: `${value}%` }}
          transition={transition}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/5 rounded-full" />
        </MotionProgressIndicator>

        <div className="absolute inset-0 z-20 rounded-full bg-gradient-to-r from-transparent dark:via-white/5 via-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />
      </ProgressPrimitives.Track>
      {glassEffect && <GlassFilter />}
    </>
  );
}

type ProgressLabelProps = React.ComponentProps<typeof ProgressPrimitives.Label>;

function ProgressLabel(props: ProgressLabelProps) {
  return <ProgressPrimitives.Label data-slot="progress-label" {...props} />;
}

type ProgressValueProps = Omit<
  React.ComponentProps<typeof ProgressPrimitives.Value>,
  'render'
> & {
  countingNumberProps?: CountingNumberProps;
};

function ProgressValue({ countingNumberProps, ...props }: ProgressValueProps) {
  const { value } = useProgress();

  return (
    <ProgressPrimitives.Value
      data-slot="progress-value"
      render={
        <CountingNumber
          number={value ?? 0}
          transition={{ stiffness: 80, damping: 20 }}
          {...countingNumberProps}
        />
      }
      {...props}
    />
  );
}

export {
  Progress,
  ProgressTrack,
  ProgressLabel,
  ProgressValue,
  useProgress,
  type ProgressProps,
  type ProgressTrackProps,
  type ProgressLabelProps,
  type ProgressValueProps,
};
