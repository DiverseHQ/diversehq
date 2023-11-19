/* eslint-disable */
export enum MetadataDisplayType {
  number = 'number',
  string = 'string',
  date = 'date'
}

export enum MetadataVersions {
  one = '1.0.0'
}

export interface AttributeData {
  displayType?: MetadataDisplayType
  traitType?: string
  value: string
  key: string
}
