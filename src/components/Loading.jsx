import React from "react";

const Loading = ({ work }) => {
  return (
    <div>
      <div
        className={`  z-10 fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center`}
      >
        <div className="flex items-center p-5  text-white rounded-md shadow-lg  ">
          <div className="loader"></div>
          <div className="ml-4 text-2xl">{work}...</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
