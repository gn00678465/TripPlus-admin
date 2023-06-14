import { uploadImage } from '@/api';
import { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';

class MyUploadAdapter {
  loader: any;
  url: string;
  xhr!: XMLHttpRequest;

  constructor(loader: any, url: string) {
    this.loader = loader;
    this.url = url;
  }

  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open('POST', this.url, true);
    xhr.responseType = 'json';
  }
  _initListeners(resolve: any, reject: any, file: File) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;
    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', (err) => reject());

    xhr.addEventListener('load', () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        default: response?.url
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }
  _sendRequest(file: File) {
    const data = new FormData();
    data.append('file', file);

    const token = useAuthStore.getState().userInfo?.token || '';

    this.xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    this.xhr.send(data);
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}

export function MyUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader, `${process.env.BASE_API_URL}/upload`);
  };
}
