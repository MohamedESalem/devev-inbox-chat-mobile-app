import { PressableProps } from 'react-native';
import { DerivedValue } from 'react-native-reanimated';

export type SendMessageButtonProps = PressableProps & {
  variant?: 'default' | 'copilot';
};

export type AddCommandButtonProps = PressableProps & {
  derivedAddMenuOptionStateValue: DerivedValue<0 | 1>;
};

export type PhotosCommandButtonProps = PressableProps & {};

export type VoiceRecordButtonProps = PressableProps & {};
