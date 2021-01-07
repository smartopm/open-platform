import React, { useRef } from 'react';
import EmailEditor from 'react-email-editor';
import TemplateList from './TemplateList'

export default function EmailBuilder() {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
      console.log('exportHtml', design);
    });
  };

  const onLoad = () => {
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  return (
    <div>
      <div>
        <button type="button" onClick={exportHtml}>Export HTML</button>
      </div>
      <TemplateList />
      <EmailEditor
        ref={emailEditorRef}
        onLoad={onLoad}
      />
    </div>
  );
};