export interface EditorProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  showFloatingToolbar?: boolean;
  enableSpeechToText?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  plugins?: React.ComponentType[];
  theme?: Record<string, string>;
}
