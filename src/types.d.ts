declare module '@json-editor/json-editor' {
  class JSONEditor {
    constructor(element: HTMLElement, options: any);
    set(json: any): void;
    // Add other methods as needed
  }
  export = JSONEditor;
}

declare module '@andypf/json-viewer' {
  import { FC } from 'react';
  interface JSONViewerProps {
    data: any;
  }
  const JSONViewer: FC<JSONViewerProps>;
  export default JSONViewer;
}