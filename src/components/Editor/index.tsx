import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
    ClassicEditor: typeof ClassicEditor;
  }>();
  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    };
  }, []);

  return (
    <>
      {editorLoaded ? (
        <div>
          <CKEditor
            editor={ClassicEditor}
            data={value}
            config={{
              extraPlugins: [MyUploadAdapterPlugin]
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
