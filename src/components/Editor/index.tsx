import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { MyUploadAdapterPlugin } from './UploadAdapter';

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

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      DecoupledEditor: require('@ckeditor/ckeditor5-build-decoupled-document')
    };
  }, []);

  return (
    <>
      {editorLoaded ? (
        <div>
          <CKEditor
            id={name}
            editor={DecoupledEditor}
            data={value}
            config={{
              // toolbar: [
              //   'heading',
              //   '|',
              //   'bold',
              //   'italic',
              //   'blockQuote',
              //   'link',
              //   'numberedList',
              //   'bulletedList',
              //   'imageUpload',
              //   'insertTable',
              //   'tableColumn',
              //   'tableRow',
              //   'mergeTableCells',
              //   'mediaEmbed',
              //   '|',
              //   'undo',
              //   'redo'
              // ],
              extraPlugins: [MyUploadAdapterPlugin]
            }}
            onReady={(editor) => {
              editor.ui
                .getEditableElement()
                ?.parentElement?.insertBefore(
                  editor.ui.view.toolbar.element as HTMLElement,
                  editor.ui.getEditableElement() as HTMLElement
                );
            }}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              onChange(data);
            }}
          />
          <style jsx global>{`
            .ck-editor__editable_inline {
              min-height: 400px;
            }
          `}</style>
        </div>
      ) : (
        <div>Editor loading</div>
      )}
    </>
  );
}
