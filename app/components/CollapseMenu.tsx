import React from "react";

const CollapseMenu = () => {
  return (
    <React.Fragment>
      {/* Collapse Menu Title */}
      <div tabIndex={0} className="collapse collapse-arrow">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-white flex items-center gap-4 p-0 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
          Connect to Database
        </div>

        {/* Collapse Content */}
        <div className="collapse-content text-sm flex flex-col  justify-start gap-4">
          {["Health", "Finance", "Education", "Stock"].map((item, index) => {
            return (
              <React.Fragment>
                <div className="flex justify-between">
                  {/* Database Name */}
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                      />
                    </svg>
                    <p>Database: {item}</p>
                  </div>

                  {/* Connect Status */}
                  <div className="form-control">
                    <label className="cursor-pointer label gap-2">
                      <span className="label-text">Connect</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-accent toggle-sm"
                        checked ={index === 0 ? true : false}
                      />
                    </label>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default CollapseMenu;
