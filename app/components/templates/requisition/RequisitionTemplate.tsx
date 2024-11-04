import React from "react";
import RequisitionForm from "../../organisms/RequisitionForm";
import Header from "../../organisms/Header";

interface RequisitionTemplateProps {
  onLogout: () => void;
}

const RequisitionTemplate: React.FC<RequisitionTemplateProps> = ({
  onLogout,
}) => (
  <>
    <Header admin={false} />
    <section className="bg-white pt-28 mb-14">
      <RequisitionForm />
    </section>
  </>
);

export default RequisitionTemplate;
