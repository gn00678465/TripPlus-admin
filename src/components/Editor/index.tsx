import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { MyUploadAdapterPlugin } from './UploadAdapter';

export const CKEditorConfig = {
  toolbar: [
    'heading',
    '|',
    'fontfamily',
    'fontsize',
    'fontColor',
    'fontBackgroundColor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'alignment',
    '|',
    'numberedList',
    'bulletedList',
    '|',
    'indent',
    'outdent',
    '|',
    'link',
    'blockquote',
    'imageUpload',
    'insertTable',
    'mediaEmbed',
    '|',
    'undo',
    'redo'
  ]
};

interface CKeditorProps {
  onChange: (data: string) => void;
  editorLoaded: boolean;
  name: string;
  value: string;
}

export default function CKeditor({
  onChange,
  editorLoaded,
  name,
  value
}: CKeditorProps) {
  const editorRef = useRef<{
    CKEditor: typeof CKEditor;
    DecoupledEditor: typeof DecoupledEditor;
  }>();

  const { toolbar, ...config } = CKEditorConfig;

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      DecoupledEditor: require('@ckeditor/ckeditor5-build-decoupled-document')
    };
  }, []);

  return (
    <>
      {editorLoaded ? (
        <div className="ck-content">
          <CKEditor
            id={name}
            editor={DecoupledEditor}
            data={value}
            config={{
              toolbar: toolbar,
              extraPlugins: [MyUploadAdapterPlugin],
              list: {
                properties: {
                  styles: true,
                  startIndex: true,
                  reversed: true
                }
              },
              ...config
            }}
            onReady={(editor) => {
              editor.ui
                .getEditableElement()
                ?.parentElement?.insertBefore(
                  editor.ui.view.toolbar.element as HTMLElement,
                  editor.ui.getEditableElement() as HTMLElement
                );
              const rootEditableElement =
                editor.editing.view.document.getRoot();
              if (rootEditableElement) {
                editor.editing.view.change(({ setStyle }) => {
                  setStyle('min-height', '400px', rootEditableElement);
                  setStyle('border', '1px solid #d3d3d3', rootEditableElement);
                  setStyle('border-top-width', '0px', rootEditableElement);
                });
              }
            }}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              onChange(data);
            }}
          />
        </div>
      ) : (
        <div>Editor loading</div>
      )}
    </>
  );
}
