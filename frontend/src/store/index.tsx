import { createContext, useContext } from 'solid-js';
import { Context } from 'solid-js/types/reactive/signal';
import axios, { AxiosResponse } from 'axios';


const StoreContext: Context<IDriveStore> = createContext();
export const StoreProvider = (props: any) => {
  return (
    <StoreContext.Provider value={createStore()}>
      {props.children}
    </StoreContext.Provider>
  );
}

export const useStore = (): IDriveStore => {
  return useContext(StoreContext);
}

const createStore = (): IDriveStore => {
  const cache: any = {};

  const get = async (path: string, headers: any = {}) => {
    if (!cache[path]) {
      const raw: AxiosResponse = await axios.get(`http://localhost:3020/file/${path}`, { headers, crossdomain: true })
      // const raw: Response = await fetch(`http://localhost:3020/file/${path}`, { headers, mode: 'no-cors' });
      if (raw.status === 200) {
        cache[path] = await raw.data;
      } else {
        throw raw.status;
      }
    }
    return cache[path];
  };

  const post = async (path: string, body?: any, headers?: any) => {
    if (!cache[path]) {
      const raw: Response = await fetch(`http://localhost:3020/file/${path}`, { method: 'POST', headers });
      cache[path] = raw.json();
    }
    return cache[path];
  };

  const getFileList = () => get('getList');

  const downloadFile = (filename: string) => post('download', { filename });

  const uploadFile = () => post('upload', null, { filename: 'something/hardcoded.txt' });

  return {
    getFileList,
    downloadFile,
    uploadFile
  };
}


interface IDriveStore {
  getFileList: () => Promise<any>,
  downloadFile: (filename: string) => Promise<any>,
  uploadFile: () => Promise<any>;
}
