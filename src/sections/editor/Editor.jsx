import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';

const Editor = ({ value, setValue }) => {

  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const currentFormat = editor.getFormat();

      // Set default line height for the entire document
      if (!currentFormat.lineheight) {
        editor.format('lineheight', '1.5');
      }
    }
  }, []);

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'font',
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'list', 'bullet',
    'align',
    'link'
  ];

  return (
    <div>
      <style>
        {`
          /* Custom default line height */
          .ql-editor {
            line-height: 1.5 !important; /* Force the line height change */
          }
        `}
      </style>
      <ReactQuill
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        theme="snow"
        style={{ position: 'relative', zIndex: 10, lineHeight: 1.5 }}
      />
    </div>

  );
};

export default Editor;