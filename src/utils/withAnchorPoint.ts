import type { TransformsStyle } from 'react-native';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

const isValidSize = (size: Size): boolean => {
  'worklet';
  return size && size.width > 0 && size.height > 0;
};

const defaultAnchorPoint = { x: 0.5, y: 0.5 };

type TransformArray = Exclude<NonNullable<TransformsStyle['transform']>, string>;
type TransformEntry = TransformArray[number];

export const withAnchorPoint = (transform: TransformsStyle, anchorPoint: Point, size: Size) => {
  'worklet';
  if (!isValidSize(size)) {
    return transform;
  }

  const existingTransform = transform.transform;
  if (!Array.isArray(existingTransform)) {
    return transform;
  }

  const injectedTransform = [...(existingTransform as TransformArray)] as TransformEntry[];

  if (anchorPoint.x !== defaultAnchorPoint.x && size.width) {
    // shift before rotation
    injectedTransform.unshift({
      translateX: size.width * (anchorPoint.x - defaultAnchorPoint.x),
    });
    // shift after rotation
    injectedTransform.push({
      translateX: size.width * (defaultAnchorPoint.x - anchorPoint.x),
    });
  }

  if (anchorPoint.y !== defaultAnchorPoint.y && size.height) {
    // shift before rotation
    injectedTransform.unshift({
      translateY: size.height * (anchorPoint.y - defaultAnchorPoint.y),
    });
    // shift after rotation
    injectedTransform.push({
      translateY: size.height * (defaultAnchorPoint.y - anchorPoint.y),
    });
  }

  return { transform: injectedTransform };
};
