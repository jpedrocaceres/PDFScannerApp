declare module 'expo-camera' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export enum CameraType {
    back = 'back',
    front = 'front'
  }

  interface CameraProps extends ViewProps {
    type?: CameraType;
    ref?: any;
  }

  export class Camera extends Component<CameraProps> {
    takePictureAsync(options?: {
      quality?: number;
      base64?: boolean;
      exif?: boolean;
      skipProcessing?: boolean;
    }): Promise<{
      uri: string;
      width: number;
      height: number;
      type?: string;
      base64?: string;
    }>;
  }
}

declare module 'expo-image-picker' {
  export enum MediaTypeOptions {
    All = 'All',
    Videos = 'Videos',
    Images = 'Images'
  }

  interface ImagePickerResult {
    canceled: boolean;
    assets: Array<{
      uri: string;
      width: number;
      height: number;
      type?: string;
    }>;
  }

  export function launchImageLibraryAsync(options?: {
    mediaTypes?: MediaTypeOptions;
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }): Promise<ImagePickerResult>;

  export function requestCameraPermissionsAsync(): Promise<{ status: string }>;

  export function launchCameraAsync(options: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }): Promise<ImagePickerResult>;
} 