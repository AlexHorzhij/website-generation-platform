export type AxisType = "USP_ANGLE" | "PAIN_POINT" | "BENEFIT" | string;

export interface Axis {
  id: number;
  type: AxisType;
  siteId: number;
  content: string;
}

export type AxisTypeDataType = {
  type: string;
  name: string;
  description: string;
};
