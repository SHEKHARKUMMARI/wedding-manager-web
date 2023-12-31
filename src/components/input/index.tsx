"use client";
import { Eye, EyeSlash, InfoCircle } from "iconsax-react";
import React, { Fragment, LegacyRef, forwardRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import inputStyles from "./input.module.scss";
import Popup from "reactjs-popup";

// eslint-disable-next-line react/display-name
const CustomInput = forwardRef(
  (
    props: UseFormRegister<any> & {
      isInvalid: boolean;
      errorMessage?: string;
      label: string;
    } & React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    const { isInvalid, errorMessage, label, type, ...rest } = props;
    const [showPassword, setShowPassword] = useState<boolean>();
    return (
      <div>
        <div>{label}</div>
        <div
          className={`flex items-center gap-2 ${inputStyles["input-container"]}`}
        >
          <input
            ref={ref}
            type={type === "password" && showPassword ? "text" : type || "text"}
            {...rest}
            className={inputStyles?.["custom-input"]}
          />
          {isInvalid && (
            <Popup
              key={`input-error`}
              trigger={
                <InfoCircle
                  size="12"
                  color="red"
                  style={{ cursor: "pointer" }}
                />
              }
              position={"left center"}
              on={["hover", "focus"]}
              arrow={true}
            >
              <div className={`bg-black rounded-lg`}>
                <span className="text-white p-5">{errorMessage}</span>
              </div>
            </Popup>
          )}
          {type === "password" && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <EyeSlash size="16" color="black" />
              ) : (
                <Eye size="16" color="black" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
export default CustomInput;
