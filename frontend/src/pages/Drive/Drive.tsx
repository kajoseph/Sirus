import { Component, createState } from 'solid-js';
import { useStore } from '../../store';

export const Drive = (props: any) => {
  try {
    const [state, setState] = createState({ list: {} });
    const store = useStore();

    store.getFileList()
      .then((list) => {
        setState({ list });
      });

    return (
      <>
        <div>Hello world from the Drive file!</div>
        {JSON.stringify(state.list)}
      </>
    );
  } catch (err) {
    console.error(err);
  }
}