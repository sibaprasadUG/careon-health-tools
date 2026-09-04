import React from 'react';

export type IconName =
  | 'bmi'
  | 'ideal-weight'
  | 'bmr'
  | 'calories'
  | 'water'
  | 'blood-pressure'
  | 'blood-sugar'
  | 'weight'
  | 'plus'
  | 'arrow-right'
  | 'warning'
  | 'check'
  | 'info'
  | 'calendar'
  | 'clipboard';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/*
  CareOn 3D Health Icons

  Image:
  /public/assets/health-tools-3d-icons.png

  Layout:
  ┌──────────┬──────────┬──────────┬──────────┐
  │   BMI    │  Ideal   │   BMR    │ Calories │
  ├──────────┼──────────┼──────────┼──────────┤
  │  Water   │    BP    │  Sugar   │  Weight  │
  └──────────┴──────────┴──────────┴──────────┘

  The source image contains the 3D icon AND its label.
  This component crops only the upper icon portion.
*/

const healthIconIndex: Record<
  'bmi' |
  'ideal-weight' |
  'bmr' |
  'calories' |
  'water' |
  'blood-pressure' |
  'blood-sugar' |
  'weight',
  { column: number; row: number }
> = {
  bmi: {
    column: 0,
    row: 0,
  },

  'ideal-weight': {
    column: 1,
    row: 0,
  },

  bmr: {
    column: 2,
    row: 0,
  },

  calories: {
    column: 3,
    row: 0,
  },

  water: {
    column: 0,
    row: 1,
  },

  'blood-pressure': {
    column: 1,
    row: 1,
  },

  'blood-sugar': {
    column: 2,
    row: 1,
  },

  weight: {
    column: 3,
    row: 1,
  },
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 72,
  className = '',
}) => {
  /*
    -----------------------------------------
    SIMPLE UI ICONS
    -----------------------------------------
  */

  if (name === 'plus') {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.65,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        +
      </span>
    );
  }

  if (name === 'arrow-right') {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.65,
          lineHeight: 1,
        }}
      >
        →
      </span>
    );
  }

  if (name === 'warning') {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.62,
          lineHeight: 1,
        }}
      >
        ⚠
      </span>
    );
  }

  if (name === 'check') {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.62,
          lineHeight: 1,
        }}
      >
        ✓
      </span>
    );
  }

  if (name === 'info') {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.62,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        i
      </span>
    );
  }

  if (name === 'calendar') {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.58,
          lineHeight: 1,
        }}
      >
        📅
      </span>
    );
  }

  if (name === 'clipboard') {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.58,
          lineHeight: 1,
        }}
      >
        📋
      </span>
    );
  }

  /*
    -----------------------------------------
    3D HEALTH ICONS
    -----------------------------------------
  */

  const icon = healthIconIndex[
    name as keyof typeof healthIconIndex
  ];

  if (!icon) {
    return null;
  }

  /*
    The source image is 1536 × 1024.

    It contains:
      4 columns
      2 rows

    Therefore:
      each cell = 25% width
      each cell = 50% height

    We intentionally make the sprite 400% × 200%.

    This makes ONE complete cell equal to the
    requested icon size.

    The wrapper is slightly shorter than the
    complete cell so the text label embedded
    in the source image remains hidden.
  */

  const cellWidth = size;
  const cellHeight = size * 1.33;

  const backgroundX =
    icon.column === 0
      ? '0%'
      : icon.column === 1
        ? '33.333333%'
        : icon.column === 2
          ? '66.666667%'
          : '100%';

  const backgroundY =
    icon.row === 0
      ? '0%'
      : '100%';

  return (
    <span
      className={`careon-3d-icon ${className}`}
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'inline-block',

        width: cellWidth,
        height: size,

        overflow: 'hidden',

        flexShrink: 0,

        backgroundImage:
          "url('/assets/health-tools-3d-icons.png')",

        backgroundRepeat: 'no-repeat',

        /*
          4 columns × 2 rows
        */
        backgroundSize: '400% 200%',

        backgroundPosition:
          `${backgroundX} ${backgroundY}`,

        backgroundOrigin: 'border-box',

        verticalAlign: 'middle',
      }}
    />
  );
};

export default Icon;