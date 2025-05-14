import React from 'react';
import nodataimage from '../../assets/nodataimage.png';

interface NodataProps {
  name: string;
}

const Nodata: React.FC<NodataProps> = ({ name }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-4'>
      <img src={nodataimage} alt="nodataimage" />
      <h1>No {name} at this time</h1>
      <p>
        {name} will appear here after they enroll in your school.
      </p>
    </div>
  );
};

export default Nodata;
