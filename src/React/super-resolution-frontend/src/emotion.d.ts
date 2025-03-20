import '@emotion/react';

declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: import('@emotion/react').SerializedStyles;
  }
}