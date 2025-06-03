declare module 'expo-router' {
  import { NavigationState } from '@react-navigation/native';
  
  export interface RouterProps {
    replace(route: string | { pathname: string }): void;
    push(route: string | { pathname: string }): void;
  }

  export interface SegmentsProps extends Array<string> {
    0: string;
  }

  export function useRouter(): RouterProps;
  export function useSegments(): SegmentsProps;
  export function Link(props: any): JSX.Element;
  export function Slot(): JSX.Element;
  export const Tabs: any;
} 