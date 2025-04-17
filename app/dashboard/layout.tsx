"use client";

import React from "react";
import DashboardWrapper from "./dashboard-wrapper";
import StoreProvider from "../redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <StoreProvider>
        <DashboardWrapper> {children} </DashboardWrapper>
      </StoreProvider>
    </div>
  );
};

export default DashboardLayout;
