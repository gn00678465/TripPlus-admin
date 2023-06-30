import { uploadImage } from '@/api';

class MyUploadAdapter {
  loader: any;
  abortController!: AbortController;
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    this.abortController = new AbortController();
    return new Promise((resolve, reject) => {
      const loader = this.loader;
      return loader.file
        .then((file: File) => {
          const formData = new FormData();
          formData.append('file', file);

          uploadImage(formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress(progressEvent) {
              loader.uploadTotal = progressEvent.total;
              loader.uploaded = progressEvent.loaded;
            }
          })
            .then((res) => {
              if (res.status === 'Success') {
                resolve({ default: res.data.imageUrl });
              }
              if (res.status === 'Error') {
                reject(res.message);
              }
            })
            .catch((err) => reject(err));
        })
        .catch(reject);
    });
  }

  abort() {}
}

export function MyUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}
