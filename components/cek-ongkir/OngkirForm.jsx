"use client";

import React, { useState } from "react";
import PropTypes from 'prop-types';

function OngkirForm(props) {
  const type = props.type || 'pengiriman-instan';
  const [kotaAwal, setKotaAwal] = useState("");
  const [kotaTujuan, setKotaTujuan] = useState("");
  const [jadwalKirim, setJadwalKirim] = useState("");
  const [multiDropAddresses, setMultiDropAddresses] = useState([""]);

  const handleCheck = () => {
    if (type === 'multi-drop') {
      alert(`Checking multi-drop delivery from ${kotaAwal} to multiple destinations`);
    } else if (type === 'jadwal-kirim') {
      alert(`Checking scheduled delivery from ${kotaAwal} to ${kotaTujuan} at ${jadwalKirim}`);
    } else {
      alert(`Checking instant delivery from ${kotaAwal} to ${kotaTujuan}`);
    }
  };

  const renderDestinationFields = () => {
    if (type === 'multi-drop') {
      return (
        <>
          {multiDropAddresses.map((address, index) => (
            <div key={index} className="flex items-center ml-[34px] gap-[33px] mb-2">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/i3i6xon1_expires_30_days.png"
                className="w-[29px] h-[29px] object-fill"
                alt="Destination"
              />
              <input 
                type="text"
                value={address}
                onChange={(e) => {
                  const newAddresses = [...multiDropAddresses];
                  newAddresses[index] = e.target.value;
                  setMultiDropAddresses(newAddresses);
                }}
                placeholder={`Tujuan ${index + 1}`}
                className="text-lg font-bold placeholder:text-[#D9D9D9] focus:outline-none bg-transparent w-full"
              />
              {index === multiDropAddresses.length - 1 && (
                <button
                  onClick={() => setMultiDropAddresses([...multiDropAddresses, ""])}
                  className="text-[#5038ED] font-bold px-4"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </>
      );
    }
    
    return (
      <div className="flex items-center ml-[34px] gap-[33px]">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/i3i6xon1_expires_30_days.png"
          className="w-[29px] h-[29px] object-fill"
          alt="Destination"
        />
        <input 
          type="text"
          value={kotaTujuan}
          onChange={(e) => setKotaTujuan(e.target.value)}
          placeholder="Kota Tujuan"
          className="text-lg font-bold placeholder:text-[#D9D9D9] focus:outline-none bg-transparent w-full"
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-start self-stretch bg-white py-3 mb-[39px] ml-[291px] mr-[277px] rounded-[20px] border border-solid border-[#5FE26C80]">
        <div className="flex items-center mb-2.5 ml-[33px] gap-[33px]">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/wzxwoypu_expires_30_days.png"
            className="w-[30px] h-[30px] object-fill"
            alt="Origin"
          />
          <input 
            type="text"
            value={kotaAwal}
            onChange={(e) => setKotaAwal(e.target.value)}
            placeholder="Kota Awal"
            className="text-lg font-bold placeholder:text-[#D9D9D9] focus:outline-none bg-transparent w-full"
          />
        </div>
        
        <div className="flex items-center self-stretch mb-[9px] mx-12 gap-[46px]">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/r4xbsigz_expires_30_days.png"
            className="w-[1px] h-[39px] object-fill"
            alt="Divider"
          />
          <div className="flex-1 bg-[#0000001A] h-[1px]" />
        </div>

        {renderDestinationFields()}

        {type === 'jadwal-kirim' && (
          <div className="flex items-center ml-[34px] gap-[33px] mt-4">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235038ED'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E"
              className="w-[29px] h-[29px]"
              alt="Calendar"
            />
            <input 
              type="datetime-local"
              value={jadwalKirim}
              onChange={(e) => setJadwalKirim(e.target.value)}
              className="text-lg font-bold text-gray-700 focus:outline-none bg-transparent w-full"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center self-stretch mb-[39px]">
        <button 
          onClick={handleCheck}
          className="flex flex-col items-start text-left py-[11px] px-[47px] rounded-2xl border-0 bg-gradient-to-b from-[#9181F4] to-[#5038ED] hover:opacity-90 transition-opacity"
        >
          <span className="text-white text-xl font-bold">
            {type === 'multi-drop' ? 'Cek Ongkir Multi-Drop' : 'Cek Ongkir'}
          </span>
        </button>
      </div>
    </>
  );
}

OngkirForm.propTypes = {
  type: PropTypes.string
};

export default OngkirForm;
