import { ClipLoader } from 'react-spinners';

const override = {
  margin: '0 auto',
};

export const Loader = () => {
  return (
    <ClipLoader
      cssOverride={override}
      color='#2196f3'
      size={50}
    />
  );
};
