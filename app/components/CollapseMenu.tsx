import React from "react";

interface MenuProps {
  title: string;
  menuItem: String[];
}

const CollapseMenu: React.FC<MenuProps> = ({ title, menuItem }) => {
  return (
    <React.Fragment>
      {/* Collapse Menu Title */}
      <div tabIndex={0} className="collapse collapse-arrow">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-white flex items-center gap-4 p-0" >
          {title === "Connection to Database" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#0098C1"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#0098C1"
              className="size-6"
            >
              <path d="m387-412 35-114-92-74h114l36-112 36 112h114l-93 74 35 114-92-71-93 71ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm240-280q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" />
            </svg>
          )}

          {title}
        </div>

        {/* Collapse Content */}
        <div className="collapse-content text-sm flex flex-col  justify-start gap-4 text-white">
          {menuItem?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div className="flex justify-between gap-4">
                  {/* Database Name */}
                  <div className="flex items-center gap-2">
                    {title === "Connection to Database" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#0098C1"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="22px"
                        viewBox="0 -960 960 960"
                        width="22px"
                        fill="#0098C1"
                      >
                        <path d="m387-412 35-114-92-74h114l36-112 36 112h114l-93 74 35 114-92-71-93 71ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm240-280q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" />
                      </svg>
                    )}

                    <p>{item}</p>
                  </div>

                  {/* Connect Status */}
                  <div className="form-control">
                    <label className="cursor-pointer label gap-2">
                      <span className="label-text text-white">Connect</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-accent toggle-sm"
                        // checked ={index === 0 ? true : false}
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
