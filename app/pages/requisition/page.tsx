"use client";

import React from "react";
import RequisitionTemplate from "../../components/templates/requisition/RequisitionTemplate";

const handleLogout = () => console.log("teste")
const RequisitionPage: React.FC = () => <RequisitionTemplate onLogout={handleLogout} />;

export default RequisitionPage;
