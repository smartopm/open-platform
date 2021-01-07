import React, { useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import TemplateList from './TemplateList'

export default function EmailBuilder() {
  const emailEditorRef = useRef(null);
  const [template, setTemplate] = useState('')

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log('exportHtml', html);
      console.log('exportHtml', design);
    });
  };

  function handleTemplateValue(event){
    setTemplate(event.target.value)
  }

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
      <TemplateList 
        value={template} 
        handleValue={handleTemplateValue}
        createTemplate={() => console.log('I was clicked pe')}
      />
      <EmailEditor
        ref={emailEditorRef}
        onLoad={onLoad}
      />
    </div>
  );
};